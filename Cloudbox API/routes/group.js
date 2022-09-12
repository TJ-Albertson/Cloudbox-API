const express = require("express");
const groupRouter = express.Router();

const groupModel = require("../models/groupModel");

groupRouter.get("/getGroup", async (req, res) => {
  const email = req.auth.payload["https://example.com/email"];
  const group = await groupModel.findOne({ email: email });

  if (group) {
    return res.json(group);
  } else {
    let newGroup = new groupModel({
      email: email,
      boxArray: [email],
      accessArray: [email],
      shareArray: [],
    }).save();
    return res.json(newGroup);
  }
});

groupRouter.patch("/", async (req, res) => {
  const ownerEmail = req.auth.payload["https://example.com/email"];
  const { type, targetEmail, desire } = req.body;

  const group = await groupModel.findOne({ email: email });

  if (desire == "add") {
    if (type == "share") {
      await groupModel.updateOne(
        { email: ownerEmail },
        { $addToSet: { shareArray: targetEmail } }
      );

      await groupModel.updateOne(
        { email: targetEmail },
        { $addToSet: { accessArray: ownerEmail } }
      );
    } else if (type == "box") {
      await groupModel.updateOne(
        { email: ownerEmail },
        { $addToSet: { boxArray: { $each: targetEmail } } }
      );
    }
  } else if (desire == "delete") {
    if (type == "share") {
      await groupModel.updateOne(
        { email: ownerEmail },
        { $pull: { shareArray: { $in: targetEmail } } }
      );

      await groupModel.updateOne(
        { email: targetEmail },
        { $pull: { accessArray: ownerEmail, boxArray: ownerEmail } }
      );
    } else if (type == "box") {
      await groupModel.updateOne(
        { email: ownerEmail },
        { $pull: { boxArray: targetEmail } }
      );
    }
  }
});

//patch, /group/{id}/{group}
groupRouter.post("/addShareEmail", async (req, res) => {
  const ownerEmail = req.auth.payload["https://example.com/email"];
  const { shareEmail } = req.body;

  const shareExist = await groupModel.findOne({ email: shareEmail });

  if (!shareExist) {
    return res.json({ emailExist: false });
  }

  await groupModel.updateOne(
    { email: ownerEmail },
    { $addToSet: { shareArray: shareEmail } }
  );

  await groupModel.updateOne(
    { email: shareEmail },
    { $addToSet: { accessArray: ownerEmail } }
  );

  return res.json("Share Attempt");
});

groupRouter.post("/removeShareEmail", async (req, res) => {
  const ownerEmail = req.auth.payload["https://example.com/email"];
  const removeEmail = req.body;

  await groupModel.updateOne(
    { email: ownerEmail },
    { $pull: { shareArray: { $in: removeEmail } } }
  );

  await groupModel.updateOne(
    { email: removeEmail },
    { $pull: { accessArray: ownerEmail, boxArray: ownerEmail } }
  );
  const group = await groupModel.find({ email: ownerEmail });
  return res.json(group);
});

groupRouter.post("/addBox", async (req, res) => {
  const ownerEmail = req.auth.payload["https://example.com/email"];
  const addEmail = req.body;

  await groupModel.updateOne(
    { email: ownerEmail },
    { $addToSet: { boxArray: { $each: addEmail } } }
  );

  const group = await groupModel.find({ email: ownerEmail });
  return res.json(group);
});

groupRouter.post("/removeBox", async (req, res) => {
  const ownerEmail = req.auth.payload["https://example.com/email"];
  const { removeEmail } = req.body;

  await groupModel.updateOne(
    { email: ownerEmail },
    { $pull: { boxArray: removeEmail } }
  );
  const group = await groupModel.find({ email: ownerEmail });
  return res.json(group);
});

module.exports = groupRouter;
