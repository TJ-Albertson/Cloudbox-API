const express = require('express')
const router = express.Router()

const verifyJWT = require("../models/verifyJWT")

const emailGroup = require("../models/emailGroupModel")

router.get("/groups", verifyJWT, async (req, res) => {
    const emailGroups = await emailGroup.find({ownerEmail: req.user.email})
    return res.json(emailGroups)
})  


router.post("/:email/addShareEmail", async (req, res) => {

    const ownerEmail = req.params.email
    const shareEmail = req.body.data

    const shareExist = await emailGroup.findOne({ownerEmail : shareEmail}) 

    if(!shareExist) {
        return res.json({emailExist: false})
    }

    await emailGroup.updateOne(
        { ownerEmail : ownerEmail },
        { $addToSet : { shareArray : shareEmail } }
    )

    await emailGroup.updateOne(
        { ownerEmail : shareEmail },
        { $addToSet : { emailArray : ownerEmail } }
    )

    res.send('add request made');
})

router.post("/:email/removeShareEmails", async (req, res) => {
    const ownerEmail = req.params.email
    const removeEmail = req.body.data

    console.log({ownerEmail, removeEmail})

    

    await emailGroup.updateOne(
        { ownerEmail : ownerEmail },
        { $pull : { shareArray : { $in: removeEmail } } }
    )

    await emailGroup.updateOne(
        { ownerEmail : removeEmail },
        { $pull : { emailArray : ownerEmail, boxArray : ownerEmail } }
    )
    
    res.send('delete request made');
})


router.post("/:email/addBoxes", async (req, res) => {
    const ownerEmail = req.params.email
    const addEmail = req.body.data

    console.log({ownerEmail, addEmail})

    await emailGroup.updateOne(
        { ownerEmail : ownerEmail },
        { $addToSet : { boxArray : { $each: addEmail } } }
    )
    
    const emailGroups = await emailGroup.find({ownerEmail: ownerEmail})
    return res.json(emailGroups)
})

router.post("/:email/removeBox", async (req, res) => {
    const ownerEmail = req.params.email
    const removeEmail = req.body.data

    console.log({ownerEmail, removeEmail})

    await emailGroup.updateOne(
        { ownerEmail : ownerEmail },
        { $pull : { boxArray : removeEmail } }
    )
    const emailGroups = await emailGroup.find({ownerEmail: ownerEmail})
    return res.json(emailGroups)
})

router.get("/test", async (req, res) => {
    res.json('test data');
})

module.exports = router;