const uuid = require("uuid/v4");
const Ajv = require("ajv");
const path = require("path");
const fs = require("fs");

const consts = require("../static/constants");
const logMsgs = require("../static/log_messages");
const logger = require("../utils/logger");
const errorHandler = require("../implementation/error_handler");

exports.genUUID = () => uuid();
exports.validateReqBody = async (body, removeRequired, type, isValidate = false) => {

	logger.info(`${logMsgs.val_json_schema}`);
	var ajv = new Ajv({ allErrors: true });

	let schemas = [], mainSchema = [];
	if (type === consts.getTradesFlow) {
		schemas = consts.manageTradesSchema;
		mainSchema = consts.manageTradesSchema[0];
	}
	else if (type === consts.makeTradesFlow) {
		schemas = consts.manageTradesSchema;
		mainSchema = consts.manageTradesSchema[1];
	}
	else if (type === consts.updateTradesFlow) {
		schemas = consts.manageTradesSchema;
		mainSchema = consts.manageTradesSchema[2];
	}
	else if (type === consts.deleteTradeFlow) {
		schemas = consts.manageTradesSchema;
		mainSchema = consts.manageTradesSchema[3];
	}
	else if (type === consts.tradesReturnsFlow) {
		schemas = consts.manageTradesSchema;
		mainSchema = consts.manageTradesSchema[4];
	}
	else if (type === consts.portfolioDetailsFlow) {
		schemas = consts.manageTradesSchema;
		mainSchema = consts.manageTradesSchema[5];
	}
	// Adding the schemas to the ajv instance
	for(let schema of schemas){

		/* The 'required' array in the below schema gets deleted incase of PUT;
				but any subsequent POST requires it; thus using fs to 
				read the schemas. */
		let schemaPath = path.join(__dirname, `../schemas/${schema}_schema.json`);
		let jsonSchema = JSON.parse(fs.readFileSync(schemaPath));
		
		if(removeRequired){
			delete jsonSchema.required;
		}
		ajv.addSchema(jsonSchema, schema);
	}

	// Validating the res.body against the DB schema 
	var valid = ajv.validate(mainSchema, body);
    
	// Clearing the schemas to the ajv instance - after validation
	for(let schema of schemas){
		ajv.removeSchema(schema);
	}
	logger.info(`${logMsgs.val_format}`);

	var response = { valid: true };
	
	if(!valid){
		response = errorHandler.formatAJVerrors(response, ajv.errors);
	}
	return response;
};

/** Check whether the given data is object type */
exports.isObject = (obj) =>{
	return Object.prototype.toString.call(obj).indexOf(consts.typeObjCaps) !== -1;
};

// Check whether the given data is array type
exports.isArray = (arr) =>{
	return Object.prototype.toString.call(arr).indexOf(consts.typeArrCaps) !== -1;
};

/**
 * Check whether the given data is of Function type
 */ 
exports.isFunction = (obj) =>{
	return Object.prototype.toString.call(obj).indexOf(consts.typeFuncCaps) !== -1;
};

/** Check whether the given data is Error type */
exports.isError = (obj) =>{
	return Object.prototype.toString.call(obj).indexOf("Error") !== -1;
};

// Check whether given data is object and is empty
exports.isObjectAndEmpty = (obj) => {
	return (Object.keys(obj).length === 0 && obj.constructor === Object);
};
exports.roundToTwo = (num)=>{
	return +(Math.round(num + "e+2")  + "e-2");
  }