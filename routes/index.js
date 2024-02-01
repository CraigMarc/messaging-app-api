/*
var express = require('express');
var router = express.Router();

//GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
*/
const express = require("express");
const router = express.Router();

// Require controller modules.
//const nonUser_controller = require("../controllers/nonUserController");
const auth_controller = require("../controllers/authController");

/// NonUser ROUTES ///

//sign up

router.post("/signup/", auth_controller.sign_up);

// login 

router.post("/login/", auth_controller.log_in);

/*

// Get all published posts

router.get("/published", nonUser_controller.all_published_posts_get);

// GET all comments.
router.get("/comments/", nonUser_controller.all_comments_get);

// get comments for specific post

router.get("/comments/:postId", nonUser_controller.post_comments_get);

//add commment to post

router.post("/comments/", nonUser_controller.comments_create);

// login 

router.post("/login/", auth_controller.log_in);

// logout

router.post("/logout/", auth_controller.log_out);
*/

module.exports = router;