const express = require("express");
const router = express.Router();
const { User, Deck, Card } = require("../database/models");
const cors = require('cors')
router.post("/login", cors(), async (req, res, next) => {
  try {
    const user = await User.findOne({ 
      where: { 
        username: req.body.username 
      },
    })

    if (!user) {
      res.status(401).send("Wrong username and/or password");
    }
    else if (!user.correctPassword(req.body.password)) {
      res.status(401).send("Wrong username and/or password");
    }
    else {
      let foundUser = await User.findOne({
        where: { 
          username: req.body.username
        },
        include: 
        [{ model: Deck,
          include: [{
            model: Card,
            include: [User]
          }]},
    
        {model: Card,
          include: [User],
          include: [{
            model: Deck,
            include: [User]
          }]
        }]
      })
      req.login(user, err => (err ? next(err) : res.json(foundUser)));
    }
  }

  catch (err) {
    next(err);
  }

});

router.post("/signup", cors(), async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    // req.login(user, err => (err ? next(err) : res.json(user)));
    if(user) {
      res.json(user);
    }
  }
  catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("User already exists");
    }
    else {
      next(err);
    }
  }
});

router.delete("/logout", cors(), (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(204).end();
});

router.get("/me", async (req, res) => {
  let foundUser = await User.findOne({
    where: { 
      username: req.user.username
    },
    include: 
    [{ model: Deck,
      include: [{
        model: Card,
        include: [User]
      }]},

    {model: Card,
      include: [User],
      include: [{
        model: Deck,
        include: [User]
      }]
    }]
  })
  res.json(foundUser);
});

module.exports = router;