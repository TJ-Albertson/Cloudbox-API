const express = require('express')
const router = express.Router()

const emailGroups = require("../models/emailGroupModel")

router.post("/:email/addEmail", async (req, res) => {
    
    console.log("request made")

    const ownerEmail = req.params.email
    const shareEmail = req.body.data
    
    console.log({ownerEmail, shareEmail})
    //add shareEmail to ownerEmail -> shareArray
    //add shareEmail to shareEmail -> emailArray
    
    emailGroups.updateOne(
        { ownerEmail : ownerEmail },
        { $addToSet : { shareArray : shareEmail } }
    )

    emailGroups.updateOne(
        { ownerEmail : shareEmail },
        { $addToSet : { emailArray : shareEmail } }
    )

    res.json("request made")
})

module.exports = router;