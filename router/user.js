const express = require("express");
const router = express.Router();
const User = require("../model/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {redirectUrl} = require("../middleware.js");

// Register routes
router.get("/register", wrapAsync(async (req, res) => {
    res.render("./user/register.ejs");
}));

router.post("/register", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Successfully registered!");
            res.redirect("/listings");
        })

    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }

}));

// Login routes
router.get("/login", wrapAsync(async (req, res) => {
    res.render("./user/login.ejs");
}));

router.post("/login", redirectUrl,
    passport.authenticate("local",
     {
        failureRedirect: "/login",
        failureFlash: true
    }
), wrapAsync(async (req, res) => {
        req.flash("success", "Welcome back!");
        let redirect = res.locals.redirectURL || "/listings";
        console.log(redirect);
        res.redirect(redirect);
    }));

// Logout route
router.get("/logout", wrapAsync(async (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Successfully logged out!");
        res.redirect("/listings");
    })

}));

module.exports = router;