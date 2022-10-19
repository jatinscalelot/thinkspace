let express = require("express");
let router = express.Router();
const mongoConnection = require('../../../utilities/connections');
const responseManager = require('../../../utilities/response.manager');
const usersModel = require('../../../models/users.model');
const helper = require('../../../utilities/helper');
const constants = require('../../../utilities/constants');
let mongoose = require('mongoose');
router.post('/', helper.authenticateToken, async (req, res) => {
    if (req.token.userid && mongoose.Types.ObjectId.isValid(req.token.userid)) {
        const { firstname, lastname, mobilenumber, email } = req.body;
        if(firstname && firstname.trim() != '' && lastname && lastname.trim() != '' && mobilenumber && mobilenumber.trim() != '' && email && email.trim() != ''){
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
                let primary = mongoConnection.useDb(constants.DEFAULT_DB);
                let checkForExistingemail = await primary.model(constants.MODELS.users, usersModel).findOne({ _id: { $ne : mongoose.Types.ObjectId(req.token.userid)}, email: email }).lean();
                let checkForExistingmobile = await primary.model(constants.MODELS.users, usersModel).findOne({ _id: { $ne : mongoose.Types.ObjectId(req.token.userid)}, mobilenumber: mobilenumber }).lean();
                if(checkForExistingemail == null){
                    if(checkForExistingmobile == null){
                        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
                        await primary.model(constants.MODELS.users, usersModel).findByIdAndUpdate(req.token.userid, { 
                            fullname : firstname + ' ' + lastname,
                            firstname : firstname,
                            lastname : lastname,
                            mobilenumber : mobilenumber,
                            email : email
                        });
                        return responseManager.onSuccess('Profile updated successfully!', 1, res);
                    }else{
                        return responseManager.badrequest({message : 'Mobile Number already exist, please try again'}, res);
                    }
                }else{
                    return responseManager.badrequest({message : 'Email-id already exist, please try again'}, res);
                }
            }else{
                return responseManager.badrequest({message : 'Invalid email-id to update, please try again'}, res);
            }
        }else{
            return responseManager.badrequest({message : 'Invalid data to update profile, please try again'}, res);
        }
    }else{
        return responseManager.badrequest({message : 'Invalid data to update profile, please try again'}, res);
    }
});
router.get('/',  helper.authenticateToken, async (req, res) => {
    if (req.token.userid && mongoose.Types.ObjectId.isValid(req.token.userid)) {
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        let profile = await primary.model(constants.MODELS.users, usersModel).findById(req.token.userid).lean();
        return responseManager.onSuccess('your profile data!', profile, res);
    }else{
        return responseManager.badrequest({message : 'Invalid data to get profile, please try again'}, res);
    }
});
module.exports = router;