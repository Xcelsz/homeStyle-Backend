
const pool = require("../database/db");
const fs = require("fs");
const path = require("path");

// Create a new service listing
exports.createServiceListing = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      serviceName,
      serviceLocation,
      shortDescription,
      area,
      bedrooms,
      livingRooms,
      parking,
      bathrooms,
      kitchen,
      status = "unpublished",
    } = req.body;

    const mediaPath = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO service_listings 
      (title, subtitle, media_path, service_name, service_location, short_description, area, bedrooms, living_rooms, parking, bathrooms, kitchen, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
      RETURNING *`,
      [
        title,
        subtitle,
        mediaPath,
        serviceName,
        serviceLocation,
        shortDescription,
        area,
        bedrooms,
        livingRooms,
        parking,
        bathrooms,
        kitchen,
        status,
      ]
    );

    res.status(201).json({ message: "Service listing created", data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch all service listings
exports.getAllServiceListings = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM service_listings");
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch a single service listing
exports.getServiceListingById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM service_listings WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Service listing not found" });
    }
    res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a service listing
exports.updateServiceListing = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      serviceName,
      serviceLocation,
      shortDescription,
      area,
      bedrooms,
      livingRooms,
      parking,
      bathrooms,
      kitchen,
      status,
    } = req.body;

    const mediaPath = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `UPDATE service_listings 
      SET title = $1, subtitle = $2, media_path = COALESCE($3, media_path), service_name = $4, service_location = $5, short_description = $6, area = $7, bedrooms = $8, living_rooms = $9, parking = $10, bathrooms = $11, kitchen = $12, status = $13, updated_at = NOW() 
      WHERE id = $14 
      RETURNING *`,
      [
        title,
        subtitle,
        mediaPath,
        serviceName,
        serviceLocation,
        shortDescription,
        area,
        bedrooms,
        livingRooms,
        parking,
        bathrooms,
        kitchen,
        status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Service listing not found" });
    }

    res.status(200).json({ message: "Service listing updated", data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a service listing
exports.deleteServiceListing = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM service_listings WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Service listing not found" });
    }

    // Delete associated media file
    const mediaPath = result.rows[0].media_path;
    if (mediaPath) {
      fs.unlink(path.join(__dirname, "..", mediaPath), (err) => {
        if (err) console.error("Failed to delete file:", err);
      });
    }

    res.status(200).json({ message: "Service listing deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
