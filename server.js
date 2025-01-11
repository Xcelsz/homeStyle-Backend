const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const serviceListingRoutes = require("./routes/serviceListingRoutes");
const dotenv = require('dotenv');
dotenv.config()

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// this are the various routes
app.use("/uploads", express.static("uploads")); // Serve static files
app.use("/api/service-listings", serviceListingRoutes);

app.listen(5020, () => {
  console.log("Backend server is running on 5020");
});
