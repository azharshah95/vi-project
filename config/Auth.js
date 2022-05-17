// @desc Check Role Middleware
const checkRole = roles => (req, res, next) =>
  !roles.includes(req.user.role)  // userobject must have a role key/value
    ? res.status(401).json("Unauthorized")
    : next();


module.exports = { checkRole }