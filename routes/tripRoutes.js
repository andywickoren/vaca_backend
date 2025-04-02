const express = require("express");
const router = express.Router();
const { getAllTrips, getTripById } = require("../controllers/tripController");
const auth = require("../middleware/auth");
const validateId = require("../middleware/validateId");

router.get("/", getAllTrips);

router.get("/:id", validateId("id"), getTripById);

module.exports = router;
