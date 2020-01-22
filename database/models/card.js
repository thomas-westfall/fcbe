const Sequelize = require('sequelize');
const db = require('../db');

const Card = db.define("card", {

  cardEnglish: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cardPinyin: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cardSimplified: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cardTraditional: {
    type: Sequelize.STRING,
    allowNull: false
  },
});

module.exports = Card;