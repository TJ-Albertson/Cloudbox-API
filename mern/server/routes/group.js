const express = require('express')
const groupRouter = express.Router()

const groupModel = require("../models/groupModel")

groupRouter.get("/getGroup", async (req, res) => {
   
    const email = req.auth.payload['https://example.com/email']
    const group = await groupModel.findOne({email: email})
    
    if(group) {
        return res.json(group)      
    } else {
        let newGroup = new groupModel({ 
            email: email,
            boxArray: [email],
            accessArray: [email],
            shareArray: []
        }).save()
        return res.json(newGroup)
    }
})  

groupRouter.post("/addShareEmail", async (req, res) => {
    
    const ownerEmail = req.auth.payload['https://example.com/email']
    const { shareEmail } = req.body

    console.log({ownerEmail, shareEmail})

    const shareExist = await groupModel.findOne({email: shareEmail}) 

    if(!shareExist) {
        return res.json({emailExist: false})
    }

    await groupModel.updateOne(
        { email : ownerEmail },
        { $addToSet : { shareArray : shareEmail } }
    )

    await groupModel.updateOne(
        { email : shareEmail },
        { $addToSet : { emailArray : ownerEmail } }
    )
    
    const group = await groupModel.find({ownerEmail: ownerEmail})
    return res.json(group)
})

groupRouter.post("/removeShareEmail", async (req, res) => {
    const ownerEmail = req.auth.payload['https://example.com/email']
    const removeEmail = req.body.data

    await groupModel.updateOne(
        { email : ownerEmail },
        { $pull : { shareArray : { $in: removeEmail } } }
    )

    await groupModel.updateOne(
        { email : removeEmail },
        { $pull : { emailArray : ownerEmail, boxArray : ownerEmail } }
    )
    const group = await groupModel.find({ownerEmail: ownerEmail})
    return res.json(group)
})

groupRouter.post("/addBox", async (req, res) => {
    const ownerEmail = req.auth.payload['https://example.com/email']
    const addEmail = req.body.data

    await groupModel.updateOne(
        { email : ownerEmail },
        { $addToSet : { boxArray : { $each: addEmail } } }
    )
    
    const group = await groupModel.find({ownerEmail: ownerEmail})
    return res.json(group)
})

groupRouter.post("/deleteBox", async (req, res) => {
    const ownerEmail = req.auth.payload['https://example.com/email']
    const removeEmail = req.body.data

    await groupModel.updateOne(
        { ownerEmail : ownerEmail },
        { $pull : { boxArray : removeEmail } }
    )
    const group = await groupModel.find({ownerEmail: ownerEmail})
    return res.json(group)
})

module.exports = groupRouter;