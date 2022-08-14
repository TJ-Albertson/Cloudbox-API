const express = require('express')
const router = express.Router()

const emailGroup = require("../models/emailGroupModel")

router.post("/:email/addShareEmail", async (req, res) => {

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

    res.send('add request made');
})

router.post("/:email/removeShareEmails", async (req, res) => {
    const ownerEmail = req.params.email
    const removeEmail = req.body.data

    console.log({ownerEmail, removeEmail})

    const remove = await emailGroup.updateOne(
        { ownerEmail : ownerEmail },
        { $pull : { shareArray : { $in: removeEmail } } }
    )

    const remove2 = await emailGroup.updateOne(
        { ownerEmail : removeEmail },
        { $pull : { emailArray : ownerEmail, boxArray : ownerEmail } }
    )
    
    res.send('delete request made');
})


router.post("/:email/addBoxes", async (req, res) => {
    const ownerEmail = req.params.email
    const addEmail = req.body.data

    console.log({ownerEmail, addEmail})

    const box = await emailGroup.updateOne(
        { ownerEmail : ownerEmail },
        { $addToSet : { boxArray : { $each: addEmail } } }
    )
    
    res.send('add request made');
})

module.exports = router;