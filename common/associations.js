/*
	This file contains methods to create and remove 
	the required associations between the Expertise Event Processor related tables.
*/
const consts = require("../static/constants");

const portfolio = require("./models/portfolio.model");
const trades = require("./models/trades.model");


exports.setAssociations = (db, Sequelize) => {

	const portfolioModel = portfolio(db, Sequelize);
	const tradesModel = trades(db, Sequelize);

	portfolioModel.hasMany(tradesModel, { sourceKey: consts.FIELD.UUID, foreignKey: consts.FIELD.SECURITY_UUID });
	tradesModel.belongsTo(portfolioModel, { foreignKey: consts.FIELD.SECURITY_UUID, targetKey: consts.FIELD.UUID });
	return {
		portfolioModel, tradesModel
	};
};