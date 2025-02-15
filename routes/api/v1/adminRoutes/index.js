const express = require('express');
const routes = express.Router();
const Adminctr = require('../../../../controller/api/v1/adminController/adminCtr')
const passport = require('passport')

routes.get('/', Adminctr.home);
routes.post('/signin', Adminctr.signin)
routes.post('/inserData', passport.authenticate('jwt', { failureRedirect: '/unauthor' }),Adminctr.singleSignUp);
routes.get('/statusData',passport.authenticate('jwt', { failureRedirect: '/unauthor' }),Adminctr.singledata)
routes.post('/adminprofile',passport.authenticate('jwt', { failureRedirect: '/unauthor' }),Adminctr.adminprofile)
routes.put('/update/:id',passport.authenticate('jwt', { failureRedirect: '/unauthor' }),Adminctr.update)
routes.get('/FindUpdateData/:id',Adminctr.FindUpdateData)
routes.patch('/changePassword' ,passport.authenticate('jwt', { failureRedirect: '/unauthor' }) ,  Adminctr.ChangePassword)
routes.post('/forgetpassword', Adminctr.forgetPassword)
routes.get('/unauthor', (req, res) => {
    try {
        return res.status(200).json({ msg: "your authorized" });
    } catch (err) {
        return res.status(200).json({ 
            msg: "Profile added successfully",
            error: "An error occurred while adding the profile"
        });
    }
});

module.exports = routes;