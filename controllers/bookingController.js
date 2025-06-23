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
        return res.status(200).json(booking[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
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

        return res.status(200).json({ message: 'Booking updated successfully!' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
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

        return res.status(200).json({ message: 'Booking deleted successfully!' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};















// Create Appointment
exports.createAppointment = async (req, res) => {
    try {
        const { property_id, service, location, property_category, about_you, about_property, name, email, whatsapp, property_address, status, appointment_date } = req.body;
        
        const sql = `INSERT INTO book_appointments 
            (property_id, service, location, property_category, about_you, about_property, name, email, whatsapp, property_address, status, appointment_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await pool.execute(sql, [property_id, service, location, property_category, about_you, about_property, name, email, whatsapp, property_address, status, appointment_date]);
        
        res.status(201).json({ message: "Appointment booked successfully", appointmentId: result.insertId });
    } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get All Appointments
exports.getAppointments = async (req, res) => {
    console.log('====================================');
    console.log('asdasdasd');
    console.log('====================================');
    try {
        const sql = "SELECT * FROM book_appointments";
        const [results] = await pool.execute(sql);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get Appointment by ID
exports.getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM book_appointments WHERE id = ?";
        const [result] = await pool.execute(sql, [id]);

        if (result.length === 0) return res.status(404).json({ message: "Appointment not found" });
        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Error fetching appointment:", error);
        res.status(500).json({ error: error.message });
    }
};

// Update Appointment Status
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const sql = "UPDATE book_appointments SET status = ? WHERE id = ?";
        
        const [result] = await pool.execute(sql, [status, id]);
        res.status(200).json({ message: "Appointment status updated successfully" });
    } catch (error) {
        console.error("Error updating appointment status:", error);
        res.status(500).json({ error: error.message });
    }
};

// Delete Appointment
exports.deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM book_appointments WHERE id = ?";
        
        const [result] = await pool.execute(sql, [id]);
        res.status(200).json({ message: "Appointment deleted successfully" });
    } catch (error) {
        console.error("Error deleting appointment:", error);
        res.status(500).json({ error: error.message });
    }
};

// Create Booking View
exports.createBookingView = async (req, res) => {
    try {
        const { property_id, service, property_name, viewing_slot, name, employment_status, email, whatsapp, proof_of_funds_url, about } = req.body;
        
        const sql = `INSERT INTO booking_view 
            (property_id, service, property_name, viewing_slot, name, employment_status, email, whatsapp, proof_of_funds_url, about) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const [result] = await pool.execute(sql, [property_id, service, property_name, viewing_slot, name, employment_status, email, whatsapp, proof_of_funds_url, about]);
        res.status(201).json({ message: "Booking view created successfully", bookingId: result.insertId });
    } catch (error) {
        console.error("Error creating booking view:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get All Booking Views
exports.getBookingViews = async (req, res) => {
    console.log('====================================');
    console.log('booking');
    console.log('====================================');
    try {
        const sql = "SELECT * FROM booking_view";
        const [results] = await pool.execute(sql);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching booking views:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get Booking View by ID
exports.getBookingViewById = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM booking_view WHERE id = ?";
        const [result] = await pool.execute(sql, [id]);
        
        if (result.length === 0) return res.status(404).json({ message: "Booking view not found." });
        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Error fetching booking view:", error);
        res.status(500).json({ error: error.message });
    }
};

// Update Booking View
exports.updateBookingView = async (req, res) => {
    try {
        const { id } = req.params;
        const { property_id, service, property_name, viewing_slot, name, employment_status, email, whatsapp, proof_of_funds_url, about } = req.body;
        
        const sql = `UPDATE booking_view SET 
            property_id = ?, service = ?, property_name = ?, viewing_slot = ?, name = ?, employment_status = ?, 
            email = ?, whatsapp = ?, proof_of_funds_url = ?, about = ? WHERE id = ?`;
        
        const [result] = await pool.execute(sql, [property_id, service, property_name, viewing_slot, name, employment_status, email, whatsapp, proof_of_funds_url, about, id]);
        
        if (result.affectedRows === 0) return res.status(404).json({ message: "Booking view not found." });
        res.status(200).json({ message: "Booking view updated successfully!" });
    } catch (error) {
        console.error("Error updating booking view:", error);
        res.status(500).json({ error: error.message });
    }
};

// Delete Booking View
exports.deleteBookingView = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM booking_view WHERE id = ?";
        
        const [result] = await pool.execute(sql, [id]);
        
        if (result.affectedRows === 0) return res.status(404).json({ message: "Booking view not found." });
        res.status(200).json({ message: "Booking view deleted successfully!" });
    } catch (error) {
        console.error("Error deleting booking view:", error);
        res.status(500).json({ error: error.message });
    }
};







// Create Request Quote
exports.createRequestQuote = async (req, res) => {
    try {
        const { property_id, service, name, email, whatsapp, location_name, project_need, project_details, project_documentation } = req.body;
        
        const sql = `INSERT INTO request_quote 
            (property_id, service, name, email, whatsapp, location_name, project_need, project_details, project_documentation) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await pool.execute(sql, [property_id, service, name, email, whatsapp, location_name, project_need, project_details, project_documentation]);

        res.status(201).json({ message: "Quote request submitted successfully", requestId: result.insertId });
    } catch (error) {
        console.error("Error creating quote request:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get All Quote Requests
exports.getRequestQuotes = async (req, res) => {
    try {
        const sql = "SELECT * FROM request_quote";
        const [results] = await pool.execute(sql);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching quote requests:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get Quote Request by ID
exports.getRequestQuoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM request_quote WHERE id = ?";
        const [result] = await pool.execute(sql, [id]);

        if (result.length === 0) {
            return res.status(404).json({ message: "Quote request not found." });
        }
        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Error fetching quote request:", error);
        res.status(500).json({ error: error.message });
    }
};

// Update Quote Request
exports.updateRequestQuote = async (req, res) => {
    try {
        const { id } = req.params;
        const { property_id, service, name, email, whatsapp, location_name, project_need, project_details, project_documentation } = req.body;

        const sql = `UPDATE request_quote SET 
            property_id = ?, service = ?, name = ?, email = ?, whatsapp = ?, location_name = ?, 
            project_need = ?, project_details = ?, project_documentation = ? WHERE id = ?`;

        const [result] = await pool.execute(sql, [property_id, service, name, email, whatsapp, location_name, project_need, project_details, project_documentation, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Quote request not found." });
        }
        res.status(200).json({ message: "Quote request updated successfully!" });
    } catch (error) {
        console.error("Error updating quote request:", error);
        res.status(500).json({ error: error.message });
    }
};

// Delete Quote Request
exports.deleteRequestQuote = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM request_quote WHERE id = ?";
        const [result] = await pool.execute(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Quote request not found." });
        }
        res.status(200).json({ message: "Quote request deleted successfully!" });
    } catch (error) {
        console.error("Error deleting quote request:", error);
        res.status(500).json({ error: error.message });
    }
};

// Create Consultancy Booking
exports.createConsultBooking = async (req, res) => {
    try {
        const { property_id, service, location, consultancy_need, about_you, about_project, name, email, whatsapp, project_location, appointment_date, consultancy_plans, consultancy_mode, total_cost } = req.body;

        const sql = `INSERT INTO book_consult 
            (property_id, service, location, consultancy_need, about_you, about_project, name, email, whatsapp, project_location, appointment_date, consultancy_plans, consultancy_mode, total_cost) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await pool.execute(sql, [property_id, service, location, consultancy_need, about_you, about_project, name, email, whatsapp, project_location, appointment_date, consultancy_plans, consultancy_mode, total_cost]);

        res.status(201).json({ message: "Consultancy appointment booked successfully", consultId: result.insertId });
    } catch (error) {
        console.error("Error creating consultancy booking:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get All Consultancy Bookings
exports.getConsultBookings = async (req, res) => {
    try {
        const sql = "SELECT * FROM book_consult";
        const [results] = await pool.execute(sql);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching consultancy bookings:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get Consultancy Booking by ID
exports.getConsultBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM book_consult WHERE id = ?";
        const [result] = await pool.execute(sql, [id]);

        if (result.length === 0) {
            return res.status(404).json({ message: "Consultancy Booking not found." });
        }
        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Error fetching consultancy booking:", error);
        res.status(500).json({ error: error.message });
    }
};

// Update Consultancy Booking
exports.updateConsultBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { property_id, service, location, consultancy_need, about_you, about_project, name, email, whatsapp, project_location, appointment_date, consultancy_plans, consultancy_mode, total_cost } = req.body;

        const sql = `UPDATE book_consult SET 
            property_id = ?, service = ?, location = ?, consultancy_need = ?, about_you = ?, about_project = ?, 
            name = ?, email = ?, whatsapp = ?, project_location = ?, appointment_date = ?, consultancy_plans = ?, 
            consultancy_mode = ?, total_cost = ? WHERE id = ?`;

        const [result] = await pool.execute(sql, [property_id, service, location, consultancy_need, about_you, about_project, name, email, whatsapp, project_location, appointment_date, consultancy_plans, consultancy_mode, total_cost, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Consultancy Booking not found." });
        }
        res.status(200).json({ message: "Consultancy booking updated successfully!" });
    } catch (error) {
        console.error("Error updating consultancy booking:", error);
        res.status(500).json({ error: error.message });
    }
};

// Delete Consultancy Booking
exports.deleteConsultBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM book_consult WHERE id = ?";
        const [result] = await pool.execute(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Consultancy Booking not found." });
        }
        res.status(200).json({ message: "Consultancy booking deleted successfully!" });
    } catch (error) {
        console.error("Error deleting consultancy booking:", error);
        res.status(500).json({ error: error.message });
    }
};






// Create Decoration Booking
exports.createDecoBooking = async (req, res) => {
    try {
        const { property_id, service, location, property_type, about_you, about_property, name, email, whatsapp, property_address, service_timing, appointment_date } = req.body;

        const sql = `INSERT INTO book_deco 
            (property_id, service, location, property_type, about_you, about_property, name, email, whatsapp, property_address, service_timing, appointment_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await pool.execute(sql, [property_id, service, location, property_type, about_you, about_property, name, email, whatsapp, property_address, service_timing, appointment_date]);

        res.status(201).json({ message: "Decoration booking created successfully", decoId: result.insertId });
    } catch (error) {
        console.error("Error creating decoration booking:", error);
        res.status(500).json({ error: error.message });
    }
};


// Get all decoration bookings
exports.getAllDecoBookings = async (req, res) => {
    try {
        const [rows] = await pool.execute("SELECT * FROM book_deco ORDER BY appointment_date DESC");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching decoration bookings:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get a single decoration booking by ID
exports.getDecoBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.execute("SELECT * FROM book_deco WHERE id = ?", [id]);

        if (rows.length === 0) return res.status(404).json({ message: "Decoration booking not found" });

        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching decoration booking:", error);
        res.status(500).json({ error: error.message });
    }
};



// Fetch, Update, and Delete follow the same pattern as other controllers.




// Create Stay Booking
exports.createStayBooking = async (req, res) => {
    const { property_name, costOfStay, addOns, costOfAddOns, numberOfGuests, numberOfKids, checkInDate, checkOutDate, otherDetails, totalCost } = req.body;

    try {
        // SQL query string
        const sql = `INSERT INTO book_stay 
            (property_name, costOfStay, addOns, costOfAddOns, numberOfGuests, numberOfKids, checkInDate, checkOutDate, otherDetails, totalCost) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        // Execute the query with the provided parameters
        const [result] = await pool.execute(sql, [property_name, costOfStay, addOns, costOfAddOns, numberOfGuests, numberOfKids, checkInDate, checkOutDate, otherDetails, totalCost]);

        // Return response with the insert ID
        return res.status(201).json({
            message: "Stay booking created successfully",
            stayId: result.insertId
        });

    } catch (err) {
        // Handle errors (e.g., database connection issues)
        console.error("Error executing query:", err);
        return res.status(500).json({
            error: err.message
        });
    }
};


// Get all stay bookings
exports.getAllStayBookings = async (req, res) => {
    try {
        const [rows] = await pool.execute("SELECT * FROM book_stay ORDER BY checkInDate DESC");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching stay bookings:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get a single stay booking by ID
exports.getStayBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.execute("SELECT * FROM book_stay WHERE id = ?", [id]);

        if (rows.length === 0) return res.status(404).json({ message: "Stay booking not found" });

        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching stay booking:", error);
        res.status(500).json({ error: error.message });
    }
};



// Create Property Listing Booking
exports.createListingBooking = async (req, res) => {
    const { property_id, service, location, property_category, about_you, about_property, name, email, whatsapp, property_address, market_duration, appointment_date } = req.body;

    const sql = `INSERT INTO book_listings 
        (property_id, service, location, property_category, about_you, about_property, name, email, whatsapp, property_address, market_duration, appointment_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
        const [result] = await pool.execute(sql, [property_id, service, location, property_category, about_you, about_property, name, email, whatsapp, property_address, market_duration, appointment_date]);
        return res.status(201).json({ message: "Listing booking created successfully", listingId: result.insertId });
    } catch (err) {
        console.error("Error creating booking:", err);
        return res.status(500).json({ error: err.message });
    }
};


// Get all listing bookings
exports.getAllListingBookings = async (req, res) => {
    try {
        const [rows] = await pool.execute("SELECT * FROM book_listings ORDER BY appointment_date DESC");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching listing bookings:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get a single listing booking by ID
exports.getListingBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.execute("SELECT * FROM book_listings WHERE id = ?", [id]);

        if (rows.length === 0) return res.status(404).json({ message: "Listing booking not found" });

        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching listing booking:", error);
        res.status(500).json({ error: error.message });
    }
};



exports.updateBookingStatus = async (req, res) => {
    try {
        const { table, id, status } = req.body;

        console.log('====================================');
        console.log(req.body);
        console.log('====================================');

        // Validate the table name to prevent SQL injection
        const allowedTables = ['book_deco', 'book_stay', 'book_listings', 'request_quote', 'booking_view', 'book_consult'];
        if (!allowedTables.includes(table)) {
            return res.status(400).json({ error: "Invalid table name" });
        }

        // Validate status value
        const allowedStatuses = ['published', 'accepted', 'rejected', 'archived'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        // Update query
        const sql = `UPDATE ${table} SET status = ? WHERE id = ?`;
        const [result] = await pool.execute(sql, [status, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }

        res.json({ message: "Booking status updated successfully" });

    } catch (error) {
        console.error("Error updating booking status:", error);
        res.status(500).json({ error: error.message });
    }
};



exports.getBookingStats = async (req, res) => {
    console.log("Fetching booking stats...");

    try {
        const tables = [
            'book_deco', 'book_stay', 'book_listings', 
            'request_quote', 'booking_view', 'book_consult'
        ];

        let stats = [];

        for (let table of tables) {
            const query = `
                SELECT 
                    '${table}' AS table_name,
                    COUNT(*) AS total,
                    COUNT(CASE WHEN status = 'published' THEN 1 END) AS published,
                    COUNT(CASE WHEN status = 'accepted' THEN 1 END) AS accepted,
                    COUNT(CASE WHEN status = 'rejected' THEN 1 END) AS rejected,
                    COUNT(CASE WHEN status = 'archived' THEN 1 END) AS archived
                FROM ${table};
            `;

            const [result] = await pool.query(query);
            stats.push(result[0]); // Push query results
        }

        res.status(200).json({
            message: "Booking statistics fetched successfully",
            data: stats,
        });

    } catch (error) {
        console.error("Error fetching booking stats:", error);
        res.status(500).json({
            message: "Server error while fetching booking statistics",
            error: error.message,
        });
    }
};



