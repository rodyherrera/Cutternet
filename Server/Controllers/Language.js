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
const Language = require('../Models/Language');
const HandlerFactory = require('./HandlerFactory');
const { General } = require('../Settings/');

exports.GetLanguages = HandlerFactory.GetAll({
    Model: Language,
    ApplyFilter: (Request) =>
        Request.params.Language !== '-1' ? { Language: Request.params.Language } : {},
    ApplyRecursion: [
        (Data) => Data.Request.params.Language && Data.Database.TotalResults === 0,
        { Language: General.DefaultLanguage }
    ]
});

exports.DeleteLanguage = HandlerFactory.DeleteOne({ Model: Language });

exports.CreateLanguage = HandlerFactory.CreateOne({
    Model: Language,
    FilterRequestFields: ['Key', 'Value', 'Language']
});

exports.UpdateLanguage = HandlerFactory.UpdateOne({
    Model: Language,
    FilterRequestFields: ['Key', 'Value', 'Language']
});
