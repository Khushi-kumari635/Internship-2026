// middleware/authMiddleware.js
// This middleware checks whether the incoming request has a valid
// JWT token in its headers. If valid, it attaches the user info to
// req.user so the next route handler can use it.

const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  // We expect the token in the header like: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1]; // get the token part after "Bearer"

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach decoded user data (id, role) to the request object
      req.user = decoded;

      next(); // move on to the actual route handler
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
