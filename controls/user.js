const User = require("../model/user.js");


module.exports.renderSignupForm = async (req, res) => {
    res.render("./user/register.ejs");
};

module.exports.signup = async (req, res) => {
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

};

module.exports.renderLoginForm = async (req, res) => {
    res.render("./user/login.ejs");
};

module.exports.login = async (req, res) => {
        req.flash("success", "Welcome back!");
        let redirect = res.locals.redirectURL || "/listings";
        console.log(redirect);
        res.redirect(redirect);
};

module.exports.logout = async (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Successfully logged out!");
        res.redirect("/listings");
    })

};