const Sequelize = require('sequelize');
const db = require('../db');

const Deck = db.define("deck", {

  deckName: {
    type: Sequelize.STRING,
    allowNull: false
  },

  deckSize : {
    type: Sequelize.INTEGER,
    allowNull: false
  }
  
});

module.exports = Deck;