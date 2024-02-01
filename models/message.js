const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  sentBy: { type: String, required: true },
  sentTo: { type: String, required: true },
  timestamp: { type: Date, default: new Date() },
  text: { type: String, required: true },
});



// Export model
module.exports = mongoose.model("Message", MessageSchema);