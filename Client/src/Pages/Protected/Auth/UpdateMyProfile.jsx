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
import { CheckErrors, FormatString, SetFormattedTitle } from '../../../Utils/Shortcuts';
import isEmail from 'validator/lib/isEmail';
import '../../../Assets/StyleSheet/Creator.css';
import { TextField, Button, CircularProgress } from '@mui/material';
import { BsInfoCircle } from 'react-icons/bs';
import AuthUpdateProfile from '../../../Assets/Images/Auth-UpdateProfile.png';
import { DataValidation } from '../../../Infrastructure';
import Fade from 'react-reveal';

const UpdateMyProfile = () => {
    const [GetUsername, SetUsername] = useState('');
    const [GetEmail, SetEmail] = useState('');
    const [GetIsLoading, SetIsLoading] = useState(false);
    const [GetIsComponentMounted, SetIsComponentMounted] = useState(true);
    const [GetErrors, SetErrors] = useState({});
    const [GetIsFormInvalid, SetIsFormInvalid] = useState(false);
    const { OnUpdateProfile, GetMessage, GetUser, SetMessage } = useContext(AuthContext);
    const { GetLanguages } = useContext(LanguageContext);
    const Validator = DataValidation.Auth;

    useEffect(() => {
        SetIsFormInvalid(
            !GetUsername.length ||
                !GetEmail.length ||
                (GetUsername === GetUser.Username && GetEmail === GetUser.Email) ||
                GetErrors.Username !== undefined ||
                GetErrors.Email !== undefined
        );
    }, [GetErrors]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        SetFormattedTitle(GetLanguages.UPDATE_MY_PROFILE_TITLE, GetLanguages);
        return () => {
            SetUsername('');
            SetEmail('');
            SetIsLoading(false);
            SetIsComponentMounted(false);
            SetErrors({});
            SetIsFormInvalid(false);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const OnSubmit = (Event) => {
        Event.preventDefault();
        if (!GetIsComponentMounted) return;
        OnUpdateProfile({
            OnStart: () => SetIsLoading(true),
            OnFinish: () => SetIsLoading(false),
            OnResolve: () =>
                SetMessage(
                    FormatString({
                        UnformattedString: GetLanguages.ON_UPDATE_MY_PROFILE_MESSAGE,
                        Values: { User: GetUsername }
                    })
                ),
            Data: { Username: GetUsername, Email: GetEmail }
        });
    };

    useEffect(() => {
        SetErrors(
            CheckErrors({
                Validator: 'Auth',
                States: [
                    {
                        Identifier: 'Username',
                        LengthWithoutWhitespaces: true,
                        Getter: GetUsername,
                        OnLengthError:
                            GetLanguages.ON_UPDATE_MY_PROFILE_USERNAME_LENGTH_MESSAGE_ERROR
                    },
                    {
                        Identifier: 'Email',
                        Getter: GetEmail,
                        Validator: [
                            () => isEmail(GetEmail),
                            GetLanguages.ON_UPDATE_MY_PROFILE_EMAIL_INVALID_MESSAGE
                        ]
                    }
                ]
            })
        );
    }, [GetEmail, GetUsername]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const { Username, Email } = GetUser;
        SetUsername(Username);
        SetEmail(Email);
    }, [GetUser]);

    return (
        <main className="Creator-Main">
            <Fade clear>
                <section className="Creator-Information">
                    <article>
                        <h1>
                            {FormatString({
                                UnformattedString: GetLanguages.UPDATE_MY_PROFILE_INFORMATION_TITLE,
                                Values: { Username: GetUser.Username }
                            })}
                        </h1>
                        <p>{GetLanguages.UPDATE_MY_PROFILE_INFORMATION_SUBTITLE}</p>
                    </article>

                    <figure>
                        <img src={AuthUpdateProfile} alt="Update Profile Img" />
                    </figure>
                </section>

                <section className="Creator-Form">
                    <article>
                        <div>
                            <h3>{GetLanguages.UPDATE_MY_PROFILE_FORM_TITLE}</h3>
                            <div className="Form-Help-Text">
                                <p>{GetLanguages.UPDATE_MY_PROFILE_FORM_SUBTITLE}</p>
                            </div>
                        </div>

                        <form method="PATCH" onSubmit={OnSubmit}>
                            <label className="Form-Item" htmlFor="Username">
                                <TextField
                                    autoFocus={window.innerWidth > 768}
                                    type="text"
                                    name="Username"
                                    error={Boolean(GetErrors.Username)}
                                    onChange={(Event) => SetUsername(Event.target.value)}
                                    value={GetUsername}
                                    required={true}
                                    fullWidth={true}
                                    placeholder={
                                        GetLanguages.UPDATE_MY_PROFILE_FORM_USERNAME_INPUT_PLACEHOLDER
                                    }
                                    helperText={
                                        GetErrors.Username
                                            ? GetErrors.Username
                                            : FormatString({
                                                  UnformattedString:
                                                      GetLanguages.UPDATE_MY_PROFILE_FORM_USERNAME_INPUT_HELPER_TEXT,
                                                  Values: {
                                                      MaxLength: Validator.Username.MaxLength,
                                                      MinLength: Validator.Username.MinLength
                                                  }
                                              })
                                    }
                                    inputProps={{
                                        maxLength: Validator.Username.MaxLength,
                                        minLength: Validator.Username.MinLength
                                    }}
                                />
                            </label>

                            <label className="Form-Item" htmlFor="Email">
                                <TextField
                                    type="email"
                                    name="Email"
                                    error={Boolean(GetErrors.Email)}
                                    onChange={(Event) => SetEmail(Event.target.value)}
                                    value={GetEmail}
                                    required={true}
                                    fullWidth={true}
                                    placeholder={
                                        GetLanguages.UPDATE_MY_PROFILE_FORM_EMAIL_INPUT_PLACEHOLDER
                                    }
                                    helperText={
                                        GetErrors.Email
                                            ? GetErrors.Email
                                            : GetLanguages.UPDATE_MY_PROFILE_FORM_EMAIL_INPUT_HELPER_TEXT
                                    }
                                />
                            </label>

                            {GetMessage && !Object.values(GetErrors).includes(GetMessage) && (
                                <div className="Form-Info">
                                    <i>
                                        <BsInfoCircle />
                                    </i>
                                    <p>{GetMessage}</p>
                                </div>
                            )}

                            <div className="Form-Submit">
                                {!GetIsLoading ? (
                                    <Button
                                        variant="outlined"
                                        type="submit"
                                        className="Link Button"
                                        disabled={GetIsFormInvalid}
                                    >
                                        {GetLanguages.UPDATE_MY_PROFILE_FORM_SUBMIT_BUTTON_TEXT}
                                    </Button>
                                ) : (
                                    <CircularProgress className="Circular-Loader" size={'2rem'} />
                                )}
                            </div>
                        </form>
                    </article>
                </section>
            </Fade>
        </main>
    );
};

export default UpdateMyProfile;
