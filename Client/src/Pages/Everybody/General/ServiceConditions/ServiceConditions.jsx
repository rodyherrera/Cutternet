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
import React, { useEffect, useContext } from 'react';
import { LanguageContext } from '../../../../Services/Language/Context';
import { SetFormattedTitle } from '../../../../Utils/Shortcuts';
import './ServiceConditions.css';
import Fade from 'react-reveal';

const ServiceConditions = () => {
    const { GetLanguages } = useContext(LanguageContext);

    useEffect(() => {
        SetFormattedTitle(GetLanguages.SERVICE_CONDITIONS_TITLE, GetLanguages);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <main id="Service-Conditions-Main">
            <Fade clear>
                <section>
                    <div>
                        <h2>{GetLanguages.SERVICE_CONDITIONS_HEADER_TITLE}</h2>
                        <p>{GetLanguages.SERVICE_CONDITIONS_HEADER_SUBTITLE}</p>
                    </div>

                    <div className="Service-Term">
                        <h3>{GetLanguages.SERVICE_CONDITIONS_PRIVACY_TITLE}</h3>
                        <p>{GetLanguages.SERVICE_CONDITIONS_PRIVACY_CONTENT}</p>
                    </div>

                    <div className="Service-Term">
                        <h3>{GetLanguages.SERVICE_CONDITIONS_METRICS_TITLE}</h3>
                        <p>{GetLanguages.SERVICE_CONDITIONS_METRICS_CONTENT}</p>
                    </div>

                    <div className="Service-Term">
                        <h3>{GetLanguages.SERVICE_CONDITIONS_OPEN_SOURCE_TITLE}</h3>
                        <p>{GetLanguages.SERVICE_CONDITIONS_OPEN_SOURCE_CONTENT}</p>
                    </div>
                </section>
            </Fade>
        </main>
    );
};

export default ServiceConditions;
