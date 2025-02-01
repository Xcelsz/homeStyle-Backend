const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const serviceListingRoutes = require("./routes/serviceListingRoutes");
const featureRouter = require("./routes/featureRoute")
const bookingRouter = require("./routes/bookingRoute")

const authRoutes = require('./routes/auth/admin/authRoute');
const dotenv = require('dotenv');
dotenv.config()

const app = express();
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});
app.use(bodyParser.json());

// this are the various routes
app.use("/uploads", express.static("uploads")); // Serve static files
app.use("/api/listings", serviceListingRoutes);
app.use("/api", featureRouter);
app.use("/api/bookings", bookingRouter);
app.use('/api/admin', authRoutes);


app.listen(3030, () => {
  console.log("Backend server is running on 3030");
});
