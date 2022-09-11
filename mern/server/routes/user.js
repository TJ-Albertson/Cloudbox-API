const express = require("express");
const userRouter = express.Router();

const User = require("../models/userModel");

userRouter.get("/", async (req, res) => {
  const email = req.auth.payload["https://example.com/email"];
  const user = await User.findOne({ email: email });

  console.log(user);

  if (user) {
    return res.json(user);
  } else {
    let newUser = new User({
      email: email,
      username: "",
      bio: "",
      profilePicturePath: "/none",
      boxArray: [email],
      accessArray: [email],
      shareArray: [],
    }).save();
    return res.json(newUser);
  }
});

userRouter.put("/", async (req, res) => {
  const email = req.auth.payload["https://example.com/email"];
  const { username, profilePicturePath, bio } = req.body;

  await User.updateOne(
    { email: email },
    { username },
    { profilePicturePath },
    { bio }
  );

  res.json("update user info");
});

userRouter.patch("/groups", async (req, res) => {
  const email = req.auth.payload["https://example.com/email"];
  const { array, targetEmail, desire } = req.body;

  const targetUser = await User.findOne({ email: targetEmail });

  if (desire == "add") {
    if (array == "share") {
      if (!targetUser) {
        return res.json({ emailExist: false });
      }

      await User.updateOne(
        { email: email },
        { $addToSet: { shareArray: targetEmail } }
      );

      await User.updateOne(
        { email: targetEmail },
        { $addToSet: { accessArray: email } }
      );

      return res.json("add share email attempt made");
    } else if (array == "box") {
      await User.updateOne(
        { email: email },
        { $addToSet: { boxArray: { $each: targetEmail } } }
      );
      return res.json("add box email attempt made");
    }
  } else if (desire == "delete") {
    if (array == "share") {
      await User.updateOne(
        { email: email },
        { $pull: { shareArray: { $in: targetEmail } } }
      );

      await User.updateOne(
        { email: targetEmail },
        { $pull: { accessArray: email, boxArray: email } }
      );
      return res.json("delete share email/s attempt made");
    } else if (array == "box") {
      await User.updateOne(
        { email: email },
        { $pull: { boxArray: targetEmail } }
      );
      return res.json("delete box email/s attempt made");
    }
  }
  return res.json("data not good");
});

userRouter.get("/:email", async (req, res) => {
  const user = await User.findOne({ email: email });
  const { username, profilePicturePath, bio } = user;

  res.send({ username, profilePicturePath, bio });
});

module.exports = userRouter;
