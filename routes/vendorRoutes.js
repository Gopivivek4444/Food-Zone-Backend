const vendorController = require('../controllers/vendorController')
const express = require('express')

const router = express.Router();

router.post('/register',vendorController.vendorRegister);
router.post('/login',vendorController.vendorLogin);
router.get('/allVendors',vendorController.getAllVendors);
router.get('/singleVendor/:id',vendorController.getVendorById);
router.get('/vendorFirms/:id',vendorController.getFirmsByVendorId);
module.exports = router;