// Installations routes - Installations
// By: Francisco Gómez Pino

// Mode strict
"use strict";

// Libraries required
let router = require('express').Router();
let jwt = require('jsonwebtoken');

// Obtain settings for JSON Web Authentication
let configJWT = require('../../../configuration').JSONWebToken;

// Obtain Installation model
let Installation = require('mongoose').model('Installation');

// Process to register device
router.post('/register', (req, res, next) => {

    // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    let newInstallation = new Installation({
        deviceType: req.body.deviceType,
        deviceToken: req.body.deviceToken
    });

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, configJWT.secret, function (err, decoded) {
            if (err) {
                let error = new Error('FAILED_TO_AUTHENTICATE_TOKEN');
                error.status = 401;
                return next(error);
            }

            newInstallation.user = decoded.id;

            newInstallation.save((err) => {
                if (err) {
                    console.log(err);
                    let error = new Error('VALIDATION_INSTALLATION_ERROR');
                    error.status = 406;
                    return next(error);
                }
                return res.status(200).json({
                    success: true
                });
            });
        });

    } else {

        newInstallation.save((err) => {
            if (err) {
                console.log(err);
                let error = new Error('VALIDATION_INSTALLATION_ERROR');
                error.status = 406;
                return next(error);
            }
            return res.status(200).json({
                success: true
            });
        });

    }
});

// Export router
module.exports = router;
