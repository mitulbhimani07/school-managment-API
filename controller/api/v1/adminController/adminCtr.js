
const signin = require('../../../../model/adminModel')
const Faculty=require('../../../../model/facultyModel');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

module.exports.home = async (req,res)=>{
    try{
        let getuser = await signin.find()
        return  res.status(200).json({msg:"User Page",data:getuser});
    }
    catch(err){
        console.log(err);
        return  res.status(200).json({msg:"somthing woas wrong !"});
    }
}
module.exports.insertData = async (req,res)=>{
    console.log(req.body);
    
    try{
        let chekuser = await signin.find({email:req.body.email}).countDocuments()
        if (chekuser==0) {
           if (req.body.password == req.body.confomPassword) {
                req.body.password =  await bcrypt.hash(req.body.password,10)
                console.log(req.body.password);
                let signUp = await signin.create(req.body)
                if (signUp) {

                    return  res.status(200).json({msg:"sign up DATA added successfuly"});
                        
                } else {
                        
                    return  res.status(200).json({msg:"Plaees tray again"});
                    
                }
           }
           else{

               return  res.status(200).json({msg:"password and confomPassword not match"});
           }
        }else{
            return  res.status(200).json({msg:"email is alredy axsit"});

        }

    }
    catch(err){
        return  res.status(400).json({msg:"somthing woas wrong !",err:err});

    }
}
module.exports.signin = async (req,res)=>{
    try{
        let getuser = await signin.findOne({email:req.body.email})
        if (getuser) {
            let chekPassword = await bcrypt.compare(req.body.password,getuser.password);
            if (chekPassword) {
                let token = await jwt.sign({userData : getuser},'ADMIN')
                return  res.status(400).json({msg:"signin successfuly",data:token});

            } else {
                return  res.status(400).json({msg:"invalid password !",err:err});

            }
        }
        else{

            return  res.status(200).json({msg:"email not found"});
        }

    }
    catch(err){
        return  res.status(400).json({msg:"somthing woas wrong !",err:err});

    }
}
module.exports.logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Get token from headers
        if (!token) {
            return res.status(401).json({ msg: "No token provided" });
        }

        await signin.create({ token }); // Store token in the blacklist

        return res.status(200).json({ msg: "Logout successful" });
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong!", err: err });
    }
};
module.exports.adminprofile = async (req,res) =>{
    try{
        console.log(req.body);
        let ProfileAdmin = await signin.create(req.body)
        if (ProfileAdmin) {

            return  res.status(200).json({msg:"Profile added successfuly"});
                
        } else {
                
            return  res.status(200).json({msg:"Plaees tray again"});
            
        }
    }catch(err){
        return  res.status(400).json({msg:"somthing woas wrong !",err:err});

    }
}
module.exports.FindUpdateData = async (req,res)=>{
    try{
        let findupdate = await signin.findById(req.params.id);
        return  res.status(200).json({msg:"Updated Page",data:findupdate});
    }
    catch(err){
        console.log(err);
        return  res.status(200).json({msg:"somthing woas wrong !"});
    }
}
module.exports.update = async (req,res) =>{
    console.log(req.params.id);
    
    try{
        let FindUpdateId = await signin.findById(req.params.id)
        if (FindUpdateId) {
            let UpdateData = await signin.findByIdAndUpdate(FindUpdateId._id , req.body)
            if (UpdateData) {
                return  res.status(200).json({msg:"Update successfuly"});

            }
            else{

                return  res.status(400).json({msg:" !",err:err});
            }
        }
        else{
            return  res.status(400).json({msg:"somthing woas wrong !",err:err});

        }
    }catch(err){
        return  res.status(400).json({msg:"somthing woas wrong !",err:err});

    }
}
module.exports.ChangePassword = async (req, res) => {
    try {      
        let AdminData = await signin.findById(req.user._id)
        console.log(AdminData);
        if (AdminData) {
            let checkPassword = await bcrypt.compare(req.body.currentpassword, AdminData.password)
            if (checkPassword) {
                if (req.body.currentpassword != req.body.newPassword) {
                    if (req.body.newPassword == req.body.confirmPassword) {
                        req.body.newPassword = bcrypt.hash(req.body.confirmPassword, 10)
                        let newData = await signin.findByIdAndUpdate(req.user._id, req.body)
                        if (newData) {
                            let data = await signin.findById(req.user._id)
                            return res.status(200).json({ mes: "password change success", Data: data })
                        } else {
                            return res.status(200).json({ mes: "password change faild" })
                        }
                    } else {
                        return res.status(200).json({ mes: "new password and confirm password is not same" })
                    }
                } else {
                    return res.status(200).json({ mes: "new password and current password is same" })
                }
            } else {
                return res.status(200).json({ mes: "your current password is wrong" })
            }
        } else {
            return res.status(200).json({ mes: "Record Not Found" })
        }
    } catch (err) {
        return res.status(400).json({ mes: "Somthing Wrong" })
    }
}
module.exports.sendEmail = async (req, res) => {
    console.log(req.body);
  
    try {
      // 1. Check if user exists
      let isAdmin = await signin.findOne({ email: req.body.email });
      if (!isAdmin) {
        return res.status(400).json({ mes: "Invalid email" });
      }
  
      // 2. Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
      // 3. Store OTP and expiry in the database (valid for 15 minutes here)
      isAdmin.otp = otp;
      isAdmin.otpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes from now
      await isAdmin.save();
  
      // 4. Create the transporter
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "mitulbhimani281@gmail.com",  // your email
          pass: "uugochxrfxrylbjw",           // your app password
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
  
      // 5. Send the OTP via email
      const info = await transporter.sendMail({
        from: `${req.body.email}`, // or your email
        to: "mitulbhimani281@gmail.com",   // or req.body.email to send OTP to the user
        subject: "Password Reset OTP",
        text: `Your OTP is: ${otp}`,       // plain text body
        html: `
            <h3>Password Reset Request</h3>
            <p>Your OTP is: <b>${otp}</b></p>
            <p>This OTP will expire in 15 minutes.</p>
            <p>Please click the link below to proceed with your password reset:</p>
            <p><a href="http://localhost:8005/api/forgetPassword">Reset Password</a></p>
            <p>If you did not request a password reset, please ignore this email.</p>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            `
        ,
      });
  
      return res.status(200).json({ mes: "Password reset OTP sent to your email." });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ mes: "Something went wrong" });
    }
};
module.exports.forgetPassword=async(req,res)=>{
    console.log(req.body);
    
    try{
        let checkEmail=await signin.findOne({email:req.query.email});
        if(checkEmail){
            if(req.body.newPass==req.body.confirmPass){
                req.body.password=await bcrypt.hash(req.body.newPass,10);
                let updatePassword=await signin.findByIdAndUpdate(checkEmail._id,req.body);
                if(updatePassword){
                    res.status(200).json({msg:"password updated successfully",data:updatePassword});
                }
                else{
                    res.status(200).json({msg:"Password not updated"});
                }
            }
            else{
                res.status(200).json({msg:"new Password and confirm password not matched"});
            }
        }else{
            res.status(200).json({msg:"Invalid Email"});
        }
    }
    catch(err){
        res.status(400).json({msg:"something is wrong..",error:err});
    }
}
module.exports.adminLogout=async(req,res)=>{
    try{
        req.session.destroy((err)=>{
            if(err){
                res.status(200).json({msg:"something is wrong.."});
            }
            else{
                res.status(200).json({msg:"Admin Logout successfully.."});
            }
        })
    }
    catch(err){
        res.status(400).json({msg:"something is wrong..",error:err});
    }
}
//faculty Registration
module.exports.facultyRegister=async(req,res)=>{
    try{
        let existEmail=await Faculty.findOne({email:req.body.email});
        if(!existEmail){
            var gPass=generatePassword();
            var link="http://localhost:9000/api";
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                  user: "mitulbhimani281@gmail.com",
                  pass: "uugochxrfxrylbjw",
                },
                tls:{
                    rejectUnauthorized:false
                }
            });

            const info = await transporter.sendMail({
                from: 'mitulbhimani281@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: "Faculty Verification", // Subject line
                text: "Faculty Login", // plain text body
                html: `<h1>Faculty Verification</h1><p>email:${req.body.email}</p><p>password:${gPass}</p><p>To Get Login Click here:${link}</p>`, // html body
            });
            
            if(info){
                let bcryptGPass=await bcrypt.hash(gPass,10);
                let addFaculty=await Faculty.create({email:req.body.email,password:bcryptGPass,userName:req.body.userName});
                if(addFaculty){
                    res.status(200).json({msg:"Faculty add successfully",data:addFaculty});
                }else{
                    res.status(200).json({msg:"Faculty not add"});
                }
            }else{
                res.status(200).json({msg:"Mail not Sent"});
            }
        }
        else{
            res.status(200).json({msg:"Invalid Email"});
        }
    }
    catch(err){
        res.status(400).json({msg:"something is wrong..",error:err});
    }
}
//password generator
function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}