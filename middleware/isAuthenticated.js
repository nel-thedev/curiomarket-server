const jwt = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) => {
  //get the heather from the token
  const token = req.headers.authorization?.split(' ')[1];

  if (!token || token === 'null') {
    return res.status(400).json({ message: 'Token not found' });
  }

  try {
    //verify the token with the secret
    const tokenInfo = jwt.verify(token, process.env.SECRET);

    //assign the req.user to the token so we have the user information
    req.user = tokenInfo;
    next();
  } catch (error) {
    console.log(error.message, 'Error.message');
    return res.status(401).json(error);
  }
};

module.exports = isAuthenticated;
