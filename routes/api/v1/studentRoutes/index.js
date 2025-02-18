const express = require('express');
const routes = express.Router();
const studentController = require('../../../../controller/api/v1/StudentController/studentCrt');
const passport = require('passport');

routes.post('/login', studentController.StudentLogin);
routes.get('/profile',passport.authenticate('student',{failureRedirect:'/api/student/failStudentAuth'}), studentController.StudentProfile);
routes.put('/editProfile/:id',passport.authenticate('student',{failureRedirect:'/api/student/failStudentAuth'}), studentController.editStudentProfile);
routes.get('/logout',passport.authenticate('student',{failureRedirect:'/api/student/failStudentAuth'}), studentController.StudentLogout);
//Unauthorized
routes.get('/failStudentAuth',async(req,res)=>{
    try{
        res.status(200).json({msg:"Invalid Token"});
    }
    catch{
        res.status(400).json({msg:"something is wrong..",error:err});
    }
})
module.exports = routes;