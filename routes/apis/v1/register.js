let express = require("express");
let router = express.Router();
const mongoConnection = require('../../../utilities/connections');
const responseManager = require('../../../utilities/response.manager');
const usersModel = require('../../../models/users.model');
const constants = require('../../../utilities/constants');
let mongoose = require('mongoose');
router.post('/', async (req, res) => {
    const { fullname, email, password } = req.body;
    if(fullname && fullname.trim() != ''  && email && email.trim() != '' && password && password.trim() != ''){
        if(password.trim().length > 5){
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
                let primary = mongoConnection.useDb(constants.DEFAULT_DB);
                let checkForExisting = await primary.model(constants.MODELS.users, usersModel).findOne({ email: email }).lean();
                if(checkForExisting == null){
                    await primary.model(constants.MODELS.users, usersModel).create({ 
                        fullname : fullname,
                        firstname : '',
                        lastname : '',
                        mobilenumber : '',
                        email : email,
                        password : password
                    });
                    return responseManager.onSuccess('Profile registration successfully done, Now you can login with your email and password!', 1, res);
                }else{
                    return responseManager.badrequest({message : 'Email-id already exist, please try again'}, res);
                } 
            }else{
                return responseManager.badrequest({message : 'Invalid email-id to register, please try again'}, res);
            }
        }else{
            return responseManager.badrequest({message : 'Password must be >= 6 chars, please try again'}, res);
        }
    }else{
        return responseManager.badrequest({message : 'Invalid data to register, please try again'}, res);
    }
});
module.exports = router;