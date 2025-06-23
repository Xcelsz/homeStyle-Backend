const pool = require("../database/db"); // Assuming your DB connection pool is already set up

// Search with Residential and Keyword parameters
exports.search = async (req, res) => {
    const { needType, keyword } = req.query;

    // Validate that at least one parameter is provided
    if (!needType && !keyword) {
        return res.status(400).json({ error: 'At least one of "needType" or "keyword" is required' });
    }

    // SQL query components
    let sql = `SELECT * FROM PropertyDetails WHERE 1=1`; // Base query that always returns true
    const params = [];

    // If 'keyword' is provided, search for it in name or description
    if (keyword) {
        const searchTerm = `%${keyword}%`;
        sql += ` AND (title LIKE ? OR subtitle LIKE ? OR area LIKE ?)`;
        // params.push(searchTerm, searchTerm);
        params.push(searchTerm, searchTerm, searchTerm);
    }

    // If 'needType' is provided, filter by it
    if (needType) {
        sql += ` AND PropertyNeed = ?`;
        params.push(needType === 'true' ? 1 : 0); // Assuming 'needType' is a boolean-like string ('true' or 'false')
    }

    try {
        // Execute the query with the provided parameters
        const [results] = await pool.query(sql, params);

        // Return the search results
        return res.status(200).json(results);
    } catch (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Failed to fetch data from database', message: error.message });
    }
};


// trustedby Features 


exports.addtrustedby = async (req, res) => {
    try {
        console.log('Received Data:', req.body);
        console.log('Uploaded File:', req.file);
  
        const { name, description, email, phone_number, website_url } = req.body;
        const logo_url = req.file ? req.file.path : null; // Get file path
  
        if (!logo_url) {
            return res.status(400).json({ message: "Logo image is required" });
        }
  
        await pool.query(
            `INSERT INTO partners (name, logo_url, description, email, phone_number, website_url, is_trusted) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, logo_url, description, email, phone_number, website_url, 1]
        );
  
        res.status(201).json({ message: "Trusted Partner added successfully" });
    } catch (error) {
        console.error("Error adding partner:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

// Get trusted partners
exports.trustedby = async (req, res) => {
    const sql = 'SELECT * FROM partners WHERE is_trusted = 1';  // Fetch trusted partners only

    try {
      const [results] = await pool.query(sql);
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'No trusted partners found.' });
      }
  
      return res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching trusted partners:', error);
      return res.status(500).json({ error: 'Failed to fetch trusted partners', message: error.message });
    }
};

// Update trusted partners
exports.updateTrustedby = async (req, res) => {
    const { partnerId, trustedBy } = req.body; // `partnerId` is the ID of the partner to trust, `trustedBy` is the user marking them as trusted

    if (!partnerId || !trustedBy) {
      return res.status(400).json({ error: 'Partner ID and trustedBy are required' });
    }
  
    // Update query to mark the partner as trusted and store who trusted them
    const sql = 'UPDATE partners SET is_trusted = 1, trusted_by = ? WHERE id = ?';
  
    try {
      // Execute the query
      const [results] = await pool.query(sql, [trustedBy, partnerId]);
  
      // Check if the partner was updated
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Partner not found or already trusted' });
      }
  
      return res.status(200).json({ message: 'Partner marked as trusted successfully' });
    } catch (error) {
      console.error('Error marking partner as trusted:', error);
      return res.status(500).json({ error: 'Failed to mark partner as trusted', message: error.message });
    }
};


exports.untrustPartner = async (req, res) => {
    const { id } = req.body; // `id` is the ID of the partner to delete and untrust

    if (!id) {
        return res.status(400).json({ error: 'Partner ID is required' });
    }

    // Update query to set is_trusted to 0 and delete the partner
    const sql = 'UPDATE partners SET is_trusted = 0 WHERE id = ?';

    try {
        // Execute the query
        const [updateResults, deleteResults] = await pool.query(sql, [id]);

        // Check if the partner was updated and deleted
        if (updateResults.affectedRows === 0 || deleteResults.affectedRows === 0) {
            return res.status(404).json({ message: 'Partner not found or already untrusted/deleted' });
        }

        return res.status(200).json({ message: 'Partner untrusted and deleted successfully' });
    } catch (error) {
        console.error('Error untrusting and deleting partner:', error);
        return res.status(500).json({ error: 'Failed to untrust and delete partner', message: error.message });
    }
};
exports.deletePartner = async (req, res) => {
    const { id } = req.body; // `id` is the ID of the partner to delete and untrust

    console.log('====================================');
    console.log(req.body);
    console.log('====================================');
    if (!id) {
        return res.status(400).json({ error: 'Partner ID is required' });
    }

    // Update query to set is_trusted to 0 and delete the partner
    const sql = 'DELETE FROM partners WHERE id = ?';

    try {
        // Execute the query
        const [deleteResults] = await pool.query(sql, [id]);

        // Check if the partner was updated and deleted
        if (deleteResults.affectedRows === 0) {
            return res.status(404).json({ message: 'Partner not found or already deleted' });
        }

        return res.status(200).json({ message: 'Partner deleted successfully' });
    } catch (error) {
        console.error('Error deleting partner:', error);
        return res.status(500).json({ error: 'Failed to delete partner', message: error.message });
    }
};




// Review Features 


// Add a new review
exports.postReview = async (req, res) => {
    const { name, rating, comment, service, service_id } = req.body;

    console.log('====================================');
    console.log(req.body);
    console.log('====================================');
  
    // Validation to ensure required fields are not undefined or empty
    if (!name || !rating || !comment || !service || !service_id) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      // Insert review into the database
      const [result] = await pool.execute(
        'INSERT INTO reviews (name, rating, comment, service, service_id, approved) VALUES (?, ?, ?, ?, ?, ?)',
        [name, rating, comment || null, service, service_id, false] // Use null for empty comment
      );
  
      // Here you can add a notification step, for example, sending an email or message
      // Example: Sending a notification to the admin or service provider about the new review (pseudo code)
      // sendNotificationToAdmin(service, service_id, rating);
  
      res.status(201).json({ message: 'Review added successfully!', reviewId: result.insertId });
    } catch (error) {
      console.log('====================================');
      console.log(error.message);
      console.log('====================================');
      res.status(500).json({ error: error.message });
    }
  };
  

  exports.getReviewsForIndividual = async (req, res) => {
    const { service, serviceId } = req.query;

    console.log('====================================');
    console.log(req.query);
    console.log('====================================');
  
    try {
      // Start building the query to fetch approved reviews
      let query = 'SELECT * FROM reviews WHERE approved = true';
      const values = [];
  
      // Add filter for 'service' if provided
      if (service) {
        query += ' AND service = ?';
        values.push(service);
      }
  
      // Add filter for 'serviceId' if provided
      if (serviceId) {
        query += ' AND service_id = ?';
        values.push(serviceId);
      }
  
      // Execute the query
      const [reviews] = await pool.execute(query, values);
  
      // If no reviews are found
      if (reviews.length === 0) {
        return res.status(404).json({ message: "No approved reviews found" });
      }
  
      // Return the reviews
      res.status(200).json(reviews);
    } catch (error) {
        console.log('====================================');
        console.log(error.message);
        console.log('====================================');
      res.status(500).json({ error: error.message });
    }
  };
  
  

// Get all reviews (optional filtering by approved status)
exports.getReviews = async (req, res) => {
    const { approved } = req.query;
    try {
        const query = approved
            ? 'SELECT * FROM reviews WHERE approved = ?'
            : 'SELECT * FROM reviews';
        const values = approved ? [approved === 'true'] : [];
        const [reviews] = await pool.execute(query, values);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Approve a review
exports.approveReview = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('UPDATE reviews SET approved = ? WHERE id = ?', [true, id]);
        res.status(200).json({ message: 'Review approved successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Edit a review
exports.editReview = async (req, res) => {
    const { id } = req.params;
    const { name, rating, comment } = req.body;
    try {
        await pool.execute(
            'UPDATE reviews SET name = ?, rating = ?, comment = ? WHERE id = ?',
            [name, rating, comment, id]
        );
        res.status(200).json({ message: 'Review updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM reviews WHERE id = ?', [id]);
        res.status(200).json({ message: 'Review deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Email Features 



// Add a new subscription
exports.addSubscription = async (req, res) => {
    const { email } = req.body;
    try {
        // Check if the email already exists
        const [existing] = await pool.execute('SELECT * FROM subscriptions WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already subscribed.' });
        }

        // Insert the new email into the database
        await pool.execute('INSERT INTO subscriptions (email, subscribed) VALUES (?, ?)', [email, true]);
        res.status(201).json({ message: 'Subscription successful!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all subscribers
exports.getSubscribers = async (req, res) => {
    try {
        const [subscribers] = await pool.execute('SELECT * FROM subscriptions WHERE subscribed = ?', [true]);
        res.status(200).json(subscribers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Unsubscribe an email
exports.unsubscribe = async (req, res) => {
    const { email } = req.body;
    try {
        const [result] = await pool.execute('UPDATE subscriptions SET subscribed = ? WHERE email = ?', [false, email]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Email not found.' });
        }
        res.status(200).json({ message: 'Unsubscribed successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Check subscription status
exports.checkSubscription = async (req, res) => {
    const { email } = req.query;
    try {
        const [subscriber] = await pool.execute('SELECT * FROM subscriptions WHERE email = ?', [email]);
        if (subscriber.length === 0) {
            return res.status(404).json({ message: 'Email not found.' });
        }
        res.status(200).json({ subscribed: subscriber[0].subscribed });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Resource Features 


// Add a new resource
exports.addResource = async (req, res) => {
    const { title, subtitle, description, category, image_url } = req.body;
    try {
        await pool.execute(
            'INSERT INTO resources (title, subtitle, description, category, image_url) VALUES (?, ?, ?, ?, ?)',
            [title, subtitle, description, category, image_url]
        );
        res.status(201).json({ message: 'Resource added successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all resources
exports.getAllResources = async (req, res) => {
    try {
        const [resources] = await pool.execute('SELECT * FROM resources');
        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific resource by ID
// exports.getResourceById = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const [resource] = await pool.execute('SELECT * FROM resources WHERE id = ?', [id]);
//         if (resource.length === 0) {
//             return res.status(404).json({ message: 'Resource not found.' });
//         }
//         res.status(200).json(resource[0]);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// Get resources by category
// exports.getResourcesByCategory = async (req, res) => {
//     const { category } = req.params;
//     try {
//         const [resources] = await pool.execute('SELECT * FROM ResourceDetails WHERE category = ?', [category]);
//         res.status(200).json(resources);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


exports.getResourcesByCategory = async (req, res) => {
    try {
      const { category } = req.params;
  
      // Fetch all resources by category
      const [resources] = await pool.query(
        `SELECT * FROM ResourceDetails WHERE category = ? AND status = 'published'`,
        [category]
      );
  
      if (!resources.length) {
        return res.status(404).json({ message: "No resources found for this category" });
      }
  
      // Fetch related images and paragraphs for each resource
      for (let resource of resources) {
        const [resourceImages] = await pool.query(
          `SELECT image_url, position FROM ResourceImages WHERE resource_id = ? ORDER BY position ASC`,
          [resource.id]
        );
  
        const [resourceParagraphs] = await pool.query(
          `SELECT paragraph, position FROM ResourceParagraphs WHERE resource_id = ? ORDER BY position ASC`,
          [resource.id]
        );
  
        resource.images = resourceImages;
        resource.paragraphs = resourceParagraphs;
      }
  
      res.json({
        resources,
      });
    } catch (error) {
      console.error("Error fetching resources by category:", error);
      res.status(500).json({
        message: "Server error while fetching resources",
        error: error.message,
      });
    }
  };




  exports.getResourceById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch resource details
      const [resourceDetails] = await pool.query(
        `SELECT * FROM ResourceDetails WHERE id = ?`,
        [id]
      );
  
      if (!resourceDetails.length) {
        return res.status(404).json({ message: "Resource not found" });
      }
  
      const resource = resourceDetails[0];
  
      // Fetch related images
      const [resourceImages] = await pool.query(
        `SELECT image_url, position FROM ResourceImages WHERE resource_id = ? ORDER BY position ASC`,
        [id]
      );
  
      // Fetch related paragraphs
      const [resourceParagraphs] = await pool.query(
        `SELECT paragraph, position FROM ResourceParagraphs WHERE resource_id = ? ORDER BY position ASC`,
        [id]
      );
  
      res.json({
        resource,
        images: resourceImages,
        paragraphs: resourceParagraphs,
      });
    } catch (error) {
      console.error("Error fetching resource data:", error);
      res.status(500).json({
        message: "Server error while fetching resource data",
        error: error.message,
      });
    }
  };
  

// Update a resource
exports.updateResource = async (req, res) => {
    const { id } = req.params;
    const { title, subtitle, description, category, image_url } = req.body;
    try {
        const [result] = await pool.execute(
            'UPDATE resources SET title = ?, subtitle = ?, description = ?, category = ?, image_url = ? WHERE id = ?',
            [title, subtitle, description, category, image_url, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Resource not found.' });
        }
        res.status(200).json({ message: 'Resource updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a resource
exports.deleteResource = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.execute('DELETE FROM resources WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Resource not found.' });
        }
        res.status(200).json({ message: 'Resource deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// post enquiry
exports.enquiry = async (req, res) => {
    const { name, email, subject, message, service, serviceId } = req.body;
  
    // Query to insert the new enquiry into the database
    try {
      const query = 'INSERT INTO enquiries (name, email, subject, message, service, service_id) VALUES (?, ?, ?, ?, ?, ?)';
      
      // Execute the query using await and pass the data
      const [result] = await pool.execute(query, [name, email, subject, message, service, serviceId]);
      
      // Respond with a success message
      res.status(201).json({ message: 'Enquiry saved successfully', enquiryId: result.insertId });
    } catch (error) {
      console.error('Error saving enquiry:', error);
      return res.status(500).json({ message: 'Error saving enquiry', error: error.message });
    }
  };


// Get all enquiries
exports.getAllEnquiries = async (req, res) => {
    try {
      const [result] = await pool.execute("SELECT * FROM enquiries ORDER BY created_at DESC");
  
      if (result.length === 0) {
        return res.status(404).json({ message: "No enquiries found" });
      }
  
      // Parse the result to ensure proper formatting (e.g., for dates, service_id, etc.)
      const parsedResult = result.map((enquiry) => ({
        ...enquiry,
        // Ensure proper formatting of fields if necessary
        service_id: enquiry.service_id,
        created_at: enquiry.created_at ? new Date(enquiry.created_at).toISOString() : null,
      }));
  
      // Return the results
      res.status(200).json({ data: parsedResult });
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

// Controller to add a viewing request
exports.addRequest = async (req, res) => {
    try {
      const { name, email, date, message } = req.body;
  
      const query = "INSERT INTO requests (name, email, date, message) VALUES (?, ?, ?, ?)";
      
      const [result] = await pool.execute(query, [name, email, date, message]);
  
      res.status(201).json({ message: "Viewing request added successfully", id: result.insertId });
    } catch (error) {
      console.error("Error adding request:", error);
      res.status(500).json({ message: "Failed to add request", error: error.message });
    }
  };
  
  // Controller to clear all requests
  exports.clearRequests = async (req, res) => {
    try {
      const query = "DELETE FROM requests";
      
      const [result] = await pool.execute(query);
  
      res.status(200).json({ message: "All requests cleared successfully" });
    } catch (error) {
      console.error("Error clearing requests:", error);
      res.status(500).json({ message: "Failed to clear requests", error: error.message });
    }
  };
  



// Submit Viewing Request
exports.submitViewing = async (req, res) => {
    const { name, email, date, message } = req.body;
    console.log('====================================');
        console.log(req.body);
        console.log('====================================');
    
    try {
        const query = 'INSERT INTO viewRequests (name, email, date, message) VALUES (?, ?, ?, ?)';
        await pool.execute(query, [name, email, date, message]);
        console.log('====================================');
        console.log('Viewing request submitted successfully!');
        console.log('====================================');
        res.status(200).json({ message: 'Viewing request submitted successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Clear the Database (Delete all records)
exports.clearDb = async (req, res) => {
    try {
        const query = 'DELETE FROM requests';
        await pool.execute(query);
        res.status(200).json({ message: 'Database cleared successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




// Tailor Request Api



exports.createRequest = async (req, res) => {
    const { location, property_need, time_frame, name, email, whatsapp, about_need, about_you } = req.body;
    try {
        const sql = 'INSERT INTO tailorRequests (location, property_need, time_frame, name, email, whatsapp, about_need, about_you) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const [result] = await pool.execute(sql, [location, property_need, time_frame, name, email, whatsapp, about_need, about_you]);
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRequests = async (req, res) => {
    try {
        const [results] = await pool.execute('SELECT * FROM tailorRequests');
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRequestById = async (req, res) => {
    try {
        const [result] = await pool.execute('SELECT * FROM tailorRequests WHERE id = ?', [req.params.id]);
        res.status(200).json(result[0] || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRequest = async (req, res) => {
    const { location, property_need, time_frame, name, email, whatsapp, about_need, about_you } = req.body;
    try {
        const sql = 'UPDATE tailorRequests SET location=?, property_need=?, time_frame=?, name=?, email=?, whatsapp=?, about_need=?, about_you=? WHERE id=?';
        await pool.execute(sql, [location, property_need, time_frame, name, email, whatsapp, about_need, about_you, req.params.id]);
        res.status(200).json({ message: 'Request updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteRequest = async (req, res) => {
    try {
        await pool.execute('DELETE FROM tailorRequests WHERE id = ?', [req.params.id]);
        res.status(200).json({ message: 'Request deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};







// Add a new featured listing
exports.addFeaturedListing = async (req, res) => {
    try {
        const { sub_category, description } = req.body;
        const category = "Featured"; // Fixed category

        const allowedCategories = [
            "Trusted by Partners",
            "Team Members",
            "Available Jobs",
            "Terms: Privacy Policy Terms",
            "Terms: Cookie Policy Terms",
            "Terms: Website Terms"
        ];

        if (!allowedCategories.includes(sub_category)) {
            return res.status(400).json({ message: "Invalid sub-category" });
        }

        const sql = `INSERT INTO FeaturedListings (category, sub_category, description) VALUES (?, ?, ?)`;
        await pool.query(sql, [category, sub_category, description]);

        res.json({ message: "Featured listing added successfully" });
    } catch (error) {
        console.error("Error adding listing:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all featured listings
exports.getFeaturedListings = async (req, res) => {
    try {
        const [listings] = await pool.query(`SELECT * FROM FeaturedListings ORDER BY created_at DESC`);
        res.json(listings);
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update a listing
exports.updateFeaturedListing = async (req, res) => {
    try {
        const { id, sub_category, description } = req.body;
        const allowedCategories = [
            "Trusted by Partners",
            "Team Members",
            "Available Jobs",
            "Terms: Privacy Policy Terms",
            "Terms: Cookie Policy Terms",
            "Terms: Website Terms"
        ];

        if (!allowedCategories.includes(sub_category)) {
            return res.status(400).json({ message: "Invalid sub-category" });
        }

        const sql = `UPDATE FeaturedListings SET sub_category = ?, description = ? WHERE id = ?`;
        await pool.query(sql, [sub_category, description, id]);

        res.json({ message: "Listing updated successfully" });
    } catch (error) {
        console.error("Error updating listing:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a listing
exports.deleteFeaturedListing = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query(`DELETE FROM FeaturedListings WHERE id = ?`, [id]);

        res.json({ message: "Listing deleted successfully" });
    } catch (error) {
        console.error("Error deleting listing:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};




// Add Available Job
exports.addjobs =  async (req, res) => {
  try {
      const { title, description, location, salary } = req.body;
      await pool.query(
          `INSERT INTO jobs (title, description, location, salary) VALUES (?, ?, ?, ?)`,
          [title, description, location, salary]
      );
      res.status(201).json({ message: "Job added successfully" });
  } catch (error) {
      console.error("Error adding job:", error);
      res.status(500).json({ message: "Server error" });
  }
};

exports.getjobs = async (req, res) => {
  try {
      const [jobs] = await pool.query("SELECT * FROM jobs");
      res.json(jobs);
  } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Server error" });
  }
};





// Add a new team member
exports.addTeamMember = async (req, res) => {
    try {
        console.log("Received data:", req.body);
        console.log("Received file:", req.file);

        const category = req.body.category || "general"; // Use category from request, default to 'general'
  
        const { name, position, bio, email, phone_number, linkedin_url } = req.body;
        // const profile_image_url = req.file ? `/images/${category}/${req.file.filename}` : null; 

        const profile_image_url = req.file ? req.file.path : null; // Get file path
  
        if (!profile_image_url) {
            return res.status(400).json({ message: "Profile image is required" });
        }
  
        const [result] = await pool.query(
            `INSERT INTO TeamMembers (name, position, profile_image_url, bio, email, phone_number, linkedin_url) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, position, profile_image_url, bio, email, phone_number, linkedin_url]
        );
  
        res.status(201).json({ message: "Team member added successfully", id: result.insertId });
    } catch (error) {
        console.error("Error adding team member:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

// Get all team members
exports.getAllTeamMembers = async (req, res) => {
  try {
      const [members] = await pool.query("SELECT * FROM TeamMembers ORDER BY created_at DESC");
      res.json(members);
  } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single team member by ID
exports.getTeamMemberById = async (req, res) => {
  try {
      const { id } = req.params;
      const [member] = await pool.query("SELECT * FROM TeamMembers WHERE id = ?", [id]);

      if (!member.length) return res.status(404).json({ message: "Team member not found" });

      res.json(member[0]);
  } catch (error) {
      console.error("Error fetching team member:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a team member
exports.updateTeamMember = async (req, res) => {
  try {
      const { id } = req.params;
      const { name, position, profile_image_url, bio, email, phone_number, linkedin_url, twitter_url, is_active } = req.body;

      const [result] = await pool.query(`
          UPDATE TeamMembers 
          SET name = ?, position = ?, profile_image_url = ?, bio = ?, email = ?, phone_number = ?, linkedin_url = ?, twitter_url = ?, is_active = ? 
          WHERE id = ?`,
          [name, position, profile_image_url, bio, email, phone_number, linkedin_url, twitter_url, is_active, id]
      );

      if (result.affectedRows === 0) return res.status(404).json({ message: "Team member not found" });

      res.json({ message: "Team member updated successfully" });
  } catch (error) {
      console.error("Error updating team member:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a team member
exports.deleteTeamMember = async (req, res) => {
  try {
      const { id } = req.params;
      const [result] = await pool.query("DELETE FROM TeamMembers WHERE id = ?", [id]);

      if (result.affectedRows === 0) return res.status(404).json({ message: "Team member not found" });

      res.json({ message: "Team member deleted successfully" });
  } catch (error) {
      console.error("Error deleting team member:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
};



// Create a new TalkToUs entry
exports.createTalkToUs = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        await pool.query("INSERT INTO TalkToUs (name, email, message) VALUES (?, ?, ?)", [name, email, message]);
        res.status(201).json({ message: "Message submitted successfully" });
    } catch (error) {
        console.error("Error submitting message:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get all TalkToUs messages
exports.getAllTalkToUs = async (req, res) => {
    try {
        const [messages] = await pool.query("SELECT * FROM TalkToUs ORDER BY created_at DESC");
        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// feedbackController.js
// Create a new feedback entry
exports.createFeedback = async (req, res) => {
    try {
        const { name, email, recommendation_rating, experience_rating, new_features_suggestion, improvement_suggestions } = req.body;
        await pool.query(
            "INSERT INTO Feedback (name, email, recommendation_rating, experience_rating, new_features_suggestion, improvement_suggestions) VALUES (?, ?, ?, ?, ?, ?)",
            [name, email, recommendation_rating, experience_rating, new_features_suggestion, improvement_suggestions]
        );
        res.status(201).json({ message: "Feedback submitted successfully" });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get all feedback entries
exports.getAllFeedback = async (req, res) => {
    try {
        const [feedback] = await pool.query("SELECT * FROM Feedback ORDER BY created_at DESC");
        res.json(feedback);
    } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).json({ error: "Server error" });
    }
};



exports.createTerms = async (req, res) => {
    // Destructure the necessary fields from the request body
    const { category, topic, description } = req.body;
  
    console.log('====================================');
    console.log(req.body);
    console.log('====================================');
  
    // Validate required fields (category and topic are required)
    if (!category || !topic) {
      return res.status(400).json({ error: "Both category and topic are required." });
    }
  
    // Define the SQL query for insertion
    const sql = `INSERT INTO FeaturedListings (category, topic, description) VALUES (?, ?, ?)`;
  
    try {
      // Execute the query with the provided data
      const [results] = await pool.query(sql, [category, topic, description]);
  
      // Send a successful response including the inserted record ID
      res.status(201).json({
        message: "Featured listing added successfully!",
        id: results.insertId,
      });
    } catch (err) {
      console.error("Database insertion error:", err);
      res.status(500).json({ error: "An error occurred while inserting the listing." });
    }
  };


  exports.getTermsByCategory = async (req, res) => {
    const { category } = req.params; // Assuming category is passed as a URL parameter
  
    if (!category) {
      return res.status(400).json({ error: "Category is required." });
    }
  
    const sql = `SELECT * FROM FeaturedListings WHERE category = ?`;
  
    try {
      const [results] = await pool.query(sql, [category]);
  
      if (results.length === 0) {
        return res.status(404).json({ message: "No terms found for the specified category." });
      }
  
      res.status(200).json(results);
    } catch (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "An error occurred while fetching terms." });
    }
  };


  exports.deleteTerms = async (req, res) => {
    const { id } = req.params; // Assuming id is passed as a URL parameter
  
    if (!id) {
      return res.status(400).json({ error: "ID is required." });
    }
  
    const sql = `DELETE FROM FeaturedListings WHERE id = ?`;
  
    try {
      const [results] = await pool.promise().query(sql, [id]);
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "No term found with the specified ID." });
      }
  
      res.status(200).json({
        message: "Term deleted successfully!",
      });
    } catch (err) {
      console.error("Database deletion error:", err);
      res.status(500).json({ error: "An error occurred while deleting the term." });
    }
  };