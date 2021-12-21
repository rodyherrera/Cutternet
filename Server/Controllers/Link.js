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
const Link = require('../Models/Link');
const LinkStatistic = require('../Models/LinkStatistic');
const HandlerFactory = require('./HandlerFactory');
const { RuntimeError } = require('../Utils/RuntimeError');
const CatchAsync = require('../Utils/CatchAsync');
const GetGeoInfoFromIP = require('../Utils/GetGeoInfoFromIP');
const Validator = require('validator');
const ValidateUserData = require('../Utils/ValidateUserData');

exports.GetLinks = HandlerFactory.GetAll({ Model: Link });

exports.GetLinkStatistics = HandlerFactory.GetAll({
    Model: LinkStatistic,
    ApplyFilter: (Request) => ({ Link: Request.Link._id })
});

exports.GetMyLinks = HandlerFactory.GetAll({
    Model: Link,
    ApplyFilter: (Request) => ({ User: Request.User._id })
});

exports.CreateLink = HandlerFactory.CreateOne({
    Model: Link,
    FilterRequestFields: ['Link', 'Name'],
    ApplyFilter: (Request) => ({ User: Request.User._id })
});

exports.UpdateLink = HandlerFactory.UpdateOne({
    Model: Link,
    FilterRequestFields: ['Link', 'Name', 'IsActive'],
    ApplyIdentifier: (Request) => Request.Link._id
});

exports.DeleteLink = HandlerFactory.DeleteOne({
    Model: Link,
    ApplyIdentifier: (Request) => Request.Link._id
});

exports.GetLink = CatchAsync(async (Request, Response, Next) => {
    if (!Request.Link.IsActive) return Next(new RuntimeError('LINK_IS_DISABLED', 401));
    let { IPAddress, BrowserLanguage, OperatingSystem, Browser } = Request.body;
    let { ValidBrowser, ValidOperatingSystem, ValidBrowserLanguage } = ValidateUserData(
        OperatingSystem,
        Browser,
        BrowserLanguage
    );
    const { Country, Region, Timezone, City, Latitude, Longitude } = GetGeoInfoFromIP(IPAddress);
    if (Latitude && Longitude && !Validator.isLatLong(Latitude + ',' + Longitude))
        return Next(new RuntimeError('LINK_LAT_LONG_INVALID'));
    if (Validator.isLocale(BrowserLanguage)) BrowserLanguage = 'en';
    await LinkStatistic.create({
        BrowserLanguage: ValidBrowserLanguage,
        Browser: ValidBrowser,
        OperatingSystem: ValidOperatingSystem,
        IPAddress,
        Country,
        Region,
        Timezone,
        City,
        Latitude,
        Longitude,
        Link: Request.Link._id
    });
    const RequestedLink = await Link.findByIdAndUpdate(
        Request.Link._id,
        { Visits: Request.Link.Visits + 1 },
        { new: true, runValidators: true }
    );
    return Response.status(200).json({
        Status: 'Success',
        Data: RequestedLink
    });
});
