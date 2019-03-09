const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 50
  },
  email:{
    type: String,
    required:true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password:{
    type: String,
    required: true,
    min: 5,
    max: 1024
    //TODO:  !!!   joi-password-complexity   !!!
  },
  isAdmin: Boolean,
  date: {type: Date, default: Date.now}
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
};
const User = mongoose.model('User', userSchema);


function validateUser(user) {
  const schema = {
    name: Joi.string().min(4).max(50).required(),
    email:Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };
  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
