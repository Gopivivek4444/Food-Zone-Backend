const express = require('express')
const productController = require('../controllers/productController')

const router = express.Router();

router.post('/addProduct/:Id',productController.addProduct)
router.get('/:Id/products',productController.getProductsByFirmId)

router.get('/uploads/:image',(req, res) => {
    const imageName = req.params.image;
    res.headersSent('Content-Type','image/jpeg') ;
    res.sendFile(path.join(__dirname,'..','uploads', imageName)) ;
});

router.delete('/deleteProduct/:Id',productController.deleteProductById);

module.exports = router;