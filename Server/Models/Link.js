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
const Validator = require('validator');
const Slugify = require('slugify');
const LinkStatistic = require('./LinkStatistic');
const { FormatError } = require('../Utils/RuntimeError');
const TextSearch = require('mongoose-partial-search');
const Validation = require('../Settings/').General.DataValidation.Link;

const LinkSchema = new Mongoose.Schema({
    Link: {
        type: String,
        validate: [Validator.isURL, FormatError('LINK_INVALID_URL')],
        required: [true, FormatError('LINK_URL_NOT_PROVIDED')],
        trim: true
    },
    User: {
        type: Mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, FormatError('LINK_USER_NOT_PROVIDED')]
    },
    Name: {
        type: String,
        searchable: true,
        maxlength: [Validation.Name.MaxLength, FormatError('LINK_NAME_MAXLENGTH')],
        minlength: [Validation.Name.MinLength, FormatError('LINK_NAME_MINLENGTH')],
        required: [true, FormatError('LINK_NAME_NOT_PROVIDED')]
    },
    Visits: {
        type: Number,
        default: 0
    },
    CreatedAt: {
        type: Date,
        default: Date.now()
    },
    IsActive: {
        type: Boolean,
        default: true
    }
});

LinkSchema.plugin(TextSearch);

// ! User just have 1 link with same name and url
LinkSchema.index({ Name: 1, User: 1 }, { unique: true });

// ! To User reference
LinkSchema.virtual('LinkStatistics', {
    ref: 'LinkStatistic',
    foreignField: 'Link',
    localField: '_id'
});

LinkSchema.pre(['findOneAndDelete', 'deleteMany'], async function (Next) {
    const Query = this.getQuery();
    let Filter = {};
    // ! If it is called when user delete their account
    if (Query.User) Filter = { User: Query.User };
    // ! If it is called directly from model (Link.deleteMany || ...)
    else Filter = { Link: Query._id };

    await LinkStatistic.deleteMany(Filter);
    Next();
});

LinkSchema.pre(/^find/, function (Next) {
    if (this.getQuery() && this.getQuery().Name)
        this.getQuery().Name = Slugify(this.getQuery().Name, { lower: true });
    if (this.getUpdate() && this.getUpdate().Name)
        this.getUpdate().Name = Slugify(this.getUpdate().Name, { lower: true });
    this.populate({
        path: 'User',
        select: 'Username Email'
    });
    Next();
});

LinkSchema.pre('save', function (Next) {
    this.Name = Slugify(this.Name, { lower: true });
    Next();
});

const Link = Mongoose.model('Link', LinkSchema);

module.exports = Link;
