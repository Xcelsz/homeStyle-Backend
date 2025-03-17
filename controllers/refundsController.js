const pool = require("../database/db");

// Get All Refunds
exports.getAllRefunds = async (req, res) => {
  try {
    const sql = 'SELECT * FROM refunds';
    const [result] = await pool.query(sql);
    res.json(result);
  } catch (error) {
    console.error('Error fetching refunds:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Refund Status
exports.updateRefundStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });

    const sql = 'UPDATE refunds SET status = ? WHERE id = ?';
    const [result] = await pool.query(sql, [status, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Refund not found' });

    res.json({ message: 'Refund status updated successfully' });
  } catch (error) {
    console.error('Error updating refund status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
