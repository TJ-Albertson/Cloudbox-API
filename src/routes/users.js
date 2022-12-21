const express = require("express");
const userRouter = express.Router();

const User = require("../models/userModel");
const fs = require("fs-extra");
const axios = require("axios").default;


userRouter.get("/:email", async (req, res) => {

  //const email = req.auth.payload["https://example.com/email"];
  const email = req.params.email;

  console.log("THSIFSDF", {email})

  const user = await User.findOne({ email });

  //else create user
  if (user) {
    return res.json(user);
  } else {
    var options = {
      method: "POST",
      url: `${process.env.AUTH0_DOMAIN}/oauth/token`,
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: `${process.env.AUTH0_DOMAIN}/api/v2/`,
      }),
    };

    await axios
      .request(options)
      .then(function (response) {
        var options = {
          method: "GET",
          url: `https://dev-5c9085dy.us.auth0.com/api/v2/users/${req.auth.payload.sub}`,
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${response.data.access_token}`,
          },
        };

        axios
          .request(options)
          .then(function (response) {
            const userMeta = response.data;

            new User({
              email,
              username: userMeta.name,
              bio: "",
              picture: userMeta.picture,
              accountType: "free",
              boxArray: [email],
              accessArray: [email],
              shareArray: [],
            })
              .save()
              .then((savedDoc) => res.json(savedDoc));
          })
          .catch(function (error) {
            console.error(error);
          });
      })
      .catch(function (error) {
        console.error(error);
      });
  }
});

userRouter.patch("/:email", async (req, res) => {
  //const email = req.auth.payload["https://example.com/email"];
  const email = req.params.email;
  const { array, targetEmail, desire } = req.body;

  const user = await User.findOne({ email });
  const targetUser = await User.findOne({ email: targetEmail });

  if (desire == "add") {
    if (array == "share") {
      if (!targetUser) {
        return res.json({ emailExist: false });
      }

      user.shareArray.push(targetEmail)
      targetUser.accessArray.push(email)

      await user.save()
      await targetUser.save()

      /*
      await User.updateOne(
        { email: email },
        { $addToSet: { shareArray: targetEmail } }
      );

      await User.updateOne(
        { email: targetEmail },
        { $addToSet: { accessArray: { email, color: "#00000008" } } }
      );
      */

      return res.json("add share email attempt made");
    } else if (array == "box") {

      targetEmail.forEach(tEmail => user.boxArray.push(tEmail))
      await user.save()

      /*
      await User.updateOne(
        { email: email },
        { $addToSet: { boxArray: { $each: targetEmail } } }
      );
      */

      return res.json("add box email attempt made");
    }
  } else if (desire == "delete") {
    if (array == "share") {

      user.shareArray.filter(qEmail => targetEmail);
      targetUser.accessArray.filter(qEmail => email);
      targetUser.accessArray.filter(qEmail => email);

      await User.updateOne(
        { email: email },
        { $pull: { shareArray: { $in: targetEmail } } }
      );

      await User.updateOne(
        { email: targetEmail },
        { $pull: { accessArray: { email }, boxArray: email } }
      );
      return res.json("delete share email/s attempt made");
    } else if (array == "box") {

      user.boxArray.filter(qEmail => targetEmail)
      
      /*
      await User.updateOne(
        { email: email },
        { $pull: { boxArray: targetEmail } }
      );
      */

      return res.json("delete box email/s attempt made");
    }
  }
  return res.json("data not good");
});


userRouter.put("/", async (req, res) => {

  const id = req.auth.payload.sub
  const { username, picture, bio } = req.body;

  await User.updateOne(
    { userID: id },
    { username },
    { picture },
    { bio }
  );

  res.json("update user info");
});


/*
userRouter.get("/email/:email", async (req, res) => {

  const user = await User.findOne({ email: req.params.email });
  const { username, picture, bio } = user;

  res.json({ username, picture, bio });
});
*/

module.exports = userRouter;
