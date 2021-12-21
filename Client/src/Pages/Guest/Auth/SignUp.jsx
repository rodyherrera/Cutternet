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
import { Link } from 'react-router-dom';
import { AuthRoutes, DataValidation } from '../../../Infrastructure';
import { AuthContext } from '../../../Services/Auth/Context';
import { LanguageContext } from '../../../Services/Language/Context';
import { CheckErrors, SetFormattedTitle, FormatString } from '../../../Utils/Shortcuts';
import isEmail from 'validator/lib/isEmail';
import SignUpImage from '../../../Assets/Images/Auth-SignUp.png';
import { BsInfoCircle } from 'react-icons/bs';
import { Button, TextField, CircularProgress } from '@mui/material';
import '../../../Assets/StyleSheet/Creator.css';
import Fade from 'react-reveal';

const SignUp = () => {
    const [GetUsername, SetUsername] = useState('');
    const [GetEmail, SetEmail] = useState('');
    const [GetPassword, SetPassword] = useState('');
    const [GetPasswordConfirm, SetPasswordConfirm] = useState('');
    const [GetIsLoading, SetIsLoading] = useState(false);
    const [GetIsComponentMounted, SetIsComponentMounted] = useState(true);
    const [GetErrors, SetErrors] = useState({});
    const [GetIsFormInvalid, SetIsFormInvalid] = useState(false);
    const { OnRegister, GetMessage } = useContext(AuthContext);
    const { GetLanguages } = useContext(LanguageContext);
    const Validator = DataValidation.Auth;

    useEffect(() => {
        SetFormattedTitle(GetLanguages.SIGN_UP_TITLE, GetLanguages);
        return () => {
            SetUsername('');
            SetEmail('');
            SetPassword('');
            SetPasswordConfirm('');
            SetIsLoading(false);
            SetIsComponentMounted(false);
            SetErrors({});
            SetIsFormInvalid(false);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        SetIsFormInvalid(
            !GetUsername.length ||
                !GetEmail.length ||
                !GetPassword.length ||
                !GetPasswordConfirm.length ||
                GetErrors.Username !== undefined ||
                GetErrors.Password !== undefined ||
                GetErrors.Email !== undefined ||
                GetErrors.PasswordConfirm !== undefined
        );
    }, [GetErrors]); // eslint-disable-line react-hooks/exhaustive-deps

    const OnSignUp = (Event) => {
        Event.preventDefault();
        if (!GetIsComponentMounted) return;
        OnRegister({
            OnStart: () => SetIsLoading(true),
            OnFinish: () => SetIsLoading(false),
            Data: {
                Username: GetUsername,
                Email: GetEmail,
                Password: GetPassword,
                PasswordConfirm: GetPasswordConfirm
            }
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
                        OnLengthError: GetLanguages.ON_SIGN_UP_USERNAME_LENGTH_ERROR_MESSAGE
                    },
                    {
                        Identifier: 'Password',
                        Getter: GetPassword,
                        OnLengthError: GetLanguages.ON_SIGN_UP_PASSWORD_LENGTH_ERROR_MESSAGE
                    },
                    {
                        Identifier: 'PasswordConfirm',
                        Getter: GetPasswordConfirm,
                        CompareWith: GetPassword,
                        OnCompareError:
                            GetLanguages.ON_SIGN_UP_PASSWORD_CONFIRM_NONEQUAL_ERROR_MESSAGE
                    },
                    {
                        Identifier: 'Email',
                        Getter: GetEmail,
                        Validator: [
                            () => isEmail(GetEmail),
                            GetLanguages.ON_SIGN_UP_EMAIL_INVALID_MESSAGE
                        ]
                    }
                ]
            })
        );
    }, [GetUsername, GetPassword, GetPasswordConfirm, GetEmail]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <main className="Creator-Main">
            <Fade clear>
                <section className="Creator-Information">
                    <article>
                        <h1>{GetLanguages.SIGN_UP_INFORMATION_TITLE}</h1>
                        <p>{GetLanguages.SIGN_UP_INFORMATION_SUBTITLE}</p>
                    </article>

                    <figure>
                        <img src={SignUpImage} alt="Create Account Img" />
                    </figure>
                </section>

                <section className="Creator-Form">
                    <article>
                        <div>
                            <h3>{GetLanguages.SIGN_UP_FORM_TITLE}</h3>
                            <div className="Form-Help-Text">
                                <p>
                                    {GetLanguages.SIGN_UP_FORM_SUBTITLE}
                                    <Link className="Link Visible" to={AuthRoutes.SignIn}>
                                        {' '}
                                        {GetLanguages.SIGN_UP_FORM_SUBTITLE_LINK}
                                    </Link>
                                </p>
                            </div>
                        </div>

                        <form method="POST" onSubmit={OnSignUp}>
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
                                        GetLanguages.SIGN_UP_FORM_USERNAME_INPUT_PLACEHOLDER
                                    }
                                    helperText={
                                        GetErrors.Username
                                            ? GetErrors.Username
                                            : FormatString({
                                                  UnformattedString:
                                                      GetLanguages.SIGN_UP_FORM_USERNAME_INPUT_HELPER_TEXT,
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
                                    placeholder={GetLanguages.SIGN_UP_FORM_EMAIL_INPUT_PLACEHOLDER}
                                    helperText={
                                        GetErrors.Email
                                            ? GetErrors.Email
                                            : GetLanguages.SIGN_UP_FORM_EMAIL_INPUT_HELPER_TEXT
                                    }
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
                                        GetLanguages.SIGN_UP_FORM_PASSWORD_INPUT_PLACEHOLDER
                                    }
                                    error={Boolean(GetErrors.Password)}
                                    helperText={
                                        GetErrors.Password
                                            ? GetErrors.Password
                                            : FormatString({
                                                  UnformattedString:
                                                      GetLanguages.SIGN_UP_FORM_PASSWORD_INPUT_HELPER_TEXT,
                                                  Values: {
                                                      MaxLength: Validator.Password.MaxLength,
                                                      MinLength: Validator.Password.MinLength
                                                  }
                                              })
                                    }
                                    inputProps={{
                                        maxLength: Validator.Password.MaxLength,
                                        minLength: Validator.Password.MinLength
                                    }}
                                />
                            </label>

                            <label className="Form-Item" htmlFor="PasswordConfirm">
                                <TextField
                                    type="password"
                                    name="PasswordConfirm"
                                    required={true}
                                    fullWidth={true}
                                    onChange={(Event) => SetPasswordConfirm(Event.target.value)}
                                    value={GetPasswordConfirm}
                                    placeholder={
                                        GetLanguages.SIGN_UP_FORM_PASSWORD_CONFIRM_INPUT_PLACEHOLDER
                                    }
                                    error={Boolean(GetErrors.PasswordConfirm)}
                                    helperText={
                                        GetErrors.PasswordConfirm
                                            ? GetErrors.PasswordConfirm
                                            : GetLanguages.SIGN_UP_FORM_PASSWORD_CONFIRM_INPUT_HELPER_TEXT
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
                                        disabled={GetIsFormInvalid}
                                        variant="outlined"
                                        type="submit"
                                        className="Link Button"
                                    >
                                        {GetLanguages.SIGN_UP_FORM_SUBMIT_BUTTON_TEXT}
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

export default SignUp;
