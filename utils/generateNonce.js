const Web3 = require("web3");

const generateNonce = async (req, res) => {
  try {
    const nonce = Web3.utils.randomHex(32).slice(2);
    await res.cookie("DehiddenNonce", nonce, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.status(200).json({ status: 200, nonce });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: 400, error: error });
  }
};

module.exports = { generateNonce };
