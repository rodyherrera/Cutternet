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
import { LanguageContext } from '../../../Services/Language/Context';
import { APIPagination } from '../../../Infrastructure';
import { FormatString, SetFormattedTitle, SetPageAccordToRecords } from '../../../Utils/Shortcuts';
import GenericRecordsRetriever from '../../../Components/General/GenericRecordsRetriever/';
import Language from '../../../Components/Language/Language/Language';
import '../../../Assets/StyleSheet/Retriever.css';
import LanguageDashboardImage from '../../../Assets/Images/Language-Dashboard.png';
import SelectedLanguage from '../../../Components/Language/SelectedLanguage';

const ManageLanguages = () => {
    const {
        OnGetAllLanguages,
        OnDeleteLanguage,
        GetLanguages,
        RequiredFields,
        FilterFields,
        SortFields,
        SetMessage,
        GetMessage
    } = useContext(LanguageContext);
    const [GetAlLLanguages, SetAllLanguages] = useState([]);
    const [GetLimit, SetLimit] = useState(APIPagination.Limit.Default);
    const [GetPage, SetPage] = useState(APIPagination.Page.Default);
    const [GetIsLoading, SetIsLoading] = useState(false);
    const [GetExecuteRefresh, SetExecuteRefresh] = useState(false);
    const [GetSelectedLanguage, SetSelectedLanguage] = useState(null);
    const [GetIsComponentMounted, SetIsComponentMounted] = useState(true);
    const [GetWaitingMessage, SetWaitingMessage] = useState(
        GetLanguages.MANAGE_LANGUAGES_WAITING_MESSAGE
    );

    useEffect(() => {
        SetFormattedTitle(GetLanguages.MANAGE_LANGUAGES_TITLE, GetLanguages);
        return () => {
            SetAllLanguages([]);
            SetLimit(APIPagination.Limit.Default);
            SetPage(APIPagination.Page.Default);
            SetIsLoading(false);
            SetExecuteRefresh(false);
            SetSelectedLanguage(null);
            SetIsComponentMounted(false);
            SetWaitingMessage('');
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const HandleLanguageDelete = (LanguageData) =>
        OnDeleteLanguage({
            LanguageIdentifier: LanguageData._id,
            OnFinish: () => SetIsLoading(false),
            OnStart: () => SetIsLoading(true),
            OnResolve: () => {
                if (!GetIsComponentMounted) return;
                SetPageAccordToRecords(GetAlLLanguages.length, SetPage, GetPage);
                SetSelectedLanguage(null);
                SetWaitingMessage(GetLanguages.MANAGE_LANGUAGES_DELETE_WAITING_MESSAGE);
                SetExecuteRefresh(true);
                SetMessage(
                    FormatString({
                        UnformattedString: GetLanguages.MANAGE_LANGUAGES_DELETE_MESSAGE,
                        Values: { Key: LanguageData.Key },
                        SafeLength: true
                    })
                );
            }
        });

    return (
        <GenericRecordsRetriever
            GetExecuteRefresh={GetExecuteRefresh}
            SetExecuteRefresh={SetExecuteRefresh}
            FilterFields={FilterFields}
            SortFields={SortFields}
            SetMessage={SetMessage}
            OnGetRecords={OnGetAllLanguages}
            GetIsLoading={GetIsLoading}
            HeaderTitle={GetLanguages.MANAGE_LANGUAGES_HEADER_TITLE}
            SetIsLoading={SetIsLoading}
            SetRecords={SetAllLanguages}
            GetRecords={GetAlLLanguages}
            OnWaitingServerResponseMessage={GetWaitingMessage}
            SetLimit={SetLimit}
            RequiredFields={RequiredFields}
            GetLimit={GetLimit}
            SetPage={SetPage}
            GetPage={GetPage}
            GetMessage={GetMessage}
            SearchPlaceholder={GetLanguages.MANAGE_LANGUAGES_SEARCH_PLACEHOLDER}
        >
            {GetSelectedLanguage && (
                <SelectedLanguage
                    GetSelectedLanguage={GetSelectedLanguage}
                    HandleLanguageDelete={HandleLanguageDelete}
                    SetExecuteRefresh={SetExecuteRefresh}
                    SetSelectedLanguage={SetSelectedLanguage}
                    GetMessage={GetMessage}
                    SetWaitingMessage={SetWaitingMessage}
                />
            )}

            <section className="Generic-Retriever">
                <article className="Generic-Retriever-List">
                    {GetAlLLanguages.map((LanguageData, Index) => (
                        <Language
                            SetSelectedLanguage={SetSelectedLanguage}
                            HandleLanguageDelete={HandleLanguageDelete}
                            LanguageData={LanguageData}
                            key={Index}
                        />
                    ))}
                </article>
                <article className="Generic-Retriever-Information">
                    <figure>
                        <img src={LanguageDashboardImage} alt="Languages Dashboard Img" />
                        <figcaption>
                            <p>{GetLanguages.MANAGE_LANGUAGES_HELP_TEXT}</p>
                        </figcaption>
                    </figure>
                </article>
            </section>
        </GenericRecordsRetriever>
    );
};

export default ManageLanguages;
