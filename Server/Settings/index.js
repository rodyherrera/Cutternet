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
const FileSystem = require('fs');

const ReadAndParse = (SettingsFile) =>
    JSON.parse(FileSystem.readFileSync('./Settings/' + SettingsFile));

const Settings = {
    Routes: ReadAndParse('ApiRoutes.json'),
    ClientRoutes: ReadAndParse('ClientRoutes.json'),
    General: ReadAndParse('General.json')
};

module.exports = Settings;
