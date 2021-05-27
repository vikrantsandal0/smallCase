exports.invalidValue = "invalidValue";

exports.errorCodes = {
	"required": 1001,
	"duplicate": 1002,
	"invalidType": 1003,
	"invalidValue": 1004,
	"minLimit": 1005,
	"maxLimit": 1006,
	"additionalProperties": 1007,
	"formatError": 1008,
	"notFound": 1009,
	"noChange": 1010,
	"notAllowed": 1011,
	"invalidAllowedValues": 1012
};

//error constants for AJV req body validation
exports.valErrCombo = {
	"required": { params: "missingProperty", error_code: "required" },
	"additionalProperties": { params: "additionalProperty", error_code: "additionalProperties" },
	"minimum": { error_code: "minLimit" },
	"minItems": { error_code: "minLimit" },
	"type": { error_code: "invalidType" },
	"format": { error_code: "formatError" },
	"enum": { params: "allowedValues", error_code: "invalidAllowedValues" }
};

