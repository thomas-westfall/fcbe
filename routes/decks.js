const express = require('express');
const router = express.Router();
const { Deck } = require('../database/models');
const { Card } = require('../database/models');
const request = require('request');
// GET ALL DECKS
router.get('/', function(req, res, next) {
    Deck.findAll({ include: [{
      model: Card
    }]})
      .then(decks => res.json(decks))
      .catch(next)
  });

// GET ALL DECKS BY ID
router.get('/:userId', function(req, res, next) {
  Deck.findAll(
    {where: {userId: req.params.userId},
    //attributes: ['userId', 'totalPrice', 'tipPercent', 'id'],
    attributes: ['userId'],
    include: [Card]
    }
    )
    .then(deck => res.json(deck))
    .catch(next)
});

// CREATES A NEW DECK
router.post('/', function(req, res, next) {
  const deck = req.body;
  Deck.create(deck)
  .then(function(deck) {
    res.json(deck.id); // sends back deck id of one just created
  })
  .catch(function (err) {
    // respond with validation errors
    return res.status(422).send(err.errors[0].message);
  })
  .catch(function (err) {
    // every other error
    return res.status(400).send({
        message: err.message
    })
  })
});

router.post('/translate', (req, res) => {
  console.log("hi")
  console.log(process.env.TRANSLATE)
  var q = req.body.q;
  console.log(q);
var options = { method: 'POST',
url: 'https://translation.googleapis.com/language/translate/v2',
form: 
 { key: process.env.TRANSLATE,
   q: q,
   target: 'en' } };
  request(options, function (error, response, body) {
  if (error) throw new Error(error);
  console.log(body);
  res.send(body);
  });
})

module.exports = router;
