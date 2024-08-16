const user = require("../models/userModel");

const bcryptjs = require('bcryptjs');

const config = require("../config/config");

const jwt = require("jsonwebtoken");
const path = require("path");




const securePassword = async (password) => {
    try {
        const passwordHash = await bcryptjs.hash(password, 10);
        return passwordHash;
    }
    catch (error) {

        res.status(400).send(error.message);

    }
}

const register_user = async (req, res) => {


    try {

        const spassword = await securePassword(req.body.password);


        const users = new user({
            name: req.body.name,
            email: req.body.email,
            password: spassword,

        });


        const useremail = await user.findOne({ email: req.body.email });


        if (useremail) {

            res.status(200).send({ success: false, msg: "This email is already exist" });

        }

        else {
            const user_data = await users.save();
            res.status(200).send({ success: true, data: user_data });
        }

    }

    catch (error) {


        res.status(400).send(error.message);
    }
}




const create_token = async (id) => {

    try {


        const token = await jwt.sign({ _id: id }, config.secret_jwt);
        return token;

    }
    catch (error) {
        res.status(400).send(error.message);
    }
}



//login Method

const user_login = async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        if (email) {
            const userData = await user.findOne({ email: email });


            if (userData) {

                const passwordmatch = await bcryptjs.compare(password, userData.password);

                if (passwordmatch) {

                    const tokenData = await create_token(userData._id);


                    const userResult = {
                        _id: userData._id,
                        name: userData.name,
                        email: userData.email,
                        password: userData.password,
                        token: tokenData

                    }

                    const response = {
                        success: true,
                        msg: "User Details",
                        data: userResult

                    }

                    res.status(200).send(response);

                }
                else {
                    res.status(200).send({ success: false, msg: "login details are incorrect" });
                }

            }
            else {
                res.status(200).send({ success: false, msg: "login details are incorrect" });
            }
        }

    }
    catch (error) {
        res.status(400).send(error.message);
    }
}




const getalluserdata = async (req, res) => {
    try {
        const userdata = await user.find();
        res.status(200).send({ success: true, data: userdata });
    } catch (error) {
        res.status(200).send({ success: true, msg: error.message });
    }
}




const getuserbyid = async (req, res) => {
    try {
        const id = req.params.id;
        const validuser = await user.findById(id);
        if (validuser) {
            // console.log(validuser);
            res.status(200).send({ success: true, data: validuser });
        }
        else {
            res.status(200).send({ success: true, msg: 'invalid user id' });
        }
    } catch (error) {
        res.status(400).send({ success: false, data: error.message });
    }
}




const getuserbytoken = async (req, res) => {
    try {
        const id = req.user._id;
        // console.log(id);
        const validuser = await user.findById(id);
        if (validuser) {
            // console.log(validuser);
            res.status(200).send({ success: true, data: validuser });
        }
        else {
            res.status(200).send({ success: true, msg: 'invalid user id' });
        }
    } catch (error) {
        res.status(400).send({ success: false, data: error.message });
    }
}

module.exports = {
    register_user,
    user_login,
    getalluserdata,
    getuserbyid,
    getuserbytoken

}