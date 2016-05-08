// Ad model to Nodepop API
// By: Francisco Gómez Pino

// Mode strict
"use strict";

// Libraries required
let mongoose = require('mongoose');

// Model schema definition
let adSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['sale', 'wanted']
    },
    price: {
        type: Number,
        index: true,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        index: true,
        required: true,
        enum: ['lifestyle', 'mobile', 'motor', 'work']
    }],
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

// List static function
adSchema.statics.list = function (filter, start, limit, sort, callback) {
    let query = Ad.find(filter, "-__v");
    query.skip(start);
    query.limit(limit);
    query.sort(sort);
    return query.exec(callback);
};

// Defining Ad Model
var Ad = mongoose.model('Ad', adSchema);
