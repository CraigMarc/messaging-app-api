const express = require('express');
const router = express.Router();
const user_controller = require("../controllers/userController");

// send new message

router.post("/messages", user_controller.new_message);

// get user messages

router.get("/messages", user_controller.get_messages);



module.exports = router;
