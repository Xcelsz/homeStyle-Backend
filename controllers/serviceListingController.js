const pool = require("../database/db");
const fs = require("fs");
const path = require("path");

// Create a new service listing
exports.createServiceListing = async (req, res) => {

  console.log(req.body);
  
  try {
    const {
      title,
      subtitle,
      displayImage, // For the display image URL
      serviceCategory,
      serviceLocation,
      serviceSummary,
      price,
      keywords,
      paymentOptions,
      location,
      features,
      serviceDetails,
      status = "unpublished",
      listingType,
      PropertyNeed,
      generalInfo,
      localAmenities,
      size,
      parking,
      bedRoom,
      bathRoom,
      area
    } = req.body;

    const mediaPath = req.file ? `/uploads/${req.file.filename}` : displayImage;
    let foreignKeyId = null;
    let foreignKeyColumn = null;

    const tableDetails = {
      Service: {
        tableName: 'ServiceDetails',
        columns: `title, subtitle, display_image, service_category, service_location, service_summary, price, keywords, payment_options, location, features, service_details`,
        values: [
          title,
          subtitle,
          mediaPath,
          serviceCategory,
          serviceLocation,
          serviceSummary,
          price,
          JSON.stringify(keywords.split(',')),
          JSON.stringify(paymentOptions.split(',')),
          JSON.stringify(serviceLocation),
          JSON.stringify(features.split(',')),
          serviceDetails,
        ],
        foreignKeyColumn: 'service_details_id',
      },
      Property: {
        tableName: 'PropertyDetails',
        columns: `PropertyNeed, title, subtitle, price, displayImage, serviceSummary, generalInfo, features, localAmenities, location, payment_options, status, service_details, size, bedRoom, parking, bathRoom, area`,
        values: [
          PropertyNeed,
          title,
          subtitle,
          parseInt(price),
          mediaPath,
          serviceSummary,
          generalInfo,
          JSON.stringify(features),
          JSON.stringify(localAmenities),
          JSON.stringify(location),
          JSON.stringify(paymentOptions),
          status,
          serviceDetails,
          size,
          bedRoom,
          parking,
          bathRoom,
          serviceLocation
        ],
        foreignKeyColumn: 'property_details_id',
      },
    };

    const listingDetails = tableDetails[listingType];

    if (!listingDetails) {
      return res.status(400).json({ message: "Invalid listingType for this API" });
    }

    const [serviceResult] = await pool.query(
      `INSERT INTO ${listingDetails.tableName} (${listingDetails.columns}) VALUES (${listingDetails.columns.split(', ').map(() => '?').join(', ')})`,
      listingDetails.values
    );

    foreignKeyId = serviceResult.insertId;
    foreignKeyColumn = listingDetails.foreignKeyColumn;

    const [listingResult] = await pool.query(
      `INSERT INTO PropertyListings 
      (title, subtitle, display_image, short_description, status, type, subcategory, ${foreignKeyColumn}) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        subtitle,
        mediaPath,
        serviceSummary,
        status,
        listingType,
        serviceCategory,
        foreignKeyId,
      ]
    );

    const lastInsertId = listingResult.insertId;

    const [newRecord] = await pool.query(
      `SELECT * FROM PropertyListings WHERE id = ?`,
      [lastInsertId]
    );

    res.status(201).json({
      message: "Service listing created successfully",
      data: newRecord,
    });
  } catch (error) {
    console.error("Error creating service listing:", error);
    res.status(500).json({
      message: "Server error while creating listing",
      error: error.message,
    });
  }
};



exports.createPropertyListing = async (req, res) => {
  try {
    const {
      PropertyNeed,
      title,
      subtitle,
      price,
      displayImage,
      serviceSummary,
      generalInfo,
      features = [],
      localAmenities = [],
      location = {},
      paymentOptions = [],
      status = "published",
      serviceDetails
    } = req.body;

    const mediaPath = req.file ? `/uploads/${req.file.filename}` : displayImage;

    const [result] = await pool.query(
      `INSERT INTO PropertyDetails 
      (PropertyNeed, title, subtitle, price, displayImage, serviceSummary, generalInfo, 
      features, localAmenities, location, paymentOptions, status, serviceDetails) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        PropertyNeed,
        title,
        subtitle,
        price,
        mediaPath,
        serviceSummary,
        generalInfo,
        JSON.stringify(features),
        JSON.stringify(localAmenities),
        location,
        JSON.stringify(paymentOptions),
        status,
        serviceDetails
      ]
    );

    const [newRecord] = await pool.query(
      `SELECT * FROM PropertyDetails WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: "Property created successfully",
      data: newRecord
    });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({
      message: "Server error while creating property",
      error: error.message
    });
  }
};



// Fetch all listings with pagination
// exports.getAllListings = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page, 10) || 1; // Default to page 1
//     const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page
//     const offset = (page - 1) * limit;

//     const query = "SELECT * FROM PropertyListings ORDER BY id DESC LIMIT ? OFFSET ?";
//     const [rows] = await pool.query(query, [limit, offset]);

//     const countQuery = "SELECT COUNT(*) AS total FROM PropertyListings ";
//     const [countResult] = await pool.query(countQuery);

//     res.status(200).json({
//       data: rows,
//       pagination: {
//         total: countResult[0].total,
//         page,
//         limit,
//         totalPages: Math.ceil(countResult[0].total / limit),
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };



// Fetch all listings without pagination
exports.getAllListings = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM PropertyListings"
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Service listing not found" });
    }
    res.status(200).json({ data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllServiceListings = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM ServiceDetails "
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Service listing not found" });
    }
    res.status(200).json({ data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
//sd
exports.getAllPropertyListings = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM PropertyDetails ORDER BY property_details_id DESC LIMIT 6"
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Service listing not found" });
    }

    // Parse `localAmenities`, `location`, and `payment_options` if they are strings
    const parsedResult = result.map(property => ({
      ...property,
      localAmenities: typeof property.localAmenities === "string" 
        ? JSON.parse(property.localAmenities) 
        : property.localAmenities || [],
      
      location: typeof property.location === "string" 
        ? JSON.parse(property.location) 
        : property.location || {},
      
      payment_options: typeof property.payment_options === "string" 
        ? JSON.parse(property.payment_options) 
        : property.payment_options || [],
      
      // Ensure `price` and `parking` are numbers (if necessary)
      price: Number(property.price),
      parking: Number(property.parking),
    }));

    res.status(200).json({ data: parsedResult });
  } catch (error) {
    console.error("Error parsing properties:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// Fetch a single service listing
exports.getServiceListingById = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "SELECT * FROM PropertyListings WHERE id = ?",
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Service listing not found" });
    }
    res.status(200).json({ data: result[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a service listing
exports.deleteServiceListing = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM PropertyListings WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Service listing not found" });
    }

    res.status(200).json({ message: "Service listing deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update status of a service listing
exports.updateServiceListingStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!["published", "unpublished", "close", "achieve"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const [result] = await pool.query(
      "UPDATE PropertyListings SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Service listing not found" });
    }

    const [updatedRecord] = await pool.query(
      "SELECT * FROM PropertyListings WHERE id = ?",
      [id]
    );

    res.status(200).json({
      message: "Service listing status updated",
      data: updatedRecord[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch service stats
exports.getServiceStats = async (req, res) => {
  console.log("Fetching service stats...");

  try {
    const query = `
      SELECT 
        type,
        COUNT(*) AS total,
        COUNT(CASE WHEN status = 'published' THEN 1 END) AS published,
        COUNT(CASE WHEN status = 'unpublished' THEN 1 END) AS unpublished,
        COUNT(CASE WHEN status = 'archived' THEN 1 END) AS archived
      FROM PropertyListings
      GROUP BY type;
    `;

    const [results] = await pool.query(query);

    // Define the expected types with default values
    const defaultStats = {
      Property: { total: 0, published: 0, unpublished: 0, archived: 0 },
      Service: { total: 0, published: 0, unpublished: 0, archived: 0 },
      Addons: { total: 0, published: 0, unpublished: 0, archived: 0 },
      Resource: { total: 0, published: 0, unpublished: 0, archived: 0 },
    };

    // Merge query results with default stats
    const mergedResults = Object.entries(defaultStats).map(([type, defaults]) => {
      const result = results.find((item) => item.type === type) || {};
      return {
        type,
        total: result.total || defaults.total,
        published: result.published || defaults.published,
        unpublished: result.unpublished || defaults.unpublished,
        archived: result.archived || defaults.archived,
      };
    });

    res.status(200).json({
      message: "Service statistics fetched successfully",
      data: mergedResults,
    });
  } catch (error) {
    console.error("Error fetching service stats:", error);
    res.status(500).json({
      message: "Server error while fetching service statistics",
      error: error.message,
    });
  }
};
