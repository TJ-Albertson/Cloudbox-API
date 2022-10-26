const express = require("express");
const fileRouter = express.Router();
const path = require("path");
const upload = require("../middleware/multer");
const File = require("../models/fileModel");
const fs = require("fs-extra");

//get files with userId
fileRouter.get("/", async (req, res) => {

  const email = req.query.email;

  const files = await File.find({ email });

  res.send(files);
});

//get single file to download
fileRouter.get("/:id", async (req, res) => {
  const file = await File.findById(req.params.id);
  res.set({
    "Content-Type": file.mimeType,
  });
  res.sendFile(path.join(__dirname, "..", file.path));
});


//also auto delete file if error uploading to mongo
//need to add auto rename title if matching
fileRouter.post("/", upload.single("file"), async (req, res) => {
  const { owner, size, name, directory, userId } = req.body;
  const { mimetype } = req.file;

  let copyName = name;

  let i = 1;
  while (true) {
    const takenFileName = await File.findOne({
      owner: owner,
      name: copyName,
      directory: directory,
    });

    if (!takenFileName) break;

    copyName = name + " (" + i + ")";
    i++;
  }

  const crypto = require("crypto");
  const buf = crypto.randomBytes(15);

  fs.move(
    "./files/temp/" + name,
    "./files/users/" + email + "/" + name + "_" + buf.toString("hex")
  );
  const path =
    "./files/users/" + email + "/" + name + "_" + buf.toString("hex");

  const file = new File({
    owner,
    name: copyName,
    size,
    directory,
    path: path,
    mimeType: mimetype,
  });
  await file.save();
  res.json("file uploaded successfully.");
});


//rename file
fileRouter.patch("/:id", async (req, res) => {
  const id = req.params.id
  const { newName } = req.body;

  await File.updateOne({ _id: id }, { name: newName });
  res.json("File renamed");
});

//delete file
fileRouter.delete("/:id", async (req, res) => {
  const file = await File.findById(req.params.id);

  console.log(path.join(__dirname, "..", file.path));

  await File.deleteOne({ _id: req.params.id });
  fs.remove(path.join(__dirname, "..", file.path));

  res.json("Delete attempt");
});

module.exports = fileRouter;


/*
fileRouter.post("/folder", async (req, res) => {
  const { owner, name, mimeType, directory } = req.body;

  const takenFileName = await File.findOne({
    owner: owner,
    name: name,
    directory: directory,
  });
  if (takenFileName) {
    return res.json({ isNameTaken: true });
  }

  const file = new File({
    owner,
    name,
    directory,
    mimeType,
  });
  await file.save();
  res.json("folder uploaded successfully.");
});

*/


/*
//get file list based on id
fileRouter.get("/:userId", async (req, res) => {
  const email = req.params.email;
  const files = await File.find({ owner: email }).sort({ title: 1 });
  res.send(files);
});
*/