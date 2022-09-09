const express = require("express");
const userRouter = express.Router();

const User = require("../models/userModel");

//user
userRouter.get("/", async (req, res) => {
    const user = await userModel.findOne({ email: email });
  res.send("get user info");
});

userRouter.put("/", async (req, res) => {

  res.send("update user info");
});

userRouter.get("/groups", async (req, res) => {
  const email = req.auth.payload["https://example.com/email"];
  const user = await User.findOne({ email: email });

  if (user) {
    const {accessArray, boxArray, shareArray} = user
    return res.json({accessArray, boxArray, shareArray});
  } else {
    let newUser = new User({
      email: email,
      bio: "",
      profilePicturePath: "/none",
      boxArray: [email],
      accessArray: [email],
      shareArray: [],
    }).save();
    return res.json(newUser);
  }
});

userRouter.patch("/groups", async (req, res) => {
  const email = req.auth.payload["https://example.com/email"];
  const { type, targetEmail, desire } = req.body;

  const targetUser = await userModel.findOne({ email: targetEmail });

  console.log("req")

  if (desire == "add") {
    if (type == "share") {
      if (!targetUser) {
        return res.json({ emailExist: false });
      }

      await userModel.updateOne(
        { email: email },
        { $addToSet: { shareArray: targetEmail } }
      );

      await userModel.updateOne(
        { email: targetEmail },
        { $addToSet: { accessArray: email } }
      );

      return res.json("add share email attempt made");
    } else if (type == "box") {
      await userModel.updateOne(
        { email: email },
        { $addToSet: { boxArray: { $each: targetEmail } } }
      );
      return res.json("add box email attempt made");
    }
  } else if (desire == "delete") {
    if (type == "share") {
      await userModel.updateOne(
        { email: email },
        { $pull: { shareArray: { $in: targetEmail } } }
      );

      await userModel.updateOne(
        { email: targetEmail },
        { $pull: { accessArray: email, boxArray: email } }
      );
      return res.json("delete share email/s attempt made");
    } else if (type == "box") {
      await userModel.updateOne(
        { email: email },
        { $pull: { boxArray: targetEmail } }
      );
      return res.json("delete box email/s attempt made");
    }
  }
  return res.json("data not good")
});

userRouter.get("/:email", async (req, res) => {
  res.send("get other user profile");
});

//groups




module.exports = userRouter;