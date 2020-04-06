const express = require("express");

const User = require("../models/User");
const Request = require("../models/Request");

const {
    checkDuplicatedRequest,
  } = require("../middlewares");

const router = express.Router();

router.post(
    "/new",
    checkDuplicatedRequest,
    (req, res, next) => {
        try {
            const { requester, preference, description } = req.body;
            if(description) {
                req.session.currentUser.requests.push({ requester : requester, preference : preference, description : description })
            } else {
                req.session.currentUser.requests.push({ requester : requester, preference : preference })
            }
            res.status(200).json({ code : "success" })
        } catch(error) {
            next(error);
        }
    }
)

module.exports = router;