const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const  Message = require("../models/message");

exports.get_messages = asyncHandler(async (req, res, next) => {
res.json({message: "working"})
})
