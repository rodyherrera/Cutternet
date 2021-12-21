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
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthRoutes, DataValidation } from '../../../Infrastructure';
import { CheckErrors, SetFormattedTitle, FormatString } from '../../../Utils/Shortcuts';
import { LanguageContext } from '../../../Services/Language/Context';
import SignInImage from '../../../Assets/Images/Auth-SignIn.png';
import { Button, CircularProgress, TextField } from '@mui/material';
import { BsInfoCircle } from 'react-icons/bs';
import '../../../Assets/StyleSheet/Creator.css';
import Fade from 'react-reveal';

const SignIn = () => {
    const [GetUsername, SetUsername] = useState('');
    const [GetPassword, SetPassword] = useState('');
    const [GetIsLoading, SetIsLoading] = useState(false);
    const [GetIsComponentMounted, SetIsComponentMounted] = useState(true);
    const [GetErrors, SetErrors] = useState({});
    const [GetIsFormInvalid, SetIsFormInvalid] = useState(false);
    const { GetMessage, OnLogin } = useContext(AuthContext);
    const { GetLanguages } = useContext(LanguageContext);
    const Location = useLocation();
    const Navigate = useNavigate();
    const Validator = DataValidation.Auth;

    useEffect(() => {
        SetFormattedTitle(GetLanguages.SIGN_IN_TITLE, GetLanguages);
        return () => {
            SetUsername('');
            SetPassword('');
            SetIsLoading(false);
            SetIsComponentMounted(false);
            SetErrors({});
            SetIsFormInvalid(false);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        SetIsFormInvalid(
            !GetUsername.length ||
                !GetPassword.length ||
                GetErrors.Username !== undefined ||
                GetErrors.Password !== undefined
        );
    }, [GetErrors]); // eslint-disable-line react-hooks/exhaustive-deps

    const OnSignIn = (Event) => {
        Event.preventDefault();
        if (!GetIsComponentMounted) return;
        OnLogin({
            OnStart: () => SetIsLoading(true),
            Data: { Username: GetUsername, Password: GetPassword },
            OnFinish: () => SetIsLoading(false),
            OnResolve: () =>
                Navigate(Location.state?.from?.pathname || '/', {
                    replace: true
                })
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
                        OnLengthError: GetLanguages.ON_SIGN_IN_USERNAME_LENGTH_MESSAGE_ERROR
                    },
                    {
                        Identifier: 'Password',
                        Getter: GetPassword,
                        OnLengthError: GetLanguages.ON_SIGN_IN_PASSWORD_LENGTH_MESSAGE_ERROR
                    }
                ]
            })
        );
    }, [GetPassword, GetUsername]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <main className="Creator-Main">
            <Fade clear>
                <section className="Creator-Information">
                    <article>
                        <h1>{GetLanguages.SIGN_IN_INFORMATION_TITLE}</h1>
                        <p>{GetLanguages.SIGN_IN_INFORMATION_SUBTITLE}</p>
                    </article>

                    <figure>
                        <img src={SignInImage} alt="Login Account Img" />
                    </figure>
                </section>

                <section className="Creator-Form">
                    <article>
                        <div>
                            <h3>{GetLanguages.SIGN_IN_FORM_TITLE}</h3>
                            <div className="Form-Help-Text">
                                <p>
                                    {GetLanguages.SIGN_IN_FORM_SUBTITLE}
                                    <Link className="Link Visible" to={AuthRoutes.SignUp}>
                                        {' '}
                                        {GetLanguages.SIGN_IN_FORM_SUBTITLE_LINK}
                                    </Link>
                                </p>
                            </div>
                        </div>

                        <form method="POST" onSubmit={OnSignIn}>
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
                                        GetLanguages.SIGN_IN_FORM_USERNAME_INPUT_PLACEHOLDER
                                    }
                                    helperText={
                                        GetErrors.Username
                                            ? GetErrors.Username
                                            : FormatString({
                                                  UnformattedString:
                                                      GetLanguages.SIGN_IN_FORM_USERNAME_INPUT_HELPER_TEXT,
                                                  Values: {
                                                      MaxLength: Validator.Username.MaxLength,
                                                      MinLength: Validator.Username.MinLength
                                                  }
                                              })
                                    }
                                    inputProps={{
                                        maxLength: Validator.Username.MaxLength,
                                        minLength: Validator.Username.minLength
                                    }}
                                />
                            </label>

                            <label className="Form-Item" htmlFor="Password">
                                <TextField
                                    type="password"
                                    name="Password"
                                    required={true}
                                    fullWidth={true}
                                    onChange={(Event) => SetPassword(Event.target.value)}
                                    value={GetPassword}
                                    placeholder={
                                        GetLanguages.SIGN_IN_FORM_PASSWORD_INPUT_PLACEHOLDER
                                    }
                                    error={Boolean(GetErrors.Password)}
                                    helperText={
                                        GetErrors.Password ? (
                                            GetErrors.Password
                                        ) : (
                                            <>
                                                {FormatString({
                                                    UnformattedString:
                                                        GetLanguages.SIGN_IN_FORM_PASSWORD_INPUT_HELPER_TEXT,
                                                    Values: {
                                                        MaxLength: Validator.Password.MaxLength,
                                                        MinLength: Validator.Password.MinLength
                                                    }
                                                })}
                                                <Link
                                                    className="Link Visible"
                                                    to={AuthRoutes.ForgotPassword}
                                                >
                                                    {' '}
                                                    {
                                                        GetLanguages.SIGN_IN_FORM_PASSWORD_INPUT_HELPER_TEXT_LINK
                                                    }
                                                </Link>
                                            </>
                                        )
                                    }
                                    inputProps={{
                                        maxLength: Validator.Password.MaxLength,
                                        minLength: Validator.Password.MinLength
                                    }}
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
                                        disabled={GetIsFormInvalid}
                                        className="Link Button"
                                    >
                                        {GetLanguages.SIGN_IN_FORM_SUBMIT_BUTTON_TEXT}
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

export default SignIn;
