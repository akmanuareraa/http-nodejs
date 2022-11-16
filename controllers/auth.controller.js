var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var User = require("../models/user");
const Web3 = require("web3");
const { generateToken } = require("../utils/generateToken");

exports.signup = (req, res) => {
  const user = new User({
    fullName: req.body.fullName,
    email: req.body.email,
    role: req.body.role,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({
        message: err,
      });
      return;
    } else {
      res.status(200).send({
        message: "User Registered successfully",
      });
    }
  });
};

// exports.generateNonce = async (req, res) => {
//   try {
//     const nonce = Web3.utils.randomHex(32).slice(2);
//     await res.cookie("DehiddenNonce", nonce, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
//       maxAge: 1000 * 60 * 60 * 24 * 7,
//     });
//     return res.status(200).json({ status: 200, nonce });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({ status: 400, error: error });
//   }
// };

exports.signin = async (req, res) => {
  try {
    const web3 = new Web3();
    // const nonce = req.cookies.DehiddenNonce || req.body.nonce;
    const nonce = req.body.nonce;
    if (!nonce)
      return res.status(400).json({ status: 400, error: "Invalid signature" });
    const { signature } = req.body;
    const address = web3.eth.accounts.recover(nonce, signature);
    if (!address || !Web3.utils.isAddress(address))
      return res.status(400).json({ status: 400, error: "Invalid signature" });
    // const { data, error, contract_address, chain } = await CreateOrLoginUser(
    //   address,
    //   req.body.id
    // );
    // if (error) return res.status(400).json({ status: 400, error });
    const token = generateToken({
      wallet: address,
    });
    res.cookie("DehiddenToken", token);
    return res
      .status(200)
      // .json({ status: 200, data: data?.wallet, token: token });
      .json({ status: 200, data: address, token: token });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: 400, error: error });
  }
};

// exports.signin = (req, res) => {
//   User.findOne({
//     email: req.body.email,
//   }).exec((err, user) => {
//     if (err) {
//       res.status(500).send({
//         message: err,
//       });
//       return;
//     }
//     if (!user) {
//       return res.status(404).send({
//         message: "User Not found.",
//       });
//     }

//     //comparing passwords
//     var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
//     // checking if password was valid and send response accordingly
//     if (!passwordIsValid) {
//       return res.status(401).send({
//         accessToken: null,
//         message: "Invalid Password!",
//       });
//     }
//     //signing token with user id
//     var token = jwt.sign(
//       {
//         id: user.id,
//       },
//       process.env.API_SECRET,
//       {
//         expiresIn: 86400,
//       }
//     );

//     //responding to client request with user profile success message and  access token .
//     res.status(200).send({
//       user: {
//         id: user._id,
//         email: user.email,
//         fullName: user.fullName,
//       },
//       message: "Login successfull",
//       accessToken: token,
//     });
//   });
// };
