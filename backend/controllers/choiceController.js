const Choice = require("../models/Choice");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync")
const ObjectId = require("mongoose").Types.ObjectId
const cloudinary = require("../lib/cloudinary")

/**
 * Get all choices
 * @route   GET /api/choices
 * @access  Public
 */
exports.getAllChoices = catchAsync(async (req, res, next) => {
    const choices = await Choice.find({})

    return res.json({ ok: true, choices });
});


/**
 * Make choices (gets sent by default every 5 choices)
 * @route   PUT /api/choices
 * @access  Admin
 */
exports.makeChoice = catchAsync(async (req, res, next) => {
    const { choices } = req.body

    /**
     * Validation, example choices array:
     * [
     *     ["<choice ID>", "r|b"],
     *     ["<choice ID>", "r|b"],
     * ]
     */
    if (!choices || !Array.isArray(choices) || choices.length > 10) {
        return next(new AppError("Invalid data received", 400))
    }
    for (let i = 0; i < choices.length; i++) {
        if (!Array.isArray(choices[i]) || choices[i].length !== 2 || !ObjectId.isValid(choices[i][0]) || typeof choices[i][1] !== "string") {
            return next(new AppError("Invalid data received", 400))
        }
    }

    /**
     * Update choices with a unordered bulk operation (runs parallel)
     */
    const bulk = Choice.collection.initializeUnorderedBulkOp()
    for (let i = 0; i < choices.length; i++) {
        const updateObj = choices[i][1] === "r" ? { $inc: { 'red.count': 1 } } : { $inc: { 'blue.count': 1 } };
        bulk.find({ _id: new ObjectId(choices[i][0]) }).updateOne(updateObj)
    }
    await bulk.execute((err, res) => console.log(err, res))

    return res.json({ ok: true });
});


/**
 * Add choice
 * @route   POST /api/choices
 * @access  Admin
 */
exports.addChoice = catchAsync(async (req, res, next) => {
    const { red, blue } = req.body

    if (red.image) {
        const result = await cloudinary.uploader.upload(red.image);
        red.image = result.secure_url;
    }
    if (blue.image) {
        const result = await cloudinary.uploader.upload(blue.image);
        blue.image = result.secure_url;
    }

    await Choice.create({ red, blue })

    return res.json({ ok: true });
});


/**
 * Update choice
 * @route   PUT /api/choices/:id
 * @access  Admin
 */
exports.updateChoice = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const { red, blue } = req.body

    const choice = await Choice.findOneAndUpdate({ _id: id }, {
        ...(red && { red }),
        ...(blue && { blue })
    }, { runValidators: true })
    if (!choice) {
        return next(new AppError("Choice was already deleted or has not been found.", 404))
    }

    return res.json({ ok: true });
});


/**
 * Delete choice
 * @route   DELETE /api/choices/:id
 * @access  Admin
 */
exports.deleteChoice = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const choice = await Choice.findOneAndDelete(id)
    if (!choice) {
        return next(new AppError("Choice was already deleted or has not been found.", 404))
    }

    if (choice?.red?.image) {
        const cloudinaryURL = choice.red.image.split("/")
        const cloudinaryPublicId = cloudinaryURL[cloudinaryURL.length - 1]
        cloudinary.uploader.destroy(cloudinaryPublicId)
    }
    if (choice?.blue?.image) {
        const cloudinaryURL = choice.blue.image.split("/")
        const cloudinaryPublicId = cloudinaryURL[cloudinaryURL.length - 1]
        cloudinary.uploader.destroy(cloudinaryPublicId)
    }

    return res.json({ ok: true });
});


/**
 * Search choice
 * @route   GET /api/choices/search?query=abc
 * @access  Admin
 */
exports.searchChoice = catchAsync(async (req, res, next) => {
    const { query } = req.query

    const searchRegex = new RegExp(query, 'i')
    const choices = await Choice.find({
        $or: [
            {
                "red.text": searchRegex
            },
            {
                "blue.text": searchRegex
            },
            {
                "red.link": searchRegex
            },
            {
                "blue.link": searchRegex
            }
        ]
    })

    return res.json({ ok: true, choices });
});
