var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
var flash = require("connect-flash");
var bodyParser = require("body-parser");
var params = require("./params/params");
var session = require("express-session");
const passport = require("passport");
// const ejsLint = require("ejs-lint");

var app = express();

/* Connecting to the database. */
mongoose.connect(
	params.DATABASECONNECTION,
	{
		useUnifiedTopology: true,
	},
	(err) => {
		if (err) throw err;
		console.log("Connected to MongoDB");
	}
);

/* Setting the port to 3000. */
app.set("port", process.env.PORT || 8080);

/* Setting the views directory to the views folder. */
app.set("views", path.join(__dirname, "views"));

/* Setting the view engine to ejs. */
app.set("view engine", "ejs");

app.use(express.static("views"));
/* Parsing the body of the request. */
app.use(
	bodyParser.urlencoded({
		extended: false,
	})
);

/* Parsing the cookies. */
app.use(cookieParser());

/* Creating a session. */
app.use(session({ secret: "qwerty", resave: true, saveUnintialized: true }));

/* Initializing the passport. */
app.use(passport.initialize());

/* Creating a session for the user. */
app.use(passport.session());
// require("./setuppassport")(passport);

// app.use(function (req, res, next) {
	// 	res.locals.message = req.flash();
	// 	next();
	// });
	
	/* Used to display the flash messages. */
	app.use(flash());
	
	app.use("/", require("./routes/web"));
	app.use("/api", require("./routes/api"));

	/* Listening to the port 3000. */
	app.listen(app.get("port"), function () {
		console.log("Server started at port " + app.get("port"));
	});
	