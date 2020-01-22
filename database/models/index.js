const User = require('./user');
const Deck = require('./deck');
const Card = require('./card');

User.hasMany(Deck);
Deck.belongsTo(User);

Deck.hasMany(Card);
Card.belongsTo(Deck);

User.hasMany(Card);
Card.belongsTo(User);

module.exports = {
  User,
  Deck,
  Card
};
