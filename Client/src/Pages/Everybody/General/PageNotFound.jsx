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
import { SetFormattedTitle } from '../../../Utils/Shortcuts';
import PageNotFoundImage from '../../../Assets/Images/General-PageNotFound.png';
import '../../../Assets/StyleSheet/Simple-Content-Center.css';
import { useNavigate } from 'react-router';
import { Button } from '@mui/material';
import Fade from 'react-reveal';

const PageNotFound = () => {
    const { GetLanguages } = useContext(LanguageContext);
    const Navigate = useNavigate();

    useEffect(() => {
        SetFormattedTitle(GetLanguages.PAGE_NOT_FOUND_TITLE, GetLanguages);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <main id="Simple-Content-Center-Main">
            <Fade clear>
                <section>
                    <figure>
                        <img src={PageNotFoundImage} alt="Page Not Found Img" />
                        <figcaption>
                            <article>
                                <p>{GetLanguages.PAGE_NOT_FOUND_MESSAGE}</p>
                            </article>
                            <article>
                                <Button
                                    onClick={() => Navigate('/')}
                                    variant="text"
                                    className="Link Button"
                                >
                                    {GetLanguages.PAGE_NOT_FOUND_BUTTON_MESSAGE}
                                </Button>
                            </article>
                        </figcaption>
                    </figure>
                </section>
            </Fade>
        </main>
    );
};

export default PageNotFound;
