// twitter and passport integration
const cookieSession = require("cookie-session");
const session = require("express-session");
const passport = require("passport");
require("./passport");

//Configure dotenv files above using any other library and files
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const isLoggedIn = require("./middlewares/auth");
const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  userRoutes = require("./routes/user");

//Connect to database
try {
  mongoose.connect("mongodb://localhost:27017/usersdb", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
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

