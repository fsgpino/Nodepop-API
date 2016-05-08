// Configuration to Nodepop API

// Mode strict
"use strict";

// Settings
module.exports = {
    mongo: {
        URI: 'mongodb://localhost:27017/nodepop',
        options: {
            server: {
                reconnectTries: 3
            }
        }
    },
    JSONWebToken: {
        secret: '2lak3mdurn5jxu3jsndi2hce',
        expiresIn: '1 day'
    },
    language: {
        default: "en",
        available: ["en", "es"]
    }
};
