/* eslint-disable no-undef */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'first name is required']
  },
  lastName: {
    type: String,
    required: [true, 'last name is required']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: [true, 'User already exist'],
    match: [
      // eslint-disable-next-line no-useless-escape
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient',
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

// encrypt password
UserSchema.pre('save', async function(){
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt)
})

// sign JWT and return
UserSchema.methods.getJWT = function() {
  return jwt.sign({id:this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES})
}

//  verify password during login
UserSchema.methods.comparePass = async function(pass2){
  return await bcrypt.compare(pass2, this.password)
}


module.exports = mongoose.model('User', UserSchema)