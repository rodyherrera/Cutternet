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
import { useNavigate, useParams } from 'react-router';
import { AuthContext } from '../../../Services/Auth/Context';
import { LanguageContext } from '../../../Services/Language/Context';
import { CheckErrors, SetFormattedTitle, FormatString } from '../../../Utils/Shortcuts';
import { BsInfoCircle } from 'react-icons/bs';
import '../../../Assets/StyleSheet/Creator.css';
import { Button, TextField, CircularProgress } from '@mui/material';
import ResetPasswordImage from '../../../Assets/Images/Auth-ResetPassword.png';
import { DataValidation } from '../../../Infrastructure';
import Fade from 'react-reveal';

const ResetPassword = () => {
    const [GetPassword, SetPassword] = useState('');
    const [GetIsLoading, SetIsLoading] = useState(false);
    const [GetPasswordConfirm, SetPasswordConfirm] = useState('');
    const [GetIsComponentMounted, SetIsComponentMounted] = useState(true);
    const [GetIsFormInvalid, SetIsFormInvalid] = useState(false);
    const [GetErrors, SetErrors] = useState({});
    const { OnResetPassword, GetMessage } = useContext(AuthContext);
    const { GetLanguages } = useContext(LanguageContext);
    const { ResetPasswordToken } = useParams();
    const Navigate = useNavigate();
    const Validator = DataValidation.Auth;

    useEffect(() => {
        SetFormattedTitle(GetLanguages.RESET_PASSWORD_TITLE, GetLanguages);
        return () => {
            SetPassword('');
            SetIsLoading(false);
            SetPasswordConfirm('');
            SetIsComponentMounted(false);
            SetIsFormInvalid(false);
            SetErrors({});
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        SetIsFormInvalid(
            !GetPassword.length ||
                !GetPasswordConfirm.length ||
                GetErrors.Password !== undefined ||
                GetErrors.PasswordConfirm !== undefined
        );
    }, [GetErrors]); // eslint-disable-line react-hooks/exhaustive-deps

    const OnSubmit = (Event) => {
        Event.preventDefault();
        if (!GetIsComponentMounted) return;
        OnResetPassword({
            OnStart: () => SetIsLoading(true),
            OnFinish: () => SetIsLoading(false),
            OnResolve: () => Navigate('/'),
            ResetPasswordToken,
            Data: {
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
                        Identifier: 'Password',
                        Getter: GetPassword,
                        OnLengthError: GetLanguages.ON_RESET_PASSWORD_PASSWORD_LENGTH_ERROR_MESSAGE
                    },
                    {
                        Identifier: 'PasswordConfirm',
                        Getter: GetPasswordConfirm,
                        CompareWith: GetPassword,
                        OnCompareError:
                            GetLanguages.ON_RESET_PASSWORD_PASSWORD_CONFIRM_NONEQUAL_ERROR_MESSAGE
                    }
                ]
            })
        );
    }, [GetPassword, GetPasswordConfirm]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <main className="Creator-Main Use-Full-Main">
            <Fade clear>
                <section className="Creator-Information">
                    <article>
                        <h1>{GetLanguages.RESET_PASSWORD_INFORMATION_TITLE}</h1>
                        <p>{GetLanguages.RESET_PASSWORD_INFORMATION_SUBTITLE}</p>
                    </article>

                    <figure>
                        <img src={ResetPasswordImage} alt="Reset Password Img" />
                    </figure>
                </section>

                <section className="Creator-Form">
                    <article>
                        <div>
                            <h3>{GetLanguages.RESET_PASSWORD_FORM_TITLE}</h3>
                            <div className="Form-Help-Text">
                                <p>{GetLanguages.RESET_PASSWORD_FORM_SUBTITLE}</p>
                            </div>
                        </div>

                        <form method="POST" onSubmit={OnSubmit}>
                            <label className="Form-Item" htmlFor="Password">
                                <TextField
                                    autoFocus={window.innerWidth > 768}
                                    type="password"
                                    name="Password"
                                    required={true}
                                    fullWidth={true}
                                    onChange={(Event) => SetPassword(Event.target.value)}
                                    value={GetPassword}
                                    placeholder={
                                        GetLanguages.RESET_PASSWORD_FORM_PASSWORD_INPUT_PLACEHOLDER
                                    }
                                    error={Boolean(GetErrors.Password)}
                                    helperText={
                                        GetErrors.Password
                                            ? GetErrors.Password
                                            : FormatString({
                                                  UnformattedString:
                                                      GetLanguages.RESET_PASSWORD_FORM_PASSWORD_INPUT_HELPER_TEXT,
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
                                        GetLanguages.RESET_PASSWORD_FORM_PASSWORD_CONFIRM_INPUT_PLACEHOLDER
                                    }
                                    error={Boolean(GetErrors.PasswordConfirm)}
                                    helperText={
                                        GetErrors.PasswordConfirm
                                            ? GetErrors.PasswordConfirm
                                            : GetLanguages.RESET_PASSWORD_FORM_PASSWORD_CONFIRM_INPUT_HELPER_TEXT
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
                                        disabled={GetIsFormInvalid}
                                        type="submit"
                                        className="Link Button"
                                    >
                                        {GetLanguages.RESET_PASSWORD_FORM_SUBMIT_BUTTON_TEXT}
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

export default ResetPassword;
