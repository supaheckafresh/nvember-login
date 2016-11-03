'use strict';

const mongoose = require('mongoose'),
  Promise = require('bluebird'),
  bcrypt = Promise.promisifyAll(require('bcrypt')),
  SALT_WORK_FACTOR = 9;

let UserSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  name: {type: String, required: true}
});

UserSchema.pre('save', function (next){
  if (!this.isModified('password')) return next();

  bcrypt.genSaltAsync(SALT_WORK_FACTOR)
    .then(salt => {
      bcrypt.hashAsync(this.password, salt)
        .then(hash => {
          this.password = hash;
          next();
        })
        .catch(next);
    })
    .catch(next);
});

mongoose.model('User', UserSchema);