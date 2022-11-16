const { verifyToken } = require("../utils/tokenGenerator");

const isSignedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.includes("Bearer ")
      ? req.headers.authorization.split("Bearer ")[1]
      : req.headers.authorization;
    if (!token)
      return res
        .status(401)
        .json({ status: 401, message: "Access Token not provided" });
    const verify = await verifyToken(token);
    if (!verify)
      return res.status(401).json({ status: 401, message: "Unauthorized" });
    // req.wallet = verify.wallet;
    // req.id = verify.id;
    // req.contract = verify.contract;
    // req.chain = verify.chain;
    next();
  } catch (error) {
    return res.status(401).json({ status: 401, message: "Unauthorized" });
  }
};

module.exports = isSignedIn;
