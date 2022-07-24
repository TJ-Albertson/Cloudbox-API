const express = require("express");
const app = express();

const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require('./models/user');

const port = process.env.PORT || 5000;
require("dotenv").config({ path: "./config.env" });

const urlEncodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json(), urlEncodedParser)
app.use(cors());
app.use(express.json());

app.use('/', require('./routes/auth.js'));


mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

//mongodb+srv://admin2:kb0VEu3tabCHQ3hG@cluster0.c9dnp.mongodb.net/clients?retryWrites=true&w=majority

app.listen(port, () => {
  mongoose.connect(process.env.MONGODB, { useNewUrlParser: true });

  console.log(`Server is running on port: ${port}`);
});
