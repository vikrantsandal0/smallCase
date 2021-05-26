const Sequelize = require("sequelize");
const _ = require("lodash");
const moment = require("moment");

const errorHandler = require("./error_handler");
const helper = require("./helper");
const logger = require("../utils/logger");
const logMsgs = require("../static/log_messages");
const consts = require("../static/constants");
const dbUtils = require("../utils/db");
const { fetchPortFolio, updatePortfolio } = require("../common/queries/portfolio");
const { createTrade, fetchTrade, updateTrade } = require('../common/queries/trades');
const { Console } = require("winston/lib/winston/transports");

const formatInsertObj = (new_average_price, new_quantity, old_average, old_quantity, trade_type, trade_quantity, security_uuid) => {
	let x = {
		trade_price: consts.CURRENT_STOCK_PRICE,
		trade_type,
		trade_quantity,
		new_average_price,
		new_quantity,
		old_quantity,
		old_average,
		...(security_uuid ? { security_uuid } : {}),
	}
	console.log('final object to insert=======', x);
	return x;
}
const findNewAvgPrice = (secObj) => {

	let { securityAvgPrice, securityCurrentQuantity, quantity, tradeType, stockPrice = consts.CURRENT_STOCK_PRICE } = secObj;

	let newAvgPrice, newQuantity;

	switch (tradeType) {

		case consts.TRADE_TYPE.BUY: {
			newAvgPrice = ((securityAvgPrice * securityCurrentQuantity) + (quantity * stockPrice)) / (securityCurrentQuantity + quantity);
			newQuantity = securityCurrentQuantity + quantity
			break
		}

		case consts.TRADE_TYPE.SELL: {
			if (securityCurrentQuantity < quantity) {
				throw { message: consts.RESPONSE_MESSAGES.NOT_ENOUGH_STOCKS, statusCode: consts.preconditionFailedHTTPCode }
			}
			newAvgPrice = securityAvgPrice;
			newQuantity = securityCurrentQuantity - quantity;
			break
		}
	}
	newAvgPrice = helper.roundToTwo(newAvgPrice);
	console.log('newAvgPrice======quantity========', newAvgPrice, newQuantity);
	return { newAvgPrice, newQuantity }

}
const tradeRemovalCalc = (secObj) => {

	let { trade_quantity, trade_price, trade_type, average_price, current_quantity } = secObj;
	let settleAmount = 0, settleSharesNum = 0, newAvgPrice = 0;

	switch (trade_type) {

		case consts.TRADE_TYPE.BUY: {
			settleAmount = trade_price * trade_quantity;
			// Checking if we have enough stocks to remove after transaction deletion 

			if ((current_quantity < trade_quantity) || (average_price * current_quantity) < settleAmount) {
				throw { message: consts.RESPONSE_MESSAGES.NOT_ENOUGH_STOCKS, statusCode: consts.preconditionFailedHTTPCode }
			}

			settleSharesNum = current_quantity - trade_quantity
			newAvgPrice = (average_price * current_quantity - settleAmount) / settleSharesNum;
			break;
		}

		case consts.TRADE_TYPE.SELL: {
			settleSharesNum = current_quantity + trade_quantity;
			newAvgPrice = average_price;
			break;
		}
	}
	newAvgPrice = helper.roundToTwo(newAvgPrice);
	console.log('newAvgPrice======quantity========', newAvgPrice, settleAmount, settleSharesNum);
	return { settleAmount, settleSharesNum, newAvgPrice }

}

exports.getTrades = async (req, res) => {

	logger.info(logMsgs.gT_start);
	try {
		const { query, dbObj } = req;
		const { dbConnection: db } = dbObj;
		console.log('body-------', query);
		//validate the req body using the json schemas & other validations
		logger.info(logMsgs.gT_valReqBody);
		/* Validate the Request body */
		let result = await helper.validateReqBody(query, false, consts.getTradesFlow);
		/* If validation fails, return HTTP 400, with the error array */
		if (!result.valid) {
			logger.info(logMsgs.gT_valReqBodyFail);
			res.status(consts.badReqHTTPCode).json({ errors: result.error });
			return;
		}

		logger.info(logMsgs.db_setAssociations);
		const models = dbUtils.setAssociations(db);
		/* Initiate all required parameters: where conditions, page details, filters */

		let securityId = query.security_uuid;

		const secWhereCondition = {
			[consts.FIELD.UUID]: securityId,
			[consts.FIELD.IS_DELETED]: consts.BOOLEAN.FALSE
		},
			includesData = [{
				model: models.tradesModel,
				attributes: consts.tradeAttrs,
				where: { [consts.FIELD.IS_DELETED]: consts.BOOLEAN.FALSE }
			}]


		let security = await fetchPortFolio(models, [consts.FIELD.UUID, consts.FIELD.CURR_QUANTITY, consts.FIELD.AVG_PRICE],
			secWhereCondition, includesData);
		console.log('security----', security);
		if (_.isEmpty(security)) {
			throw { message: consts.RESPONSE_MESSAGES.NO_DATA_FOUND, statusCode: consts.notFoundHTTPCode }
		}
		// If no errors thrown, return status 200, with listOfItems and success msg
		return res.status(consts.successMHTTPCode).json({
			status: consts.successMHTTPCode,
			responseTimeStamp: + new Date(),
			message: consts.successMsg,
			result: security
		});

	}
	catch (err) {
		/* If errors thrown, return status 400, with the errors.
			If DB structure errors thrown, return status 500*/
		const response = errorHandler.formatErrorMessage(err);
		res.status(response.statusCode).json(response.body);
	}
};

exports.makeTrades = async (req, res) => {

	logger.info(logMsgs.mT_start);
	try {
		const { body, dbObj } = req;
		const { dbConnection: db } = dbObj;
		console.log('body-------', body);
		//validate the req body using the json schemas & other validations
		logger.info(logMsgs.mT_valReqBody);
		/* Validate the Request body */
		let result = await helper.validateReqBody(body, false, consts.makeTradesFlow);
		/* If validation fails, return HTTP 400, with the error array */
		if (!result.valid) {
			logger.info(logMsgs.mT_valReqBodyFail);
			res.status(consts.badReqHTTPCode).json({ errors: result.error });
			return;
		}

		logger.info(logMsgs.db_setAssociations);
		const models = dbUtils.setAssociations(db);
		/* Initiate all required parameters: where conditions, page details, filters */

		let securityId = body.security_uuid, tradeType = body.trade_type, quantity = body.quantity;

		const secWhereCondition = {
			[consts.FIELD.UUID]: securityId,
			[consts.FIELD.IS_DELETED]: consts.BOOLEAN.FALSE
		};

		let security = await fetchPortFolio(models, [consts.FIELD.UUID, consts.FIELD.CURR_QUANTITY, consts.FIELD.AVG_PRICE], secWhereCondition, []);
		console.log('security----', security);
		if (_.isEmpty(security)) {
			throw { message: consts.RESPONSE_MESSAGES.NO_SECURITY_PRESENT, statusCode: consts.notFoundHTTPCode }
		}
		let { average_price: securityAvgPrice, current_quantity: securityCurrentQuantity } = security[0];

		console.log('AFTER EXTRACTION', securityAvgPrice, securityCurrentQuantity);

		let { newAvgPrice, newQuantity } = findNewAvgPrice({ securityAvgPrice, securityCurrentQuantity, quantity, tradeType })
		let tradeCreated = null;

		await db.transaction(async () => {

			logger.info(logMsgs.mT_startTransaction);
			tradeCreated = await createTrade(models, formatInsertObj(newAvgPrice,
				newQuantity,
				securityAvgPrice,
				securityCurrentQuantity,
				tradeType,
				quantity,
				securityId));



			await updatePortfolio(models, { average_price: newAvgPrice, current_quantity: newQuantity, old_average: securityAvgPrice, old_quantity: securityCurrentQuantity }
				, { [consts.FIELD.UUID]: securityId });

			logger.info(logMsgs.mT_endTransaction);
		});
		logger.info(logMsgs.mT_end);

		// If no errors thrown, return status 200, with listOfItems and success msg
		return res.status(consts.successMHTTPCode).json({
			status: consts.successMHTTPCode,
			responseTimeStamp: + new Date(),
			message: consts.successMsg,
			result: _.pick(tradeCreated, [consts.FIELD.ID, consts.FIELD.SECURITY_UUID, consts.FIELD.TRADE_TYPE])
		});

	}
	catch (err) {
		/* If errors thrown, return status 400, with the errors.
			If DB structure errors thrown, return status 500*/
		const response = errorHandler.formatErrorMessage(err);
		res.status(response.statusCode).json(response.body);
	}
};
exports.updateTrades = async (req, res) => {

	logger.info(logMsgs.uT_start);
	try {
		const { body, dbObj } = req;
		const { dbConnection: db } = dbObj;

		//validate the req body using the json schemas & other validations
		logger.info(logMsgs.uT_valReqBody);
		/* Validate the Request body */
		var result = await helper.validateReqBody(body, false, consts.updateTradesFlow);
		/* If validation fails, return HTTP 400, with the error array */
		if (!result.valid) {
			logger.info(logMsgs.uT_valReqBodyFail);
			res.status(consts.badReqHTTPCode).json({ errors: result.error });
			return;
		}

		logger.info(logMsgs.db_setAssociations);
		const models = dbUtils.setAssociations(db);

		/* Initiate all required parameters: where conditions, page details, filters */

		let securityId = body.security_uuid, tradeType = body.trade_type, quantity = body.quantity, tradeId = body.trade_id;

		const secWhereCondition = {
			[consts.FIELD.UUID]: securityId,
			[consts.FIELD.IS_DELETED]: consts.BOOLEAN.FALSE
		};

		let security = await fetchPortFolio(models, [consts.FIELD.UUID, consts.FIELD.OLD_QUANTITY, consts.FIELD.OLD_AVG],
			secWhereCondition, []);
		console.log('security----', security);

		if (_.isEmpty(security)) {
			throw { message: consts.RESPONSE_MESSAGES.NO_SECURITY_PRESENT, statusCode: consts.notFoundHTTPCode }
		}

		const findTradeCondition = {
			[consts.FIELD.ID]: tradeId,
			[consts.FIELD.IS_DELETED]: consts.BOOLEAN.FALSE
		};

		let trade = await fetchTrade(models, consts.tradeAttrs, findTradeCondition, []);
		console.log('trade----', trade);
		if (_.isEmpty(trade)) {
			throw { message: consts.RESPONSE_MESSAGES.NO_TRADE_PRESENT, statusCode: consts.notFoundHTTPCode }
		}

		let { old_average: securityAvgPrice, old_quantity: securityCurrentQuantity } = security[0];

		let { newAvgPrice, newQuantity } = findNewAvgPrice({ securityAvgPrice, securityCurrentQuantity, quantity, tradeType })
		console.log('newAvgPrice----', newAvgPrice, '===========newQuantity', newQuantity);
		await db.transaction(async () => {

			logger.info(logMsgs.uT_startTransaction);
			await updateTrade(models, formatInsertObj(newAvgPrice,
				newQuantity,
				securityAvgPrice,
				securityCurrentQuantity,
				tradeType,
				quantity), { [consts.FIELD.ID]: tradeId });

			await updatePortfolio(models, { average_price: newAvgPrice, current_quantity: newQuantity, old_average: securityAvgPrice, old_quantity: securityCurrentQuantity }
				, { [consts.FIELD.UUID]: securityId });

			logger.info(logMsgs.uT_endTransaction);
		});
		logger.info(logMsgs.uT_end);

		// If no errors thrown, return status 200, with listOfItems and success msg
		return res.status(consts.successMHTTPCode).json({
			status: consts.successMHTTPCode,
			responseTimeStamp: + new Date(),
			message: consts.successMsg,
			result: { trade_id: tradeId, security_uuid: securityId, trade_type: tradeType }
		});

	}
	catch (err) {
		/* If errors thrown, return status 400, with the errors.
			If DB structure errors thrown, return status 500*/
		const response = errorHandler.formatErrorMessage(err);
		res.status(response.statusCode).json(response.body);
	}
};
exports.deleteTrades = async (req, res) => {

	logger.info(logMsgs.dT_start);
	try {
		const { body, dbObj } = req;
		const { dbConnection: db } = dbObj;

		//validate the req body using the json schemas & other validations
		logger.info(logMsgs.dT_valReqBody);
		/* Validate the Request body */
		var result = await helper.validateReqBody(body, false, consts.deleteTradeFlow);
		/* If validation fails, return HTTP 400, with the error array */
		if (!result.valid) {
			logger.info(logMsgs.dT_valReqBodyFail);
			res.status(consts.badReqHTTPCode).json({ errors: result.error });
			return;
		}

		logger.info(logMsgs.db_setAssociations);
		const models = dbUtils.setAssociations(db);

		/* Initiate all required parameters: where conditions, page details, filters */

		let securityId = body.security_uuid, tradeId = body.trade_id;

		const secWhereCondition = {
			[consts.FIELD.UUID]: securityId,
			[consts.FIELD.IS_DELETED]: consts.BOOLEAN.FALSE
		};

		let security = await fetchPortFolio(models, [consts.FIELD.UUID, consts.FIELD.CURR_QUANTITY, consts.FIELD.AVG_PRICE], secWhereCondition, []);
		console.log('security----', security);
		if (_.isEmpty(security)) {
			throw { message: consts.RESPONSE_MESSAGES.NO_SECURITY_PRESENT, statusCode: consts.notFoundHTTPCode }
		}

		const findTradeCondition = {
			[consts.FIELD.ID]: tradeId,
			[consts.FIELD.IS_DELETED]: consts.BOOLEAN.FALSE
		};

		let trade = await fetchTrade(models, consts.tradeAttrs, findTradeCondition, []);
		console.log('trade----', trade);
		if (_.isEmpty(trade)) {
			throw { message: consts.RESPONSE_MESSAGES.NO_TRADE_PRESENT, statusCode: consts.notFoundHTTPCode }
		}
		let { average_price, current_quantity } = security[0];

		let { newAvgPrice, settleSharesNum } = tradeRemovalCalc({ ...trade, average_price, current_quantity })

		await db.transaction(async () => {

			logger.info(logMsgs.dT_startTransaction);
			await updateTrade(models, { [consts.FIELD.IS_DELETED]: consts.BOOLEAN.TRUE }, { [consts.FIELD.ID]: tradeId });

			await updatePortfolio(models, { average_price: newAvgPrice, current_quantity: settleSharesNum, old_average: average_price, old_quantity: current_quantity }
				, { [consts.FIELD.UUID]: securityId });

			logger.info(logMsgs.dT_endTransaction);
		});
		logger.info(logMsgs.dT_end);

		// If no errors thrown, return status 200, with listOfItems and success msg
		return res.status(consts.successMHTTPCode).json({
			status: consts.successMHTTPCode,
			responseTimeStamp: + new Date(),
			message: consts.successMsg,
			result: {}
		});

	}
	catch (err) {
		/* If errors thrown, return status 400, with the errors.
			If DB structure errors thrown, return status 500*/
		const response = errorHandler.formatErrorMessage(err);
		res.status(response.statusCode).json(response.body);
	}
};
exports.tradesReturns = async (req, res) => {

	logger.info(logMsgs.tT_start);
	try {
		const { body, dbObj } = req;
		const { dbConnection: db } = dbObj;

		//validate the req body using the json schemas & other validations
		logger.info(logMsgs.tT_valReqBody);
		/* Validate the Request body */
		let result = await helper.validateReqBody(body, false, consts.tradesReturnsFlow);
		/* If validation fails, return HTTP 400, with the error array */
		if (!result.valid) {
			logger.info(logMsgs.tT_valReqBodyFail);
			res.status(consts.badReqHTTPCode).json({ errors: result.error });
			return;
		}

		logger.info(logMsgs.db_setAssociations);
		const models = dbUtils.setAssociations(db);

		let securityId = body.security_uuid || '';

		const secWhereCondition = {
			[consts.FIELD.IS_DELETED]: consts.BOOLEAN.FALSE,
			...(securityId ? { [consts.FIELD.UUID]: securityId } : {}),

		};

		let security = await fetchPortFolio(models, [consts.FIELD.AVG_PRICE, consts.FIELD.CURR_QUANTITY], secWhereCondition, []);
		
		let finalReturns = helper.roundToTwo(security.reduce((sum, ticker) => {
			return sum += Number((consts.CURRENT_STOCK_PRICE - ticker.average_price) * ticker.current_quantity);
		}, 0))
		// If no errors thrown, return status 200, with listOfItems and success msg
		return res.status(consts.successMHTTPCode).json({
			status: consts.successMHTTPCode,
			responseTimeStamp: + new Date(),
			message: consts.successMsg,
			result: finalReturns
		});

	}
	catch (err) {
		/* If errors thrown, return status 400, with the errors.
			If DB structure errors thrown, return status 500*/
		const response = errorHandler.formatErrorMessage(err);
		res.status(response.statusCode).json(response.body);
	}
};
exports.portfolioDetails = async (req, res) => {

	logger.info(logMsgs.pD_start);
	try {
		const { body, dbObj } = req;
		const { dbConnection: db } = dbObj;

		logger.info(logMsgs.db_setAssociations);
		const models = dbUtils.setAssociations(db);

		/* Initiate all required parameters: where conditions, page details, filters */
		const secWhereCondition = {
			[consts.FIELD.IS_DELETED]: consts.BOOLEAN.FALSE
		};

		let security = await fetchPortFolio(models, null, secWhereCondition, []);
		console.log('FINAL PORTFOLIO--', security);
		logger.info(logMsgs.pD_end);
		// If no errors thrown, return status 200, with listOfItems and success msg
		return res.status(consts.successMHTTPCode).json({
			status: consts.successMHTTPCode,
			responseTimeStamp: + new Date(),
			message: consts.successMsg,
			result: security
		});

	}
	catch (err) {
		/* If errors thrown, return status 400, with the errors.
			If DB structure errors thrown, return status 500*/
		const response = errorHandler.formatErrorMessage(err);
		res.status(response.statusCode).json(response.body);
	}
};