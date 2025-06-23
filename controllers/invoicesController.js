const pool = require("../database/db");


// Get All Invoices
exports.getAllInvoices = async (req, res) => {
  try {
    const sql = 'SELECT * FROM invoices';
    const [result] = await pool.query(sql);
    res.json(result);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create New Invoice
exports.createInvoices = async (req, res) => {
  try {
    const { id, customer, date, amount, status, type } = req.body;
    if (!id || !customer || !date || !amount || !status || !type) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const sql = 'INSERT INTO invoices (id, customer, date, amount, status, type) VALUES (?, ?, ?, ?, ?, ?)';
    await pool.query(sql, [id, customer, date, amount, status, type]);

    res.json({ message: 'Invoice created successfully' });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Invoice Status
exports.updateInvoices = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const sql = 'UPDATE invoices SET status = ? WHERE id = ?';
    const [result] = await pool.query(sql, [status, req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json({ message: 'Invoice status updated successfully' });
  } catch (error) {
    console.error('Error updating invoice status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Invoice
exports.deleteInvoices = async (req, res) => {
  try {
    const sql = 'DELETE FROM invoices WHERE id = ?';
    const [result] = await pool.query(sql, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

  