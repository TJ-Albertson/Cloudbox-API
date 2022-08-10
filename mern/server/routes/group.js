const express = require('express')
const router = express.Router()

const emailGroup = require("../models/emailGroupModel")

router.post("/:email/addEmail", async (req, res) => {

    const ownerEmail = req.params.email
    const shareEmail = req.body.data

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
})

router.post("/:email/removeEmail", async (req, res) => {
    const ownerEmail = req.params.email
    const removeEmail = req.body.data

    const remove = await emailGroup.updateOne(
        { ownerEmail : ownerEmail },
        { $pull : { boxArray : removeEmail}}
    )
})

router.post("/:email/removeShareEmail", async (req, res) => {
    const ownerEmail = req.params.email
    const removeEmail = req.body.data

    const remove = await emailGroup.updateOne(
        { ownerEmail : ownerEmail },
        { $pull : { boxArray : removeEmail}}
    )
})

module.exports = router;