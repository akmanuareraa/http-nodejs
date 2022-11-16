var express = require("express"),
  router = express.Router(),
  verifyToken = require("../middlewares/authJWT.js"),
  { signup, signin } = require("../controllers/auth.controller.js"),
  { generateNonce } = require("../utils/generateNonce.js"),
  isSignedIn = require("../middlewares/isSignedIn.js");

router.get("/nonce", (req, res) => generateNonce(req, res));

router.post("/login", (req, res) => signin(req, res));

router.get("/validation", isSignedIn, function (req, res) {
  res.status(200).send({
    message: "Access Approved",
  });
});

router.post("/posttweet", isSignedIn, async function (req, res) {
  try {
    const { data: createdTweet } = await client.v2.tweet(req.body.text);
    console.log(
      "Tweet posted successfully !!",
      createdTweet.id,
      ":",
      createdTweet.text
    );
    res
      .status(200)
      .json({ status: 200, data: { new_tweet_id: createdTweet.id } });
  } catch (error) {
    console.error("Error occured while posting new tweet: ", error);
    res.status(500).json({ status: 500, data: { response: error } });
  }
});

router.post("postreply", isSignedIn, async function (req, res) {
  try {
    const { data: createdTweet } = await client.v2.reply(
      req.body.text,
      req.body.tweet_id
    );
    console.log(
      "Tweet posted successfully !!",
      createdTweet.id,
      ":",
      createdTweet.text
    );
    res
      .status(200)
      .json({ status: 200, data: { new_tweet_id: createdTweet.id } });
  } catch (error) {
    console.error("Error occured while posting new tweet: ", error);
    res.status(500).json({ status: 500, data: { response: error } });
  }
});

router.post("/postthread", isSignedIn, async function (req, res) {
  try {
    const { data: createdTweet } = await client.v2.tweetThread(req.body.text);
    console.log("Thread posted successfully !!", createdTweet);
    res.status(200).json({ status: 200, data: { new_tweet_id: createdTweet } });
  } catch (error) {
    console.error("Error occured while posting new tweet: ", error);
    res.status(500).json({ status: 500, data: { response: error } });
  }
});

router.get("/getbalance", isSignedIn, async function (req, res) {
  const chain = "mumbai";
  const options = {
    method: "GET",
    url:
      "https://deep-index.moralis.io/api/v2/" + req.params.account + "/balance",
    params: { chain: chain },
    headers: {
      accept: "application/json",
      "X-API-Key":
        "hBKMMFQMRJJZFNyc718a0NpPmY1tomdBe68FS5hXDfN7fWnvzDdx4eyEknDNRrez",
    },
  };

  await axios
    .request(options)
    .then(function (response) {
      console.log("Axios Response for Balance: ", response.data.balance);
      res
        .status(200)
        .json({ status: 200, data: { balance: response.data.balance } });
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({ status: 500, data: { response: error } });
    });
});

router.get("/verifyownership", async (req, res) => {
  const chain = "mumbai";
  const options = {
    method: "GET",
    url:
      "https://deep-index.moralis.io/api/v2/nft/" +
      req.params.contract_address +
      "/" +
      req.params.token_id +
      "/owners",
    params: { chain: chain, format: "decimal" },
    headers: {
      accept: "application/json",
      "X-API-Key":
        "hBKMMFQMRJJZFNyc718a0NpPmY1tomdBe68FS5hXDfN7fWnvzDdx4eyEknDNRrez",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      console.log("Axios Response for NFT Check: ", response.data.result);
      let result = response.data.result.find(
        ({ owner_of }) => owner_of === req.params.wallet_address
      );
      console.log("NFT Verification Result: ", result);
      if (result) {
        res.status(200).json({ status: 200, data: { ownership: true } });
      } else {
        res.status(200).json({ status: 200, data: { ownership: false } });
      }
    })
    .catch(function (error) {
      console.error("Error occured while checking for NFT: ", error);
      res.status(500).json({ status: 500, data: { response: error } });
    });
});

module.exports = router;
