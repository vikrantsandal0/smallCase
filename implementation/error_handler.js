/**
 * HELPER ERROR HANDLER METHODS
 */

const helper = require("./helper");
const logger = require("../utils/logger");
const errConsts = require("../static/error_constants");
const consts = require("../static/constants");
const logMsgs = require("../static/log_messages");

/**
 * Method to log the error name, message and the error object is available
 * @param {Object} err: Contains the generic error thrown
 */
const logErrorMessage = (err) => {
	if (err.name) logger.error(logMsgs.format_err_name(err.name)); // Log the error name
	if (err.message) logger.error(logMsgs.format_err_msg(err.message)); // Log the error message

	err = (helper.isError(err)) ? err.stack : err; // If the err is Error, log the error stack
	if (helper.isObject(err)) // If the err is Object, log the stringified object
		err = (err.original) ? JSON.stringify(err.original) : JSON.stringify(err);

	logger.error(err);
};

const errorObjCreator = (error, field_name, error_code, message, fNmNtRqrd) => {
	let obj = {
		seq_id: error.length,
		field_name: field_name,
		error_code: errConsts.errorCodes[error_code],
		message: message.replace(/"/g, "'")
	};
	if (fNmNtRqrd) delete obj.field_name;
	error.push(obj);
	return error;
};

/** Method to log and throw error
 * @param {Object} toLog array containing all the error objects
 * @param {Object} toThrow name of field for which errro being thrown*/
exports.logAndThrowErr = (toLog, toThrow) => {
	logErrorMessage(toLog);
	throw toThrow;
};


/**Formats each object returned by AJV,
  * into required format {field_name, error_code, message}
  * @param {Object} error 
  */
const decodeError = (error) => {
	if (error.keyword == "if") return null; // to refrain from mentioning a schema failed to validate
	const spcfcError = errConsts.valErrCombo[error.keyword];
	let resp = {
		field_name: (spcfcError.params == undefined) ? error.dataPath : `${error.dataPath}.${error.params[spcfcError.params]}`,
		error_code: spcfcError.error_code,
		message: error.message
	};
	if (resp.field_name.startsWith(consts.dotString)) resp.field_name = resp.field_name.slice(1); // to remove the preceding dot.
	if (resp.field_name == consts.emptyStr) delete resp.field_name; /* For root key errors */
	return resp;
};

/**	This method formats ALL error messages caught by the last .catch */
exports.formatErrorMessage = (err) => {
	logErrorMessage(err);

	logger.info(`${logMsgs.format_err}`);
	return {
		statusCode: err.statusCode || consts.errorHTTPCode,
		body: {
			message: err.message || consts.ISError
		}
	};;
};

/** This method formats the errors returned from Json Schema validation */
exports.formatAJVerrors = (response, errors) => {
	logger.info(`${logMsgs.val_itr_error}`);
	for (let error of errors.entries()) {
		logger.info(`${logMsgs.val_error_generic} ${JSON.stringify(error)} `);
		if (response.valid) response = { valid: false, error: [] };
		const resp = decodeError(error[1]);
		if (resp) response.error = errorObjCreator(response.error, resp.field_name, resp.error_code, resp.message);
	}
	logger.info(`${logMsgs.val_itr_error_comp}`);
	return response;
};
