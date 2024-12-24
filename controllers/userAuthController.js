const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register User
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if(userExists){
      return res.status(400).json({ message: 'User already exists' });
      
    }
     const hashedPassword = await bcrypt.hash(password,10);
     const newUser = new User({
      username,
      email,
      password: hashedPassword
     }); 

     await newUser.save();
     res.status(201).json({message:"User Registered Successfully"});
     console.log("registered");

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error', error });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if(!user || await bcrypt.compare(password, user.password)){
      return res.status(401).json({message: "Invalid username or Password"});
    }
    const token = generateToken(user._id);
    res.status(200).json({message:"Login Successfull", token})
    console.log(email,"This is Token : ",token);

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server Error', error });
  }
};
