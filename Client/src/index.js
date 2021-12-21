/***
 * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project root
 * for full license information.
 *
 * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
 *
 * For related information - https://github.com/CodeWithRodi/Cutternet/
 *
 * Cutternet Client Source Code
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 ****/
import React from 'react';
import ReactDOM from 'react-dom';
import ReportWebVitals from './ReportWebVitals';
import Application from './Utils/Application';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Services/Auth/Context';
import { LinkProvider } from './Services/Link/Context';
import { LanguageProvider } from './Services/Language/Context';

ReactDOM.render(
    <BrowserRouter>
        <LanguageProvider>
            <LinkProvider>
                <AuthProvider>
                    <Application />
                </AuthProvider>
            </LinkProvider>
        </LanguageProvider>
    </BrowserRouter>,
    document.getElementById('CutternetApp')
);

ReportWebVitals();
