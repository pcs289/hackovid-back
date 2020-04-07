const express = require("express");

const { Request } = require("../models/Request");
const { User } = require("../models/User");
const { checkIfLoggedIn } = require("../middlewares");

const router = express.Router();

/* POST create a new request to 'requestedId' from 'req.session.currentUser' for some of requested's preference */
router.post(
    "/create",
    checkIfLoggedIn,
    async (req, res, next) => {
        try {
            const { requestedId, preferenceId, description } = req.body;

            // Find Consumer & Provider, consumer create requests to providers
            const requester = await User.findOne({ _id : req.session.currentUser._id });
            const requested = await User.findOne({ _id: requestedId, "preferences._id": preferenceId });

            // Checks if requested exists, preference exists and if it belongs to requested, otherwise requested will be undefined
            if (!requested) {
                return res.status(400).json({code: "requested-or-preference-no-exist"});
            }

            // Create Request
            const request = new Request({
                requester,
                requested,
                preference: preferenceId,
                description
            });
            await request.save();

            // Add to requester's requests array
            requester.requests.push(request);
            requester.markModified('requests');
            await requester.save();

            // Add to requested's requests array
            requested.requests.push(request);
            requested.markModified('requests');
            await requested.save();

            res.status(200).json({ code : "success" })
        } catch(error) {
            next(error);
        }
    }
);

module.exports = router;
