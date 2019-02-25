module.exports = function (req,res,next) {
  //401 Unauthorized -- user doesn't supply a valid jwt
  //403 Forbidden -- the role doesn't have power
  
  if(!req.user.isAdmin){
    return res.status(403).send('Access denied.')
  }
  next()
};