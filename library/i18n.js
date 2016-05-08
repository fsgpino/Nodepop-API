// Translation library - i18n
// By: Francisco Gómez Pino

// Mode strict
"use strict";

// Libraries required
let fs = require('fs');
let path = require('path');

// Obtain settings for language
let languagesSettings = require('../configuration').language;

// Array where languages are loaded
let languagesLoaded = [];

// Function to check if the language is loaded in memory
function is_loaded(language) {
    return languagesLoaded[language] !== undefined;
}

// Function to load language in memory
function load_language(language) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join('./languages', language + '.json'), {encoding: 'utf8'}, function (err, data) {
            if (err) {
                return reject("i18n " + err);
            }
            languagesLoaded[language] = JSON.parse(data);
            return resolve();
        });
    });
}

// Function to get a sentence by key
function obtainSentence(key, language, resolve, reject) {
    if (languagesLoaded[language][key] === undefined) {
        return reject('i18n Error: The \'' + key + '\' key does not exist in the language file \'' + language + '\'');
    }
    return resolve(languagesLoaded[language][key]);
}

// Main function obtains a sentence by language and key (Saved in exports)
module.exports = function (language, key) {
    return new Promise((resolve, reject) => {
        var selected = languagesSettings.default;
        if (languagesSettings.available.indexOf(language) != -1) {
            selected = language;
        }
        if (is_loaded(selected)) {
            return obtainSentence(key, selected, resolve, reject);
        } else {
            load_language(selected).then(() => {
                return obtainSentence(key, selected, resolve, reject);
            }).catch((err) => {
                return reject(err);
            });
        }
    });
};
