const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const logger = require("morgan");
const passport = require('passport');
const config = require('./config');

// connect to the database and load models
require('./models').connect(config.dbUri);


// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({ extended: false }));
// pass the passport middleware
app.use(passport.initialize());

// load passport strategies
const localSignupStrategy = require('./passport/local-signup');
const localLoginStrategy = require('./passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// pass the authenticaion checker middleware
const authCheckMiddleware = require('./middleware/auth-check');
app.use('/api', authCheckMiddleware);

// routes
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.use(logger("dev"));
app.use(bodyParser.json);
app.use(express.static(path.join(__dirname, "../client/build")));
app.use((req, res, next) => {
  const error = new error("not found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);

  res.json({
    error: {
      message: error.message
    }
  });
});
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
