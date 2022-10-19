let express = require("express");
let router = express.Router();
const mongoConnection = require('../../../utilities/connections');
const responseManager = require('../../../utilities/response.manager');
const usersModel = require('../../../models/users.model');
const helper = require('../../../utilities/helper');
const constants = require('../../../utilities/constants');
let mongoose = require('mongoose');
router.post('/', async (req, res) => {
    const { email, password } = req.body;
    if(email && email.trim() != '' && password && password.trim() != ''){
        if(password.trim().length > 5){
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
                let primary = mongoConnection.useDb(constants.DEFAULT_DB);
                let checkForExisting = await primary.model(constants.MODELS.users, usersModel).findOne({ email: email, password: password }).lean();
                if(checkForExisting){
                    let accessToken = await helper.generateAccessToken({ userid : checkForExisting._id.toString() });
                    return responseManager.onSuccess('user login successfully!', {token : accessToken}, res);
                }else{
                    return responseManager.badrequest({message : 'Invalid username or password, please try again'}, res);
                } 
            }else{
                return responseManager.badrequest({message : 'Invalid email-id to login, please try again'}, res);
            }
        }else{
            return responseManager.badrequest({message : 'Password must be >= 6 chars, please try again'}, res);
        }
    }else{
        return responseManager.badrequest({message : 'Invalid data to login, please try again'}, res);
    }
});
module.exports = router;