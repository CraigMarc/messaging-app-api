const express = require('express');
const router = express.Router();
const user_controller = require("../controllers/userController");

// send new message

router.post("/messages", user_controller.new_message);

// get user messages

router.post("/allmessages", user_controller.get_messages);

// get users

router.get("/users", user_controller.get_users);

// delete messages


router.delete("/messages", user_controller.delete_messages);

// add picture

router.post("/image", user_controller.post_pic);


module.exports = router;
