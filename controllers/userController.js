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

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }

}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
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
    
    let date = new Date()
    let time = date.getTime()


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
          time: time,
          read: false

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

    res.status(200).json({ message: "messages deleted" })
  } catch (error) {
    res.status(500).json({ message: error });
  }

});

//upload image

exports.post_pic = [

  // Handle single file upload with field name "image"
  upload.single("image"),


  async function (req, res, next) {

    try {

      //delete old pic

      let userPic = await User.findById(req.body.id);

      //delete pic file
      if (userPic.image != "image-1708024677240.png") {
        fs.unlink("./uploads/" + userPic.image, (err) => {
          if (err) {
            throw err;
          }

          console.log("Delete File successful.");
        });
      }


      await User.findByIdAndUpdate(req.body.id, { image: req.file.filename });
      let allUsers = await User.find().exec()
      res.status(200).json(allUsers)
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }


]

//delete pic

exports.delete_pic = asyncHandler(async (req, res, next) => {

  try {
    //find pic file
    let userPic = await User.findById(req.body.user_id);

    //delete pic file
    if (userPic.image) {
      fs.unlink("./uploads/" + userPic.image, (err) => {
        if (err) {
          throw err;
        }

        console.log("Delete File successful.");
      });
    }

    // update database

    await User.findByIdAndUpdate(req.body.user_id, { $unset: { image: "" } });
    let allUsers = await User.find().exec()
    res.status(200).json(allUsers)

  }
  catch (error) {
    res.status(500).json({ message: error });
  }


})

// delete user

exports.delete_user = asyncHandler(async (req, res, next) => {


  try {

    let userPic = await User.findById(req.body.id);

    //delete pic file
    if (userPic.image != "image-1708024677240.png") {
      fs.unlink("./uploads/" + userPic.image, (err) => {
        if (err) {
          throw err;
        }

        console.log("Delete File successful.");
      });
    }

    // delete all users messages

    await Message.deleteMany({ sentTo: req.body.id })
    await Message.deleteMany({ sentBy: req.body.id })



    await User.findOneAndDelete({ _id: req.body.id })

    let allUsers = await User.find().exec()
    res.status(200).json(allUsers)

  } catch (error) {
    res.status(500).json({ message: error });
  }

});


// delete message

exports.delete_message = asyncHandler(async (req, res, next) => {

  try {
    await Message.findOneAndDelete({ _id: req.body.id })

    let allPostsSent = await Message.find({ sentTo: req.body.userName }).populate('sentTo').populate('sentBy').exec()
    let allPostsBy = await Message.find({ sentBy: req.body.userName }).populate('sentBy').populate('sentTo').exec()
    res.status(200).json({ allPostsSent: allPostsSent, allPostsBy: allPostsBy })

  } catch (error) {
    res.status(500).json({ message: error });
  }

});
