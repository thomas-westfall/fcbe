const express = require('express');
const router = express.Router();
const { User } = require('../database/models');
// const { Receipt } = require('../database/models');
// const { Order } = require('../database/models');

// FINDS ALL USERS
// router.get('/', function(req, res, next) {
//   User.findAll()
//     .then(users => res.json(users))
//     .catch(next)
// });

// FINDS USER BY ID NUMBER
router.get('/:username', function(req, res, next) {
  User.findOne({
    where: {username: req.params.username},
    attributes: ['id', 'firstName', 'lastName', 'username']
    })
    .then(user =>
      {
        if(user == null) 
        {
        res.status(404).send("User not found.");
        }
        else 
        {
          res.status(200).json(user);
        }
      })
    .catch(next)
});



// ADD TO BAALNCE
// router.put('/balance', function(req, res, next) {
//   User.findOne({
//     where: {
//       username: req.body.username
//     }
//     }).then(user =>
//       {
//         if(user == null) 
//         {
//         res.status(404).send("Invalid username and/or password");
//       }
//       else {
//         res.status(200).json(user);
//       }
//       })
//       .catch(next)
// });

// router.put('/balance', function(req, res, next) {
//   let modifiedUser = req.body;
//   let modified = User.update(
//     {
//       "balance": modifiedUser.balance
//     }, 
//       {
//       where : {
//         username : modifiedUser.username
//       }
//     }).catch(error=>{console.log(error)});

//     if(modified) {
//       res.status(200).send(`Updated user's balance.`);
//     }
//     else {
//       res.status(404).send(`Did not find user.`);
//     }
// });

// CREATES A NEW USER
// router.post('/', function(req, res, next) {
//   const user = req.body;
//   User.create(user)
//   .then(function(user) {
//     res.json(user);
//   })
//   .catch(function (err) {
//     // respond with validation errors
//     return res.status(422).send(err.errors[0].message);
//   })
//   .catch(function (err) {
//     // every other error
//     return res.status(400).send({
//         message: err.message
//     })
//   })
// });


module.exports = router;
