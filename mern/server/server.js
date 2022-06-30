const express = require("express");
const app = express();

const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require("cors");

const port = process.env.PORT || 5000;
require("dotenv").config({ path: "./config.env" });


app.use(session({
  //need to generate secret and put in .env
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(cors());
app.use(express.json());
app.use('/record', require("./routes/record"));
app.use('/', require('./routes/index.js'));

mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
const User = require('./models/user');

//run()
async function run() {
  const user = new User({ name: 'keef', someID: 'id number' })
  await user.save()
  console.log(user)
}

var filter = {
  name: "big keef"
};

var update = {
  name: "big keed",
  someID: "idenfasdf"
};

var options = {
  upsert: true
}

User.findOneAndUpdate(filter, update, options)

app.listen(port, () => {
  // perform a database connection when server starts
  mongoose.connect('mongodb+srv://admin2:kb0VEu3tabCHQ3hG@cluster0.c9dnp.mongodb.net/clients?retryWrites=true&w=majority', { useNewUrlParser: true });

  console.log(`Server is running on port: ${port}`);
});
