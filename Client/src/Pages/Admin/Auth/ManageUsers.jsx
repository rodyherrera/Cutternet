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
import { AuthContext } from '../../../Services/Auth/Context';
import { LanguageContext } from '../../../Services/Language/Context';
import { APIPagination } from '../../../Infrastructure';
import { FormatString, SetFormattedTitle, SetPageAccordToRecords } from '../../../Utils/Shortcuts';
import GenericRecordsRetriever from '../../../Components/General/GenericRecordsRetriever';
import User from '../../../Components/Auth/User/';
import '../../../Assets/StyleSheet/Retriever.css';
import AuthDashboardImage from '../../../Assets/Images/Auth-Dashboard.png';
import SelectedUser from '../../../Components/Auth/SelectedUser';

const ManageUsers = () => {
    const {
        OnGetAllUsers,
        GetMessage,
        SetMessage,
        RequiredFields,
        OnDeleteUser,
        SortFields,
        FilterFields
    } = useContext(AuthContext);
    const { GetLanguages } = useContext(LanguageContext);
    const [GetUsers, SetUsers] = useState([]);
    const [GetLimit, SetLimit] = useState(APIPagination.Limit.Default);
    const [GetPage, SetPage] = useState(APIPagination.Page.Default);
    const [GetIsLoading, SetIsLoading] = useState(false);
    const [GetExecuteRefresh, SetExecuteRefresh] = useState(false);
    const [GetIsComponentMounted, SetIsComponentMounted] = useState(true);
    const [GetSelectedUser, SetSelectedUser] = useState(null);
    const [GetWaitingMessage, SetWaitingMessage] = useState(
        GetLanguages.MANAGE_USERS_WAITING_MESSAGE
    );

    useEffect(() => {
        SetFormattedTitle(GetLanguages.MANAGE_USERS_TITLE, GetLanguages);
        return () => {
            SetUsers([]);
            SetLimit(APIPagination.Limit.Default);
            SetPage(APIPagination.Page.Default);
            SetIsLoading(false);
            SetExecuteRefresh(false);
            SetIsComponentMounted(false);
            SetSelectedUser(null);
            SetWaitingMessage('');
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const HandleUserDelete = (UserData) =>
        OnDeleteUser({
            UserIdentifier: UserData._id,
            OnFinish: () => SetIsLoading(false),
            OnStart: () => SetIsLoading(true),
            OnResolve: () => {
                if (!GetIsComponentMounted) return;
                SetPageAccordToRecords(GetUsers.length, SetPage, GetPage);
                SetSelectedUser(null);
                SetWaitingMessage(GetLanguages.MANAGE_USERS_DELETE_WAITING_MESSAGE);
                SetExecuteRefresh(true);
                SetMessage(
                    FormatString({
                        UnformattedString: GetLanguages.MANAGE_USERS_DELETE_MESSAGE,
                        Values: { Username: UserData.Username }
                    })
                );
            }
        });

    return (
        <GenericRecordsRetriever
            SetMessage={SetMessage}
            GetExecuteRefresh={GetExecuteRefresh}
            SetExecuteRefresh={SetExecuteRefresh}
            FilterFields={FilterFields}
            SortFields={SortFields}
            OnGetRecords={OnGetAllUsers}
            GetIsLoading={GetIsLoading}
            RequiredFields={RequiredFields}
            SetIsLoading={SetIsLoading}
            SetRecords={SetUsers}
            GetRecords={GetUsers}
            SetLimit={SetLimit}
            HeaderTitle={GetLanguages.MANAGE_USERS_HEADER_TITLE}
            GetLimit={GetLimit}
            SetPage={SetPage}
            GetPage={GetPage}
            OnWaitingServerResponseMessage={GetWaitingMessage}
            GetMessage={GetMessage}
            SearchPlaceholder={GetLanguages.MANAGE_USERS_SEARCH_PLACEHOLDER}
        >
            {GetSelectedUser && (
                <SelectedUser
                    SetSelectedUser={SetSelectedUser}
                    SetWaitingMessage={SetWaitingMessage}
                    GetMessage={GetMessage}
                    GetSelectedUser={GetSelectedUser}
                    HandleUserDelete={HandleUserDelete}
                    SetExecuteRefresh={SetExecuteRefresh}
                />
            )}

            <section className="Generic-Retriever">
                <article className="Generic-Retriever-List">
                    {GetUsers.map((UserData, Index) => (
                        <User
                            key={Index}
                            SetSelectedUser={SetSelectedUser}
                            HandleUserDelete={HandleUserDelete}
                            UserData={UserData}
                        />
                    ))}
                </article>
                <article className="Generic-Retriever-Information">
                    <figure>
                        <img src={AuthDashboardImage} alt="Users Dashboard Img" />
                        <figcaption>
                            <p>{GetLanguages.MANAGE_USERS_HELP_TEXT}</p>
                        </figcaption>
                    </figure>
                </article>
            </section>
        </GenericRecordsRetriever>
    );
};

export default ManageUsers;
