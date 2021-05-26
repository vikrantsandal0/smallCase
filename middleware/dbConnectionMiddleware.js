const errorHandler = require('../implementation/error_handler');
const logger = require('../utils/logger');
const logMsgs = require('../static/log_messages');
const dbUtils = require('../utils/db');

exports.dbConnectionMiddleware = async (req, res, next) => {
  logger.info(logMsgs.middleware_atdb_start);
  let db;
  try {
    logger.info(logMsgs.db_getConnection);
    // Get connection object for the DB from global object
    // Do NOT access the global DB connection object directly;
    // ALWAYS use dbUtils methods.
    db = await dbUtils.getDBConnObj();
    logger.info(logMsgs.db_testConnection);
    await dbUtils.testConnection(db);
    req.dbObj = req.dbObj || {};
    req.dbObj.dbConnection = db;
    next();
  } catch(err) {
    /* If errors thrown, return status 400, with the errors.
			If DB structure errors thrown, return status 500*/
      const response = errorHandler.formatErrorMessage(err);
      res.status(response.statusCode).json(response.body);
  }
}