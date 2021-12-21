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
const GeoIPLite = require('geoip-lite');

const GetGeoInfoFromIP = (IP) => {
    const Data = GeoIPLite.lookup(IP);
    if (!Data)
        return {
            Country: undefined,
            Region: undefined,
            Timezone: undefined,
            City: undefined,
            Latitude: undefined,
            Longitude: undefined
        };
    const [Latitude, Longitude] = Data.ll;
    return {
        Country: Data.country,
        Region: Data.region,
        Timezone: Data.timezone,
        City: Data.city,
        Latitude,
        Longitude
    };
};

module.exports = GetGeoInfoFromIP;
