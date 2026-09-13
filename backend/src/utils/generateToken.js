const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT for a participant.
 * @param {Object} participant - Mongoose participant document
 * @returns {string} Signed JWT string
 */
function generateToken(participant) {
  const payload = {
    id: participant._id,
    email: participant.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '60m',
  });
}

module.exports = generateToken;
