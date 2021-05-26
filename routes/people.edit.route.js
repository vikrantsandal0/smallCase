/* eslint-disable linebreak-style */
const express = require("express");
const peopleProfileEditController = require("../controllers/people.profileEdit.controller");
const router = express.Router();

// PUT - Edit People Profile data
// PUT /v1/identity/people/edit/:peopleId
router.put("/:peopleId", peopleProfileEditController.edit_profile);
// PUT /v1/identity/people/edit/self
router.put("/self", peopleProfileEditController.edit_profile);

module.exports = router;