const pool = require("../database/db");

// Get Sales Data
exports.getAllSales = async (req, res) => {
  try {
    const sql = 'SELECT * FROM sales';
    const [result] = await pool.query(sql);
    res.json(result);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Sales Data
exports.updateSales = async (req, res) => {
  try {
    const { property, add_ons, services, total } = req.body;
    if (!property || !add_ons || !services || !total) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const sql = 'UPDATE sales SET property = ?, add_ons = ?, services = ?, total = ? WHERE id = ?';
    const [result] = await pool.query(sql, [property, add_ons, services, total, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Sale not found' });

    res.json({ message: 'Sales updated successfully' });
  } catch (error) {
    console.error('Error updating sales:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
