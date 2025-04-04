const { Trip, Image } = require("../models");
const path = require("path");

const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({
      include: Image,
    });

    const formattedTrips = trips.map((trip) => ({
      tripName: trip.name,
      tripSlug: trip.name.toLowerCase().replace(/\s+/g, "-"),
      nationalPark: trip.park,
      state: trip.state,
      country: trip.country,
      date: trip.date,
      images: trip.Images ? trip.Images.map((img) => img.image_url) : [],
    }));

    res.json(formattedTrips);
  } catch (error) {
    console.error("Error fetching trips:", error);
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

const createTrip = async (req, res) => {
  try {
    const { tripName, nationalPark, state, country, date, tripSlug } = req.body;

    const newTrip = await Trip.create({
      name: tripName,
      park: nationalPark,
      state,
      country,
      date,
    });

    const imageFiles = req.files;

    if (imageFiles && imageFiles.length > 0) {
      const imageRecords = imageFiles.map((file) => ({
        image_url: `/uploads/${file.filename}`,
        trip_id: newTrip.id,
      }));

      await Image.bulkCreate(imageRecords);
    }

    const tripWithImages = await Trip.findByPk(newTrip.id, { include: Image });

    res.status(201).json({
      tripName: tripWithImages.name,
      tripSlug,
      nationalPark: tripWithImages.park,
      state: tripWithImages.state,
      country: tripWithImages.country,
      date: tripWithImages.date,
      images: tripWithImages.Images.map((img) => img.image_url),
    });
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ error: "Failed to create trip" });
  }
};

module.exports = { getAllTrips, getTripById, createTrip };
