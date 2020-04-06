const express = require("express");

const Request = require("../models/Request");
const User = require("../models/User");

const {
    checkDuplicatedRequest,
  } = require("../middlewares");

const router = express.Router();

router.post(
    "/new",
    //checkDuplicatedRequest,
    async (req, res, next) => {
        try {
            const { requester, preference, description } = req.body;
            var user = await User.findOne({ _id : req.session.currentUser._id })
            var request = null;
            if(description) {
                request = new Request({
                    requester,
                    preference,
                    description
                })
            } else {
                request = new Request({
                    requester,
                    preference
                })
            }
            user.requests.push(request);
            await user.save();
            await request.save();
            res.status(200).json({ code : "success" })
        } catch(error) {
            next(error);
        }
    }
)

module.exports = router;