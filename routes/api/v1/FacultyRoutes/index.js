const express = require('express');
const routes = express.Router();
const Facultyctr = require('../../../../controller/api/v1//FacultyController/facultyCtr')
const passport = require('passport')

//Faculty Login
routes.post('/facultyLogin', Facultyctr.facultyLogin)
//Faculty Profile
routes.get('/facultyProfile',passport.authenticate('faculty',{failureRedirect:'/api/faculty/failFacultyAuth'}),Facultyctr.facultyProfile);
//faculty profile edit
routes.put('/editFacultyProfile/:id',passport.authenticate('faculty',{failureRedirect:'/api/faculty/failFacultyAuth'}),Facultyctr.editFacultyProfile);
//faculty logout
routes.get('/facultyLogout',passport.authenticate('faculty',{failureRedirect:'/api/faculty/failFacultyAuth'}),Facultyctr.facultyLogout);
//Unauthorized
routes.get('/failFacultyAuth',async(req,res)=>{
    try{
        res.status(200).json({msg:"Invalid Token"});
    }
    catch{
        res.status(400).json({msg:"something is wrong..",error:err});
    }
})
module.exports = routes;