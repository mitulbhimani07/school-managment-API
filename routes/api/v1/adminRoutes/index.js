const express = require('express');
const routes = express.Router();
const Adminctr = require('../../../../controller/api/v1/adminController/adminCtr')
const passport = require('passport')

//Admin Login
routes.post('/signin', Adminctr.signin)
//Admin Home
routes.get('/', Adminctr.home);
//Admin Register
routes.post('/insertData',  Adminctr.insertData);
//Admin Profile
routes.post('/adminprofile', passport.authenticate('jwt', { failureRedirect: '/api/adminFailLogin' }), Adminctr.adminprofile)

//Admin Update
routes.put('/update/:id', passport.authenticate('jwt', { failureRedirect: '/api/adminFailLogin' }), Adminctr.update)
//Find Update Data
routes.get('/FindUpdateData/:id', passport.authenticate('jwt', { failureRedirect: '/api/adminFailLogin' }), Adminctr.FindUpdateData)

//Change Password
routes.patch('/changePassword', passport.authenticate('jwt', { failureRedirect: '/api/adminFailLogin' }), Adminctr.ChangePassword)
//Forget Password
routes.post('/sendEmail', Adminctr.sendEmail)
routes.post('/forgetPassword',Adminctr.forgetPassword);
//Reset Password`
//Admin Logout
routes.get('/adminLogout', passport.authenticate('jwt', { failureRedirect: '/api/adminFailLogin' }), Adminctr.adminLogout);
//faculty Register
routes.post("/facultyRegister",passport.authenticate('jwt',{failureRedirect:'/api/adminFailLogin'}),Adminctr.facultyRegister);

//Admin Failed Login
routes.get('/adminFailLogin', (req, res) => {
    try {
        res.status(200).json({ msg: "Admin Failed Login.." });
    }
    catch (err) {
        res.status(400).json({ msg: "Something is wrong", error: err });
    }
});

module.exports = routes;