const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  messages: [{
    sender:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content:  { type: String, required: true },
    sentAt:   { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
