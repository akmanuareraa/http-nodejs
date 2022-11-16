// twitter and passport integration
const cookieSession = require("cookie-session");
const session = require("express-session");
const passport = require("passport");
var bodyParser = require("body-parser");
require("./passport");

//Configure dotenv files above using any other library and files
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const isLoggedIn = require("./middlewares/auth");
const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  userRoutes = require("./routes/user");

app.use(express.json({ limit: 5000000 }));
app.use(express.urlencoded({ limit: 5000000, extended: true }));

//Connect to database
try {
  mongoose.connect(
    "mongodb+srv://manuareraa:dehidden@manu-personal-cluster.nkqft.mongodb.net/usersdb",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  );
  console.log("connected to db");
} catch (error) {
  handleError(error);
}
process.on("unhandledRejection", (error) => {
  console.log("unhandledRejection", error.message);
});

// twitter and password integration
// twitter and passport integration
// app.use(
//   cookieSession({
//     name: "twitter-auth-session",
//     keys: ["key1", "key2"],
//   })
// );
app.use(
  session({
    secret: "somethingsecretgoeshere",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true },
  })
);

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

app.use(passport.initialize());
app.use(passport.session());

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: true,
  })
);

// app.use(
//   bodyParser.json({
//     limit: "50mb",
//   })
// );

// app.use(
//   bodyParser.urlencoded({
//     limit: "50mb",
//     parameterLimit: 100000,
//     extended: true,
//   })
// );

// app.use(bodyParser.json({ limit: "10mb" }));
// app.use(express.bodyParser({limit: '50mb'}));

//using user route
app.use(userRoutes);

//setup server to listen on port 8080
app.listen(3000, () => {
  console.log("Server is live on port 3000", process.env.PORT);
});

app.get("/test", (req, res) => {
  res.json({ message: "API Working" });
});

// twitter and password integration
app.get("/auth/error", (req, res) => res.send("Unknown Error"));
app.get("/auth/twitter", passport.authenticate("twitter"));
app.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/auth/error" }),
  function (req, res) {
    res.redirect("/");
  }
);

app.get("/", isLoggedIn, (req, res) => {
  // res.send(`Hello world ${req.user.displayName}`);
  res.status(200).json({
    status: 200,
    data: { authenticate: "successful", username: req.user.displayName },
  });
});
app.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
});
