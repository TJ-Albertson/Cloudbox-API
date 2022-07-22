const express = require('express')
const router = express.Router()

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const verifyJWT = require("../models/verifyJWT")

router.get("/isLoggedIn", verifyJWT, (req, res) => {
    return res.json({isLoggedIn: true, email: req.user.email})
})  

router.get("isEmailTaken", (req, res) => {
    const takenEmail = await User.findOne({})
    return res.json
}
)

router.post("/register", async (req, res) => {

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
  
router.post("/login", (req, res) => {

    const userLoggingIn = req.body
    console.log(userLoggingIn)

    User.findOne({email: userLoggingIn.email})
    .then(dbUser => {
        if (!dbUser) {
            return res.json({
            message: "Invalid Email or Password"
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
                    if (err) return res.json({message: err})
                        return res.json({
                            message: "Success",
                            token: "Bearer " + token
                        })
                    }
                )
            } else {
                return res.json({
                    message: "Invalid Email or Password"
                })
            }
        })
    })
})

module.exports = router