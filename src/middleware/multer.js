const multer = require("multer");

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
      //        10,000,000 = 100MB
      fileSize: 10000000,
    },
    fileFilter(req, file, cb) {
      if (
        !file.originalname.match(
          /\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls|txt|mp4)$/
        )
      ) {
        return cb(
          new Error(
            "only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls, mp4 format."
          )
        );
      }
      cb(undefined, true); // continue with upload
    },
  });

  module.exports = upload