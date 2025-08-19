const express = require("express");// require npm i express
const app = express();
const mongoose = require("mongoose");   // require npm i mongoose
const dotenv = require("dotenv");// require npm i dotenv
const path = require("path");// require npm i path
const methodover = require("method-override"); // require npm i method-override
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./router/listing.js");
const reviews = require("./router/review.js");
const session = require("express-session");// require npm i express-session
const flash = require("connect-flash"); // require npm i connect-flash
const port = 8080;

// // Importing custom error handling and async wrapper utilities

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
// Load environment variables from .env file
dotenv.config();
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => { console.log("Connected to MongoDB"); })
    .catch((err) => { console.error("Error connecting to MongoDB:", err); });


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/", (req, res) => {
    res.redirect("/listings");
})
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


app.all("/*path", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});
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
