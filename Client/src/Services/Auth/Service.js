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
import { AuthRoutesAPI } from '../../Infrastructure';
import { GenericRequestToBackend } from '../../Utils/Shortcuts';

const IdentifierIntoLocalStorage = 'Auth';
const ParseBodyCallback = (Data) => {
    // ! Username can not has whitespaces
    if (Data.Username !== undefined) Data.Username = Data.Username.replaceAll(' ', '');
    return Data;
};

export const GetCurrentUserToken = () => {
    try {
        return JSON.parse(localStorage.getItem(IdentifierIntoLocalStorage)).Token;
    } catch (GettinTokenError) {
        HandleLogoutIntoClient();
        return false;
    }
};

export const HandleResponseDataIntoClient = (Data) => {
    const AuthData = { ...Data.Data };
    if (!Data.Token) return AuthData;
    localStorage.setItem(IdentifierIntoLocalStorage, JSON.stringify({ Token: Data.Token }));
    return AuthData;
};

export const HandleLogoutIntoClient = () => {
    localStorage.removeItem(IdentifierIntoLocalStorage);
    return null;
};

export const GetAllUsers = (Filter) =>
    GenericRequestToBackend({
        Path: AuthRoutesAPI.GetAllUsers,
        SendToken: true,
        Filter
    });

export const UpdateMyPassword = (Data) =>
    GenericRequestToBackend({
        Path: AuthRoutesAPI.UpdateMyPassword,
        Method: 'PATCH',
        Body: Data,
        SendToken: true
    });

export const ResetPassword = (Data, ResetPasswordToken) =>
    GenericRequestToBackend({
        Path: AuthRoutesAPI.ResetPassword + ResetPasswordToken,
        Method: 'PATCH',
        Body: Data
    });

export const DeleteUser = (UserIdentifier) =>
    GenericRequestToBackend({
        Path: AuthRoutesAPI.DeleteUser + UserIdentifier,
        Method: 'DELETE',
        SendToken: true
    });

export const DeleteMe = () =>
    GenericRequestToBackend({
        Path: AuthRoutesAPI.DeleteMe,
        Method: 'DELETE',
        SendToken: true
    });

export const UpdateUser = (Data, UserIdentifier) =>
    GenericRequestToBackend({
        Path: AuthRoutesAPI.UpdateUser + UserIdentifier,
        Method: 'PATCH',
        SendToken: true,
        ParseBodyCallback,
        Body: Data
    });

export const UpdateMyProfile = (Data) =>
    GenericRequestToBackend({
        Path: AuthRoutesAPI.UpdateMyProfile,
        Method: 'PATCH',
        SendToken: true,
        ParseBodyCallback,
        Body: Data
    });

export const ForgotPassword = (Data) =>
    GenericRequestToBackend({
        Path: AuthRoutesAPI.ForgotPassword,
        Method: 'POST',
        Body: Data
    });

export const MyProfile = () =>
    GenericRequestToBackend({
        Path: AuthRoutesAPI.MyProfile,
        SendToken: true
    });

export const SignUp = (Data) =>
    GenericRequestToBackend({
        Path: AuthRoutesAPI.SignUp,
        Method: 'POST',
        ParseBodyCallback,
        Body: Data
    });

export const SignIn = (Data) =>
    GenericRequestToBackend({
        Path: AuthRoutesAPI.SignIn,
        Method: 'POST',
        ParseBodyCallback,
        Body: Data
    });
