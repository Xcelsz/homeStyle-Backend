const pool = require('../database/db');

// Create a new booking
exports.createBooking = async (req, res) => {
    const {
        property_id,
        service,
        deal_name,
        viewing_slot,
        name,
        email,
        whatsapp,
        employment_status,
        proof_of_funds_url
    } = req.body;

    try {
        await pool.execute(
            `INSERT INTO bookings 
             (property_id, service, deal_name, viewing_slot, name, email, whatsapp, employment_status, proof_of_funds_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [property_id, service, deal_name, viewing_slot, name, email, whatsapp, employment_status, proof_of_funds_url]
        );
        res.status(201).json({ message: 'Booking created successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const [bookings] = await pool.execute('SELECT * FROM bookings');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific booking by ID
exports.getBookingById = async (req, res) => {
    const { id } = req.params;
    try {
        const [booking] = await pool.execute('SELECT * FROM bookings WHERE id = ?', [id]);
        if (booking.length === 0) {
            return res.status(404).json({ message: 'Booking not found.' });
        }
        res.status(200).json(booking[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a booking
exports.updateBooking = async (req, res) => {
    const { id } = req.params;
    const {
        property_id,
        service,
        deal_name,
        viewing_slot,
        name,
        email,
        whatsapp,
        employment_status,
        proof_of_funds_url
    } = req.body;

    try {
        const [result] = await pool.execute(
            `UPDATE bookings 
             SET property_id = ?, service = ?, deal_name = ?, viewing_slot = ?, name = ?, email = ?, whatsapp = ?, employment_status = ?, proof_of_funds_url = ?
             WHERE id = ?`,
            [property_id, service, deal_name, viewing_slot, name, email, whatsapp, employment_status, proof_of_funds_url, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        res.status(200).json({ message: 'Booking updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Delete a booking
exports.deleteBooking = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.execute('DELETE FROM bookings WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        res.status(200).json({ message: 'Booking deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
