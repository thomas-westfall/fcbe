const Sequelize = require('sequelize');
const db = require('../db');

const Deck = db.define("deck", {

  totalPrice: {
    type: Sequelize.FLOAT,
    allowNull: false
  },

  deckSize : {
    type: Sequelize.INTEGER,
    allowNull: false
  }
  
});

module.exports = Deck;