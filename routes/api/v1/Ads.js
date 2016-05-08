// Ads routes - Ads
// By: Francisco Gómez Pino

// Mode strict
"use strict";

// Libraries required
let router = require('express').Router();
let url = require('url');

// Obtain Ad model
let Ad = require('mongoose').model('Ad');

// Process to list ads
router.get('/', (req, res, next) => {

    let start = parseInt(req.query.start) || 0;
    let limit = parseInt(req.query.limit) || 0;
    let sort = req.query.sort || null;

    let filter = {};

    if (typeof req.query.name !== 'undefined') {
        filter.name = new RegExp('^' + req.query.name, 'i')
    }

    if (typeof req.query.type !== 'undefined') {
        filter.type = req.query.type
    }

    if (typeof req.query.price !== 'undefined') {
        console.log(filterPrice(req.query.price));
        filter.price = filterPrice(req.query.price);
    }

    if (typeof req.query.tags !== 'undefined') {
        if (typeof req.query.tags !== 'object') {
            filter.tags = [req.query.tags];
        }
        if (typeof req.query.tags === 'object') {
            filter.tags = req.query.tags;
        }
        filter.tags = {$in: filter.tags};
    }

    Ad.list(filter, start, limit, sort, (err, rows) => {

        if (err) {
            console.log(err);
            let error = new Error('INTERNAL_ERROR');
            error.status = 500;
            return next(error);
        }

        rows.forEach((row) => {
            row.photo = url.format({
                protocol: req.protocol,
                host: req.get('host'),
                pathname: "/images/ads/" + row.photo
            });
        });

        res.status(200).json({
            success: true,
            rows: rows
        });

    });

});

// Process to list tags
router.get('/tags', function (req, res, next) {

    var query = Ad.find({});

    query.select('tags');

    query.exec(function (err, rows) {

        if (err) {
            console.log(err);
            let error = new Error('INTERNAL_ERROR');
            error.status = 500;
            return next(error);
        }

        let tags = [];

        rows.forEach((row) => {
            row.tags.forEach((tag) => {
                if (tags.indexOf(tag) === -1) {
                    tags.push(tag);
                }
            });
        });

        res.status(200).json({
            success: true,
            rows: tags
        });

    });

});


// Aditional function to check Price
function filterPrice(price) {

    if (/^-[0-9]+$/.test(price)) {
        return {'$lte': parseInt(price.match(/[0-9]+/))};
    }

    if (/^[0-9]+\-$/.test(price)) {
        return {'$gte': parseInt(price.match(/[0-9]+/))};
    }

    if (/^[0-9]+\-[0-9]+$/.test(price)) {
        return {'$gte': parseInt(price.split('-')[0]), '$lte': parseInt(price.split('-')[1])};
    }

    return parseInt(price);

}

// Export router
module.exports = router;
