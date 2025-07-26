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
const allowedOrigins = [
    'https://dev.mibesfront.compassionate.217-154-36-100.plesk.page',
    'https://dev.admindash.compassionate.217-154-36-100.plesk.page',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:8080',
];

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


app.listen(3030, () => {
  console.log("Backend server is running on 3030");
});
