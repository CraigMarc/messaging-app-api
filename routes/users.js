const express = require('express');
const router = express.Router();
const user_controller = require("../controllers/userController");

/* GET users listing. */
/*
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/

// get user messages

router.get("/messages", user_controller.get_messages);



module.exports = router;
