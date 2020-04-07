const User = require("../models/User");

const checkIfLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.status(401).json({ code: "unauthorized" });
  }
};

const checkUsernameAndPasswordNotEmpty = (req, res, next) => {
  const { username, password, name, surname } = req.body;
  console.log("resocals", req.body);
  if (username !== "" && password !== "" && name !== "" && surname != "") {
    res.locals.auth = req.body;
    next();
  } else {
    res.status(422).json({ code: "validation" });
  }
};

const checkUsernameNotEmpty = (req, res, next) => {
  const { username } = req.body;
  if (username !== "") {
    res.locals.auth = req.body;
    next();
  } else {
    res.status(422).json({ code: "validation" });
  }
};

const checkDuplicatedRequest = async (req, res, next) => {
  const { requester, preference } = req.body;
  if (!(await User.exists({ _id : req.session.currentUser._id, requests: { requester : requester, preference : preference, status : 0 }}) || 
        await User.exists({ _id : req.session.currentUser._id, requests: { requester : requester, preference : preference, status : 1 }}))) {
      next();
  } else {
    res.status(409).json({ code: "conflict" });
  }
} 

module.exports = {
  checkIfLoggedIn,
  checkUsernameAndPasswordNotEmpty,
  checkUsernameNotEmpty,
  checkDuplicatedRequest
};
