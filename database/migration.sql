CREATE DATABASE IF NOT EXISTS listings_db;
USE listings_db;

-- Create PropertyDetails table
CREATE TABLE PropertyDetails (
    property_details_id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100),
    PropertyNeed VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    price DECIMAL(10, 2),
    displayImage VARCHAR(255),
    serviceSummary TEXT,
    generalInfo TEXT,
    features JSON,
    propertyAmenities JSON,
    location JSON,
    payment_options JSON,
    status ENUM('published', 'unpublished', 'close', 'archived') DEFAULT 'unpublished',
    service_details TEXT,
    service_type VARCHAR(100),
    size INT DEFAULT 0,
    bedRoom INT DEFAULT 0,
    parking INT DEFAULT 0,
    bathRoom INT DEFAULT 0,
    area VARCHAR(255),
    videoLinks JSON,
    faq JSON,
    propertyUsage VARCHAR(255),
    total VARCHAR(255),
    occupancy VARCHAR(255),
    propertyPrice JSON,
    propertyTax JSON,
    risks JSON,
    tenures JSON,
    registrations JSON,
    salesPrice JSON,
    ownership JSON,
    roads JSON,
    serviceLevel JSON,
    Cancellation JSON,
    CheckIn JSON,
    commissionOffice VARCHAR(255),
    closeReason TEXT
) ENGINE=InnoDB;

-- Create ServiceDetails table
CREATE TABLE ServiceDetails (
    service_details_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    display_image VARCHAR(255),
    serviceCategory VARCHAR(100),
    serviceLocation VARCHAR(255),
    area VARCHAR(255),
    listingType VARCHAR(100),
    serviceSummary TEXT,
    price DECIMAL(10, 2) DEFAULT 0.00,
    keyFeatures JSON,
    whatsIncludedDetails TEXT,
    whatsIncluded JSON,
    expectedOutcome JSON,
    requestQuote BOOLEAN DEFAULT FALSE,
    media JSON,
    status ENUM('published', 'unpublished', 'close', 'archived') DEFAULT 'unpublished',
    faq JSON,
    closeReason TEXT
) ENGINE=InnoDB;

-- Create ResourceDetails table
CREATE TABLE ResourceDetails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    total_minutes_read INT,
    overview TEXT,
    category VARCHAR(100),
    faq JSON,
    status ENUM('published', 'unpublished', 'close', 'archived') DEFAULT 'unpublished',
    closeReason TEXT
) ENGINE=InnoDB;

-- Create Addons table
CREATE TABLE Addons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    category VARCHAR(100),
    price DECIMAL(10, 2) DEFAULT 0.00,
    display_image VARCHAR(255),
    key_features_total INT DEFAULT 0,
    key_features_values JSON,
    overview TEXT,
    general_info TEXT,
    why_choose TEXT,
    whats_included JSON,
    status ENUM('published', 'unpublished', 'close', 'archived') DEFAULT 'unpublished',
    faq JSON,
    closeReason TEXT
) ENGINE=InnoDB;

-- Create PropertyListings table (after referenced tables)
CREATE TABLE PropertyListings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    display_image VARCHAR(255),
    short_description TEXT,
    status ENUM('published', 'unpublished', 'close', 'archived') DEFAULT 'unpublished',
    type ENUM('Property', 'Service', 'Resource', 'Addons') NOT NULL,
    subcategory VARCHAR(100),
    property_details_id INT,
    service_details_id INT,
    resource_details_id INT,
    addons_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_details_id) REFERENCES PropertyDetails(property_details_id) ON DELETE SET NULL,
    FOREIGN KEY (service_details_id) REFERENCES ServiceDetails(service_details_id) ON DELETE SET NULL,
    FOREIGN KEY (resource_details_id) REFERENCES ResourceDetails(id) ON DELETE SET NULL,
    FOREIGN KEY (addons_id) REFERENCES Addons(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Create PropertyImages table
CREATE TABLE PropertyImages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    propertyId INT,
    imageUrl VARCHAR(255) NOT NULL,
    FOREIGN KEY (propertyId) REFERENCES PropertyDetails(property_details_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Create PropertyFloorPlans table
CREATE TABLE PropertyFloorPlans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    propertyId INT,
    filePath VARCHAR(255) NOT NULL,
    FOREIGN KEY (propertyId) REFERENCES PropertyDetails(property_details_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Create PropertyOwnership table
CREATE TABLE PropertyOwnership (
    id INT AUTO_INCREMENT PRIMARY KEY,
    propertyId INT,
    filePath VARCHAR(255) NOT NULL,
    FOREIGN KEY (propertyId) REFERENCES PropertyDetails(property_details_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Create PropertyAmenities table
CREATE TABLE PropertyAmenities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    propertyId INT,
    amenitiesData JSON,
    FOREIGN KEY (propertyId) REFERENCES PropertyDetails(property_details_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Create ResourceImages table
CREATE TABLE ResourceImages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resource_id INT,
    image_url VARCHAR(255) NOT NULL,
    position INT NOT NULL,
    FOREIGN KEY (resource_id) REFERENCES ResourceDetails(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Create ResourceParagraphs table
CREATE TABLE ResourceParagraphs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resource_id INT,
    paragraph TEXT NOT NULL,
    position INT NOT NULL,
    FOREIGN KEY (resource_id) REFERENCES ResourceDetails(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Create AddonImages table
CREATE TABLE AddonImages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    addon_id INT,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (addon_id) REFERENCES Addons(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Create sales table
CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property JSON NOT NULL,
    add_ons JSON NOT NULL,
    services JSON NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create refunds table
CREATE TABLE refunds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status ENUM('pending', 'approved', 'rejected') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create properties table
CREATE TABLE properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    is_trusted BOOLEAN DEFAULT FALSE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create partners table
CREATE TABLE partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(255) NOT NULL,
    description TEXT,
    email VARCHAR(255),
    phone_number VARCHAR(50),
    website_url VARCHAR(255),
    is_trusted BOOLEAN DEFAULT FALSE,
    trusted_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create reviews table
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    service VARCHAR(255) NOT NULL,
    service_id INT NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create subscriptions table
CREATE TABLE subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create resources table
CREATE TABLE resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create enquiries table
CREATE TABLE enquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT,
    service VARCHAR(255),
    service_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create requests table
CREATE TABLE requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create viewRequests table
CREATE TABLE viewRequests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create tailorRequests table
CREATE TABLE tailorRequests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    property_need VARCHAR(100) NOT NULL,
    time_frame VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50),
    about_need TEXT,
    about_you TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create FeaturedListings table
CREATE TABLE FeaturedListings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(255),
    topic VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create jobs table
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    salary DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create TeamMembers table
CREATE TABLE TeamMembers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    profile_image_url VARCHAR(255) NOT NULL,
    bio TEXT,
    email VARCHAR(255),
    phone_number VARCHAR(50),
    linkedin_url VARCHAR(255),
    twitter_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create TalkToUs table
CREATE TABLE TalkToUs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create Feedback table
CREATE TABLE Feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    recommendation_rating INT NOT NULL,
    experience_rating INT NOT NULL,
    new_features_suggestion TEXT,
    improvement_suggestions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT,
    service VARCHAR(255) NOT NULL,
    deal_name VARCHAR(255),
    viewing_slot DATETIME,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50),
    employment_status VARCHAR(100),
    proof_of_funds_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES PropertyDetails(property_details_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Create book_appointments table
CREATE TABLE book_appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT,
    service VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    property_category VARCHAR(100),
    about_you TEXT,
    about_property TEXT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50),
    property_address VARCHAR(255),
    status ENUM('published', 'accepted', 'rejected', 'archived') DEFAULT 'published',
    appointment_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES PropertyDetails(property_details_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Create booking_view table
CREATE TABLE booking_view (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT,
    service VARCHAR(255) NOT NULL,
    property_name VARCHAR(255) NOT NULL,
    viewing_slot DATETIME NOT NULL,
    name VARCHAR(255) NOT NULL,
    employment_status VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50),
    proof_of_funds_url VARCHAR(255),
    about TEXT,
    status ENUM('published', 'accepted', 'rejected', 'archived') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES PropertyDetails(property_details_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Create request_quote table
CREATE TABLE request_quote (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT,
    service VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50),
    location_name VARCHAR(255),
    project_need VARCHAR(255),
    project_details TEXT,
    project_documentation VARCHAR(255),
    status ENUM('published', 'accepted', 'rejected', 'archived') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES PropertyDetails(property_details_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Create book_consult table
CREATE TABLE book_consult (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT,
    service VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    consultancy_need VARCHAR(255),
    about_you TEXT,
    about_project TEXT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50),
    project_location VARCHAR(255),
    appointment_date DATETIME,
    consultancy_plans VARCHAR(255),
    consultancy_mode VARCHAR(100),
    total_cost DECIMAL(10, 2),
    status ENUM('published', 'accepted', 'rejected', 'archived') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES PropertyDetails(property_details_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Create book_deco table
CREATE TABLE book_deco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT,
    service VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    property_type VARCHAR(100),
    about_you TEXT,
    about_property TEXT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50),
    property_address VARCHAR(255),
    service_timing VARCHAR(100),
    appointment_date DATETIME,
    status ENUM('published', 'accepted', 'rejected', 'archived') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES PropertyDetails(property_details_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Create book_stay table
CREATE TABLE book_stay (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_name VARCHAR(255) NOT NULL,
    costOfStay DECIMAL(10, 2) NOT NULL,
    addOns JSON,
    costOfAddOns DECIMAL(10, 2),
    numberOfGuests INT NOT NULL,
    numberOfKids INT DEFAULT 0,
    checkInDate DATE NOT NULL,
    checkOutDate DATE NOT NULL,
    otherDetails TEXT,
    totalCost DECIMAL(10, 2) NOT NULL,
    status ENUM('published', 'accepted', 'rejected', 'archived') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create book_listings table
CREATE TABLE book_listings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT,
    service VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    property_category VARCHAR(100),
    about_you TEXT,
    about_property TEXT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50),
    property_address VARCHAR(255),
    market_duration VARCHAR(100),
    appointment_date DATETIME,
    status ENUM('published', 'accepted', 'rejected', 'archived') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES PropertyDetails(property_details_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Create AdminUser table
CREATE TABLE AdminUser (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    role VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Insert sample data for existing tables
INSERT INTO PropertyDetails (category, PropertyNeed, title, subtitle, price, displayImage, serviceSummary, generalInfo, features, propertyAmenities, location, payment_options, status, service_details, service_type, size, bedRoom, parking, bathRoom, area, videoLinks, faq)
VALUES 
    ('Residential', 'Sale', 'Sample Property', 'Cozy Home', 250000.00, '/uploads/property.jpg', 'Beautiful home in the city', 'Spacious and modern', '["Pool", "Garage"]', '{}', '{"city": "New York"}', '["Cash", "Mortgage"]', 'published', 'Details here', 'Property', 2000, 3, 2, 2, 'Downtown', '[]', '[]');

INSERT INTO ServiceDetails (title, subtitle, display_image, serviceCategory, serviceLocation, area, listingType, serviceSummary, price, keyFeatures, whatsIncludedDetails, whatsIncluded, expectedOutcome, requestQuote, media, status, faq)
VALUES 
    ('Sample Service', 'Consulting Service', '/uploads/service.jpg', 'Consulting', 'New York', 'Downtown', 'Service', 'Expert consulting services', 100.00, '[]', 'Details here', '[]', '[]', TRUE, '["/uploads/service1.jpg"]', 'published', '[]');

INSERT INTO ResourceDetails (title, subtitle, total_minutes_read, overview, category, faq, status)
VALUES 
    ('Sample Blog', 'Educational Post', 10, 'Learn about real estate', 'Blog', '[]', 'published');

INSERT INTO Addons (title, subtitle, category, price, display_image, key_features_total, key_features_values, overview, general_info, why_choose, whats_included, status, faq)
VALUES 
    ('Sample Addon', 'Extra Feature', 'Feature', 50.00, '/uploads/addon.jpg', 2, '["Feature1", "Feature2"]', 'Additional feature overview', 'General info', 'Why choose this addon', '["Item1", "Item2"]', 'published', '[]');

INSERT INTO PropertyListings (title, subtitle, display_image, short_description, status, type, subcategory, property_details_id, service_details_id, resource_details_id, addons_id)
VALUES 
    ('Sample Property', 'A beautiful property', '/uploads/property.jpg', 'A cozy home', 'published', 'Property', 'Residential', 1, NULL, NULL, NULL),
    ('Sample Service', 'Professional service', '/uploads/service.jpg', 'Quality service', 'published', 'Service', 'Consulting', NULL, 1, NULL, NULL),
    ('Sample Resource', 'Informative blog', NULL, 'Educational content', 'published', 'Resource', 'Blog', NULL, NULL, 1, NULL),
    ('Sample Addon', 'Extra feature', '/uploads/addon.jpg', 'Additional service', 'published', 'Addons', 'Feature', NULL, NULL, NULL, 1);

INSERT INTO PropertyImages (propertyId, imageUrl)
VALUES 
    (1, '/uploads/property1.jpg'),
    (1, '/uploads/property2.jpg');

INSERT INTO PropertyFloorPlans (propertyId, filePath)
VALUES 
    (1, '/uploads/floorplan1.pdf');

INSERT INTO PropertyOwnership (propertyId, filePath)
VALUES 
    (1, '/uploads/ownership1.pdf');

INSERT INTO PropertyAmenities (propertyId, amenitiesData)
VALUES 
    (1, '{"amenity1": "Pool", "amenity2": "Gym"}');

INSERT INTO ResourceImages (resource_id, image_url, position)
VALUES 
    (1, '/uploads/resource1.jpg', 1);

INSERT INTO ResourceParagraphs (resource_id, paragraph, position)
VALUES 
    (1, 'This is a sample paragraph.', 1);

INSERT INTO AddonImages (addon_id, image_url)
VALUES 
    (1, '/uploads/addon1.jpg');

-- Insert sample data for new tables
INSERT INTO sales (property, add_ons, services, total)
VALUES 
    ('{"id": 1, "title": "Sample Property"}', '[{"id": 1, "name": "Addon1"}]', '[{"id": 1, "name": "Service1"}]', 300000.00);

INSERT INTO refunds (status)
VALUES 
    ('pending');

INSERT INTO properties (is_trusted, title, description)
VALUES 
    (TRUE, 'Trusted Property', 'A reliable property listing');

INSERT INTO partners (name, logo_url, description, email, phone_number, website_url, is_trusted, trusted_by)
VALUES 
    ('Sample Partner', '/uploads/partner_logo.jpg', 'Trusted partner description', 'partner@example.com', '1234567890', 'https://partner.com', TRUE, 'Admin');

INSERT INTO reviews (name, rating, comment, service, service_id, approved)
VALUES 
    ('John Doe', 5, 'Great service!', 'Consulting', 1, TRUE);

INSERT INTO subscriptions (email, subscribed)
VALUES 
    ('user@example.com', TRUE);

INSERT INTO resources (title, subtitle, description, category, image_url)
VALUES 
    ('Sample Resource', 'Resource Subtitle', 'Resource description', 'Guide', '/uploads/resource.jpg');

INSERT INTO enquiries (name, email, subject, message, service, service_id)
VALUES 
    ('Jane Doe', 'jane@example.com', 'Property Inquiry', 'Interested in property details', 'Property', 1);

INSERT INTO requests (name, email, date, message)
VALUES 
    ('John Smith', 'john@example.com', '2025-08-01', 'Request for viewing');

INSERT INTO viewRequests (name, email, date, message)
VALUES 
    ('Alice Brown', 'alice@example.com', '2025-08-02', 'Viewing request');

INSERT INTO tailorRequests (location, property_need, time_frame, name, email, whatsapp, about_need, about_you)
VALUES 
    ('New York', 'Sale', '3 months', 'Bob Wilson', 'bob@example.com', '1234567890', 'Need a home', 'First-time buyer');

INSERT INTO FeaturedListings (category, sub_category, topic, description)
VALUES 
    ('Featured', 'Trusted by Partners', 'Partner Trust', 'Description of trusted partners'),
    ('Featured', 'Terms: Privacy Policy Terms', 'Privacy Policy', 'Privacy policy details');

INSERT INTO jobs (title, description, location, salary)
VALUES 
    ('Real Estate Agent', 'Sell properties', 'New York', 60000.00);

INSERT INTO TeamMembers (name, position, profile_image_url, bio, email, phone_number, linkedin_url, is_active)
VALUES 
    ('Emma Davis', 'Manager', '/uploads/profile.jpg', 'Experienced manager', 'emma@example.com', '1234567890', 'https://linkedin.com/emma', TRUE);

INSERT INTO TalkToUs (name, email, message)
VALUES 
    ('Mike Johnson', 'mike@example.com', 'General inquiry');

INSERT INTO Feedback (name, email, recommendation_rating, experience_rating, new_features_suggestion, improvement_suggestions)
VALUES 
    ('Sarah Lee', 'sarah@example.com', 8, 7, 'Add mobile app', 'Improve response time');

INSERT INTO bookings (property_id, service, deal_name, viewing_slot, name, email, whatsapp, employment_status, proof_of_funds_url)
VALUES 
    (1, 'Property Viewing', 'Deal1', '2025-08-01 10:00:00', 'Tom Clark', 'tom@example.com', '1234567890', 'Employed', '/uploads/proof.pdf');

INSERT INTO book_appointments (property_id, service, location, property_category, about_you, about_property, name, email, whatsapp, property_address, status, appointment_date)
VALUES 
    (1, 'Consulting', 'New York', 'Residential', 'First-time buyer', '3-bedroom house', 'Lisa White', 'lisa@example.com', '1234567890', '123 Main St', 'published', '2025-08-01 14:00:00');

INSERT INTO booking_view (property_id, service, property_name, viewing_slot, name, employment_status, email, whatsapp, proof_of_funds_url, about, status)
VALUES 
    (1, 'Viewing', 'Sample Property', '2025-08-02 11:00:00', 'James Green', 'Self-employed', 'james@example.com', '1234567890', '/uploads/proof2.pdf', 'Interested in viewing', 'published');

INSERT INTO request_quote (property_id, service, name, email, whatsapp, location_name, project_need, project_details, project_documentation, status)
VALUES 
    (1, 'Renovation', 'Kate Brown', 'kate@example.com', '1234567890', 'Downtown', 'Kitchen remodel', 'Need new cabinets', '/uploads/docs.pdf', 'published');

INSERT INTO book_consult (property_id, service, location, consultancy_need, about_you, about_project, name, email, whatsapp, project_location, appointment_date, consultancy_plans, consultancy_mode, total_cost, status)
VALUES 
    (1, 'Consulting', 'New York', 'Investment advice', 'Investor', 'Commercial property', 'Mark Taylor', 'mark@example.com', '1234567890', 'Downtown', '2025-08-03 09:00:00', 'Long-term plan', 'Virtual', 500.00, 'published');

INSERT INTO book_deco (property_id, service, location, property_type, about_you, about_property, name, email, whatsapp, property_address, service_timing, appointment_date, status)
VALUES 
    (1, 'Decoration', 'New York', 'Apartment', 'Homeowner', '2-bedroom apartment', 'Anna Lee', 'anna@example.com', '1234567890', '456 Elm St', 'Morning', '2025-08-04 10:00:00', 'published');

INSERT INTO book_stay (property_name, costOfStay, addOns, costOfAddOns, numberOfGuests, numberOfKids, checkInDate, checkOutDate, otherDetails, totalCost, status)
VALUES 
    ('Beach Villa', 1000.00, '["WiFi", "Breakfast"]', 200.00, 4, 2, '2025-08-05', '2025-08-10', 'Family vacation', 1200.00, 'published');

INSERT INTO book_listings (property_id, service, location, property_category, about_you, about_property, name, email, whatsapp, property_address, market_duration, appointment_date, status)
VALUES 
    (1, 'Listing', 'New York', 'Residential', 'Seller', '4-bedroom house', 'Chris Adams', 'chris@example.com', '1234567890', '789 Oak St', '6 months', '2025-08-06 15:00:00', 'published');

INSERT INTO AdminUser (username, password, company, role)
VALUES 
    ('admin', '$2y$10$e8KB5jSiMEs1V82t7GGrPO/GESIiXYACPCzboMeX4jGhlm3BFGkoW', 'RealEstateCo', 'admin'),
    ('admin2', '$2y$10$e8KB5jSiMEs1V82t7GGrPO/GESIiXYACPCzboMeX4jGhlm3BFGkoW', 'RealEstateCo', 'admin');
    