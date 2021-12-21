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
const RegisterCutternetAnalytic = async (Backend) => {
    const GetIPAddress = async () => await (await fetch('https://api.ipify.org')).text();

    const ExtractUserData = async () => {
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
        let Data = {
            Browser: undefined,
            OperatingSystem: undefined,
            BrowserLanguage: undefined
        };
        const LowerCaseUserAgent = navigator.userAgent.toLowerCase();
        for (let Iterator = 0; Iterator < Lists.Browsers.length; Iterator++)
            if (LowerCaseUserAgent.indexOf(Lists.Browsers[Iterator]) !== -1) {
                Data.Browser = Lists.Browsers[Iterator];
                break;
            }
        for (let Iterator = 0; Iterator < Lists.OperatingSystems.length; Iterator++)
            if (navigator.userAgent.indexOf(Lists.OperatingSystems[Iterator]) !== -1) {
                Data.OperatingSystem = Lists.OperatingSystems[Iterator];
            }
        Data.BrowserLanguage = navigator.language.includes('-')
            ? navigator.language.split('-')[0]
            : navigator.language;
        return Data;
    };

    try {
        let IPAddress;
        try {
            IPAddress = await GetIPAddress();
        } catch (IPAddressGetRejection) {
            IPAddress = 'Unknown';
        }
        const { Browser, BrowserLanguage, OperatingSystem } = await ExtractUserData();
        const Response = await fetch(Backend, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                IPAddress,
                BrowserLanguage,
                OperatingSystem,
                Browser
            })
        });
        return Response.text();
    } catch (CutternetAnalyticsException) {
        console.error(
            '>[Cutternet]< // An error has been ocurred ==> ',
            CutternetAnalyticsException
        );
    }
};
