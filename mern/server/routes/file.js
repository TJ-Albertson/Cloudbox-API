const path = require('path');
const express = require('express');
const multer = require('multer');
const File = require('../models/fileModel');
const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './files');
    },
    filename(req, file, cb) {
      cb(null, `${new Date().getTime()}_${file.originalname}`);
    }
  }),
  limits: {
    fileSize: 1000000 // max file size 1MB = 1000000 bytes
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
    try {
      const { title } = req.body;
      const { path, mimetype } = req.file;
      const file = new File({
        title,
        file_path: path,
        file_mimetype: mimetype
      });
      await file.save();
      res.send('file uploaded successfully.');
    } catch (error) {
      res.status(400).send('Error while uploading file. Try again later.');
    }
  },
  (error, req, res, next) => {
    if (error) {
      res.status(500).send(error.message);
    }
  }
);

//change to get by id
router.get('/getAllFiles', async (req, res) => {
  try {
    //sorts alphabeticaly
    const files = await File.find({}).sort({title:1})
    res.send(files);
  } catch (error) {
    res.status(400).send('Error while getting list of files. Try again later.');
  }
});

router.get('/download/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    res.set({
      'Content-Type': file.file_mimetype
    });
    res.sendFile(path.join(__dirname, '..', file.file_path));
  } catch (error) {
    res.status(400).send('Error while downloading file. Try again later.');
  }
});

module.exports = router;