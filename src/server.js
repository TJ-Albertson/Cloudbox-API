const express = require("express");
const app = express();

const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require("body-parser")

const { auth } = require('express-oauth2-jwt-bearer');

const port = process.env.PORT || 5000;
require("dotenv").config({ path: "./config.env" });

const urlEncodedParser = bodyParser.urlencoded({ extended: true })
app.use(bodyParser.json(), urlEncodedParser)
app.use(cors());
//app.use(express.json());

const checkJwt = auth({
  audience: process.env.AUDIENCE,
  issuerBaseURL: process.env.ISSUERBASEURL,
});

app.use(checkJwt)

app.use('/files', require('./routes/file.js'));
app.use('/users', require('./routes/user.js'));
//app.use('/', require('./routes/group.js'));

mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

app.listen(port, () => {
  mongoose.connect(process.env.MONGODB, { useNewUrlParser: true });
  console.log(`Server is running on port: ${port}`);
});
