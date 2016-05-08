// JWT auth middleware for use with Express 4.x. - JSONAuth

// Mode strict
"use strict";

// Libraries required
let jwt = require('jsonwebtoken');

// Obtain settings for JSON Web Authentication
let configJWT = require('../configuration').JSONWebToken;

/**
 * JWT auth middleware for use with Express 4.x.
 *
 * @example
 * app.use('/api-requiring-auth', jwtAuth());
 *
 * @returns {function} Express 4 middleware
 */
module.exports = function () {
    return function (req, res, next) {

        // check header or url parameters or post parameters for token
        let token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, configJWT.secret, function (err, decoded) {
                if (err) {
                    let error = new Error('FAILED_TO_AUTHENTICATE_TOKEN');
                    error.status = 401;
                    next(error);
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    return next();
                }
            });

        } else {

            // if there is no token return error
            let error = new Error('NO_TOKEN_PROVIDED');
            error.status = 403;
            next(error);

        }
    };
};
