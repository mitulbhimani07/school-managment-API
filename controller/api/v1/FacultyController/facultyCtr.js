const Faculty = require("../../../../model/facultyModel");
const Student = require("../../../../model/studentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

module.exports.facultyLogin=async(req,res)=>{
    try{
        let checkFacultyEmail=await Faculty.findOne({email:req.body.email});
        if(checkFacultyEmail){
            let checkPass=await bcrypt.compare(req.body.password,checkFacultyEmail.password);
            if(checkPass){
                checkFacultyEmail=checkFacultyEmail.toObject()
                delete checkFacultyEmail.password;
                let facultyToken= await jwt.sign({FacultyData:checkFacultyEmail},"Faculty",{expiresIn:"1d"});
                res.status(200).json({msg:"Faculty Login Successfully",facultyToken:facultyToken});
            }
            else{
                res.status(200).json({msg:"Invalid Password"});
            }
        }
        else{
            res.status(200).json({msg:"Invalid Email"});
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json({msg:"something is wrong",error:err});
    }
}
//faculty profile
module.exports.facultyProfile=async(req,res)=>{
    try{
        res.status(200).json({msg:"Profile Data",Data:req.user});
    }
    catch(err){
        res.status(400).json({msg:"something is wrong",error:err});
    }
}
// edit profile
module.exports.editFacultyProfile=async(req,res)=>{
    try{
        let editFaculty=await Faculty.findById(req.params.id);
        if(editFaculty){
            let updateFacultyProfile=await Faculty.findByIdAndUpdate(req.params.id,req.body);
            if(updateFacultyProfile){
                let updateProfile=await Faculty.findById(req.params.id);
                res.status(200).json({msg:"Faculty Updated successfully",updateProfile}); 
            }
            else{
                res.status(200).json({msg:"Faculty Not Updated"}); 
            }
        }
        else{
            res.status(200).json({msg:"Invalid email"});
        }
    }
    catch(err){

    }
}

//faculty Logout
module.exports.facultyLogout=async(req,res)=>{
    try{
        req.session.destroy((err)=>{
            if(err){
                res.status(200).json({msg:"something is wrong.."});
            }
            else{
                res.status(200).json({msg:"Faculty Logout successfully.."});
            }
        })
    }
    catch(err){
        res.status(400).json({msg:"something is wrong..",error:err});
    }
}
//student Registration
module.exports.studentRegister=async(req,res)=>{
    console.log(req.body);
    
    try{
        let existEmail=await Student.findOne({email:req.body.email});
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
                let addFaculty=await Student.create({email:req.body.email,password:bcryptGPass,userName:req.body.userName});
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