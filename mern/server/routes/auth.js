const express = require('express')
const router = express.Router()

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
const emailGroup = require("../models/emailGroupModel")
const verifyJWT = require("../models/verifyJWT")

router.get("/isLoggedIn", verifyJWT, async (req, res) => {
    return res.json({isLoggedIn: true, email: req.user.email})
})  

//For frontend to check if email is taken. For login that doesn't ask if register/login
router.post("/isEmailTaken", async (req, res) => {

    const user = req.body
    const takenEmail = await User.findOne({email: user.email})
    if (takenEmail) {
        return res.json({isEmailTaken: true})
    }
    return res.json({isEmailTaken: false})
})

router.post("/register", async (req, res) => {

    console.log("register request")

    const user = req.body

    const takenEmail = await User.findOne({email: user.email})
    if (takenEmail) {
        res.json({message: "Email taken"})
    } else {
        user.password = await bcrypt.hash(req.body.password, 10)

        //add user and groups to db
        const dbUser = new User ({
            email: user.email.toLowerCase(),
            password: user.password,
        })

        const group = new emailGroup ({
            ownerEmail: user.email,
            boxArray: [user.email],
            emailArray: [user.email],
            shareArray: []
        })
        
        group.save()
        dbUser.save()
        
        res.json({message: "Success"})
    }
    
})
  
router.post("/login", (req, res) => {

    console.log("login request")

    const userLoggingIn = req.body
    console.log(userLoggingIn)

    User.findOne({email: userLoggingIn.email})
    .then(dbUser => {
        if (!dbUser) {
            return res.json({
            message: "Invalid Password"
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
                    message: "Invalid Password"
                })
            }
        })
    })
})








module.exports = router