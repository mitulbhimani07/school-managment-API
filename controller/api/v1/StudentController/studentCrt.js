const Student = require("../../../../model/studentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

module.exports.StudentLogin=async(req,res)=>{
    try{
        let checkStudentEmail=await Student.findOne({email:req.body.email});
        if(checkStudentEmail){
            let checkPass=await bcrypt.compare(req.body.password,checkStudentEmail.password);
            if(checkPass){
                checkStudentEmail=checkStudentEmail.toObject()
                delete checkStudentEmail.password;
                let StudentToken= await jwt.sign({StudentData:checkStudentEmail},"Student",{expiresIn:"1d"});
                res.status(200).json({msg:"Student Login Successfully",StudentToken:StudentToken});
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
//Student profile
module.exports.StudentProfile=async(req,res)=>{
    try{
        res.status(200).json({msg:"Profile Data",Data:req.user});
    }
    catch(err){
        res.status(400).json({msg:"something is wrong",error:err});
    }
}
// edit profile
module.exports.editStudentProfile=async(req,res)=>{
    try{
        let editStudent=await Student.findById(req.params.id);
        if(editStudent){
            let updateStudentProfile=await Student.findByIdAndUpdate(req.params.id,req.body);
            if(updateStudentProfile){
                let updateProfile=await Student.findById(req.params.id);
                res.status(200).json({msg:"Student Updated successfully",updateProfile}); 
            }
            else{
                res.status(200).json({msg:"Student Not Updated"}); 
            }
        }
        else{
            res.status(200).json({msg:"Invalid email"});
        }
    }
    catch(err){

    }
}

//Student Logout
module.exports.StudentLogout=async(req,res)=>{
    try{
        req.session.destroy((err)=>{
            if(err){
                res.status(200).json({msg:"something is wrong.."});
            }
            else{
                res.status(200).json({msg:"Student Logout successfully.."});
            }
        })
    }
    catch(err){
        res.status(400).json({msg:"something is wrong..",error:err});
    }
}
