//const Comments = require("../models/comments");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require("../models/user");
const bcrypt = require('bcryptjs')

// sign up route

exports.sign_up = asyncHandler(async (req, res, next) => {

    //check for dupliicate usernames ************************
    // check if passwords match *******************
    
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        // if err, do something
        if (err) {
            res.json({message: 'cannot encrypt'})
            return console.log('Cannot encrypt');
        }
        // otherwise, store hashedPassword in DB
        const userDetail = new User({

            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            password: hashedPassword
        })
        const user = new User(userDetail);
        await user.save()
        res.json({message: "user saved"})
    })

})

// log in route

exports.log_in = asyncHandler(async (req, res, next) => {
    //exports.log_in = (req, res) => {
    let { email, password } = req.body;
    try {
        let userDb = await User.find({ 'userName': email }).exec()

        const match = await bcrypt.compare(password, userDb[0].password);

       // if (userDb[0].userName === email) { ****** check blog dont think need this
            if (match == true) {
               
                const opts = {}
                opts.expiresIn = 1200;  //token expires in 2min
                const secret = process.env.SECRET_KEY
                const token = jwt.sign({ email }, secret, opts);
                return res.status(200).json({
                    message: "Auth Passed",
                    token
                })
            }
       // }

    } catch (error) {
        res.status(500).json({ message: "wrong username or password" });
    }

    return res.status(401).json({ message: "Auth Failed" })
})

