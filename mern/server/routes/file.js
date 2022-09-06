const express = require("express");
const fileRouter = express.Router();

const path = require("path");
const multer = require("multer");
const File = require("../models/fileModel");
const FileTree = require("../models/fileTreeModel");
const fs = require("fs-extra");

//add to all routes in future
const verifyJWT = require("../models/verifyJWT");

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
fileRouter.post("/upload", upload.single("file"), async (req, res) => {
  const {  owner, name, size, directory } = req.body;
  const { mimetype } = req.file;

  const takenFileName = await File.findOne({ owner: owner, name: name });
  if (takenFileName) {
    //need to delete file. it still gets saved in temp
    return res.json({ isNameTaken: true });
  }

  fs.move("./files/temp/" + name, "./files/" + owner + "/" + name);
  const path = "./files/users/" + owner + "/" + name;

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

fileRouter.get("/getFileList/:email", async (req, res) => {
  const email = req.params.email;
  const files = await File.find({ owner: email }).sort({ title: 1 });
  res.send(files);
});

fileRouter.get("/downloadFile/:id", async (req, res) => {
  const file = await File.findById(req.params.id);
  res.set({
    "Content-Type": file.mimeType,
  });
  res.sendFile(path.join(__dirname, "..", file.path));
});

fileRouter.post("/setFileList", async (req, res) => {
  const ownerEmail = req.auth.payload["https://example.com/email"];

  const fileTree = req.body;

  const update = await FileTree.findOneAndUpdate(
    { email: ownerEmail },
    { fileTree: JSON.stringify(fileTree) },
    { upsert: true }
  );
  res.json("req received");
});

fileRouter.get("/getFileList", async (req, res) => {
  const ownerEmail = req.auth.payload["https://example.com/email"];

  const fileTree = await FileTree.findOne({ email: ownerEmail });

  const object = {
    name: "main",
    folders: [],
    files: [],
  };

  if (fileTree) {
    return res.json(fileTree);
  } else {
    let newFileTree = new FileTree({
      email: ownerEmail,
      fileTree: JSON.stringify(object),
    }).save();
    return res.json(newFileTree);
  }
});

module.exports = fileRouter;
