const { Trip, Image } = require("../models");

const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({ include: Image });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trips" });
  }
};

const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id, { include: Image });
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trip" });
  }
};

module.exports = { getAllTrips, getTripById };
