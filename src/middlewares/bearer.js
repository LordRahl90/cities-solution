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
  try {
    atob(auth[1]);
  } catch (e) {
    res.status(401).json({ error: e.message });
    return;
  }
  next();
};

module.exports = bearer;
