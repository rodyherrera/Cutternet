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
import React, { useState, createContext, useEffect } from 'react';
import { DoServerRequest, GetClientLanguage } from '../../Utils/Shortcuts';
import HandleError from '../../Utils/ErrorController';
import { useLocation, useNavigate } from 'react-router';
import { GetAllLanguages, DeleteLanguage, UpdateLanguage, CreateLanguage } from './Service';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [GetMessage, SetMessage] = useState(null);
    const [GetError, SetError] = useState(null);
    const [GetLanguages, SetLanguages] = useState({});
    const [GetIsLanguageLoading, SetIsLanguageLoading] = useState(true);
    const Location = useLocation();
    const Navigate = useNavigate();
    const Setters = { OnErrorSetter: SetError };
    const RequiredFields = ['Key'];
    const SortFields = [
        [GetLanguages.LANGUAGE_CONTEXT_SORT_KEY, 'Key'],
        [GetLanguages.LANGUAGE_CONTEXT_SORT_VALUE, 'Value'],
        [GetLanguages.LANGUAGE_CONTEXT_SORT_LANGUAGE, 'Language']
    ];
    const FilterFields = [
        [GetLanguages.LANGUAGE_CONTEXT_FILTER_VALUE, 'Value'],
        [GetLanguages.LANGUAGE_CONTEXT_FILTER_LANGUAGE, 'Language']
    ];

    const OnCreateLanguage = ({ OnStart, Data, OnResolve, OnRejection }) =>
        DoServerRequest({
            Setters,
            OnStart,
            InPromise: { OnResolve, OnRejection },
            Axios: {
                Callback: CreateLanguage,
                Arguments: [Data]
            }
        });

    const OnGetAllLanguages = ({ OnStart, OnResolve, OnFinish, Language, Filter }) =>
        DoServerRequest({
            Setters,
            OnFinish,
            OnStart,
            InPromise: { OnResolve },
            Axios: {
                Callback: GetAllLanguages,
                Arguments: [Language || '-1', Filter]
            }
        });

    const OnDeleteLanguage = ({ OnStart, OnResolve, OnFinish, LanguageIdentifier }) =>
        DoServerRequest({
            Setters,
            OnStart,
            OnFinish,
            InPromise: { OnResolve },
            Axios: {
                Callback: DeleteLanguage,
                Arguments: [LanguageIdentifier]
            }
        });

    const OnUpdateLanguage = ({ OnStart, OnFinish, OnResolve, LanguageIdentifier, Data }) =>
        DoServerRequest({
            Setters,
            OnStart,
            OnFinish,
            InPromise: { OnResolve },
            Axios: {
                Callback: UpdateLanguage,
                Arguments: [LanguageIdentifier, Data]
            }
        });

    useEffect(
        () =>
            OnGetAllLanguages({
                OnStart: () => SetIsLanguageLoading(true),
                OnResolve: (Response) => {
                    const Buffer = {};
                    Response.Data.forEach((Data) => (Buffer[Data.Key] = Data.Value));
                    SetLanguages(Buffer);
                },
                OnFinish: () => SetIsLanguageLoading(false),
                Language: GetClientLanguage(),
                Filter: {
                    Paginate: { Limit: -1, Page: 0 }
                }
            }),
        [] // eslint-disable-line react-hooks/exhaustive-deps
    ); 

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
        <LanguageContext.Provider
            value={{
                GetMessage,
                SetMessage,
                GetIsLanguageLoading,
                OnGetAllLanguages,
                GetLanguages,
                OnDeleteLanguage,
                OnUpdateLanguage,
                OnCreateLanguage,
                RequiredFields,
                SortFields,
                FilterFields
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
};
