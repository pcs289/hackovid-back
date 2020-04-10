const multer = require('multer');
const fs = require('fs');
const express = require("express");
const { User } = require("../models/User");

const {
    checkIfLoggedIn
  } = require("../middlewares");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, './tmp/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname )
      }
});

const upload = multer({ storage: storage });

router
.post(
    "/save",
    checkIfLoggedIn,
    upload.single('file'),
    async function(req, res, next) {
        try {
            var img = { data: fs.readFileSync(req.file.path), contentType : 'image/png' }
            await User.findByIdAndUpdate({ _id : req.session.currentUser._id }, { avatarImg : img  })
            res.status(200).json({ code: 'success' });
            fs.unlinkSync(req.file.path)
        } catch(error) {
            next(error);
        }
})

router.get(
    "/upload",
    checkIfLoggedIn,
    async function(req, res, next) {
        try {
            const user = await User.findOne({ _id : req.session.currentUser._id })
            res.status(200).json(user.avatarImg);
        } catch(error) {
            next(error);
        }
})

module.exports = router;