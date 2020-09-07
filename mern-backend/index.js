const express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    apiRouter = require('./routes/router'),
    databaseConfig =  require('./config/keys').mongoURI,
    app = express();

// Default port if not set in .env
const port = process.env.DB_PORT || 8080;

// Connecting to MongoDB
mongoose
    .connect(databaseConfig, { useNewUrlParser: true, useUnifiedTopology: true,})
    .then(() => console.log(`Connected to database`))
    .catch(err => console.log(`Error connecting to db ${err}.`));

// Enabling parsing requests:
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport:
app.use(passport.initialize());
require('./config/passport')(passport);

// Starting up express server
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});

// Passing requests to API router
app.use('/', apiRouter);