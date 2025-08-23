const express = require("express");// require npm i express
const app = express();
const mongoose = require("mongoose");   // require npm i mongoose
const dotenv = require("dotenv");// require npm i dotenv
const path = require("path");// require npm i path
const methodover = require("method-override"); // require npm i method-override
const session = require("express-session");// require npm i express-session
const flash = require("connect-flash"); // require npm i connect-flash
const passport = require("passport"); // require npm i passport
const LocalStrategy = require("passport-local"); // require npm i passport-local

const port = 8080;
// Load environment variables from .env file
dotenv.config();
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => { console.log("Connected to MongoDB"); })
    .catch((err) => { console.error("Error connecting to MongoDB:", err); });

const User = require("./model/user.js");

const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./router/listing.js");
const reviewsRouter = require("./router/review.js");
const userRouter = require("./router/user.js"); 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodover("_method"));

// Set up EJS as the template engine with ejs-mate for layout support
// This allows us to use EJS with layout support, making it easier to manage templates
app.engine("ejs", require("ejs-mate"));


// Set up EJS as the template engine
// Set the view engine to EJS and specify the views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const sessionoptions = {
    secret: "ki77uu",
    resave: false,// resave false means ki agar session me koi bhi data nahi hai to bhi session ko save nahi karega
    saveUninitialized: true,    // save uninitialized sessions true means ki session me koi bhi data nahi hai to bhi save ho jayegi
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3, // Cookie will expire after 3 days
        maxAge: 1000 * 60 * 60 * 24 * 3, // Cookie will expire after 3 day
        httpOnly: true, // Cookie is not accessible via JavaScript
        // secure: false // Set to true if using HTTPS
    }
}

app.use(session(sessionoptions)); // Use session middleware to manage user sessions
app.use(flash()); // Use flash middleware to manage flash messages

app.use(passport.initialize()); // Initialize passport for authentication
app.use(passport.session()); // Use passport session to manage user sessions    

passport.use(new LocalStrategy(User.authenticate())); // Use LocalStrategy for user authentication
passport.serializeUser(User.serializeUser()); // Serialize user for session support
passport.deserializeUser(User.deserializeUser()); // Deserialize user from session 


//flash messages middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user; // req.user is set by passport and contains the authenticated user
    next();
});

app.get("/", (req, res) => {
    res.redirect("/listings");
})


//router middleware
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter); 

// error handling middleware
// app.all("/*path", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"));
// });
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    let stack = err.stack;
    console.log(statusCode, "     ", "   ", message, stack);
    res.render("error.ejs", { statusCode, message, stack });
});


app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
// http://localhost:3000/
