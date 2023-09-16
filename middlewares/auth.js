const jwt = require('jsonwebtoken');

const { UNAUTHORIZED } = require('../constants');

module.exports = (req, res, next) => {
  const { cookies } = req;

  if (!cookies || !cookies.token) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }

  const { token } = cookies;
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
};