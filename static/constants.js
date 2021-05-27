
/* This file contains all constants*/

exports.service_name = "stocks-api";
exports.namespace = "stocks-api";
exports.getTradesFlow = "get_trades";
exports.makeTradesFlow = "make_trades";
exports.updateTradesFlow = "update_trades";
exports.deleteTradeFlow = "delete_trade";
exports.tradesReturnsFlow = "trades_returns";
exports.portfolioDetailsFlow = "portfolio_details";


exports.getAccountSettingsAttrs = [["attribute", "attribute_name"], ["value", "attribute_value"]];
exports.tradeAttrs = ["id", "trade_quantity", "trade_type", "trade_price"];

exports.FIELD = {
	UUID: "uuid",
	SECURITY_UUID: 'security_uuid',
	IS_DELETED: "is_deleted",
	ID: "id",
	AVG_PRICE: "average_price",
	CURR_QUANTITY: "current_quantity",
	TRADE_TYPE: "trade_type",
	OLD_AVG: "old_average",
	OLD_QUANTITY: "old_quantity",
};

exports.BOOLEAN = {
	TRUE: "true",
	FALSE: "false"
};

exports.CURRENT_STOCK_PRICE = 100;
exports.manageTradesSchema = [this.getTradesFlow, this.makeTradesFlow, this.updateTradesFlow, this.deleteTradeFlow, this.tradesReturnsFlow
	, this.portfolioDetailsFlow];

exports.TRADE_TYPE = {
	BUY: 'BUY',
	SELL: 'SELL'
}

exports.RESPONSE_MESSAGES = {
	NOT_ENOUGH_STOCKS : "Not enough stocks",
	NO_TRADE_PRESENT: "No such trade present in database",
	NO_SECURITY_PRESENT: "No such security present in database",
	NO_DATA_FOUND : "No data found",
	INVALID_JSON : "Invalid JSON in request body",
};

exports.successMHTTPCode = 200;
exports.badReqHTTPCode = 400;
exports.preconditionFailedHTTPCode = 412;
exports.errorHTTPCode = 503;
exports.notFoundHTTPCode = 404;


exports.processEvents = {
	SIGINT: "SIGINT",
	SIGTERM: "SIGTERM",
	SIGKILL: "SIGKILL"
};

exports.ISError = "Internal Server Error";
exports.successMsg = "SUCCESS";