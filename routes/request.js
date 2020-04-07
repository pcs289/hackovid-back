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

router.get(
    "/list/requester",
    checkIfLoggedIn,
    async (req, res, next) => {
        try {
            const requests = await Request.findOne({ requester : req.session.currentUser._id });
            res.status(200).json(requests)
        } catch(error) {
            next(error);
        }
    }
);

router.get(
    "/list/requested",
    checkIfLoggedIn,
    async (req, res, next) => {
        try {
            const requests = await Request.findOne({ requested : req.session.currentUser._id });
            res.status(200).json(requests)
        } catch(error) {
            next(error);
        }
    }
);

router.get(
    "/list/requester/status",
    checkIfLoggedIn,
    async (req, res, next) => {
        try {
            const { status } = req.body;
            const requests = await Request.find({ requester : req.session.currentUser._id, status });
            res.status(200).json(requests);
        } catch(error) {
            next(error);
        }
    }
);

router.get(
    "/list/requested/status",
    checkIfLoggedIn,
    async (req, res, next) => {
        try {
            const { status } = req.body;
            const requests = await Request.find({ requester : req.session.currentUser._id, status });
            res.status(200).json(requests);
        } catch(error) {
            next(error);
        }
    }
);

router.put(
    "/status/accept",
    checkIfLoggedIn,
    async (req, res, next) => {
        try {
            const { requestID } = req.body;
            await Request.findOneAndUpdate({ _id : requestID }, { status : 1 });
            res.status(200).json({ code : "success" })
        } catch(error) {
            next(error);
        }
    }
);

router.put(
    "/status/deny",
    checkIfLoggedIn,
    async (req, res, next) => {
        try {
            const { requestID } = req.body;
            await Request.findOneAndUpdate({ _id : requestID }, { status : 2 });
            res.status(200).json({ code : "success" })
        } catch(error) {
            next(error);
        }
    }
);

router.put(
    "/status/cancel",
    checkIfLoggedIn,
    async (req, res, next) => {
        try {
            const { requestID } = req.body;
            await Request.findOneAndUpdate({ _id : requestID }, { status : 3 });
            res.status(200).json({ code : "success" })
        } catch(error) {
            next(error);
        }
    }
);

router.put(
    "/status/done",
    checkIfLoggedIn,
    async (req, res, next) => {
        try {
            const { requestID } = req.body;
            await Request.findOneAndUpdate({ _id : requestID }, { status : 4 });
            res.status(200).json({ code : "success" })
        } catch(error) {
            next(error);
        }
    }
);

router.put(
    "/update/description",
    checkIfLoggedIn,
    async (req, res, next) => {
        try {
            const { requestID, description } = req.body;
            const request = await Request.findOne({ _id : requestID }).populate("requester");
            if (request.requester._id != req.session.currentUser._id) {
                return res.status(403).json({ code : "forbidden" })
            }
            await Request.findOneAndUpdate({ _id : requestID }, { description } );
            res.status(200).json({ code : "success" })
        } catch(error) {
            next(error);
        }
    }
);


module.exports = router;
