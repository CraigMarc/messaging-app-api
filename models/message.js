const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  userName: { type: String, required: true, minLength: 4 },
  password: { type: String, required: true, minLength: 6 },
  timestamp: { type: Date, default: new Date() },
  text: { type: String, required: true },
});



// Export model
module.exports = mongoose.model("Message", MessageSchema);