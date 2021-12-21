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
import React, { useState, createContext, useEffect, useCallback, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { LanguageContext } from '../../Services/Language/Context';
import { LinkRoutes } from '../../Infrastructure';
import {
    DoServerRequest,
    IsEqualLocationPathWithNonFormattedRoutePath
} from '../../Utils/Shortcuts';
import HandleError from '../../Utils/ErrorController';
import {
    SignUp,
    SignIn,
    ForgotPassword,
    HandleResponseDataIntoClient,
    HandleLogoutIntoClient,
    UpdateMyProfile,
    MyProfile,
    GetCurrentUserToken,
    GetAllUsers,
    DeleteUser,
    UpdateMyPassword,
    DeleteMe,
    UpdateUser,
    ResetPassword
} from './Service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { GetLanguages } = useContext(LanguageContext);
    const [GetUser, SetUser] = useState(null);
    const [GetError, SetError] = useState(null);
    const [GetIsLoadingSignInWithCache, SetIsLoadingSignInWithCache] = useState(true);
    const [GetMessage, SetMessage] = useState(null);
    const Location = useLocation();
    const Navigate = useNavigate();
    const BlackListPaths = [LinkRoutes.GetLink];
    const RequiredFields = ['Username'];
    const SortFields = [
        [GetLanguages.AUTH_CONTEXT_SORT_USERNAME, 'Username'],
        [GetLanguages.AUTH_CONTEXT_SORT_EMAIL, 'Email'],
        [GetLanguages.AUTH_CONTEXT_SORT_ROLE, 'Role']
    ];
    const FilterFields = [
        [GetLanguages.AUTH_CONTEXT_FILTER_EMAIL, 'Email'],
        [GetLanguages.AUTH_CONTEXT_FILTER_ROLE, 'Role']
    ];

    const Setters = { OnErrorSetter: SetError };

    const OnGetAllUsers = ({ OnStart, OnResolve, Filter, OnFinish }) =>
        DoServerRequest({
            Setters,
            OnFinish,
            Filter,
            OnStart,
            InPromise: { OnResolve },
            Axios: {
                Callback: GetAllUsers,
                Arguments: [Filter]
            }
        });

    const OnUpdateMyPassword = ({ OnStart, OnFinish, Data, OnResolve }) =>
        DoServerRequest({
            Setters,
            OnStart,
            OnFinish,
            InPromise: { OnResolve },
            Axios: {
                Callback: UpdateMyPassword,
                Arguments: [Data]
            }
        });

    const OnDeleteUser = ({ OnStart, OnResolve, UserIdentifier, OnFinish }) =>
        DoServerRequest({
            Setters,
            OnStart,
            OnFinish,
            InPromise: { OnResolve },
            Axios: {
                Callback: DeleteUser,
                Arguments: [UserIdentifier]
            }
        });

    const OnUpdateUser = ({ OnStart, Data, UserIdentifier, OnFinish, OnResolve }) =>
        DoServerRequest({
            Setters,
            OnFinish,
            OnStart,
            InPromise: { OnResolve },
            Axios: {
                Callback: UpdateUser,
                Arguments: [Data, UserIdentifier]
            }
        });

    const OnGetUser = ({ OnStart, UserIdentifier }) =>
        DoServerRequest({
            Setters,
            OnStart,
            Axios: {
                Callback: GetUser,
                Arguments: [UserIdentifier]
            }
        });

    const OnUpdateProfile = ({ OnStart, Data, OnFinish, OnResolve }) =>
        DoServerRequest({
            Setters,
            OnStart,
            OnFinish,
            InPromise: { OnResolve },
            Axios: {
                Callback: UpdateMyProfile,
                Arguments: [Data]
            },
            UpdateState: {
                Setter: SetUser,
                Callback: HandleResponseDataIntoClient,
                Arguments: [Data]
            }
        });

    const OnForgotPassword = ({ OnStart, Data, OnFinish, OnResolve }) =>
        DoServerRequest({
            Setters,
            OnStart,
            OnFinish,
            InPromise: { OnResolve },
            Axios: {
                Callback: ForgotPassword,
                Arguments: [Data]
            }
        });

    const OnLogin = ({ OnStart, Data, OnFinish, OnResolve }) =>
        DoServerRequest({
            Setters,
            OnStart,
            OnFinish,
            InPromise: { OnResolve },
            Axios: {
                Callback: SignIn,
                Arguments: [Data]
            },
            UpdateState: {
                Setter: SetUser,
                Callback: HandleResponseDataIntoClient,
                Arguments: [Data]
            }
        });

    const OnRegister = ({ OnStart, Data, OnFinish }) =>
        DoServerRequest({
            Setters,
            OnStart,
            OnFinish,
            Axios: {
                Callback: SignUp,
                Arguments: [Data]
            },
            UpdateState: {
                Setter: SetUser,
                Callback: HandleResponseDataIntoClient,
                Arguments: [Data]
            }
        });

    const OnResetPassword = ({ OnStart, Data, ResetPasswordToken, OnFinish, OnResolve }) =>
        DoServerRequest({
            Setters,
            OnFinish,
            OnStart,
            InPromise: { OnResolve },
            Axios: {
                Callback: ResetPassword,
                Arguments: [Data, ResetPasswordToken]
            }
        });

    const OnLogout = () => SetUser(HandleLogoutIntoClient());

    const OnDeleteMe = () =>
        DoServerRequest({
            Setters,
            Axios: {
                Callback: DeleteMe
            },
            Callbacks: {
                Success: {
                    Callback: () => OnLogout()
                }
            }
        });

    const OnTryLoggedInWithLastSession = useCallback(() => {
        const CachedSessionToken = GetCurrentUserToken();
        if (!CachedSessionToken) return SetIsLoadingSignInWithCache(false);
        DoServerRequest({
            Setters: { OnErrorSetter: SetError },
            Axios: { Callback: MyProfile },
            InPromise: { OnResolve: (Response) => SetUser(Response.Data) },
            OnFinish: () => SetIsLoadingSignInWithCache(false)
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(
        () =>
            HandleError({
                Navigate,
                Location,
                SetMessage,
                GetLanguages,
                ClientError: GetError,
                AuthCallbacks: { OnLogout }
            }),
        [GetError] // eslint-disable-line react-hooks/exhaustive-deps
    ); 

    useEffect(() => {
        let IsCurrentPathInBlackList = false;
        BlackListPaths.forEach((Path) =>
            IsEqualLocationPathWithNonFormattedRoutePath({
                LocationPath: Location.pathname,
                NonFormattedRoutePath: Path,
                IsEqualCallback: () => (IsCurrentPathInBlackList = true)
            })
        );
        if (!IsCurrentPathInBlackList) OnTryLoggedInWithLastSession();
    }, [OnTryLoggedInWithLastSession]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        SetError(null);
        Array.isArray(GetMessage) ? SetMessage(GetMessage[0]) : SetMessage(null);
    }, [Location]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <AuthContext.Provider
            value={{
                IsAuthenticated: Boolean(GetUser),
                GetIsLoadingSignInWithCache,
                GetUser,
                SortFields,
                SetMessage,
                FilterFields,
                OnGetAllUsers,
                OnDeleteUser,
                OnUpdateUser,
                OnResetPassword,
                OnGetUser,
                OnDeleteMe,
                GetMessage,
                OnForgotPassword,
                OnLogin,
                OnUpdateMyPassword,
                OnUpdateProfile,
                OnRegister,
                OnLogout,
                RequiredFields
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
