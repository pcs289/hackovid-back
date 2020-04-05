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

module.exports = {
  checkIfLoggedIn,
  checkUsernameAndPasswordNotEmpty,
  checkUsernameNotEmpty,
};
