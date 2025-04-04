const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./models");
const tripRoutes = require("./routes/tripRoutes");

const { PORT = 5001 } = process.env;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/trips", tripRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
