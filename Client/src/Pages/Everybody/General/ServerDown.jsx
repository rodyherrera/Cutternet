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
import { LanguageContext } from '../../../Services/Language/Context';
import {
    SetFormattedTitle,
    RedirectUser,
    FormatRoutePathWithContext
} from '../../../Utils/Shortcuts';
import ServerDownImage from '../../../Assets/Images/General-ServerDown.png';
import '../../../Assets/StyleSheet/Simple-Content-Center.css';
import { Button } from '@mui/material';
import Fade from 'react-reveal';

const ServerDown = () => {
    const { GetLanguages } = useContext(LanguageContext);

    useEffect(() => {
        SetFormattedTitle('Server Error');
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <main id="Simple-Content-Center-Main">
            <Fade clear>
                <section>
                    <figure>
                        <img src={ServerDownImage} alt="Server Down Img" />
                        <figcaption>
                            <article>
                                <p>
                                    {GetLanguages.SERVER_DOWN_MESSAGE ||
                                        'Can not connect to the server, down.'}
                                </p>
                            </article>
                            <article>
                                <Button
                                    variant="text"
                                    className="Link Button"
                                    onClick={() =>
                                        RedirectUser(
                                            FormatRoutePathWithContext({
                                                RoutePath: '/',
                                                WithLocalSchema: true
                                            })
                                        )
                                    }
                                >
                                    {GetLanguages.SERVER_RELOAD_BUTTON_MESSAGE || 'Reload'}
                                </Button>
                            </article>
                        </figcaption>
                    </figure>
                </section>
            </Fade>
        </main>
    );
};

export default ServerDown;
