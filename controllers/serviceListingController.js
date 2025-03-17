const pool = require("../database/db");
const fs = require("fs");
const path = require("path");



function safeParse(input) {
  // If input is not a string, return it as-is (assuming it's already an array/object)
  if (typeof input !== 'string') return input;

  try {
    return JSON.parse(input);
  } catch (e) {
    // Attempt to replace single quotes with double quotes as a quick fix
    try {
      const fixedInput = input.replace(/'/g, '"');
      return JSON.parse(fixedInput);
    } catch (error) {
      console.error("Failed to parse JSON:", input);
      return [];
    }
  }
}


// Create a new service listing

// exports.createListing = async (req, res) => {
//   try {
//     const {
//       title,
//       subtitle,
//       serviceCategory,
//       serviceLocation,
//       serviceSummary,
//       price,
//       listingType,
//       serviceDetails,
//       status = "unpublished",
//       PropertyNeed,
//       generalInfo,
//       localAmenities,
//       propertyAmenities,
//       size,
//       parking,
//       bedRoom,
//       bathRoom,
//       area,
//       paymentOptions,
//       features,
//       location,
//       videoLinks,
//       faq,
//       keyResults,
//       category,
//       total_minutes_read,
//       overview,
//       images,
//     } = req.body;

//     // Handle file uploads
//     const displayImages = req.files?.media ? req.files.media.map(file => `/uploads/${file.filename}`) : [];
//     const floorPlanPaths = req.files?.floorPlans ? req.files.floorPlans.map(file => `/uploads/${file.filename}`) : [];
//     const mediaPath = displayImages.length > 0 ? displayImages[0] : null;
//     const paragraphs = req.body.paragraphs ? req.body.paragraphs.split(',') : [];

//     let foreignKeyId = null;
//     let foreignKeyColumn = null;

//     const tableDetails = {
//       Service: {
//         tableName: 'ServiceDetails',
//         columns: `title, subtitle, display_image, service_category, service_location, service_type, service_summary, price, service_details, key_results, status, faq` ,
//         values: [
//           title,
//           subtitle,
//           mediaPath,
//           serviceCategory,
//           serviceLocation,
//           listingType,
//           serviceSummary,
//           parseFloat(price) || 0,
//           serviceDetails || "",
//           JSON.stringify(keyResults || []),
//           status,
//           JSON.stringify(JSON.parse(faq || "[]")),
//         ],
//         foreignKeyColumn: "service_details_id",
//       },
//       Property: {
//         tableName: 'PropertyDetails',
//         columns: `category, PropertyNeed, title, subtitle, price, displayImage, serviceSummary, generalInfo, features, propertyAmenities, location, payment_options, status, service_details, service_type, size, bedRoom, parking, bathRoom, area, videoLinks, faq` ,
//         values: [
//           category,
//           PropertyNeed,
//           title,
//           subtitle,
//           price,
//           mediaPath,
//           serviceSummary,
//           generalInfo,
//           JSON.stringify(JSON.parse(features || "[]")),
//           JSON.stringify(JSON.parse(propertyAmenities || "{}")),
//           JSON.stringify(JSON.parse(location || "{}")),
//           JSON.stringify(JSON.parse(paymentOptions || "[]")),
//           status,
//           serviceDetails || '',
//           listingType || '',
//           size || 0,
//           bedRoom || 0,
//           parking || 0,
//           bathRoom || 0,
//           area || '',
//           JSON.stringify(JSON.parse(videoLinks || "[]")),
//           JSON.stringify(JSON.parse(faq || "[]"))
//         ],
//         foreignKeyColumn: 'property_details_id'
//       },
//       Resource: {
//         tableName: 'ResourceDetails',
//         columns: `title, subtitle, total_minutes_read, overview, category, faq`,
//         values: [title, subtitle, total_minutes_read, serviceSummary, category, JSON.stringify(JSON.parse(faq || "[]"))],
//         foreignKeyColumn: 'resource_details_id'
//       }
//     };

//     const listingDetails = tableDetails[listingType];
//     if (!listingDetails) {
//       return res.status(400).json({ message: "Invalid listingType for this API" });
//     }

//     // Insert into specific table (ServiceDetails, PropertyDetails, or ResourceDetails)
//     const [result] = await pool.query(
//       `INSERT INTO ${listingDetails.tableName} (${listingDetails.columns}) VALUES (${listingDetails.columns.split(', ').map(() => '?').join(', ')})`,
//       listingDetails.values
//     );

//     foreignKeyId = result.insertId;
//     foreignKeyColumn = listingDetails.foreignKeyColumn;

//     // Insert into the parent table PropertyListings
//     const [listingResult] = await pool.query(
//       `INSERT INTO PropertyListings 
//       (title, subtitle, display_image, short_description, status, type, subcategory, ${foreignKeyColumn}) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?)` ,
//       [
//         title,
//         subtitle,
//         mediaPath,
//         serviceSummary,
//         status,
//         listingType,
//         serviceCategory,
//         foreignKeyId
//       ]
//     );

//     const listingId = listingResult.insertId;

//     // Insert additional property-specific data if applicable
//     if (listingType === 'Property') {
//       // Insert images into PropertyImages table
//       const imagePromises = displayImages.map(url =>
//         pool.query(`INSERT INTO PropertyImages (propertyId, imageUrl) VALUES (?, ?)`, [foreignKeyId, url])
//       );

//       // Insert floor plans into PropertyFloorPlans table
//       const floorPlanPromises = floorPlanPaths.map(path =>
//         pool.query(`INSERT INTO PropertyFloorPlans (propertyId, filePath) VALUES (?, ?)`, [foreignKeyId, path])
//       );

//       // Insert local amenities into PropertyAmenities table
//       await pool.query(
//         `INSERT INTO PropertyAmenities (propertyId, amenitiesData) VALUES (?, ?)` ,
//         [foreignKeyId, JSON.stringify(JSON.parse(localAmenities || "{}"))]
//       );

//       await Promise.all([...imagePromises, ...floorPlanPromises]);
//     }

//     // Insert images and paragraphs for resource listings
//     if (listingType === 'Resource') {
//       displayImages.forEach((image, index) => {
//         pool.query(`INSERT INTO ResourceImages (resource_id, image_url, position) VALUES (?, ?, ?)`, [foreignKeyId, image, index + 1]);
//       });

//       paragraphs.forEach((paragraph, index) => {
//         pool.query(`INSERT INTO ResourceParagraphs (resource_id, paragraph, position) VALUES (?, ?, ?)`, [foreignKeyId, paragraph, index + 1]);
//       });
//     }

//     // Fetch the newly created listing record
//     const [newRecord] = await pool.query(
//       `SELECT * FROM PropertyListings WHERE id = ?` ,
//       [listingId]
//     );

//     res.status(201).json({
//       message: "Listing created successfully",
//       data: newRecord
//     });
//   } catch (error) {
//     console.error("Error creating listing:", error);
//     res.status(500).json({
//       message: "Server error while creating listing",
//       error: error.message
//     });
//   }
// };



exports.createListing = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      serviceCategory,
      serviceLocation,
      serviceSummary,
      price,
      listingType,
      serviceDetails,
      status = "unpublished",
      PropertyNeed,
      generalInfo,
      localAmenities,
      propertyAmenities,
      size,
      parking,
      bedRoom,
      bathRoom,
      area,
      paymentOptions,
      features,
      location,
      videoLinks,
      faq,
      keyResults,
      category,
      total_minutes_read,
      overview,
      images,
      whyChoose,
      whatsIncluded,
      total,
      propertyUsage,
      whatsIncludedDetails,
      expectedOutcome,
      keyFeatures,
      requestQuote,
      occupancy,
      propertyPrice,
      propertyTax,
      risks,
      tenures,
      registrations,
      salesPrice,
      ownership,
      roads,
      serviceLevel,
      Cancellation,
      CheckIn,
      commissionOffice
    } = req.body;

    console.log('====================================');
    console.log(req.body);
    console.log('====================================');

    // Handle file uploads
    const displayImages = req.files?.media ? req.files.media.map(file => `/uploads/${file.filename}`) : [];
    const frontImage = req.files?.frontMedia ? req.files.frontMedia.map(file => `/uploads/${file.filename}`) : [];
    const floorPlanPaths = req.files?.floorPlans ? req.files.floorPlans.map(file => `/uploads/${file.filename}`) : [];
    const ownershipPaths = req.files?.ownership ? req.files.ownership.map(file => `/uploads/${file.filename}`) : [];
    const mediaPath1 = displayImages.length > 0 ? displayImages[0] : null;
    const mediaPath = frontImage.length > 0 ? frontImage[0] : null;
    const paragraphs = req.body.paragraphs ? req.body.paragraphs.split(',') : [];

    // console.log('====================================');
    // console.log(frontImage);
    // console.log('====================================');


    let foreignKeyId = null;
    let foreignKeyColumn = null;

    const tableDetails = {
      Service: {
        tableName: 'ServiceDetails',
        columns: `title, subtitle, display_image, serviceCategory, serviceLocation, area, listingType, serviceSummary, price, keyFeatures, whatsIncludedDetails, whatsIncluded, expectedOutcome, requestQuote, media, status, faq`,
        values: [
          title,
          subtitle,
          mediaPath1,
          serviceCategory,
          serviceLocation,
          serviceLocation,
          listingType,
          serviceSummary,
          parseFloat(price) || 0,
          JSON.stringify(keyFeatures || []),
          whatsIncludedDetails|| "",
          JSON.stringify(whatsIncluded || []),
          JSON.stringify(expectedOutcome || []),
          requestQuote == 'true'? true : false,
          JSON.stringify(displayImages || []),
          status,
          JSON.stringify(JSON.parse(faq || "[]"))
        ],
        foreignKeyColumn: "service_details_id",
      },
      Property: {
        tableName: 'PropertyDetails',
        columns: `category, PropertyNeed, title, subtitle, price, displayImage, serviceSummary, generalInfo, features, propertyAmenities, location, payment_options, status, service_details, service_type, size, bedRoom, parking, bathRoom, area, videoLinks, faq, propertyUsage, total, occupancy, propertyPrice, propertyTax, risks, tenures, registrations, salesPrice, ownership, roads, serviceLevel, Cancellation, CheckIn, commissionOffice`,
        values: [
          category,
          PropertyNeed,
          title,
          subtitle,
          price,
          mediaPath,
          serviceSummary,
          generalInfo,
          JSON.stringify(JSON.parse(features || "[]")),
          JSON.stringify(JSON.parse(propertyAmenities || "{}")),
          JSON.stringify(JSON.parse(location || "{}")),
          JSON.stringify(JSON.parse(paymentOptions || "[]")),
          status,
          serviceDetails || '',
          listingType || '',
          size || 0,
          bedRoom || 0,
          parking || 0,
          bathRoom || 0,
          area || '',
          JSON.stringify(JSON.parse(videoLinks || "[]")),
          JSON.stringify(JSON.parse(faq || "[]")),
          propertyUsage || '',
          total || '',
          occupancy || '',
          JSON.stringify(safeParse(propertyPrice || "[]")),
          JSON.stringify(safeParse(propertyTax || "[]")),
          JSON.stringify(safeParse(risks || "[]")),
          JSON.stringify(safeParse(tenures || "[]")),
          JSON.stringify(safeParse(registrations || "[]")),
          JSON.stringify(safeParse(salesPrice || "[]")),
          JSON.stringify(safeParse(ownership || "[]")),
          JSON.stringify(safeParse(roads || "[]")),
          JSON.stringify(safeParse(serviceLevel || "[]")),
          JSON.stringify(safeParse(Cancellation || "[]")),
          JSON.stringify(safeParse(CheckIn || "[]")),
          commissionOffice || '',
        ],
        foreignKeyColumn: 'property_details_id'
      },      
      Resource: {
        tableName: 'ResourceDetails',
        columns: `title, subtitle, total_minutes_read, overview, category, faq`,
        values: [title, subtitle, total_minutes_read, serviceSummary, category, JSON.stringify(JSON.parse(faq || "[]"))],
        foreignKeyColumn: 'resource_details_id'
      },
      Addons: {
        tableName: 'Addons',
        columns: `title, subtitle, category, price, display_image, key_features_total, key_features_values, overview, general_info, why_choose, whats_included, status, faq`,
        values: [
          title,
          subtitle,
          category,
          parseFloat(price) || 0,
          mediaPath1,
          (features && features.length) || 0,
          JSON.stringify(JSON.parse(features || "[]")),
          overview || "",
          generalInfo || "",
          whyChoose || "",
          JSON.stringify(whatsIncluded ? whatsIncluded.split(',') : []),
          status,
          JSON.stringify(JSON.parse(faq || "[]"))
        ],
        foreignKeyColumn: "addons_id"
      }
    };

    const listingDetails = tableDetails[listingType];
    if (!listingDetails) {
      return res.status(400).json({ message: "Invalid listingType for this API" });
    }

    // Insert into specific table (ServiceDetails, PropertyDetails, ResourceDetails, or Addons)
    const [result] = await pool.query(
      `INSERT INTO ${listingDetails.tableName} (${listingDetails.columns}) VALUES (${listingDetails.columns.split(', ').map(() => '?').join(', ')})`,
      listingDetails.values
    );

    foreignKeyId = result.insertId;
    foreignKeyColumn = listingDetails.foreignKeyColumn;

    // Insert into the parent table PropertyListings
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
        foreignKeyId
      ]
    );

    const listingId = listingResult.insertId;

    // Insert additional property-specific data if applicable
    if (listingType === 'Property') {
      // Insert images into PropertyImages table
      const imagePromises = displayImages.map(url =>
        pool.query(`INSERT INTO PropertyImages (propertyId, imageUrl) VALUES (?, ?)`, [foreignKeyId, url])
      );

      // Insert floor plans into PropertyFloorPlans table
      const floorPlanPromises = floorPlanPaths.map(path =>
        pool.query(`INSERT INTO PropertyFloorPlans (propertyId, filePath) VALUES (?, ?)`, [foreignKeyId, path])
      );
      
      const ownershipPromises = ownershipPaths.map(path =>
        pool.query(`INSERT INTO PropertyOwnership (propertyId, filePath) VALUES (?, ?)`, [foreignKeyId, path])
      );

      // Insert local amenities into PropertyAmenities table
      await pool.query(
        `INSERT INTO PropertyAmenities (propertyId, amenitiesData) VALUES (?, ?)`,
        [foreignKeyId, JSON.stringify(JSON.parse(localAmenities || "{}"))]
      );

      await Promise.all([...imagePromises, ...floorPlanPromises, ...ownershipPromises]);
    }

    // Insert images and paragraphs for resource listings
    if (listingType === 'Resource') {
      displayImages.forEach((image, index) => {
        pool.query(`INSERT INTO ResourceImages (resource_id, image_url, position) VALUES (?, ?, ?)`, [foreignKeyId, image, index + 1]);
      });

      paragraphs.forEach((paragraph, index) => {
        pool.query(`INSERT INTO ResourceParagraphs (resource_id, paragraph, position) VALUES (?, ?, ?)`, [foreignKeyId, paragraph, index + 1]);
      });
    }

    // Insert images for Addons
    if (listingType === 'Addons' && displayImages.length > 0) {
      const imagePromises = displayImages.map(url =>
        pool.query(`INSERT INTO AddonImages (addon_id, image_url) VALUES (?, ?)`, [foreignKeyId, url])
      );
      await Promise.all(imagePromises);
    }

    // Fetch the newly created listing record
    const [newRecord] = await pool.query(
      `SELECT * FROM PropertyListings WHERE id = ?`,
      [listingId]
    );

    res.status(201).json({
      message: "Listing created successfully",
      data: newRecord
    });
  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(500).json({
      message: "Server error while creating listing",
      error: error.message
    });
  }
};














exports.createServiceListing = async (req, res) => {
  try {
      const {
        title,
        subtitle,
        serviceCategory,
        serviceLocation,
        serviceSummary,
        serviceDetails,
        status = "unpublished",
        price,
        listingType
      } = req.body;

      
      // Parse JSON fields
      const faq = JSON.parse(req.body.faq || "[]");
      const keyResults = JSON.parse(req.body.keyResults|| "[]");

      // Handle file uploads
      const mediaPath = req.file ? `/uploads/${req.file.filename}` : media;

      // Insert into database
      const [result] = await pool.query(
        `INSERT INTO ServiceDetails 
        (title, subtitle, display_image, service_category, service_location, service_summary, price, service_type, 
        service_details, key_results, status, faq) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            title,
            subtitle,
            mediaPath,  
            serviceCategory,
            serviceLocation,
            serviceSummary,
            price,
            listingType,
            serviceDetails || '',
            JSON.stringify(keyResults || []),  // ✅ Fix here
            status,
            JSON.stringify(faq || [])
          ]
      );

      res.status(201).json({
          message: "Service created successfully",
          data: result
      });

  } catch (error) {
      console.error("Error creating Service:", error);
      res.status(500).json({
          message: "Server error while creating Service",
          error: error.message
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
          serviceSummary,
          generalInfo,
          status = "published",
          serviceDetails,
          size,
          parking,
          bedRoom,
          bathRoom,
          area,
          listingType
      } = req.body;

      // Parse JSON fields
      const features = JSON.parse(req.body.features || "[]");
      const localAmenities = JSON.parse(req.body.localAmenities || "{}");
      const propertyAmenities = JSON.parse(req.body.propertyAmenities || "{}");
      const location = JSON.parse(req.body.location || "{}");
      const paymentOptions = JSON.parse(req.body.paymentOptions || "[]");
      const videoLinks = JSON.parse(req.body.videoLinks || "[]");
      const faq = JSON.parse(req.body.faq || "[]");

      // Handle file uploads
      const displayImages = req.files.media ? req.files.media.map(file => `/uploads/${file.filename}`) : [];
      const floorPlanPaths = req.files.floorPlans ? req.files.floorPlans.map(file => `/uploads/${file.filename}`) : [];
      const ownershipPaths = req.files.ownership ? req.files.ownership.map(file => `/uploads/${file.filename}`) : [];

      // Insert into database
      const [result] = await pool.query(
        `INSERT INTO PropertyDetails 
        (PropertyNeed, title, subtitle, price, displayImage, serviceSummary, generalInfo, propertyAmenities, 
        service_type, location, payment_options, status, service_details, size, bedRoom, parking, bathRoom, 
        area, videoLinks, faq) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            PropertyNeed,
            title,
            subtitle,
            price,
            displayImages[0] || '',  // Ensure displayImages[0] is not undefined
            serviceSummary,
            generalInfo,
            JSON.stringify(propertyAmenities || {}),  // ✅ Fix here
            listingType,
            JSON.stringify(location || {}), // Ensure valid JSON
            JSON.stringify(paymentOptions || []),
            status,
            serviceDetails || '',
            size || 0,
            bedRoom || 0,
            parking || 0,
            bathRoom || 0,
            area || '',
            JSON.stringify(videoLinks || []),
            JSON.stringify(faq || [])
          ]
      );

      const propertyId = result.insertId;

      // Insert images into PropertyImages table
      const imagePromises = displayImages.map(url =>
          pool.query(`INSERT INTO PropertyImages (propertyId, imageUrl) VALUES (?, ?)`, [propertyId, url])
      );

      // Insert floor plans into PropertyFloorPlans table
      const floorPlanPromises = floorPlanPaths.map(path =>
          pool.query(`INSERT INTO PropertyFloorPlans (propertyId, filePath) VALUES (?, ?)`, [propertyId, path])
      );

      const ownershipPromises = ownershipPaths.map(path =>
          pool.query(`INSERT INTO PropertyOwnership (propertyId, filePath) VALUES (?, ?)`, [propertyId, path])
      );

      // Insert local amenities into PropertyAmenities table
      await pool.query(`INSERT INTO PropertyAmenities (propertyId, amenitiesData) VALUES (?, ?)`, [propertyId, JSON.stringify(localAmenities)]);

      // Wait for all insertions to finish
      await Promise.all([...imagePromises, ...floorPlanPromises, ...ownershipPromises]);

      // Fetch the newly created property record
      const [newRecord] = await pool.query(`SELECT * FROM PropertyDetails WHERE property_details_id = ?`, [propertyId]);

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



exports.editListing = async (req, res) => {
  try {
    const {
      listingId,
      title,
      subtitle,
      serviceCategory,
      serviceLocation,
      serviceSummary,
      price,
      listingType,
      serviceDetails,
      status,
      PropertyNeed,
      generalInfo,
      localAmenities,
      propertyAmenities,
      size,
      parking,
      bedRoom,
      bathRoom,
      area,
      paymentOptions,
      features,
      location,
      videoLinks,
      faq,
      keyResults,
      category,
    } = req.body;

    // Fetch the existing listing
    const [listing] = await pool.query(`SELECT * FROM PropertyListings WHERE id = ?`, [listingId]);
    if (!listing.length) return res.status(404).json({ message: "Listing not found" });

    const { property_details_id, service_details_id } = listing[0];

    // Handle file uploads
    const displayImages = req.files?.media ? req.files.media.map(file => `/uploads/${file.filename}`) : [];
    const floorPlanPaths = req.files?.floorPlans ? req.files.floorPlans.map(file => `/uploads/${file.filename}`) : [];
    const mediaPath = displayImages.length > 0 ? displayImages[0] : listing[0].display_image;

    let foreignKeyId = property_details_id || service_details_id;
    if (!foreignKeyId) return res.status(400).json({ message: "Invalid listing type" });

    // Update the main listing table
    await pool.query(
      `UPDATE PropertyListings SET title = ?, subtitle = ?, display_image = ?, short_description = ?, status = ?, type = ?, subcategory = ? WHERE id = ?`,
      [title, subtitle, mediaPath, serviceSummary, status, listingType, serviceCategory, listingId]
    );

    // Define update queries for service or property details
    const tableDetails = {
      Service: {
        tableName: "ServiceDetails",
        query: `UPDATE ServiceDetails SET title = ?, subtitle = ?, display_image = ?, service_category = ?, service_location = ?, service_type = ?, service_summary = ?, price = ?, service_details = ?, key_results = ?, status = ?, faq = ? WHERE service_details_id = ?`,
        values: [
          title,
          subtitle,
          mediaPath,
          serviceCategory,
          serviceLocation,
          listingType,
          serviceSummary,
          parseFloat(price) || 0,
          serviceDetails || "",
          JSON.stringify(keyResults || []),
          status,
          JSON.stringify(JSON.parse(faq || "[]")),
          foreignKeyId,
        ],
      },
      Property: {
        tableName: "PropertyDetails",
        query: `UPDATE PropertyDetails SET category = ?, PropertyNeed = ?, title = ?, subtitle = ?, price = ?, displayImage = ?, serviceSummary = ?, generalInfo = ?, features = ?, propertyAmenities = ?, location = ?, payment_options = ?, status = ?, service_details = ?, service_type = ?, size = ?, bedRoom = ?, parking = ?, bathRoom = ?, area = ?, videoLinks = ?, faq = ? WHERE property_details_id = ?`,
        values: [
          category,
          PropertyNeed,
          title,
          subtitle,
          price,
          mediaPath,
          serviceSummary,
          generalInfo,
          JSON.stringify(JSON.parse(features || "[]")),
          JSON.stringify(JSON.parse(propertyAmenities || "{}")),
          JSON.stringify(JSON.parse(location || "{}")),
          JSON.stringify(JSON.parse(paymentOptions || "[]")),
          status,
          serviceDetails || "",
          listingType || "",
          size || 0,
          bedRoom || 0,
          parking || 0,
          bathRoom || 0,
          area || "",
          JSON.stringify(JSON.parse(videoLinks || "[]")),
          JSON.stringify(JSON.parse(faq || "[]")),
          foreignKeyId,
        ],
      },
    };

    const listingDetails = tableDetails[listingType];
    if (!listingDetails) {
      return res.status(400).json({ message: "Invalid listingType" });
    }

    // Update the respective child table
    await pool.query(listingDetails.query, listingDetails.values);

    // Update additional property-specific data if applicable
    if (listingType === "Property") {
      await pool.query(`DELETE FROM PropertyImages WHERE propertyId = ?`, [foreignKeyId]);
      await pool.query(`DELETE FROM PropertyFloorPlans WHERE propertyId = ?`, [foreignKeyId]);
      await pool.query(`DELETE FROM PropertyAmenities WHERE propertyId = ?`, [foreignKeyId]);

      const imagePromises = displayImages.map(url =>
        pool.query(`INSERT INTO PropertyImages (propertyId, imageUrl) VALUES (?, ?)`, [foreignKeyId, url])
      );

      const floorPlanPromises = floorPlanPaths.map(path =>
        pool.query(`INSERT INTO PropertyFloorPlans (propertyId, filePath) VALUES (?, ?)`, [foreignKeyId, path])
      );

      await pool.query(`INSERT INTO PropertyAmenities (propertyId, amenitiesData) VALUES (?, ?)`, [foreignKeyId, JSON.stringify(JSON.parse(localAmenities || "{}"))]);

      await Promise.all([...imagePromises, ...floorPlanPromises]);
    }

    // Fetch updated listing
    const [updatedListing] = await pool.query(`SELECT * FROM PropertyListings WHERE id = ?`, [listingId]);

    res.status(201).json({
      message: "Listing updated successfully",
      data: updatedListing,
    });
  } catch (error) {
    console.error("Error updating listing:", error);
    res.status(500).json({
      message: "Server error while updating listing",
      error: error.message,
    });
  }
};












// Create a new blog post
exports.createResource = (req, res) => {
  const { title, subtitle, total_minutes_read, overview, category, images, paragraphs } = req.body;
  const sql = `INSERT INTO ResourceDetails (title, subtitle, total_minutes_read, overview, category) VALUES (?, ?, ?, ?, ?)`;
  
  db.query(sql, [title, subtitle, total_minutes_read, overview, category], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      const resourceId = result.insertId;
      
      // Insert Images
      images.forEach((image, index) => {
          db.query(`INSERT INTO ResourceImages (resource_id, image_url, position) VALUES (?, ?, ?)`, [resourceId, image, index + 1]);
      });
      
      // Insert Paragraphs
      paragraphs.forEach((paragraph, index) => {
          db.query(`INSERT INTO ResourceParagraphs (resource_id, paragraph, position) VALUES (?, ?, ?)`, [resourceId, paragraph, index + 1]);
      });
      
      res.status(201).json({ message: 'Blog created successfully', resourceId });
  });
};

// Get all blogs














// Fetch listing details along with child data
// exports.getListingDetails = async (req, res) => {
//   try {
//       const { id } = req.params;
      
//       // Get the listing details
//       const [listing] = await pool.query(`SELECT * FROM PropertyListings WHERE id = ?`, [id]);
//       if (!listing.length) return res.status(404).json({ message: "Listing not found" });
      
//       const { property_details_id, service_details_id } = listing[0];
//       let childData = null;
      
//       if (property_details_id) {
//           const [propertyDetails] = await pool.query(`SELECT * FROM PropertyDetails WHERE property_details_id = ?`, [property_details_id]);
//           const [propertyImages] = await pool.query(`SELECT * FROM PropertyImages WHERE propertyId = ?`, [property_details_id]);
//           const [propertyFloorPlans] = await pool.query(`SELECT * FROM PropertyFloorPlans WHERE propertyId = ?`, [property_details_id]);
//           const [propertyAmenities] = await pool.query(`SELECT * FROM PropertyAmenities WHERE propertyId = ?`, [property_details_id]);
          
//           childData = { propertyDetails, propertyImages, propertyFloorPlans, propertyAmenities };
//       } else if (service_details_id) {
//           const [serviceDetails] = await pool.query(`SELECT * FROM ServiceDetails WHERE service_details_id = ?`, [service_details_id]);
//           childData = { serviceDetails };
//       }
      
//       res.json({ listing: listing[0], childData });
//   } catch (error) {
//       console.error("Error fetching listing details:", error);
//       res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

exports.getListingDetails = async (req, res) => {
  try {
      const { id,listingType } = req.params;
      
      
      let childData = null;
      
      if (listingType == 'property') {
          const [propertyDetails] = await pool.query(`SELECT * FROM PropertyDetails WHERE property_details_id = ?`, [id]);
          const [propertyImages] = await pool.query(`SELECT * FROM PropertyImages WHERE propertyId = ?`, [id]);
          const [propertyFloorPlans] = await pool.query(`SELECT * FROM PropertyFloorPlans WHERE propertyId = ?`, [id]);
          const [propertyAmenities] = await pool.query(`SELECT * FROM PropertyAmenities WHERE propertyId = ?`, [id]);
          
          childData = { propertyDetails, propertyImages, propertyFloorPlans, propertyAmenities };
      } else if (listingType == 'service') {
          const [serviceDetails] = await pool.query(`SELECT * FROM ServiceDetails WHERE service_details_id = ?`, [id]);
          childData = { serviceDetails };
      }else if (listingType == 'addons') {
          const [addonsDetails] = await pool.query(`SELECT * FROM Addons WHERE id = ?`, [id]);
          const [addonsImages] = await pool.query(`SELECT * FROM AddonImages WHERE addon_id = ?`, [id]);
          childData = { addonsDetails, addonsImages };
      }else if (listingType == 'resource') {
          const [resourceDetails] = await pool.query(`SELECT * FROM ResourceDetails WHERE id = ?`, [id]);
          const [resourceImages] = await pool.query(`SELECT * FROM ResourceImages WHERE resource_id = ?`, [id]);
          childData = { resourceDetails, resourceImages };
      }
      
      res.json({ childData });
  } catch (error) {
      console.error("Error fetching listing details:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
};






exports.getAllAddons = async (req, res) => {
  try {
      // Fetch all addons
      const [addons] = await pool.query(`SELECT * FROM Addons ORDER BY id DESC`);

      if (addons.length === 0) {
          return res.status(404).json({ message: "No addons found." });
      }

      // Fetch related data for each addon
      const addonsWithDetails = await Promise.all(addons.map(async (addon) => {
          const [images] = await pool.query(`SELECT image_url FROM AddonImages WHERE addon_id = ?`, [addon.id]);

          return {
              ...addon, // Fix: Spread the actual addon object
              images: images.map(img => img.image_url), // Attach images properly
          };
      }));

      res.status(200).json({
          message: "addons retrieved successfully",
          data: addonsWithDetails
      });

  } catch (error) {
      console.error("Error fetching addons:", error);
      res.status(500).json({
          message: "Server error while fetching addons",
          error: error.message
      });
  }
};


exports.getResource = async (req, res) => {
  try {
      // Fetch all resource
      const [resources] = await pool.query(`SELECT * FROM ResourceDetails ORDER BY id DESC`);

      if (resources.length === 0) {
          return res.status(404).json({ message: "No resource found." });
      }

       // Fetch related data for each addon
       const resourceWithDetails = await Promise.all(resources.map(async (resource) => {
        const [images] = await pool.query(`SELECT image_url FROM ResourceImages WHERE resource_id = ?`, [resource.id]);
        const [paragraphs] = await pool.query(`SELECT paragraph, position FROM ResourceParagraphs WHERE resource_id = ?`, [resource.id]);

        return {
            ...resource, // Fix: Spread the actual addon object
            images: images.map(img => img.image_url), // Attach images properly
            paragraph: paragraphs
        };
    }));

      res.status(200).json({
          message: "resource retrieved successfully",
          data: resourceWithDetails
      });

  } catch (error) {
      console.error("Error fetching resource:", error);
      res.status(500).json({
          message: "Server error while fetching addons",
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


// exports.getAllProperties = async (req, res) => {
//   try {
//       // Fetch all properties
//       const [properties] = await pool.query(`SELECT * FROM PropertyDetails WHERE status = 'published' ORDER BY property_details_id DESC LIMIT 6`);

//       if (properties.length === 0) {
//           return res.status(404).json({ message: "No properties found." });
//       }

//       // Fetch related data for each property
//       const propertiesWithDetails = await Promise.all(properties.map(async (property) => {
       
//           const [images] = await pool.query(`SELECT imageUrl FROM PropertyImages WHERE propertyId = ?`, [property.property_details_id]);
//           const [floorPlans] = await pool.query(`SELECT filePath FROM PropertyFloorPlans WHERE propertyId = ?`, [property.property_details_id]);
//           const [amenities] = await pool.query(`SELECT amenitiesData FROM PropertyAmenities WHERE propertyId = ?`, [property.property_details_id]);

//           console.log('====================================');
//           console.log(amenities);
//           console.log('====================================');
//           return {
//               ...property,
//               // location: property.location ? JSON.parse(property.location) : {},
//               // paymentOptions: property.paymentOptions ? JSON.parse(property.paymentOptions) : [],
//               // videoLinks: property.videoLinks ? JSON.parse(property.videoLinks) : [],
//               // faq: property.faq ? JSON.parse(property.faq) : [],
//               images: images.map(img => img.imageUrl),
//               floorPlans: floorPlans.map(plan => plan.filePath),
//               localAmenities: (amenities.length > 0 && amenities[0].amenitiesData) 
//               ? (typeof amenities[0].amenitiesData === "string" ? JSON.parse(amenities[0].amenitiesData) : amenities[0].amenitiesData) 
//               : {},
          
//           };
//       }));

//       res.status(200).json({
//           message: "Properties retrieved successfully",
//           data: propertiesWithDetails
//       });

//   } catch (error) {
//       console.error("Error fetching properties:", error);
//       res.status(500).json({
//           message: "Server error while fetching properties",
//           error: error.message
//       });
//   }
// };

exports.getAllProperties = async (req, res) => {
  try {
      // Fetch all properties
      const [properties] = await pool.query(`SELECT * FROM PropertyDetails ORDER BY property_details_id DESC`);

      if (properties.length === 0) {
          return res.status(404).json({ message: "No properties found." });
      }

      // Fetch related data for each property
      const propertiesWithDetails = await Promise.all(properties.map(async (property) => {
       
          const [images] = await pool.query(`SELECT imageUrl FROM PropertyImages WHERE propertyId = ?`, [property.property_details_id]);
          const [floorPlans] = await pool.query(`SELECT filePath FROM PropertyFloorPlans WHERE propertyId = ?`, [property.property_details_id]);
          const [amenities] = await pool.query(`SELECT amenitiesData FROM PropertyAmenities WHERE propertyId = ?`, [property.property_details_id]);
          const [ownerships] = await pool.query(`SELECT filePath FROM PropertyOwnership WHERE propertyId = ?`, [property.property_details_id]);

          console.log('====================================');
          console.log(amenities);
          console.log('====================================');
          return {
              ...property,
              // location: property.location ? JSON.parse(property.location) : {},
              // paymentOptions: property.paymentOptions ? JSON.parse(property.paymentOptions) : [],
              // videoLinks: property.videoLinks ? JSON.parse(property.videoLinks) : [],
              // faq: property.faq ? JSON.parse(property.faq) : [],
              images: images.map(img => img.imageUrl),
              floorPlans: floorPlans.map(plan => plan.filePath),
              ownership: ownerships.map(owner => owner.filePath),
              localAmenities: (amenities.length > 0 && amenities[0].amenitiesData) 
              ? (typeof amenities[0].amenitiesData === "string" ? JSON.parse(amenities[0].amenitiesData) : amenities[0].amenitiesData) 
              : {},
          
          };
      }));

      res.status(200).json({
          message: "Properties retrieved successfully",
          data: propertiesWithDetails
      });

  } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({
          message: "Server error while fetching properties",
          error: error.message
      });
  }
};




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


// exports.getAllListings = async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT 
//         pl.id AS listing_id, pl.title AS listing_title, pl.subtitle AS listing_subtitle, pl.display_image AS listing_display_image,
//         pl.short_description AS listing_short_description, pl.status AS listing_status, pl.type AS listing_type,
//         pl.subcategory AS listing_subcategory, pl.created_at, pl.updated_at,
        
//         -- PropertyDetails Fields
//         pd.property_details_id, pd.PropertyNeed, pd.category AS property_category, pd.title AS property_title, pd.subtitle AS property_subtitle,
//         pd.price AS property_price, pd.displayImage AS property_display_image, pd.serviceSummary AS property_summary,
//         pd.generalInfo AS property_general_info, pd.features AS property_features, pd.propertyAmenities, pd.location AS property_location,
//         pd.service_type AS property_service_type, pd.payment_options AS property_payment_options, pd.status AS property_status,
//         pd.service_details AS property_service_details, pd.size, pd.area, pd.bedRoom, pd.parking, pd.bathRoom, pd.videoLinks,
//         pd.faq AS property_faq,

//         -- ServiceDetails Fields
//         sd.service_details_id, sd.title AS service_title, sd.subtitle AS service_subtitle, sd.display_image AS service_display_image,
//         sd.service_category, sd.service_location, sd.service_summary, sd.price AS service_price, sd.keywords, sd.service_type AS service_type,
//         sd.payment_options AS service_payment_options, sd.location AS service_location_details, sd.features AS service_features,
//         sd.key_results, sd.faq AS service_faq, sd.service_details AS service_full_details, sd.status AS service_status

//       FROM PropertyListings pl
//       LEFT JOIN PropertyDetails pd ON pl.property_details_id = pd.property_details_id
//       LEFT JOIN ServiceDetails sd ON pl.service_details_id = sd.service_details_id
//       ORDER BY pl.created_at DESC`
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "No listings found" });
//     }

//     // Fetch additional property-specific data for each property
//     const propertyIds = rows
//       .filter(row => row.property_details_id)
//       .map(row => row.property_details_id);

//     let propertyImages = [];
//     let floorPlans = [];
//     let localAmenities = [];

//     if (propertyIds.length > 0) {
//       const [imageRows] = await pool.query(`SELECT propertyId, imageUrl FROM PropertyImages WHERE propertyId IN (?)`, [propertyIds]);
//       const [floorPlanRows] = await pool.query(`SELECT propertyId, filePath FROM PropertyFloorPlans WHERE propertyId IN (?)`, [propertyIds]);
//       const [amenitiesRows] = await pool.query(`SELECT propertyId, amenitiesData FROM PropertyAmenities WHERE propertyId IN (?)`, [propertyIds]);

//       propertyImages = imageRows;
//       floorPlans = floorPlanRows;
//       localAmenities = amenitiesRows;
//     }

//     // Format the response properly
//     const formattedData = rows.map(row => {
//       const propertyId = row.property_details_id;
//       return {
//         listing_id: row.listing_id,
//         title: row.listing_title,
//         subtitle: row.listing_subtitle,
//         display_image: row.listing_display_image,
//         short_description: row.listing_short_description,
//         status: row.listing_status,
//         type: row.listing_type,
//         subcategory: row.listing_subcategory,
//         created_at: row.created_at,
//         updated_at: row.updated_at,
    
//         // Property Details (if available)
//         property_details: propertyId ? {
//           id: propertyId,
//           property_need: row.PropertyNeed,
//           category: row.property_category,
//           title: row.property_title,
//           subtitle: row.property_subtitle,
//           price: row.property_price,
//           display_image: row.property_display_image,
//           summary: row.property_summary,
//           general_info: row.property_general_info,
//           features: row.property_features ? row.property_features.split(",") : [],
//           property_amenities: row.propertyAmenities ? JSON.parse(row.propertyAmenities) : [],
//           location: row.property_location ? JSON.parse(row.property_location) : null,
//           service_type: row.property_service_type,
//           payment_options: row.payment_options ? JSON.parse(row.payment_options) : [],
//           size: row.size,
//           area: row.area,
//           bedrooms: row.bedRoom,
//           parking: row.parking,
//           bathrooms: row.bathRoom,
//           video_links: row.videoLinks ? JSON.parse(row.videoLinks) : [],
//           faq: row.property_faq ? JSON.parse(row.property_faq) : [],
//           images: propertyImages.filter(img => img.propertyId === propertyId).map(img => img.imageUrl),
//           floor_plans: floorPlans.filter(fp => fp.propertyId === propertyId).map(fp => fp.filePath),
//           local_amenities: localAmenities.find(amenity => amenity.propertyId === propertyId)?.amenitiesData
//             ? JSON.parse(localAmenities.find(amenity => amenity.propertyId === propertyId).amenitiesData)
//             : []
//         } : null,
    
//         // Service Details (if available)
//         service_details: row.service_details_id ? {
//           id: row.service_details_id,
//           title: row.service_title,
//           subtitle: row.service_subtitle,
//           display_image: row.service_display_image,
//           category: row.service_category,
//           location: row.service_location,
//           summary: row.service_summary,
//           price: row.service_price,
//           keywords: row.keywords ? row.keywords.split(",") : [],
//           service_type: row.service_type,
//           payment_options: row.service_payment_options ? JSON.parse(row.service_payment_options) : [],
//           location_details: row.service_location_details ? JSON.parse(row.service_location_details) : null,
//           features: row.service_features ? row.service_features.split(",") : [],
//           // key_results: row.key_results ? JSON.parse(row.key_results) : [],
//           // faq: row.service_faq ? JSON.parse(row.service_faq) : [],
//           full_details: row.service_full_details,
//           status: row.service_status
//         } : null
//       };
//     });
    
//     res.status(200).json({ data: formattedData });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };



exports.getAllServiceListings = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM ServiceDetails "
    );

    if (result.length === 0) {
      // return res.status(404).json({ message: "Service listing not found" });
      res.status(200).json({ data: result });
    }
    res.status(200).json({ data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


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
// exports.updateServiceListingStatus = async (req, res) => {
//   try {
//     const { id, status } = req.body;

//     if (!["published", "unpublished", "close", "achieve"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const [result] = await pool.query(
//       "UPDATE PropertyListings SET status = ? WHERE id = ?",
//       [status, id]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Service listing not found" });
//     }

//     const [updatedRecord] = await pool.query(
//       "SELECT * FROM PropertyListings WHERE id = ?",
//       [id]
//     );

//     res.status(200).json({
//       message: "Service listing status updated",
//       data: updatedRecord[0],
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };



// Update status of listing and its related foreign table
// exports.updateServiceListingStatus = async (req, res) => {
//   try {
//       const { id, status, listingType } = req.body;
//       console.log('====================================');
//       console.log(req.body);
//       console.log('====================================');
      
//       // Get the listing details
//       const [listing] = await pool.query(`SELECT * FROM PropertyListings WHERE id = ?`, [id]);
//       if (!listing.length) return res.status(404).json({ message: "Listing not found" });
      
//       const { property_details_id, service_details_id, resource_details_id, addons_id } = listing[0];
      
//       // Update status in parent table
//       await pool.query(`UPDATE PropertyListings SET status = ? WHERE id = ?`, [status, id]);
      
//       // Update status in related child tables
//       if (property_details_id) {
//           await pool.query(`UPDATE PropertyDetails SET status = ? WHERE property_details_id = ?`, [status, property_details_id]);
//       } else if (service_details_id) {
//           await pool.query(`UPDATE ServiceDetails SET status = ? WHERE 	service_details_id = ?`, [status, service_details_id]);
//       } else if (resource_details_id) {
//           await pool.query(`UPDATE ResourceDetails SET status = ? WHERE id = ?`, [status, resource_details_id]);
//       } else if (addons_id) {
//         await pool.query(`UPDATE Addons SET status = ? WHERE id = ?`, [status, addons_id]);
//       }

//       res.json({ message: "Status updated successfully" });
//   } catch (error) {
//       console.error("Error updating status:", error);
//       res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


exports.updateServiceListingStatus = async (req, res) => {
  try {
      const { id, status, listingType, reason } = req.body;
      console.log('====================================');
      console.log(req.body);
      console.log('====================================');
  
      // Update status in related child tables
      // if (listingType == 'property') {
      //     await pool.query(`UPDATE PropertyDetails SET status = ? WHERE property_details_id = ?`, [status, id]);
      // } else if (listingType == 'service') {
      //     await pool.query(`UPDATE ServiceDetails SET status = ? WHERE 	service_details_id = ?`, [status, id]);
      // } else if (listingType == 'resource') {
      //     await pool.query(`UPDATE ResourceDetails SET status = ? WHERE id = ?`, [status, id]);
      // } else if (listingType == 'addons') {
      //   await pool.query(`UPDATE Addons SET status = ? WHERE id = ?`, [status, id]);
      // }

      if (listingType === 'property') {
        if (reason) {
          await pool.query(
            `UPDATE PropertyDetails SET status = ?, closeReason = ? WHERE property_details_id = ?`,
            [status, reason, id]
          );
        } else {
          await pool.query(
            `UPDATE PropertyDetails SET status = ? WHERE property_details_id = ?`,
            [status, id]
          );
        }
      } else if (listingType === 'service') {
        if (reason) {
          await pool.query(
            `UPDATE ServiceDetails SET status = ?, closeReason = ? WHERE service_details_id = ?`,
            [status, reason, id]
          );
        } else {
          await pool.query(
            `UPDATE ServiceDetails SET status = ? WHERE service_details_id = ?`,
            [status, id]
          );
        }
      } else if (listingType === 'resource') {
        if (reason) {
          await pool.query(
            `UPDATE ResourceDetails SET status = ?, closeReason = ? WHERE id = ?`,
            [status, reason, id]
          );
        } else {
          await pool.query(
            `UPDATE ResourceDetails SET status = ? WHERE id = ?`,
            [status, id]
          );
        }
      } else if (listingType === 'addons') {
        if (reason) {
          await pool.query(
            `UPDATE Addons SET status = ?, closeReason = ? WHERE id = ?`,
            [status, reason, id]
          );
        } else {
          await pool.query(
            `UPDATE Addons SET status = ? WHERE id = ?`,
            [status, id]
          );
        }
      }

      res.json({ message: "Status updated successfully" });
  } catch (error) {
      console.error("Error updating status:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
};












// exports.updateServiceListingStatus = async (req, res) => {
//   try {
//     const { listingId, status } = req.body;

//     console.log('===============status=====================');
//     console.log(status);
//     console.log('====================================');

//     // Validate status
//       if (!["published", "unpublished", "close", "achieve"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     // Validate listingId
//     if (!listingId) {
//       return res.status(400).json({ message: "Listing ID is required." });
//     }

//     // Fetch the listing details to get the listingType and foreignKeyColumn
//     const [listing] = await pool.query(
//       `SELECT type FROM PropertyListings WHERE id = ?`,
//       [listingId]
//     );

//     if (!listing.length) {
//       return res.status(404).json({ message: "Listing not found." });
//     }

//     const listingType = listing[0].type;
//     let foreignKeyColumn = listingType === 'Service' ? 'service_details_id' : 'property_details_id';

//     // Prepare the SQL query to update the status in the appropriate table
//     let updateQuery;
//     let tableToUpdate;

//     if (listingType === 'Service') {
//       tableToUpdate = 'ServiceDetails';
//     } else if (listingType === 'Property') {
//       tableToUpdate = 'PropertyDetails';
//     } else {
//       return res.status(400).json({ message: "Invalid listing type." });
//     }

//     // Update the status in the correct table (ServiceDetails or PropertyDetails)
//     updateQuery = `UPDATE ${tableToUpdate} SET status = ? WHERE id = (SELECT ${foreignKeyColumn} FROM PropertyListings WHERE id = ?)`;
//     const [updateResult] = await pool.query(updateQuery, [status, listingId]);

//     // If no rows were updated, return a not found response
//     if (updateResult.affectedRows === 0) {
//       return res.status(404).json({ message: "Status update failed. The corresponding record was not found." });
//     }

//     // Also update the status in the PropertyListings table
//     await pool.query(
//       `UPDATE PropertyListings SET status = ? WHERE id = ?`,
//       [status, listingId]
//     );

//     res.status(200).json({
//       message: "Listing status updated successfully."
//     });
//   } catch (error) {
//     console.error("Error updating listing status:", error);
//     res.status(500).json({
//       message: "Server error while updating listing status.",
//       error: error.message
//     });
//   }
// };


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











// Query for only publised data 

exports.getPublishedResources = async (req, res) => {
  try {
      // Fetch all resource
      const [resources] = await pool.query(`SELECT * FROM ResourceDetails WHERE status = 'published' ORDER BY id DESC`);

      if (resources.length === 0) {
          return res.status(404).json({ message: "No resource found." });
      }

       // Fetch related data for each addon
       const resourceWithDetails = await Promise.all(resources.map(async (resource) => {
        const [images] = await pool.query(`SELECT image_url FROM ResourceImages WHERE resource_id = ?`, [resource.id]);
        const [paragraphs] = await pool.query(`SELECT paragraph, position FROM ResourceParagraphs WHERE resource_id = ?`, [resource.id]);

        return {
            ...resource, // Fix: Spread the actual addon object
            images: images.map(img => img.image_url), // Attach images properly
            paragraph: paragraphs
        };
    }));

      res.status(200).json({
          message: "resource retrieved successfully",
          data: resourceWithDetails
      });

  } catch (error) {
      console.error("Error fetching resource:", error);
      res.status(500).json({
          message: "Server error while fetching addons",
          error: error.message
      });
  }
};


exports.getPublishedAddons = async (req, res) => {
  try {
      // Fetch all addons
      const [addons] = await pool.query(`SELECT * FROM Addons WHERE status = 'published' ORDER BY id DESC`);

      if (addons.length === 0) {
          return res.status(404).json({ message: "No addons found." });
      }

      // Fetch related data for each addon
      const addonsWithDetails = await Promise.all(addons.map(async (addon) => {
          const [images] = await pool.query(`SELECT image_url FROM AddonImages WHERE addon_id = ?`, [addon.id]);

          return {
              ...addon, // Fix: Spread the actual addon object
              images: images.map(img => img.image_url), // Attach images properly
          };
      }));

      res.status(200).json({
          message: "addons retrieved successfully",
          data: addonsWithDetails
      });

  } catch (error) {
      console.error("Error fetching addons:", error);
      res.status(500).json({
          message: "Server error while fetching addons",
          error: error.message
      });
  }
};


exports.getPublishedProperties = async (req, res) => {
  try {
      // Fetch all properties
      const [properties] = await pool.query(`SELECT * FROM PropertyDetails WHERE status = 'published' ORDER BY property_details_id DESC`);

      if (properties.length === 0) {
          return res.status(404).json({ message: "No properties found." });
      }

      // Fetch related data for each property
      const propertiesWithDetails = await Promise.all(properties.map(async (property) => {
       
          const [images] = await pool.query(`SELECT imageUrl FROM PropertyImages WHERE propertyId = ?`, [property.property_details_id]);
          const [floorPlans] = await pool.query(`SELECT filePath FROM PropertyFloorPlans WHERE propertyId = ?`, [property.property_details_id]);
          const [amenities] = await pool.query(`SELECT amenitiesData FROM PropertyAmenities WHERE propertyId = ?`, [property.property_details_id]);
          const [ownerships] = await pool.query(`SELECT filePath FROM PropertyOwnership WHERE propertyId = ?`, [property.property_details_id]);

          console.log('====================================');
          console.log(amenities);
          console.log('====================================');
          return {
              ...property,
              // location: property.location ? JSON.parse(property.location) : {},
              // paymentOptions: property.paymentOptions ? JSON.parse(property.paymentOptions) : [],
              // videoLinks: property.videoLinks ? JSON.parse(property.videoLinks) : [],
              // faq: property.faq ? JSON.parse(property.faq) : [],
              images: images.map(img => img.imageUrl),
              floorPlans: floorPlans.map(plan => plan.filePath),
              ownership: ownerships.map(owner => owner.filePath),
              localAmenities: (amenities.length > 0 && amenities[0].amenitiesData) 
              ? (typeof amenities[0].amenitiesData === "string" ? JSON.parse(amenities[0].amenitiesData) : amenities[0].amenitiesData) 
              : {},
          
          };
      }));

      res.status(200).json({
          message: "Properties retrieved successfully",
          data: propertiesWithDetails
      });

  } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({
          message: "Server error while fetching properties",
          error: error.message
      });
  }
};


exports.getSixPublishedProperties = async (req, res) => {
  try {
      const limit = 6 // Get limit from query params

      // Construct query based on the limit
      let query = `SELECT * FROM PropertyDetails WHERE status = 'published' ORDER BY property_details_id DESC`;
      let queryParams = [];

      if (limit) {
          query += ` LIMIT ?`;
          queryParams.push(limit);
      }

      // Fetch properties
      const [properties] = await pool.query(query, queryParams);

      if (properties.length === 0) {
          return res.status(404).json({ message: "No properties found." });
      }

      // Fetch related data for each property
      const propertiesWithDetails = await Promise.all(
          properties.map(async (property) => {
              const [images] = await pool.query(`SELECT imageUrl FROM PropertyImages WHERE propertyId = ?`, [property.property_details_id]);
              const [floorPlans] = await pool.query(`SELECT filePath FROM PropertyFloorPlans WHERE propertyId = ?`, [property.property_details_id]);
              const [amenities] = await pool.query(`SELECT amenitiesData FROM PropertyAmenities WHERE propertyId = ?`, [property.property_details_id]);
              const [ownerships] = await pool.query(`SELECT filePath FROM PropertyOwnership WHERE propertyId = ?`, [property.property_details_id]);

              return {
                  ...property,
                  images: images.map(img => img.imageUrl),
                  floorPlans: floorPlans.map(plan => plan.filePath),
                  ownership: ownerships.map(owner => owner.filePath),
                  localAmenities: (amenities.length > 0 && amenities[0].amenitiesData) 
                      ? (typeof amenities[0].amenitiesData === "string" ? JSON.parse(amenities[0].amenitiesData) : amenities[0].amenitiesData) 
                      : {},
              };
          })
      );

      res.status(200).json({
          message: "Properties retrieved successfully",
          data: propertiesWithDetails
      });

  } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({
          message: "Server error while fetching properties",
          error: error.message
      });
  }
};


