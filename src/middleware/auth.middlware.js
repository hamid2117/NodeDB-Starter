const jwt = require('jsonwebtoken')

module.exports = function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization']
  if (!authHeader)
    return res.status(401).json({ message: 'Missing authorization header' })
  const token = authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Token not provided' })

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' })
    req.user = decoded
    next()
  })
}
