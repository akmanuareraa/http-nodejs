const express = require("express");
const client = require("./twitterClient");
const axios = require("axios");

const app = express();

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Authorization"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.listen(5000, () => {
  console.log("HTTP Server Started @ 5000");
});

app.get("/test", (req, res) => {
  res.send("Hello World");
});

app.post("/createtweet", async (req, res) => {
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

app.post("/postreply", async (req, res) => {
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

app.post("/postthread", async (req, res) => {
  try {
    const { data: createdTweet } = await client.v2.tweetThread(req.body.text);
    console.log("Thread posted successfully !!", createdTweet);
    res.status(200).json({ status: 200, data: { new_tweet_id: createdTweet } });
  } catch (error) {
    console.error("Error occured while posting new tweet: ", error);
    res.status(500).json({ status: 500, data: { response: error } });
  }
});

app.get("/getBalance", async (req, res) => {
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

app.get("/checkownership", async (req, res) => {
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
