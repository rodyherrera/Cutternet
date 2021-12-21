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
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { LanguageContext } from '../../Services/Language/Context';
import HandleError from '../../Utils/ErrorController';
import { DoServerRequest } from '../../Utils/Shortcuts';
import {
    CreateLink,
    GetLink,
    GetMyLinks,
    GetStatistics,
    UpdateLink,
    DeleteLink,
    GetAllLinks
} from './Service';

export const LinkContext = createContext();

export const LinkProvider = ({ children }) => {
    const { GetLanguages } = useContext(LanguageContext);
    const [GetMessage, SetMessage] = useState(null);
    const [GetError, SetError] = useState(null);
    const Location = useLocation();
    const Navigate = useNavigate();
    const Setters = { OnErrorSetter: SetError };
    const RequiredFields = ['Link', 'Name'];
    const StatisticBothFields = [
        [GetLanguages.LINK_CONTEXT_STATISTIC_BOTH_IP_ADDRESS, 'IPAddress'],
        [GetLanguages.LINK_CONTEXT_STATISTIC_BOTH_LANGUAGE, 'BrowserLanguage'],
        [GetLanguages.LINK_CONTEXT_STATISTIC_BOTH_BROWSER, 'Browser'],
        [GetLanguages.LINK_CONTEXT_STATISTIC_BOTH_CITY, 'City'],
        [GetLanguages.LINK_CONTEXT_STATISTIC_BOTH_COUNTRY, 'Country'],
        [GetLanguages.LINK_CONTEXT_STATISTIC_BOTH_REGION, 'Region'],
        [GetLanguages.LINK_CONTEXT_STATISTIC_BOTH_TIMEZONE, 'Timezone'],
        [GetLanguages.LINK_CONTEXT_STATISTIC_BOTH_OS, 'OperatingSystem'],
        [GetLanguages.LINK_CONTEXT_STATISTIC_BOTH_REGISTERED_AT, 'RegisteredAt']
    ];
    const FilterFields = [
        [GetLanguages.LINK_CONTEXT_FILTER_VISIT, 'Visits'],
        [GetLanguages.LINK_CONTEXT_FILTER_CREATED_AT, 'CreatedAt'],
        [GetLanguages.LINK_CONTEXT_FILTER_STATUS, 'IsActive']
    ];
    const SortFields = [
        [GetLanguages.LINK_CONTEXT_SORT_NAME, 'Name'],
        [GetLanguages.LINK_CONTEXT_SORT_VISITS, 'Visits'],
        [GetLanguages.LINK_CONTEXT_SORT_CREATION_AT, 'CreatedAt'],
        [GetLanguages.LINK_CONTEXT_SORT_STATUS, 'IsActive'],
        [GetLanguages.LINK_CONTEXT_SORT_LINK, 'Link']
    ];

    const OnCreateLink = ({ OnStart, Data, OnResolve, OnRejection }) =>
        DoServerRequest({
            Setters,
            OnStart,
            InPromise: { OnResolve, OnRejection },
            Axios: {
                Callback: CreateLink,
                Arguments: [Data]
            }
        });

    const OnGetLink = ({ OnStart, Data, OnSuccess, OnFinish }) =>
        DoServerRequest({
            Setters,
            OnStart,
            OnFinish,
            Axios: {
                Callback: GetLink,
                Arguments: [Data]
            },
            Callbacks: {
                Success: {
                    Callback: OnSuccess
                }
            }
        });

    const OnGetMyLinks = ({ OnStart, Filter, OnResolve, OnFinish }) =>
        DoServerRequest({
            Setters,
            OnStart,
            Filter,
            OnFinish,
            InPromise: { OnResolve },
            Axios: {
                Callback: GetMyLinks,
                Arguments: [Filter]
            }
        });

    const OnGetStatistics = ({ OnStart, Filter, Data, OnResolve, OnFinish, OnRejection }) =>
        DoServerRequest({
            Setters,
            OnStart,
            OnFinish,
            InPromise: { OnResolve, OnRejection },
            Axios: {
                Callback: GetStatistics,
                Arguments: [Filter, Data]
            }
        });

    const OnUpdateLink = ({ OnSuccess, OnFinish, OnStart, Data }) =>
        DoServerRequest({
            Setters,
            OnStart,
            OnFinish,
            Callbacks: {
                Success: {
                    Callback: OnSuccess
                }
            },
            Axios: {
                Callback: UpdateLink,
                Arguments: [Data]
            }
        });

    const OnDeleteLink = ({ OnStart, OnResolve, OnFinish, Data }) =>
        DoServerRequest({
            Setters,
            OnStart,
            OnFinish,
            InPromise: { OnResolve },
            Axios: {
                Callback: DeleteLink,
                Arguments: [Data]
            }
        });

    const OnGetAllLinks = ({ OnStart, Filter, OnResolve, OnFinish }) =>
        DoServerRequest({
            Setters,
            OnFinish,
            OnStart,
            InPromise: { OnResolve },
            Axios: {
                Callback: GetAllLinks,
                Arguments: [Filter]
            }
        });

    useEffect(
        () =>
            HandleError({
                Navigate,
                Location,
                SetMessage,
                GetLanguages,
                ClientError: GetError
            }),
        [GetError] // eslint-disable-line react-hooks/exhaustive-deps
    );

    useEffect(() => {
        SetError(null);
        Array.isArray(GetMessage) ? SetMessage(GetMessage[0]) : SetMessage(null);
    }, [Location]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <LinkContext.Provider
            value={{
                OnGetAllLinks,
                OnDeleteLink,
                OnUpdateLink,
                OnGetStatistics,
                OnGetMyLinks,
                SetMessage,
                StatisticBothFields,
                OnGetLink,
                RequiredFields,
                SortFields,
                FilterFields,
                OnCreateLink,
                GetMessage
            }}
        >
            {children}
        </LinkContext.Provider>
    );
};
