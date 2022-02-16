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
const Validation = require('../Settings/').General.DataValidation.LinkStatistic;

const LinkStatisticSchema = new Mongoose.Schema({
    Link: {
        type: Mongoose.Schema.ObjectId,
        ref: 'Link',
        required: [true, FormatError('LINK_STATISTIC_URL_NOT_PROVIDED')]
    },
    IPAddress: {
        type: String,
        searchable: true,
        maxlength: [Validation.IPAddress.MaxLength, FormatError('LINK_STATISTIC_IP_MAXLENGTH')],
        required: [true, FormatError('LINK_STATISTIC_IP_NOT_PROVIDED')]
    },
    BrowserLanguage: {
        type: String,
        maxlength: [
            Validation.BrowserLanguage.MaxLength,
            FormatError('LINK_STATISTIC_BROWSER_LANGUAGE_MAXLENGTH')
        ],
        minlength: [
            Validation.BrowserLanguage.MinLength,
            FormatError('LINK_STATISTIC_BROWSER_LANGUAGE_MINLENGTH')
        ],
        required: [true, FormatError('LINK_STATISTIC_BROWSER_LANGUAGE_NOT_PROVIDED')]
    },
    OperatingSystem: {
        type: String,
        searchable: true,
        maxlength: [
            Validation.OperatingSystem.MaxLength,
            FormatError('LINK_STATISTIC_OS_MAXLENGTH')
        ],
        required: [true, FormatError('LINK_STATISTIC_OS_NOT_PROVIDED')]
    },
    Browser: {
        searchable: true,
        type: String,
        maxlength: [Validation.Browser.MaxLength, FormatError('LINK_STATISTIC_BROWSER_MAXLENGTH')],
        required: [true, FormatError('LINK_STATISTIC_BROWSER_NOT_PROVIDED')]
    },
    Country: {
        searchable: true,
        type: String,
        maxlength: [Validation.Country.MaxLength, FormatError('LINK_STATISTIC_COUNTRY_MAXLENGTH')],
        default: 'Unknown'
    },
    Region: {
        type: String,
        maxlength: [Validation.Region.MaxLength, FormatError('LINK_STATISTIC_REGION_MAXLENGTH')],
        default: 'Unknown'
    },
    City: {
        type: String,
        maxlength: [Validation.City.MaxLength, FormatError('LINK_STATISTIC_CITY_MAXLENGTH')],
        default: 'Unknown'
    },
    Timezone: {
        searchable: true,
        type: String,
        maxlength: [
            Validation.Timezone.MaxLength,
            FormatError('LINK_STATISTIC_TIMEZONE_MAXLENGTH')
        ],
        default: 'Unknown'
    },
    Latitude: {
        type: String,
        maxlength: [
            Validation.Latitude.MaxLength,
            FormatError('LINK_STATISTIC_LATITUDE_MAXLENGTH')
        ],
        default: 'Unknown'
    },
    Longitude: {
        type: String,
        maxlength: [
            Validation.Longitude.MaxLength,
            FormatError('LINK_STATISTIC_LONGITUDE_MAXLENGTH')
        ],
        default: 'Unknown'
    },
    RegisteredAt: {
        type: Date,
        default: Date.now
    }
});

LinkStatisticSchema.plugin(TextSearch);

LinkStatisticSchema.pre(/^find/, function (Next) {
    this.populate({
        path: 'Link',
        select: 'Link'
    });
    Next();
});

const LinkStatistic = Mongoose.model('LinkStatistic', LinkStatisticSchema);

module.exports = LinkStatistic;
