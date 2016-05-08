// MongoDB connection library - mongo
// By: Francisco Gómez Pino

// Mode strict
"use strict";

// Libraries required
let mongoose = require('mongoose');

// Obtain settings for mongo
let mongoSettings = require('../configuration').mongo;

// Listener to show Mongo connection errors in console
mongoose.connection.on('error', console.error.bind(console, 'MongoDB Connection Error: '));

// Listener to show Mongo connection info in console
mongoose.connection.once('open', function () {
    console.info('Connected to ', mongoSettings.URI);
});

// Connecting to mongodb
mongoose.connect(mongoSettings.URI, mongoSettings.options);
