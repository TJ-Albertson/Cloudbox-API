const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require('./models/user');

const port = process.env.PORT || 5000;
require("dotenv").config({ path: "./config.env" });

const app = express();
app.use(cors());

const urlEncodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json(), urlEncodedParser)


app.use(express.json());

//app.use('/', require('./routes/index.js'));


mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);


//register
app.post("/register", async (req, res) => {
  const user = req.body

  const takenEmail = await User.findOne({email: user.email})

  if (takenEmail) {
    res.json({message: "Email has already been taken"})
  } else {
    user.password = await bcrypt.hash(req.body.password, 10)

    const dbUser = new User ({
      email: user.email.toLowerCase(),
      password: user.password,
    })

    dbUser.save()
    res.json({message: "Success"})
  }
})

//login
app.post("/login", (req, res) => {
  const userLoggingIn = req.body
  console.log(userLoggingIn)
  User.findOne({email: userLoggingIn.email})
  .then(dbUser => {
    if (!dbUser) {
      return res.json({
        message: "Invalid Username or Password"
      })
    }
    bcrypt.compare(userLoggingIn.password, dbUser.password)
    .then(isCorrect => {
      if (isCorrect) {
        const payload = {
          id: dbUser._id,
          email: dbUser.email,
        }
        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          {expiresIn: 86400},
          (err, token) => {
            if (err) return res.json({messafe: err})
            return res.json({
              message: "Success",
              token: "Bearer " + token
            })
          }
        )
      } else {
        return res.json({
          message: "Invalid Username or Password"
        })
      }
    })
  })
})

//verfy
function verifyJWT(req, res, next) {
  const token = req.headers["x0access-token"]?.split(' ')[1]

  if (token) {
    jwt.verify(token, process.env.PASSPORTSECRET, (err, decoded) => {
      if (err) return res.json({
        isLoggeIn: false,
        message: "Failed to Authenticate"
      })
      req.user = {}
      req.user.id = decoded.id
      req.user.username = decoded.username
      next()
    })
  } else {
    res.json({message: "Incorret Token Given", isLoggedIn: false})
  }
}

app.get("/isUserAuth", verifyJWT, (req, res) => {
  return res.json({isLoggedIn: true, username: req.user.username})
})




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
