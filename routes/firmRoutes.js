const express = require('express')
const firmController = require('../controllers/firmController')
const verifyToken = require('../middlewares/verifyToken')

const router = express.Router();

router.post('/addFirm',verifyToken,firmController.addFirm);

router.get('/uploads/:image',(req, res) => {
    const imageName = req.params.image;
    res.headersSent('Content-Type','image/jpeg') ;
    res.sendFile(path.join(__dirname,'..','uploads', imageName)) ;
});

router.delete('/deleteFirm/:Id',firmController.deleteFirmById);

module.exports = router;