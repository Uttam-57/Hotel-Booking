const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { redirectUrl } = require("../middleware.js");
const userController = require("../controls/user.js");

router.route("/register")
.get( wrapAsync(userController.renderSignupForm))
.post( wrapAsync(userController.signup))

router.route("/login")
.get( wrapAsync(userController.renderLoginForm))
.post(redirectUrl,
    passport.authenticate("local",
        {
            failureRedirect: "/login",
            failureFlash: true
        }
    ), wrapAsync(userController.login));



// Logout route
router.get("/logout", wrapAsync(userController.logout));

module.exports = router;