const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const secret = process.env.JWT_SECRET || "your-secret-key";
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.userId = decoded.id;
      return next();
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = authenticateToken;
