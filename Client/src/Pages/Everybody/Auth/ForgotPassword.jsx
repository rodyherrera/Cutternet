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
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../Services/Auth/Context';
import { LanguageContext } from '../../../Services/Language/Context';
import { CheckErrors, FormatString, SetFormattedTitle } from '../../../Utils/Shortcuts';
import '../../../Assets/StyleSheet/Creator.css';
import { BsInfoCircle } from 'react-icons/bs';
import { CircularProgress, Button, TextField } from '@mui/material';
import ForgotPasswordImage from '../../../Assets/Images/Auth-ForgotPassword.png';
import { DataValidation } from '../../../Infrastructure';
import Fade from 'react-reveal';

const ForgotPassword = () => {
    const { OnForgotPassword, GetMessage, GetUser, SetMessage } = useContext(AuthContext);
    const { GetLanguages } = useContext(LanguageContext);
    const [GetUsername, SetUsername] = useState('');
    const [GetIsLoading, SetIsLoading] = useState(false);
    const [GetIsComponentMounted, SetIsComponentMounted] = useState(true);
    const [GetErrors, SetErrors] = useState({});
    const [GetIsFormInvalid, SetIsFormInvalid] = useState(false);
    const Validator = DataValidation.Auth;

    useEffect(() => {
        SetIsFormInvalid(GetErrors.Username !== undefined || !GetUsername.length);
    }, [GetErrors]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        SetFormattedTitle(GetLanguages.FORGOT_PASSWORD_TITLE, GetLanguages);
        return () => {
            SetUsername('');
            SetIsLoading(false);
            SetErrors({});
            SetIsFormInvalid(false);
            SetIsComponentMounted(false);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const OnSubmit = (Event) => {
        Event.preventDefault();
        if (!GetIsComponentMounted) return;
        OnForgotPassword({
            OnStart: () => SetIsLoading(true),
            OnFinish: () => SetIsLoading(false),
            Data: { Username: GetUsername },
            OnResolve: () =>
                SetMessage(
                    FormatString({
                        UnformattedString: GetLanguages.ON_FORGOT_PASSWORD_MESSAGE,
                        Values: { User: GetUsername }
                    })
                )
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
                        OnLengthError: GetLanguages.ON_FORGOT_PASSWORD_USERNAME_LENGTH_ERROR_MESSAGE
                    }
                ]
            })
        );
    }, [GetUsername]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!GetUser) return;
        SetUsername(GetUser.Username);
    }, [GetUser]);

    return (
        <main className="Creator-Main">
            <Fade clear>
                <section className="Creator-Information">
                    <article>
                        <h1>{GetLanguages.FORGOT_PASSWORD_INFORMATION_TITLE}</h1>
                        <p>{GetLanguages.FORGOT_PASSWORD_INFORMATION_SUBTITLE}</p>
                    </article>

                    <figure>
                        <img src={ForgotPasswordImage} alt="Forgot Password Img" />
                    </figure>
                </section>

                <section className="Creator-Form">
                    <article>
                        <div>
                            <h3>{GetLanguages.FORGOT_PASSWORD_FORM_TITLE}</h3>
                            <div className="Form-Help-Text">
                                <p>{GetLanguages.FORGOT_PASSWORD_FORM_SUBTITLE}</p>
                            </div>
                        </div>

                        <form method="POST" onSubmit={OnSubmit}>
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
                                        GetLanguages.FORGOT_PASSWORD_FORM_USERNAME_INPUT_PLACEHOLDER
                                    }
                                    helperText={
                                        GetErrors.Username
                                            ? GetErrors.Username
                                            : FormatString({
                                                  UnformattedString:
                                                      GetLanguages.FORGOT_PASSWORD_FORM_USERNAME_INPUT_HELPER_TEXT,
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

                            {GetMessage && !Object.values(GetErrors).includes(GetMessage) && (
                                <div className="Form-Info">
                                    <i>
                                        <BsInfoCircle />
                                    </i>
                                    <p>
                                        {FormatString({
                                            UnformattedString: GetMessage,
                                            Values: {
                                                Username: GetUsername
                                            }
                                        })}
                                    </p>
                                </div>
                            )}

                            <div className="Form-Submit">
                                {!GetIsLoading ? (
                                    <Button
                                        variant="outlined"
                                        disabled={GetIsFormInvalid}
                                        type="submit"
                                        className="Link Button"
                                    >
                                        {GetLanguages.FORGOT_PASSWORD_FORM_SUBMIT_BUTTON_TEXT}
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

export default ForgotPassword;
