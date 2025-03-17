const express = require("express");
const refundController = require("../controllers/refundsController")

const router = express.Router();

// Routes

router.get('/', refundController.getAllRefunds);
router.put('/:id', refundController.updateRefundStatus);

module.exports = router;
