// Users routes - Users
// By: Francisco Gómez Pino

// Mode strict
"use strict";

// Libraries required
let router = require('express').Router();
let jwt = require('jsonwebtoken');
let JWTAuth = require('../../../library/JWTAuth');
let bcrypt = require('bcrypt-nodejs');

// Obtain settings for JSON Web Authentication
let configJWT = require('../../../configuration').JSONWebToken;

// Obtain User model
let User = require('mongoose').model('User');

// Process to view info user
router.get('/view', JWTAuth(), (req, res, next) => {

    User.findOne({_id: req.decoded.id}, '-_id -__v').exec((err, user) => {

        if (err) {
            console.log(err);
            let error = new Error('INTERNAL_ERROR');
            error.status = 500;
            return next(error);
        }

        if (!user) {
            let error = new Error('USER_NOT_FOUND');
            error.status = 404;
            return next(error);
        }

        res.status(200).json({
            success: true,
            user: user
        });

    });

});

// Process to login user
router.post('/login', (req, res, next) => {

    User.findOne({email: req.body.email}, '+password').exec((err, user) => {

        if (err) {
            console.log(err);
            let error = new Error('INTERNAL_ERROR');
            error.status = 500;
            return next(error);
        }

        if (!user) {
            let error = new Error('USER_NOT_FOUND');
            error.status = 404;
            return next(error);
        }

        bcrypt.compare(req.body.password, user.password, function (err, valid) {

            if (err) {
                console.log(err);
                let error = new Error('INTERNAL_ERROR');
                error.status = 500;
                return next(error);
            }

            if (!valid) {
                let error = new Error('INVALID_PASSWORD');
                error.status = 401;
                return next(error);
            }

            let token = jwt.sign({id: user._id}, configJWT.secret, {
                expiresIn: configJWT.expiresIn
            });

            return res.status(200).json({
                success: true,
                token: token
            });

        });

    });

});

// Process to register user
router.post('/register', (req, res, next) => {

    User.findOne({email: req.body.email}).exec(function (err, user) {

        if (err) {
            console.log(err);
            let error = new Error('INTERNAL_ERROR');
            error.status = 500;
            return next(error);
        }

        if (user) {
            let error = new Error('USER_ALREDY_EXIST');
            error.status = 406;
            return next(error);
        }

        bcrypt.hash(req.body.password, null, null, function (err, hash) {

            if (err) {
                console.log(err);
                let error = new Error('INTERNAL_ERROR');
                error.status = 500;
                return next(error);
            }

            let newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash
            });

            newUser.save((err, newUser) => {

                if (err) {
                    console.log(err);
                    let error = new Error('VALIDATION_USER_ERROR');
                    error.status = 406;
                    return next(error);
                }

                let token = jwt.sign({id: newUser._id}, configJWT.secret, {
                    expiresIn: configJWT.expiresIn
                });

                return res.status(200).json({
                    success: true,
                    token: token
                });

            });

        });

    });

});

// Export router
module.exports = router;
