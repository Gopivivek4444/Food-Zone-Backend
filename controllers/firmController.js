const Vendor = require('../models/Vendor')
const Firm = require('../models/Firm')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Folder where images will be saved
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
  
  // Configure multer to use the storage configuration
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png|gif/;
      const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimeType = fileTypes.test(file.mimetype);
  
      if (extName && mimeType) {
        return cb(null, true);
      } else {
        cb(new Error('Only images are allowed!'));
      }
    }
  });

const addFirm = async(req, res) =>{
    try {
        const {firmName, area, category,  region,  offer} = req.body;

        const image = req.file? req.file.filename:undefined;

        const vendor = await Vendor.findById(req.vendorId)
        if(!vendor){
            return res.status(404).json({message:"Vendor not found"});
        }

        const firm = new Firm({
            firmName, area, category,  region,  offer, image, vendor: vendor._id
        })

        const savedFirm = await firm.save();
        const firmID = savedFirm._id;
        vendor.firm.push(savedFirm);
        await vendor.save();

        return res.status(200).json({message:"Firm added successfully",firmID})

    } catch (error) {
        console.error(error)
        return res.status(500).json("Internal server error")
    }
}

const deleteFirmById = async(req, res) =>{
  try {

    const firmId = req.params.Id;
    const deletedProduct = Firm.findByIdAndDelete(firmId);
    if(!deletedProduct){
      return res.status(404).json({error:"Firm Not Found"});
    }
    return res.status(200).json({message:"Firm Deleted Successfully"});
  } catch (error) {
        console.error(error)
        return res.status(500).json("Internal server error")
  }
}

module.exports = {addFirm: [upload.single('image'),addFirm],deleteFirmById}