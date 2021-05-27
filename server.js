const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const useragent = require("express-useragent");
const app = express();

const logger = require("./utils/logger");
const consts = require("./static/constants");
const errorConsts = require("./static/error_constants");
const logMsgs = require("./static/log_messages");
const dbUtils = require("./utils/db");
const { dbConnectionMiddleware } = require('./middleware/dbConnectionMiddleware');


let server;

try {
	// Create connections to master + all account DBs
	// Do NOT access the global DB connection object directly;
	// ALWAYS use dbUtils methods.
	dbUtils.createDBConnections().then(() => {
		logger.info(logMsgs.db_createAllConnections);
	}).catch((err) => {
		logger.error(JSON.stringify(err));
	});

	const trades = require("./routes/trades.route");

	
	//Body Parser middleware
	app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 2 }));
	app.use(bodyParser.json());

	//Body Parser error handler middleware
	app.use(function(error, req, res, next) {
		if (error instanceof SyntaxError) {
			return res.status(consts.badReqHTTPCode).json({
				error_code: errorConsts.errorCodes.invalidValue,
				message: `${consts.RESPONSE_MESSAGES.INVALID_JSON}: ${error.message}`
			});
		} else {
			next();
		}
	});

	//CORS middleware
	app.use(cors());

	//user-agent middleware
	app.use(useragent.express());

	app.get("/", (req, res) => {
		return res.status(200).json({
			status: consts.successMsg,
			message: logMsgs.server_success
		});
	});
	app.use((req, res, next) => {
		/* Adding logger for analysis */
		logger.info(`Request Headers: url: ${req.url}; method: ${req.method}; headers: ${JSON.stringify(req.headers)}`);
		next();
	});


	/* Stock Related API's */
	app.use("/stock-api", dbConnectionMiddleware, trades);

	//Start server
	const port = process.env.PORT || 5000;
	server = app.listen(port, console.log(`Server started on port ${port}`));

} catch (err) {
	logger.info(logMsgs.server_exit);
	logger.info(err.stack);
	process.exit(1);
}

module.exports = server;

async function shutDown() {
	logger.info(logMsgs.server_shutdown);

	/* Close master + all account DB connections */
	try{
		// Do NOT access the global DB connection object directly;
		// ALWAYS use dbUtils methods.
		await dbUtils.closeDBConnections(process.env.DB_NAME);
	}catch(err){
		logger.error(err.stack);
		process.exit(1);
	}

	/* Close all connections to node server */
	server.close(() => {
		logger.info(logMsgs.server_closeConn);
		process.exit(0);
	});
	logger.info(logMsgs.server_stopConn);

	/* Wait for 10 seconds and then close forcefully */
	setTimeout(() => {
		logger.error(logMsgs.server_killConn);
		process.exit(1);
	}, 10000);
}

process.on(consts.processEvents.SIGINT, shutDown);
process.on(consts.processEvents.SIGTERM, shutDown);