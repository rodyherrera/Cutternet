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
import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router';
import { LinkContext } from '../../../../Services/Link/Context';
import { LanguageContext } from '../../../../Services/Language/Context';
import { Button, CircularProgress } from '@mui/material';
import GetLinkErrorImage from '../../../../Assets/Images/Link-GetError.png';
import './GetLink.css';
import '../../../../Assets/StyleSheet/Simple-Content-Center.css';
import {
    GetIPAddress,
    RedirectUser,
    ExtractUserData,
    SetFormattedTitle,
    FormatRoutePathWithContext,
    FormatString
} from '../../../../Utils/Shortcuts';

const GetLink = () => {
    const { OnGetLink, GetMessage } = useContext(LinkContext);
    const { GetLanguages } = useContext(LanguageContext);
    const [GetIsLoading, SetIsLoading] = useState(true);
    const { Username, LinkName } = useParams();

    useEffect(() => {
        SetFormattedTitle(Username + '@' + LinkName, GetLanguages);
        const TradeData = async () => {
            let IPAddress;
            try {
                IPAddress = await GetIPAddress();
            } catch (IPAddressGetRejection) {
                IPAddress = 'Unknown';
            }
            const { BrowserLanguage, Browser, OperatingSystem } = ExtractUserData();
            OnGetLink({
                Data: {
                    BrowserLanguage,
                    Browser,
                    OperatingSystem,
                    IPAddress,
                    Username,
                    LinkName
                },
                OnSuccess: (Response) => RedirectUser(Response.Data.Link),
                OnFinish: () => SetIsLoading(false)
            });
        };
        TradeData();
        return () => {
            SetIsLoading(false);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <main id="Get-Link-Main">
            <section>
                {GetIsLoading ? (
                    <article>
                        <CircularProgress className="Circular-Loader" size={'2.2rem'} />
                        <p>
                            {FormatString({
                                UnformattedString: GetLanguages.GET_LINK_LOADING_MESSAGE,
                                Values: { LinkName, Username }
                            })}
                        </p>
                    </article>
                ) : GetMessage ? (
                    <article id="Simple-Content-Center-Main">
                        <figure>
                            <img src={GetLinkErrorImage} alt="Get Link Error Img" />
                            <figcaption>
                                <p>{GetMessage}</p>
                                <Button
                                    onClick={() =>
                                        RedirectUser(
                                            FormatRoutePathWithContext({
                                                RoutePath: '/',
                                                WithLocalSchema: true
                                            })
                                        )
                                    }
                                    variant="text"
                                    className="Link Button"
                                >
                                    {GetLanguages.GET_LINK_BUTTON_MESSAGE}
                                </Button>
                            </figcaption>
                        </figure>
                    </article>
                ) : (
                    <p>{GetLanguages.GET_LINK_REDIRECTING_MESSAGE}</p>
                )}
            </section>
        </main>
    );
};

export default GetLink;
