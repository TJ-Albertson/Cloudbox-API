const express = require('express')
const router = express.Router()

const emailGroup = require("../models/emailGroupModel")

router.post("/:email/addEmail", async (req, res) => {
    
    console.log("request made")

    const ownerEmail = req.params.email
    const shareEmail = req.body.data

    //add shareEmail to ownerEmail -> shareArray
    //add shareEmail to shareEmail -> emailArray

    const shareExist = await emailGroup.findOne({ownerEmail : shareEmail}) 

    if(!shareExist) {
        return res.json({emailExist: false})
    }

    const owner = await emailGroup.updateOne(
        { ownerEmail : ownerEmail },
        { $addToSet : { shareArray : shareEmail } }
    )

    const share = await emailGroup.updateOne(
        { ownerEmail : shareEmail },
        { $addToSet : { emailArray : ownerEmail } }
    )

    console.log("made it")
})

module.exports = router;