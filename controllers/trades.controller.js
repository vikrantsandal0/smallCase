const { getTrades, makeTrades, updateTrades, deleteTrades, tradesReturns, portfolioDetails } = require('../implementation/trades.impl');

exports.get_trades = getTrades;
exports.make_trades = makeTrades;
exports.update_trades = updateTrades;
exports.delete_trade = deleteTrades;
exports.trades_returns = tradesReturns;
exports.portfolio_details = portfolioDetails;