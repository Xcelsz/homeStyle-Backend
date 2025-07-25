const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const serviceListingRoutes = require("./routes/serviceListingRoutes");
const featureRouter = require("./routes/featureRoute")
const bookingRouter = require("./routes/bookingRoute")
const PORT = process.env.PORT || 3000

const authRoutes = require('./routes/auth/admin/authRoute');
const dotenv = require('dotenv');
dotenv.config()

const app = express();
app.use(express.json());
app.use(cors(
  {
    origin: process.env.corsOrigin,
    credentials: true,
  }
));
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});
app.use(bodyParser.json());

app.use("/images", express.static("images"));


// this are the various routes
app.use("/uploads", express.static("uploads")); // Serve static files
app.use("/api/listings/", serviceListingRoutes);
app.use("/api", featureRouter);
app.use("/api/bookings", bookingRouter);
app.use('/api/admin', authRoutes);

// app.use('/api/sales', require('./controllers/salesController'));
// app.use('/api/invoices', require('./controllers/invoicesController'));
// app.use('/api/refunds', require('./controllers/refundsController'));


app.listen(PORT, () => {
  console.log(`Backend server is running on ${PORT}`);
});
