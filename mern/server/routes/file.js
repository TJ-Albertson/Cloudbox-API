const express = require("express");
const fileRouter = express.Router();

const path = require("path");
const multer = require("multer");
const File = require("../models/fileModel");
const fs = require("fs-extra");

//single list of files in file system. hierarchy in mongodb
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "./files/temp");
    },
    filename(req, file, cb) {
      cb(null, file.originalname);
    },
  }),
  limits: {
    fileSize: 1000000, // max file size  1MB = 1000000 bytes
    //               10MB = 10000000
  },
  fileFilter(req, file, cb) {
    if (
      !file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls|txt)$/)
    ) {
      return cb(
        new Error(
          "only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format."
        )
      );
    }
    cb(undefined, true); // continue with upload
  },
});

//also auto delete file if error uploading to mongo
//need to add auto rename title if matching
fileRouter.post("/", upload.single("file"), async (req, res) => {
  const { owner, name, size, directory } = req.body;
  const { mimetype } = req.file;

  console.log(req.body);

  const takenFileName = await File.findOne({
    owner: owner,
    name: name,
    directory: directory,
  });
  if (takenFileName) {
    //need to delete file. it still gets saved in temp
    return res.json({ isNameTaken: true });
  }

  const crypto = require("crypto");
  const buf = crypto.randomBytes(15);

  fs.move(
    "./files/temp/" + name,
    "./files/" + owner + "/" + name + "_" + buf.toString("hex")
  );
  const path =
    "./files/users/" + owner + "/" + name + "_" + buf.toString("hex");

  const file = new File({
    owner,
    name,
    size,
    directory,
    path: path,
    mimeType: mimetype,
  });
  await file.save();
  res.json("file uploaded successfully.");
});

fileRouter.post("/folder", async (req, res) => {
  const { owner, name, mimeType, directory } = req.body;

  console.log(req.body);

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

//get file list based on email
fileRouter.get("/:email", async (req, res) => {
  const email = req.params.email;
  const files = await File.find({ owner: email }).sort({ title: 1 });
  res.send(files);
});

//get single file
fileRouter.get("/:id", async (req, res) => {
  const file = await File.findById(req.params.id);
  res.set({
    "Content-Type": file.mimeType,
  });
  res.sendFile(path.join(__dirname, "..", file.path));
});

//rename file
fileRouter.patch("/", async (req, res) => {

});

//delete file
fileRouter.delete("/:id", async (req, res) => {

});

module.exports = fileRouter;
