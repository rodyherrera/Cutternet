/***
 * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project root
 * for full license information.
 *
 * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
 *
 * For related information - https://github.com/CodeWithRodi/Cutternet/
 *
 * Cutternet Backend Source Code
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 ****/
const Mongoose = require('mongoose');
const { FormatError } = require('../Utils/RuntimeError');
const TextSearch = require('mongoose-partial-search');
const Validation = require('../Settings/').General.DataValidation.Language;

const LanguageSchema = new Mongoose.Schema({
    Key: {
        type: String,
        trim: true,
        searchable: true,
        required: [true, FormatError('LANGUAGE_KEY_NOT_PROVIDED')],
        maxlength: [Validation.Key.MaxLength, FormatError('LANGUAGE_KEY_MAXLENGTH')],
        minlength: [Validation.Key.MinLength, FormatError('LANGUAGE_KEY_MINLENGTH')]
    },
    Value: {
        type: String,
        trim: true,
        searchable: true,
        required: [true, FormatError('LANGUAGE_VALUE_NOT_PROVIDED')],
        maxlength: [Validation.Value.MaxLength, FormatError('LANGUAGE_VALUE_MAXLENGTH')]
    },
    Language: {
        type: String,
        trim: true,
        required: [true, FormatError('LANGUAGE_LANGUAGE_NOT_PROVIDED')],
        maxlength: [Validation.Language.MaxLength, FormatError('LANGUAGE_LANGUAGE_MAXLENGTH')],
        minlength: [Validation.Language.MinLength, FormatError('LANGUAGE_LANGUAGE_MINLENGTH')]
    }
});

LanguageSchema.plugin(TextSearch);
LanguageSchema.index({ Key: 1, Language: 1 }, { unique: true });

const Language = Mongoose.model('Language', LanguageSchema);

module.exports = Language;
