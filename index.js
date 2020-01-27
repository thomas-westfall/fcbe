// Module dependencies;
const express = require('express');
const session = require("express-session");

const path = require('path');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');


const passport = require("passport");
const authRouter = require("./auth");
const apiRouter = require('./routes/index');

const SequelizeStore = require("connect-session-sequelize")(session.Store);
// Our database instance;
const createLocalDatabase = require('./utilities/createLocalDatabase');

const db = require('./database');
const sessionStore = new SequelizeStore({ db });

const app = express();

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findByPk(id);
    done(null, user);
  }
  catch (err) {
    done(err);
  }
});

// A helper function to sync our database;
const syncDatabase = () => {
    if (process.env.NODE_ENV === 'production') {
      db.sync();
    }
    else {
      console.log('As a reminder, the forced synchronization option is on');
      db.sync({ force: false })
        .catch(err => {
          if (err.name === 'SequelizeConnectionError') {
            createLocalDatabase();
          }
          else {
            console.log(err);
          }
        });
      }
  };

// Instantiate our express application;

// A helper function to create our app with configurations and middleware;
const configureApp = () => {

//   var allowedOrigins = ['http://localhost:3000',
//                       'https://fcfeb.herokuapp.com/'];
// app.use(cors({
//   credentials: true,
//   origin: function(origin, callback){
//     // allow requests with no origin 
//     // (like mobile apps or curl requests)
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){
//       var msg = 'The CORS policy for this site does not ' +
//                 'allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   }
// }));

  app.use(helmet());
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(compression());

  //app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

  app.use(
    session({
      secret: "a super secretive secret key string to encrypt and sign the cookie",
      store: sessionStore,
      resave: false,
      saveUninitialized: false
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Mount our apiRouter;
  app.use("/auth", authRouter);
  app.use('/api', apiRouter);

  // Error handling;
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found');
      err.status = 404;
      next(err);
    }
    else {
      next();
    }
  });

  // error handling
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
  });
};

const startListening = () => {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!!!`);
  })
}

// Main function declaration;
const bootApp = async () => {
  await sessionStore.sync();
  await syncDatabase();
  await configureApp();
  await startListening();
};

// Main function invocation;
bootApp();

// Export our app, so that it can be imported in the www file;
module.exports = app;