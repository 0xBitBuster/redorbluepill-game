const mongoose = require("mongoose");

const ChoiceSchema = new mongoose.Schema({
    __v: { 
        type: Number, 
        select: false
    },
    red: {
        text: {
            type: String,
            minlength: [2, "Choice must be at least 2 characters long."],
            maxlength: [200, "Choise must be 200 characters at most."],
            required: true
        },
        image: {
            type: String,
            minlength: [8, "Choice Image must be at least 8 characters long."],
            maxlength: [500, "Choice Image must be 500 characters at most."],
        },
        author: {
            type: String,
            minlength: [2, "Author name must be at least 1 characters long."],
            maxlength: [100, "Author name must be 100 characters at most."],
        },
        link: {
            type: String,
            minlength: [8, "Choice Link must be at least 8 characters long."],
            maxlength: [500, "Choice Link must be 500 characters at most."],
        },
        count: {
            type: Number,
            default: 1,
            min: [1, "Count must be at least 1"]
        }
    },
    blue: {
        text: {
            type: String,
            minlength: [2, "Choice must be at least 2 characters long."],
            maxlength: [200, "Choise must be 200 characters at most."],
            required: true
        },
        image: {
            type: String,
            minlength: [8, "Choice Image must be at least 8 characters long."],
            maxlength: [500, "Choice Image must be 500 characters at most."],
        },
        author: {
            type: String,
            minlength: [2, "Author name must be at least 1 characters long."],
            maxlength: [100, "Author name must be 100 characters at most."],
        },
        link: {
            type: String,
            minlength: [8, "Choice Link must be at least 8 characters long."],
            maxlength: [500, "Choice Link must be 500 characters at most."],
        },
        count: {
            type: Number,
            default: 1,
            min: [1, "Count must be at least 0"]
        }
    },
});

module.exports = mongoose.model("Choice", ChoiceSchema);
