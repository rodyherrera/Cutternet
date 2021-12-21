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
import { CheckErrors, SetFormattedTitle } from '../../../Utils/Shortcuts';
import '../../../Assets/StyleSheet/Creator.css';
import { TextField, Button, CircularProgress } from '@mui/material';
import { BsInfoCircle } from 'react-icons/bs';
import { AuthRoutes, DataValidation } from '../../../Infrastructure';
import UpdatePasswordImage from '../../../Assets/Images/Auth-UpdatePassword.png';
import Fade from 'react-reveal';

import { Link } from 'react-router-dom';
const UpdateMyPassword = () => {
    const [GetIsComponentMounted, SetIsComponentMounted] = useState(true);
    const [GetIsLoading, SetIsLoading] = useState(false);
    const [GetCurrentPassword, SetCurrentPassword] = useState('');
    const [GetPassword, SetPassword] = useState('');
    const [GetPasswordConfirm, SetPasswordConfirm] = useState('');
    const [GetErrors, SetErrors] = useState({});
    const [GetIsFormInvalid, SetIsFormInvalid] = useState(false);
    const { OnUpdateMyPassword, GetMessage, SetMessage } = useContext(AuthContext);
    const { GetLanguages } = useContext(LanguageContext);
    const Validator = DataValidation.Auth;

    useEffect(() => {
        SetFormattedTitle(GetLanguages.UPDATE_MY_PASSWORD_TITLE, GetLanguages);
        return () => {
            SetIsComponentMounted(false);
            SetIsLoading(false);
            SetCurrentPassword('');
            SetPassword('');
            SetPasswordConfirm('');
            SetErrors({});
            SetIsFormInvalid(false);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        SetIsFormInvalid(
            !GetCurrentPassword.length ||
                !GetPassword.length ||
                !GetPasswordConfirm.length ||
                GetErrors.Password !== undefined ||
                GetErrors.CurrentPassword !== undefined ||
                GetErrors.PasswordConfirm !== undefined
        );
    }, [GetErrors]); // eslint-disable-line react-hooks/exhaustive-deps

    const HandleOnSubmit = (Event) => {
        Event.preventDefault();
        if (!GetIsComponentMounted) return;
        OnUpdateMyPassword({
            OnStart: () => SetIsLoading(true),
            OnFinish: () => SetIsLoading(false),
            OnResolve: () => SetMessage(GetLanguages.ON_UPDATE_MY_PASSWORD_MESSAGE),
            Data: {
                PasswordCurrent: GetCurrentPassword,
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
                        Getter: GetCurrentPassword,
                        OnLengthError:
                            GetLanguages.ON_UPDATE_MY_PASSWORD_CURRENT_PASSWORD_LENGTH_MESSAGE_ERROR
                    },
                    {
                        Identifier: 'Password',
                        Getter: GetPassword,
                        OnLengthError:
                            GetLanguages.ON_UPDATE_MY_PASSWORD_PASSWORD_LENGTH_MESSAGE_ERROR
                    },
                    {
                        Identifier: 'PasswordConfirm',
                        Getter: GetPasswordConfirm,
                        CompareWith: GetPassword,
                        OnCompareError:
                            GetLanguages.ON_UPDATE_MY_PASSWORD_PASSWORD_CONFIRM_NONEQUAL_MESSAGE_ERROR
                    }
                ]
            })
        );
    }, [GetPassword, GetPasswordConfirm, GetCurrentPassword]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <main className="Creator-Main">
            <Fade clear>
                <section className="Creator-Information">
                    <article>
                        <h1>{GetLanguages.UPDATE_MY_PASSWORD_INFORMATION_TITLE}</h1>
                        <p>{GetLanguages.UPDATE_MY_PASSWORD_INFORMATION_SUBTITLE}</p>
                    </article>

                    <figure>
                        <img src={UpdatePasswordImage} alt="Update Password Img" />
                    </figure>
                </section>

                <section className="Creator-Form">
                    <article>
                        <div>
                            <h3>{GetLanguages.UPDATE_MY_PASSWORD_FORM_TITLE}</h3>
                            <div className="Form-Help-Text">
                                <p>
                                    {GetLanguages.UPDATE_MY_PASSWORD_FORM_SUBTITLE}
                                    <Link to={AuthRoutes.ForgotPassword} className="Link Visible">
                                        {' '}
                                        {GetLanguages.UPDATE_MY_PASSWORD_FORM_SUBTITLE_LINK}
                                    </Link>
                                </p>
                            </div>
                        </div>

                        <form method="PATCH" onSubmit={HandleOnSubmit}>
                            <label className="Form-Item" htmlFor="CurrentPassword">
                                <TextField
                                    autoFocus={window.innerWidth > 768}
                                    type="text"
                                    name="CurrentPassword"
                                    error={Boolean(GetErrors.CurrentPassword)}
                                    onChange={(Event) => SetCurrentPassword(Event.target.value)}
                                    value={GetCurrentPassword}
                                    required={true}
                                    fullWidth={true}
                                    placeholder={
                                        GetLanguages.UPDATE_MY_PASSWORD_FORM_CURRENT_PASSWORD_INPUT_PLACEHOLDER
                                    }
                                    helperText={
                                        GetErrors.CurrentPassword
                                            ? GetErrors.CurrentPassword
                                            : GetLanguages.UPDATE_MY_PASSWORD_FORM_CURRENT_PASSWORD_INPUT_HELPER_TEXT
                                    }
                                    inputProps={{
                                        maxLength: Validator.Password.MaxLength,
                                        minLength: Validator.Password.MinLength
                                    }}
                                />
                            </label>

                            <label className="Form-Item" htmlFor="Password">
                                <TextField
                                    type="password"
                                    name="Password"
                                    error={Boolean(GetErrors.Password)}
                                    onChange={(Event) => SetPassword(Event.target.value)}
                                    value={GetPassword}
                                    required={true}
                                    fullWidth={true}
                                    placeholder={
                                        GetLanguages.UPDATE_MY_PASSWORD_FORM_PASSWORD_INPUT_PLACEHOLDER
                                    }
                                    helperText={
                                        GetErrors.Password
                                            ? GetErrors.Password
                                            : GetLanguages.UPDATE_MY_PASSWORD_FORM_PASSWORD_INPUT_HELPER_TEXT
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
                                    error={Boolean(GetErrors.PasswordConfirm)}
                                    onChange={(Event) => SetPasswordConfirm(Event.target.value)}
                                    value={GetPasswordConfirm}
                                    required={true}
                                    fullWidth={true}
                                    placeholder={
                                        GetLanguages.UPDATE_MY_PASSWORD_FORM_PASSWORD_CONFIRM_INPUT_PLACEHOLDER
                                    }
                                    helperText={
                                        GetErrors.PasswordConfirm
                                            ? GetErrors.PasswordConfirm
                                            : GetLanguages.UPDATE_MY_PASSWORD_FORM_PASSWORD_CONFIRM_INPUT_HELPER_TEXT
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
                                        {GetLanguages.UPDATE_MY_PASSWORD_FORM_SUBMIT_BUTTON_TEXT}
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

export default UpdateMyPassword;
