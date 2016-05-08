// Index routes - Index

// Mode strict
"use strict";

// Libraries required
let router = require('express').Router();

// Get home page
router.get('/', function (req, res) {
    res.render('index', {title: 'Nodepop API'});
});

// Export router
module.exports = router;
