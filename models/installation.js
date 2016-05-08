// Installation model to Nodepop API
// By: Francisco Gómez Pino

// Mode strict
"use strict";

// Libraries required
let mongoose = require('mongoose');

// Model schema definition
let installationSchema = new mongoose.Schema({
    deviceType: {
        type: String,
        lowercase: true,
        enum: [
            'android',
            'ios'
        ],
        required: true
    },
    deviceToken: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
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

// Defining Installation Model
var Installation = mongoose.model('Installation', installationSchema);
