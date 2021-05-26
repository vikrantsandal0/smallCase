module.exports = {

	/* Main Server Messages */
	server_success: "I am successful :-)",


	val_error_generic: "Validation Error: ",
	val_json_schema: "Validating JSON schema",
	val_success_generic: "Validation Pass: ",
	val_itr_error: "Setting JSON validation errors. ",
	val_itr_error_comp: "Setting JSON validation errors: Completed! ",
	middleware_atdb_start: "attachDbMiddleware: start",
	val_format: "Formatting JSON schema validation errors now.",
	format_err: "Formatting errors",
	format_err_name: (name) => `ERROR thrown: name: ${name}`,
	format_err_msg: (message) => `ERROR thrown: message: ${message}`,

	/* Server log messages */
	server_exit: "Exiting process because of error: ",
	server_shutdown: "Server shutting down.",
	server_redisDisconnect: "Redis Client has been disconnected.",
	server_closeConn: "Closed out remaining connections",
	server_stopConn: "Received kill signal, shutting down gracefully",
	server_killConn: "Could not close connections in time, forcefully shutting down",

	/* Database Log Messages */
	db_authenticated: "Tested database connection successfully!",
	db_unableToConnect: "Database connection test failed: ",
	db_syncCompleted: "Database synced!",
	db_testConnection: "Test DB connection",
	db_setAssociations: "Set Required Associations",
	db_errFetchingDBCreds: "Error fetching account dB details from master DB",
	db_errConnectingDB: (dbName) => `Error connecting to DB: ${dbName}`,
	db_createAllConnections: "All DB connections are created successfully",
	db_getConnection: "Getting DB connection object",
	db_closeAllConnections: "All DB connections are closed successfully",


	/* make trades */
	mT_start: "makeTrade: starting making trade",
	mT_end: "makeTrade: END: making trade",
	mT_valReqBody: "makeTrade: Validating the request body",
	mT_valReqBodyFail: "makeTrade: Failed: Validating the request body",
	mT_valReqBodySuccess: "makeTrade: Success: Validating the request body",
	mT_endTransaction: "makeTrade: transaction ending",
	mT_startTransaction: "makeTrade: starting transaction",



	/* udpate trade*/
	uT_start: "updateTrades: update trade start",
	uT_end: "updateTrades: END: update trade ends",
	uT_valReqBody: "updateTrades: Validating the request body",
	uT_valReqBodyFail: "updateTrades: Failed: Validating the request body",
	uT_valReqBodySuccess: "updateTrades: Success: Validating the request body",
	uT_endTransaction: "updateTrades: transaction ending",
	uT_startTransaction: "updateTrades: starting transaction",


	/* delete trade*/
	dT_start: "deleteTrades: delete trade start",
	dT_end: "deleteTrades: END: delete trade ends",
	dT_valReqBody: "deleteTrades: Validating the request body",
	dT_valReqBodyFail: "deleteTrades: Failed: Validating the request body",
	dT_valReqBodySuccess: "deleteTrades: Success: Validating the request body",
	dT_endTransaction: "deleteTrades: transaction ending",
	dT_startTransaction: "deleteTrades: starting transaction",

	/* Trading Returns*/
	tT_start: "tradeReturns: Trading returns start",
	tT_end: "tradeReturns: END: Trading returns ends",
	tT_valReqBody: "tradeReturns: Validating the request body",
	tT_valReqBodyFail: "tradeReturns: Failed: Validating the request body",
	tT_valReqBodySuccess: "tradeReturns: Success: Validating the request body",


	/* portfolio*/
	pD_start: "portfolio: portfolio fetching start",
	pD_end: "portfolio: END: portfolio fetching ends",
	pD_valReqBody: "portfolio: Validating the request body",
	pD_valReqBodyFail: "portfolio: Failed: Validating the request body",
	pD_valReqBodySuccess: "portfolio: Success: Validating the request body",


	/* get trade*/
	gT_start: "getTrades: get trades start",
	gT_end: "getTrades: END: get trades ends",
	gT_valReqBody: "getTrades: Validating the request body",
	gT_valReqBodyFail: "getTrades: Failed: Validating the request body",
	gT_valReqBodySuccess: "getTrades: Success: Validating the request body",
}