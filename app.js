// Express application - Nodepop API

// Mode strict
"use strict";

// Libraries required
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var JWTAuth = require('./library/JWTAuth');
var i18n = require('./library/i18n');
var configuration = require('./configuration');

// Start app express
var app = express();

// Start connection with MongoDB
require('./library/mongo');

// Load Nodepop models
require('./models/user.js');
require('./models/installation');
require('./models/ad.js');

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Settings features
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Get the language reading header x-lang
app.use((req, res, next) => {
    req.lang = req.get('x-lang') || configuration.language.default;
    next();
});

// Routes to Nodepop API
app.use('/', require('./routes/index'));
app.use('/api/v1/users', require('./routes/api/v1/Users'));
app.use('/api/v1/installations', require('./routes/api/v1/Installations'));
app.use('/api/v1/ads', JWTAuth(), require('./routes/api/v1/Ads')); // Required authentification

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('NOT_FOUND');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        i18n(req.lang, err.message).then((value) => {
            res.json({
                success: false,
                message: value,
                error: err
            });
        }).catch((lang_err) => {
            res.json({
                success: false,
                message: lang_err,
                error: err
            });
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    i18n(req.lang, err.message).then((value) => {
        res.json({
            success: false,
            message: value
        });
    }).catch((err_lang) => {
        res.json({
            success: false,
            message: "Language Error"
        });
    });
});

// Export application
module.exports = app;
