const express = require("express");
const app = express();

const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require("body-parser")

const { auth } = require('express-oauth2-jwt-bearer');

const port = process.env.PORT || 5000;
require("dotenv").config({ path: "./config.env" });

const urlEncodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json(), urlEncodedParser)
app.use(cors());
app.use(express.json());

app.use('/', require('./routes/auth.js'));
app.use('/', require('./routes/file.js'));
app.use('/', require('./routes/group.js'));

const checkJwt = auth({
  audience: 'http://localhost:5000',
  issuerBaseURL: `https://dev-5c9085dy.us.auth0.com/`,
});

app.get('/api/private', checkJwt, function(req, res) {
  var userId = req.user['http://localhost:5000/email'];
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated to see this.' + userId
  });
});

app.get('/api/public', function(req, res) {
  res.json({
    message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
  });
});


mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

app.listen(port, () => {
  mongoose.connect(process.env.MONGODB, { useNewUrlParser: true });
  console.log(`Server is running on port: ${port}`);
});
