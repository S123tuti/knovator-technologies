const bcrypt = require("bcrypt");
const userModle = require("../models/userModel");
const jwt = require("jsonwebtoken");

const isValidType = (value) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return false;
  }
  return true;
};

const registerUser = async (req, res) => {
  try {
    let { fname, lname, email, password } = req.body;
   
    if(!isValidType(fname) &&!/^[a-z\s]+$/i.test(fname)&& !fname)
        return res.status(400).send({status:false,msg:"Please provide valid fname"})

    if (!isValidType(lname) && !/^[a-z\s]+$/i.test(lname)&& !lname)
        return res.status(400).send({ status: false, msg: "Please provide valid lname" });

    if(!isValidType(email)&&!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email) && !email)
          return res.status(400).send({ status: false, msg: "Please provide validEmail" });

     if (!isValidType(password)&&!/^(?!.\s)[A-Za-z\d@$#!%?&]{8,15}$/.test(password)&&!password )
         return res.status(400).send({ status: false, msg: "Please provide valid password" });

     password =  await bcrypt.hash(password, 10);

    const duplicateTitle = await userModle.findOne({ email });
    if (duplicateTitle)
        return res.status(400).send({ status: false, message: "Email Already Exist" });

    let user = await userModle.create({fname,lname,email,password});

    return res.status(201).send({status:false,msg:"Success",user})
  } 
  catch (err) 
  {
    return res.status(500).send({ status: false, msg: "Server error", error: err.message });
  }
};


const loginUser = async (req,res) => 
{
    try {
    const {email,password} = req.body;
       
    if(isValidType(email)&&!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))
          return res.status(400).send({ status: false, msg: "Please provide validEmail" });

     if (isValidType(password)&&!/^(?!.\s)[A-Za-z\d@$#!%?&]{8,15}$/.test(password) )
          return res.status(400).send({ status: false, msg: "Please provide valid password" });

    const user = await userModle.findOne({ email });
    if (!user)
        return res.status(400).send({ status: false, message: "User not Exist" });

    let actualPassword = await bcrypt.compare(password, user.password);
    if (!actualPassword)
      return res.status(401).send({ status: false, message: "Incorrect password" });
    const token = jwt.sign({ userId: user._id }, 'test', { expiresIn: '1h' });

    res.status(400).send({ status: true, token ,msg:"Userlogin successful"})
        
    } 
    catch (err)
    {
        return res.status(500).send({status:false,msg:"Server error", error:err.message})
    }

}


module.exports = { registerUser , loginUser};
