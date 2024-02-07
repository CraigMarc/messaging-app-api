const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const Message = require("../models/message");

// get user messages



exports.get_messages = asyncHandler(async (req, res, next) => {

    try {
        let allPostsSent = await Message.find({ sentTo: req.body.userName }).exec()
        let allPostsBy = await Message.find({ sentBy: req.body.userName }).exec()
        res.status(200).json({ allPostsSent: allPostsSent, allPostsBy: allPostsBy })
    } catch (error) {
        res.status(500).json({ message: error });
    }

});

// get users

exports.get_users = asyncHandler(async (req, res, next) => {

    try {
        let allUsers = await User.find().exec()

        res.status(200).json(allUsers)
    } catch (error) {
        res.status(500).json({ message: error });
    }

});


// send new message

exports.new_message = [
    // Validate and sanitize the name field.

    body("sentBy")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("sentBy name must be specified."),
    body("sentTo")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("sentTo must be specified."),
    body("text")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Text must be specified."),



    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);



        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.

            res.json({ errors: errors.array() })
            return;
        }

        else {
            // Data from form is valid.
            // Check if Username already exists.
            const userNameExists = await User.findOne({ userName: req.body.sentTo }).exec();
            if (!userNameExists) {
                // UserName exists, redirect to its detail page.

                res.json({ errors: "user name does not exist" })
            } else {


                // otherwise, store hashedPassword in DB
                const messageDetail = new Message({

                    sentBy: req.body.sentBy,
                    sentTo: req.body.sentTo,
                    text: req.body.text,

                })
                const user = new Message(messageDetail);
                await user.save()
                let allPostsSent = await Message.find({ sentTo: req.body.sentBy }).exec()
                let allPostsBy = await Message.find({ sentBy: req.body.sentBy }).exec()
                res.status(200).json({ allPostsSent: allPostsSent, allPostsBy: allPostsBy })
                
            }

        }
    })
];


