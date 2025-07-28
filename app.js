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
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:5000'];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            console.error(msg, "Origin: ", origin);
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Cache-Control', 
        'Pragma',        
        'Expires'        
    ],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
console.log("CORS enabled with allowed origins:", allowedOrigins);
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


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Backend server is running on ${PORT}`);
});
