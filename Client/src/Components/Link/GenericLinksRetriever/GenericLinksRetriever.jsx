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
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { APIPagination, LinkRoutes } from '../../../Infrastructure';
import { LinkContext } from '../../../Services/Link/Context';
import GenericRecordsRetriever from '../../General/GenericRecordsRetriever';
import Link from './Link/';
import {
    SetPageAccordToRecords,
    IsEqualLocationPathWithNonFormattedRoutePath,
    FormatRoutePathWithContext,
    CopyToClipboard,
    GetEmbeddedCode,
    FormatString
} from '../../../Utils/Shortcuts';
import LinkDashboardImage from '../../../Assets/Images/Link-Dashboard.png';
import '../../../Assets/StyleSheet/Retriever.css';
import SelectedLink from './SelectedLink/';
import { LanguageContext } from '../../../Services/Language/Context';

const GenericLinksRetriever = ({ HeaderTitle, SetLinks, GetLinks, GetIsLoading, SetIsLoading }) => {
    const {
        OnDeleteLink,
        OnGetAllLinks,
        OnGetMyLinks,
        SetMessage,
        RequiredFields,
        OnUpdateLink,
        GetMessage,
        SortFields,
        FilterFields
    } = useContext(LinkContext);
    const { GetLanguages } = useContext(LanguageContext);
    const [GetLimit, SetLimit] = useState(APIPagination.Limit.Default);
    const [GetPage, SetPage] = useState(APIPagination.Page.Default);
    const [GetExecuteRefresh, SetExecuteRefresh] = useState(false);
    const [GetSelectedLink, SetSelectedLink] = useState(null);
    const [GetWaitingMessage, SetWaitingMessage] = useState(
        GetLanguages.GENERIC_LINK_RETRIEVER_WAITING_MESSAGE
    );
    const [GetIsComponentMounted, SetIsComponentMounted] = useState(true);
    const Location = useLocation();
    let OnGetLinks = OnGetMyLinks;

    useEffect(() => {
        return () => {
            SetLimit(APIPagination.Limit.Default);
            SetPage(APIPagination.Page.Default);
            SetExecuteRefresh(false);
            SetSelectedLink(null);
            SetWaitingMessage('');
            SetIsComponentMounted(false);
        };
    }, []);

    IsEqualLocationPathWithNonFormattedRoutePath({
        LocationPath: Location.pathname,
        NonFormattedRoutePath: LinkRoutes.ManageLinks,
        IsEqualCallback: () => (OnGetLinks = OnGetAllLinks)
    });

    const HandleOnDeleteLink = (LinkData, LinkName) =>
        OnDeleteLink({
            OnStart: () => SetIsLoading(true),
            OnFinish: () => SetIsLoading(false),
            Data: { Username: LinkData.User.Username, LinkName, ...LinkData },
            OnResolve: () => {
                if (GetIsComponentMounted) {
                    SetMessage(
                        FormatString({
                            UnformattedString: GetLanguages.GENERIC_LINK_RETRIEVER_DELETE_MESSAGE,
                            Values: { Link: LinkName },
                            SafeLength: true
                        })
                    );
                    SetPageAccordToRecords(GetLinks.length, SetPage, GetPage);
                    SetWaitingMessage(GetLanguages.GENERIC_LINK_RETRIEVER_DELETE_WAITING_MESSAGE);
                    SetExecuteRefresh(true);
                }
            }
        });

    const HandleOnUpdateLink = (LinkData, LinkName) =>
        OnUpdateLink({
            OnStart: () => SetIsLoading(true),
            OnFinish: () => SetIsLoading(false),
            Data: { Username: LinkData.User.Username, LinkName, ...LinkData },
            OnSuccess: () => {
                if (GetIsComponentMounted) {
                    SetMessage(
                        FormatString({
                            UnformattedString: GetLanguages.GENERIC_LINK_RETRIEVER_UPDATE_MESSAGE,
                            Values: { Link: LinkName },
                            SafeLength: true
                        })
                    );
                    SetExecuteRefresh(true);
                }
            }
        });

    const GetFormattedLinkURL = (RoutePath, LinkData, WithLocalSchema = true) =>
        FormatRoutePathWithContext({
            RoutePath,
            WithLocalSchema,
            Context: {
                Username: LinkData.User.Username,
                LinkName: LinkData.Name
            }
        });

    const HandleCopy = (URL, LinkName) => {
        CopyToClipboard(URL);
        SetMessage(
            FormatString({
                UnformattedString: GetLanguages.GENERIC_LINK_RETRIEVER_COPY_MESSAGE,
                Values: { Name: LinkName },
                SafeLength: true
            })
        );
    };

    const HandleEmbeddedCodeCopy = (LinkData) => {
        CopyToClipboard(GetEmbeddedCode(LinkData.User.Username, LinkData.Name));
        SetMessage(
            FormatString({
                UnformattedString: GetLanguages.GENERIC_LINK_RETRIEVER_EMBEDDED_COPY_MESSAGE,
                Values: { Name: LinkData.Name },
                SafeLength: true
            })
        );
    };

    return (
        <GenericRecordsRetriever
            SortFields={SortFields}
            FilterFields={FilterFields}
            OnGetRecords={OnGetLinks}
            SetMessage={SetMessage}
            GetIsLoading={GetIsLoading}
            HeaderTitle={HeaderTitle}
            SetIsLoading={SetIsLoading}
            SetRecords={SetLinks}
            HiddeLayoutIf={GetSelectedLink}
            SetExecuteRefresh={SetExecuteRefresh}
            GetExecuteRefresh={GetExecuteRefresh}
            GetRecords={GetLinks}
            SetLimit={SetLimit}
            OnWaitingServerResponseMessage={GetWaitingMessage}
            GetMessage={GetMessage}
            GetLimit={GetLimit}
            RequiredFields={RequiredFields}
            SearchPlaceholder={GetLanguages.GENERIC_LINK_RETRIEVER_SEARCH_PLACEHOLDER}
            SetPage={SetPage}
            GetPage={GetPage}
        >
            {GetSelectedLink ? (
                <SelectedLink
                    GetFormattedLinkURL={GetFormattedLinkURL}
                    SetMessage={SetMessage}
                    GetMessage={GetMessage}
                    HandleEmbeddedCodeCopy={HandleEmbeddedCodeCopy}
                    HandleCopy={HandleCopy}
                    HandleLinkDeletion={HandleOnDeleteLink}
                    SetWaitingMessage={SetWaitingMessage}
                    SetSelectedLink={SetSelectedLink}
                    SetExecuteRefresh={SetExecuteRefresh}
                    GetSelectedLink={GetSelectedLink}
                />
            ) : (
                <section className="Generic-Retriever">
                    <article className="Generic-Retriever-List">
                        {GetLinks.map((LinkData, Index) => (
                            <Link
                                GetFormattedLinkURL={GetFormattedLinkURL}
                                LinkData={LinkData}
                                HandleCopy={HandleCopy}
                                HandleEmbeddedCodeCopy={HandleEmbeddedCodeCopy}
                                HandleLinkUpdate={HandleOnUpdateLink}
                                HandleLinkDeletion={HandleOnDeleteLink}
                                SetSelectedLink={SetSelectedLink}
                                key={Index}
                            />
                        ))}
                    </article>
                    <article className="Generic-Retriever-Information">
                        <figure>
                            <img src={LinkDashboardImage} alt="Link Dashboard Img" />
                            <figcaption>
                                <p>{GetLanguages.GENERIC_LINK_RETRIEVER_HELP_TEXT}</p>
                            </figcaption>
                        </figure>
                    </article>
                </section>
            )}
        </GenericRecordsRetriever>
    );
};

export default GenericLinksRetriever;
