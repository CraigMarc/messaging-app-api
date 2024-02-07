const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const Message = require("../models/message");
const multer = require("multer"); // For uploading images
const fs = require('fs');

// configure multer for pic uploads

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      let extArray = file.mimetype.split("/");
      let extension = extArray[extArray.length - 1];
      cb(null, file.fieldname + '-' + Date.now() + '.' + extension)
    }
  })
  
  // only allow jpeg and png files
  
  const fileFilter=(req, file, cb)=>{
    if(file.mimetype ==='image/jpeg' || file.mimetype ==='image/jpg' || file.mimetype ==='image/png'){
        cb(null,true);
    }else{
        cb(null, false);
    }
  
   }
  
   const upload = multer({ 
    storage:storage,
    fileFilter:fileFilter
  });
  
  

// get user messages

exports.get_messages = asyncHandler(async (req, res, next) => {

    try {
        let allPostsSent = await Message.find({ sentTo: req.body.userName }).populate('sentTo').populate('sentBy').exec()
        let allPostsBy = await Message.find({ sentBy: req.body.userName }).populate('sentBy').populate('sentTo').exec()
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
            const userNameExists = await User.findOne({ _id: req.body.sentTo }).exec();
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
                let allPostsSent = await Message.find({ sentTo: req.body.sentBy }).populate('sentTo').populate('sentBy').exec()
                let allPostsBy = await Message.find({ sentBy: req.body.sentBy }).populate('sentBy').populate('sentTo').exec()
                res.status(200).json({ allPostsSent: allPostsSent, allPostsBy: allPostsBy })
                
            }

        }
    })
];

// delete all messages

exports.delete_messages = asyncHandler(async (req, res, next) => {

    try {
      await Message.deleteMany()

        res.status(200).json({message:"messages deleted"})
    } catch (error) {
        res.status(500).json({ message: error });
    }

});

//upload image

exports.post_pic = [

    // Handle single file upload with field name "image"
    upload.single("image"),
  
  
    async function (req, res, next) {
  
  console.log(req.body.id)
      //let picPost = await Posts.findById(req.params.postId);
  
  /*
      const post = new Posts({
        title: picPost.title,
        text: picPost.text,
        published: false,
        _id: req.params.postId,
        image: req.file.filename
      });*/
  
      try {
        await User.findByIdAndUpdate(req.body.id, {image: req.file.filename});
        let allUsers = await User.find().exec()
        res.status(200).json(allUsers)
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }
  
  
  ]


