const path = require('path');
const express = require('express');
const multer = require('multer');
const File = require('../models/fileModel');
const router = express.Router();
const fs = require('fs-extra');

//single list of files in file system. hierarchy in mongodb

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './files/temp');
    },
    filename(req, file, cb) {
      cb(null, file.originalname);
    }
  }),
  limits: {
    fileSize: 1000000 // max file size  1MB = 1000000 bytes
                      //               10MB = 10000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls|txt)$/)) {
      return cb(
        new Error(
          'only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.'
        )
      );
    }
    cb(undefined, true); // continue with upload
  }
});

//also auto delete file if error uploading to mongo
//need to add auto rename title if matching
router.post('/upload', upload.single('file'), async (req, res) => {

  const { fileName, ownerEmail } = req.body;
  const { path, mimetype } = req.file;

  const takenFileName = await File.findOne({ fileName: fileName})
  if (takenFileName) {
    return res.json({isNameTaken: true})
  }


  fs.move("./files/temp/" + fileName, "./files/" + ownerEmail + '/' + fileName)

  const file = new File({
    ownerEmail,
    fileName,
    filePath: path,
    fileMimetype: mimetype
  });
  await file.save();
  res.send('file uploaded successfully.');
});

//change to get by id
router.get('/getAllFiles', async (req, res) => {
  //sorts alphabeticaly
  const files = await File.find({}).sort({title:1})
  res.send(files);
});

router.get('/download/:dir/:id', async (req, res) => {
  const file = await File.findById(req.params.id);
  res.set({
    'Content-Type': file.file_mimetype
  });
  res.sendFile(path.join(__dirname, '..', file.file_path));
});

module.exports = router;