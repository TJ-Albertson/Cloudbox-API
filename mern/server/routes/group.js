const express = require('express')
const groupRouter = express.groupRouter()

const emailGroup = require("../models/emailGroupModel")

groupRouter.get("/groups", async (req, res) => {
    const email = req.auth.payload['https://example.com/email']
    const emailGroups = await emailGroup.find({ownerEmail: email})
    return res.json(emailGroups)
})  

groupRouter.post("/addShareEmail", async (req, res) => {
    const ownerEmail = req.auth.payload['https://example.com/email']
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
    
    const emailGroups = await emailGroup.find({ownerEmail: ownerEmail})
    return res.json(emailGroups)
})

groupRouter.post("/removeShareEmails", async (req, res) => {
    const ownerEmail = req.auth.payload['https://example.com/email']
    const removeEmail = req.body.data

    await emailGroup.updateOne(
        { ownerEmail : ownerEmail },
        { $pull : { shareArray : { $in: removeEmail } } }
    )

    await emailGroup.updateOne(
        { ownerEmail : removeEmail },
        { $pull : { emailArray : ownerEmail, boxArray : ownerEmail } }
    )
    const emailGroups = await emailGroup.find({ownerEmail: ownerEmail})
    return res.json(emailGroups)
})

groupRouter.post("/addBoxes", async (req, res) => {
    const ownerEmail = req.auth.payload['https://example.com/email']
    const addEmail = req.body.data

    await emailGroup.updateOne(
        { ownerEmail : ownerEmail },
        { $addToSet : { boxArray : { $each: addEmail } } }
    )
    
    const emailGroups = await emailGroup.find({ownerEmail: ownerEmail})
    return res.json(emailGroups)
})

groupRouter.post("/removeBox", async (req, res) => {
    const ownerEmail = req.auth.payload['https://example.com/email']
    const removeEmail = req.body.data

    await emailGroup.updateOne(
        { ownerEmail : ownerEmail },
        { $pull : { boxArray : removeEmail } }
    )
    const emailGroups = await emailGroup.find({ownerEmail: ownerEmail})
    return res.json(emailGroups)
})

module.exports = groupRouter;