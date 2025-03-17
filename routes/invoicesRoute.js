const express = require("express");
const invoiceController = require("../controllers/invoicesController")

const router = express.Router();

// Routes

router.get('/', invoiceController.getAllInvoices);
router.post('/', invoiceController.createInvoices);
router.put('/:id', invoiceController.updateInvoices);
router.delete('/:id', invoiceController.deleteInvoices);

router.get('/', refundController.getAllRefunds);
router.put('/:id', refundController.updateRefundStatus);

module.exports = router;
