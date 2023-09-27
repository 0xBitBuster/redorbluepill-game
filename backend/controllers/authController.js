const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync")
const jwt = require("jsonwebtoken")


/**
 * Admin Login
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = catchAsync(async (req, res, next) => {
    const { password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
        return next(new AppError("Wrong password.", 401))
    }

    const access_token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: "2h" });  
    res.cookie('access_token', access_token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2h
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development"
    });

    return res.json({ ok: true });
});
