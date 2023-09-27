const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const xss = require("xss-clean");
const morgan = require("morgan")
const cors = require("cors");
const hpp = require("hpp");

dotenv.config();
const { allRateLimiter, rateLimiterMiddleware } = require("./utils/rateLimiters")
const globalErrorHandler = require('./utils/globalErrorHandler');
const AppError = require('./utils/AppError');
const terminate = require("./utils/terminate")
const connectMongoDB = require("./lib/mongodb");
const choiceRoutes = require("./routes/choiceRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Configure App
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(compression());
app.use(rateLimiterMiddleware(allRateLimiter));
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use("/api/auth", authRoutes);
app.use("/api/choices", choiceRoutes);
app.all("*", (req, res, next) => next(new AppError("This route does not exist.", 404)));
app.use(globalErrorHandler);

// Connect to MongoDB, then start the server
let server;
const PORT = process.env.PORT || 4000;
connectMongoDB().then(() => {
    server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
});

// Listen for unexpected Errors
const exitHandler = terminate(server, {
    coredump: false,
    timeout: 500
})

process.on('uncaughtException', exitHandler(1, 'Unexpected Error'))
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'))
process.on('SIGTERM', exitHandler(0, 'SIGTERM'))
process.on('SIGINT', exitHandler(0, 'SIGINT'))