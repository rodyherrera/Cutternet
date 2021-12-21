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
const ValidateUserData = (OperatingSystem, Browser, BrowserLanguage) => {
    const Lists = {
        OperatingSystems: [
            'iOS',
            'Android OS',
            'BlackBerry OS',
            'Windows Mobile',
            'Amazon OS',
            'Windows 3.11',
            'Windows 95',
            'Windows 98',
            'Windows 2000',
            'Windows XP',
            'Windows Server 2003',
            'Windows Vista',
            'Windows 7',
            'Windows 8',
            'Windows 8.1',
            'Windows 10',
            'Windows ME',
            'Windows CE',
            'Open BSD',
            'Sun OS',
            'Linux',
            'Mac OS',
            'QNX',
            'BeOS',
            'OS/2',
            'Chrome OS'
        ],
        Browsers: [
            'aol',
            'edge',
            'edge-ios',
            'yandexbrowser',
            'kakaotalk',
            'samsung',
            'silk',
            'miui',
            'beaker',
            'edge-chromium',
            'chrome',
            'chromium-webview',
            'phantomjs',
            'crios',
            'firefox',
            'fxios',
            'opera-mini',
            'opera',
            'pie',
            'netfront',
            'ie',
            'bb10',
            'android',
            'ios',
            'safari',
            'facebook',
            'instagram',
            'ios-webview',
            'curl',
            'searchbot'
        ]
    };

    BrowserLanguage = BrowserLanguage.includes('-')
        ? BrowserLanguage.split('-')[0].toUpperCase()
        : BrowserLanguage.toUpperCase();

    Browser = Lists.Browsers.includes(Browser)
        ? Browser === 'ios'
            ? 'Safari'
            : Browser[0].toUpperCase() + Browser.slice(1)
        : 'Unknown';
    OperatingSystem = Lists.OperatingSystems.includes(OperatingSystem)
        ? OperatingSystem
        : 'Unknown';
    return {
        ValidBrowserLanguage: BrowserLanguage,
        ValidBrowser: Browser,
        ValidOperatingSystem: OperatingSystem
    };
};

module.exports = ValidateUserData;
