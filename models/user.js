// User model to Nodepop API
// By: Francisco Gómez Pino

// Mode strict
"use strict";

// Libraries required
let mongoose = require('mongoose');

// Model schema definition
let userSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        index: true,
        unique: true,
        required: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password: {
        type: String,
        select: false,
        required: true
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

// Defining User Model
var User = mongoose.model('User', userSchema);
