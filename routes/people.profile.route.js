/* eslint-disable linebreak-style */
const express = require("express");
const peopleProfileController = require("../controllers/people.profile.controller");
const router = express.Router();

// POST - Get People Profile data
// /v1/identity/people/profile/:peopleId
router.post("/:peopleId", peopleProfileController.view_profile);
// /v1/identity/people/profile/:peopleId/allFields
router.post("/:peopleId/allFields", peopleProfileController.get_all_fields_impl);

//POST - Endorse and Unendorse API's 
router.post("/:peopleId/endorse", peopleProfileController.endorse);
router.post("/:peopleId/unendorse", peopleProfileController.unendorse);

//GET - load endorsements
router.get("/:peopleId/expertises", peopleProfileController.load_expertises);

module.exports = router;