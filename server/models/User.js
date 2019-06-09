const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();

//Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  idCard:{
    type: String
  },
  code: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    default: process.env.USER_PHOTO_DEFAULT
  },
  role: { 
    type: String,
    trim: true
  },
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "courses"
    }
  ],
  created:{
    type: Date,
    default : Date.now
  },
  confirmed: {
    type: Boolean,
    default: false
  }
});

module.exports = User = mongoose.model('users',UserSchema)