const pool = require("../database/db"); // Assuming your DB connection pool is already set up

// Search with Residential and Keyword parameters
exports.getProperties = async (req, res) => {
    // Get the 'limit' and 'page' parameters from the query string
    let { limit, page } = req.query;
  
    // Default to 10 properties per page if no limit is provided
    limit = limit ? parseInt(limit) : 10;
  
    // Default to page 1 if no page is provided
    page = page ? parseInt(page) : 1;
  
    // Calculate the offset for pagination
    const offset = (page - 1) * limit;
  
    // SQL query to fetch the trusted properties with pagination
    const sql = 'SELECT * FROM properties WHERE is_trusted = 1 LIMIT ? OFFSET ?';
  
    try {
      // Execute the query with limit and offset
      const [results] = await pool.query(sql, [limit, offset]);
  
      // If no properties are found
      if (results.length === 0) {
        return res.status(404).json({ message: 'No properties found.' });
      }
  
      // Return the properties
      return res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching trusted properties:', error);
      return res.status(500).json({ error: 'Failed to fetch properties', message: error.message });
    }
  };
  
