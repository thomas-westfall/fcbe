const express = require('express');
const router = express.Router();
const { Card } = require('../database/models');
const request = require('request');
const querystring = require('querystring');
const cors = require('cors')
/* GETS */
// FIND ALL ORDERS
router.get('/', cors(), function(req, res, next) {
    Card.findAll()
      .then(cards => res.json(cards))
      .catch(next)
  });

// GET ALL CARDS BY DECK ID
router.get('/d/:deckId', cors(), function(req, res, next) {
  Card.findAll({
      where: {deckId: req.params.deckId}
    })
    .then(cards => res.json(cards))
    .catch(next)
});

// GET ALL CARDS BY USER ID
router.get('/:userId', cors(), function(req, res, next) {
  Card.findAll({
      where: {userId: req.params.userId}
    })
    .then(cards => res.json(cards))
    .catch(next)
});

router.post('/pinyin', function(req,res,next){
  console.log("YESNO")
  var q = req.body.q;
  console.log(q);
var options = { method: 'GET',
url: 'https://glosbe.com/transliteration/api?from=Han&dest=Latin&text=' + encodeURI(q) + '&format=json', };
console.log(options.url)
  request(options, function (error, response, body) {
  if (error) throw new Error(error);
  console.log(body);
  res.send(body);
  });
})

/* POSTS */
// CREATES A NEW CARD
router.post('/', function(req, res, next) {
  const card = req.body;
  Card.create(card)
  .then(function(card) {
    res.json(card);
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

/* PUTS */
// MODIFY THE CARD
router.put('/:id', function(req, res, next) {
  let modifiedCard = req.body;
  let modified = Card.update(
    {
      "paid": modifiedCard.paid
    }, 
    {
      where : {
        id : req.params.id
      }
    }).catch(error=>{console.log(error)});

    if(modified) {
      res.status(200).send(`Updated card with id# ${req.params.id}.`);
    }
    else {
      res.status(404).send(`Did not find card.`);
    }
});

module.exports = router;
