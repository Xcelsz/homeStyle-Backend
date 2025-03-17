const express = require("express");
const salesController = require("../controllers/salesController")

const router = express.Router();

// Routes

router.get('/', salesController.getAllSales);
router.put('/:id', salesController.updateSales);

module.exports = router;
