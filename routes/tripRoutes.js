const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const {
  getAllTrips,
  getTripById,
  createTrip,
} = require("../controllers/tripController");

// const auth = require("../middleware/auth");
const validateId = require("../middleware/validateId");

router.get("/", getAllTrips);

router.get("/:id", validateId("id"), getTripById);

router.post("/", upload.array("images"), createTrip);

module.exports = router;
