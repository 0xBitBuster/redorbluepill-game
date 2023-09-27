const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const verifyAuthentication = (req, res, next) => {
	const token = req.cookies.access_token || req.body.access_token;
	if (!token) {
		return next(new AppError("Invalid token", 401))
	}

	try {
		jwt.verify(token, process.env.JWT_SECRET);
	} catch (_) {
		return next(new AppError("Invalid token", 401))
	}

	return next();
};

module.exports = verifyAuthentication;
