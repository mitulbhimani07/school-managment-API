const Faculty = require("../../../../model/facultyModel");
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