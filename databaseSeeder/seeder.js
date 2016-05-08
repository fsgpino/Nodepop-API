// Database Seeder - Nodepop API
// By: Francisco Gómez Pino

// Mode strict
"use strict";

// Libraries required
let bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');

// Start connection with MongoDB
require('../library/mongo');

// Load Nodepop models
require('../models/user.js');
require('../models/installation');
require('../models/ad.js');

// Obtain models
let Ad = require('mongoose').model('Ad');
let User = require('mongoose').model('User');
let Installation = require('mongoose').model('Installation');

// Function to read files
function reader(file, callback) {
    fs.readFile(path.join(__dirname, 'jsons', file + '.json'), (err, data) => {
        if (err) {
            return callback(err);
        }
        return callback(null, JSON.parse(data));
    });
}

// Function to insert in database
function inserter(data, collection, callback) {
    data.forEach((item) => {

        var mongooseItem;

        switch (collection) {
            case 'Ads':
                mongooseItem = new Ad(item);
                break;
            case 'Installations':
                mongooseItem = new Installation(item);
                break;
            case 'Users':
                item.password = bcrypt.hashSync(item.password);
                mongooseItem = new User(item);
                break;
            default:
                return callback(new Error('Collection invalid'));
        }

        mongooseItem.save((err, itemSaved) => {
            if (err) {
                return callback(err);
            }
            return callback(null, itemSaved);
        });

    });

}

Ad.remove({}, (err) => {
    if (err) {
        return console.log('Error removing Ad object in BD: ', err);
    }
});

Installation.remove({}, (err) => {
    if (err) {
        return console.log('Error removing Installations object in BD: ', err);
    }
});

User.remove({}, (err) => {
    if (err) {
        return console.log('Error removing Users object in BD: ', err);
    }
});

// Loading Ads in database
reader('Ads', (err, data) => {
    if (err) {
        return console.log('Reading Ads Error: ', err);
    }
    inserter(data, 'Ads', (err, item) => {
        if (err) {
            return console.log('Inserting Ads Error: ', err);
        }
        return console.log('Item saved:', item);
    });
});

// Loading Users in database
reader('Users', (err, data) => {
    if (err) {
        return console.log('Reading Users Error: ', err);
    }
    inserter(data, 'Users', (err, item) => {
        if (err) {
            return console.log('Inserting Users Error: ', err);
        }
        return console.log('Item saved:', item);
    });
});

// Loading Installations in database
reader('Installations', (err, data) => {
    if (err) {
        return console.log('Reading Installations Error: ', err);
    }
    inserter(data, 'Installations', (err, item) => {
        if (err) {
            return console.log('Inserting Installations Error: ', err);
        }
        return console.log('Item saved:', item);
    });
});
