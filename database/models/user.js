const crypto = require("crypto");
const Sequelize = require('sequelize');
const db = require('../db');

const User = db.define("user", {

  balance: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0.00,
  }, 

  username : {
    type: Sequelize.STRING,
    allowNull: false,
    unique: {
      args: true,
      msg: 'Username Already In Use!'
    }
  },

  password: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue("password");
    }
  },
  
  salt: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue("salt");
    }
  },

  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },

  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },

  phoneNumber: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: {
      args: true,
      msg: 'Phone Number Already In Use!'
    }
  },

  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    },
    allowNull: false,
    unique: {
      args: true,
      msg: 'Email Already In Use!'
    }
  }
});

User.generateSalt = function() {
  return crypto.randomBytes(16).toString("base64");
};

User.encryptPassword = function(plainText, salt) {
  return crypto
    .createHash("RSA-SHA256")
    .update(plainText)
    .update(salt)
    .digest("hex");
};

User.prototype.correctPassword = function(candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt()) === this.password();
};

const setSaltAndPassword = user => {
  if (user.changed("password")) {
    user.salt = User.generateSalt();
    user.password = User.encryptPassword(user.password(), user.salt());
  }
};

User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);

module.exports = User;