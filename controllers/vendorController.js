const Vendor = require('../models/Vendor')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dotEnv = require('dotenv')

dotEnv.config();

const secretKey = process.env.WhatIsYourName

const vendorRegister = async(req,res) => {

    const {username,email,password} = req.body;

    try{

        vendorEmail = await Vendor.findOne({email});
        if(vendorEmail){
            return res.status(400).json("Email already taken");
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        });

        await newVendor.save();
        res.status(201).json({message: "Vendor registered successfully"});

        console.log("registered");
    }
    catch(error){
        console.error(error);
        res.status(500).json({error:"Internal server error"});
    }
}

const vendorLogin = async(req, res) =>{

    const {email, password} = req.body;

    try{

    const vendor = await Vendor.findOne({email});

    if(!vendor || !(await bcrypt.compare(password,vendor.password)))
    {
       return res.status(401).json({error: "Invalid username or Password"});
    }

    const token = jwt.sign({vendorId: vendor._id}, secretKey, {expiresIn:"1h"})

    res.status(200).json({message:"Login Successfull", token})
    console.log(email,"This is Token : ",token);

    }catch(error){
        console.log(error)
        res.status(500).json({error:"Internal server Error"})
    }


}

const getAllVendors = async(req, res) =>{
    try {
        const vendors = await Vendor.find().populate('firm');
        res.json({vendors});
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal server Error"})
    }
}

const getVendorById = async(req, res) =>{
    const vendorId = req.params.id;
    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if(!vendor){
            return res.status(404).json({error:"Vendor Not Found!"});
        }
        return res.status(200).json({vendor});
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal server Error"})
    }
}

const getFirmsByVendorId = async (req, res) => {
    const vendorId = req.params.id;
    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if (!vendor) {
            return res.status(404).json({ error: "Vendor Not Found!" });
        }

        // Extract firm IDs and firmNames
        const vendorFirms = vendor.firm.map(firm => ({
            _id: firm._id,
            firmName: firm.firmName
        }));

        return res.status(200).json({ vendorFirms });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server Error" });
    }
};


module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById, getFirmsByVendorId }