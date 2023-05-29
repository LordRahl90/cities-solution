const bearer = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization == undefined || authorization.length === 0) {
    res.status(401).json({ error: "token not provided" });
    return;
  }
  auth = authorization.split(" ");
  if (auth.length !== 2) {
    res.status(401).json({ error: "not authorized" });
    return;
  }
  next();
};

module.exports = bearer;
