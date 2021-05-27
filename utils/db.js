const Sequelize = require('sequelize');
const path = require('path');
const cls = require('cls-hooked');

const logger = require('./logger');
const errorHandler = require('../implementation/error_handler');
const logMsgs = require('../static/log_messages');
const consts = require('../static/constants');
const tradesAssociations = require('../common/associations');

// Set the CLS namespace to Sequelize
const stocksNameSpace = cls.createNamespace(consts.namespace);
Sequelize.useCLS(stocksNameSpace);

//Global DB connection object accumulator
global.DB_CONNS = {};

// Create connections to master + all account DB's and store in GLOBAL object
// Do NOT access the global DB connection object directly;
// ALWAYS use dbUtils methods.
exports.createDBConnections = async () => {
	let connObj = {}, dbName = process.env.DB_NAME;
	try {
		connObj[dbName] = await new Sequelize(
			process.env.DB_NAME,
			process.env.DB_USER,
			null,
			{
				host: process.env.DB_HOST,
				dialect: process.env.DB_DIALECT,
				port: process.env.DB_PORT,
			}
		);
	} catch (err) {
		//Log error but continue
		logger.error(logMsgs.db_errConnectingDB(dbName));
	}
	// Assigning objects to global variable
	DB_CONNS = connObj;
};

// Get a DB connection
// Do NOT access the global DB connection object directly;
// ALWAYS use dbUtils methods.
exports.getDBConnObj = async () => {
	//If connection object is not in memory, create it
	const dbName = process.env.DB_NAME;
	if (!DB_CONNS[dbName]) {
		logger.info(`Lazy loading DB: ${dbName};`);
		try {
			await module.exports.createDBConnections()
		} catch (err) {
			//Log and throw error
			logger.error(logMsgs.db_errConnectingDB(dbName));
			throw err;
		}
	}
	logger.info(`Connected to db: ${dbName}`);
	//Return connection object
	return DB_CONNS[dbName];
};

// Close master + all account DB connections
// Do NOT access the global DB connection object directly;
// ALWAYS use dbUtils methods.
exports.closeDBConnections = async (db) => {
	if (DB_CONNS) {
		await DB_CONNS[db]
			.close()
			.catch((err) => errorHandler.logAndThrowErr(err, err));
		logger.info(logMsgs.db_closeAllConnections);
	}
};
// Instantiate the Sequelize models and set required associations
exports.setAssociations = (db) => {
	try {
		return tradesAssociations.setAssociations(db, Sequelize);
	} catch (err) {
		errorHandler.logAndThrowErr(err, err);
	}
};

// Test the DB connection
exports.testConnection = (db) => {
	// Test DB
	return db
		.authenticate()
		.then(() => {
			logger.info(logMsgs.db_authenticated);
		})
		.catch((err) => {
			logger.info(logMsgs.db_unableToConnect, err);
			throw err;
		});
};
