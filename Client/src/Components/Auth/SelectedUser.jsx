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
import React, { useState, useEffect, useContext } from 'react';
import '../../Assets/StyleSheet/Modifier.css';
import { CheckErrors, FormatString } from '../../Utils/Shortcuts';
import { DataValidation } from '../../Infrastructure';
import { AuthContext } from '../../Services/Auth/Context';
import { IoClose, BsInfoCircle } from 'react-icons/all';
import AuthUpdateUserImage from '../../Assets/Images/Auth-UpdateUser.png';
import isEmail from 'validator/lib/isEmail';
import {
    TextField,
    ListItemText,
    Select,
    FormHelperText,
    CircularProgress,
    FormControl,
    MenuItem,
    InputLabel,
    Button,
    OutlinedInput
} from '@mui/material';
import { LanguageContext } from '../../Services/Language/Context';

const SelectedUser = ({
    SetSelectedUser,
    GetMessage,
    GetSelectedUser,
    SetExecuteRefresh,
    SetWaitingMessage,
    HandleUserDelete
}) => {
    const { GetLanguages } = useContext(LanguageContext);
    const { OnUpdateUser, SetMessage } = useContext(AuthContext);
    const [GetUsername, SetUsername] = useState(GetSelectedUser.Username);
    const [GetEmail, SetEmail] = useState(GetSelectedUser.Email);
    const [GetRole, SetRole] = useState(GetSelectedUser.Role);
    const [GetIsLoading, SetIsLoading] = useState(false);
    const [GetIsFormInvalid, SetIsFormInvalid] = useState(false);
    const [GetErrors, SetErrors] = useState({});
    const [GetIsComponentMounted, SetIsComponentMounted] = useState(true);
    const Validator = DataValidation.Auth;

    useEffect(() => {
        SetMessage('');
        return () => {
            SetUsername('');
            SetEmail('');
            SetRole('');
            SetIsLoading(false);
            SetIsFormInvalid(false);
            SetErrors({});
            SetIsComponentMounted(false);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        SetErrors(
            CheckErrors({
                Validator: 'Auth',
                States: [
                    {
                        Identifier: 'Username',
                        Getter: GetUsername,
                        OnLengthError: GetLanguages.ON_SELECTED_USER_USERNAME_LENGTH_ERROR_MESSAGE
                    },
                    {
                        Identifier: 'Role',
                        Getter: GetRole,
                        OnEnumError: GetLanguages.ON_SELECTED_USER_ROLE_ENUM_ERROR_MESSAGE
                    },
                    {
                        Identifier: 'Email',
                        Getter: GetEmail,
                        Validator: [
                            () => isEmail(GetEmail),
                            GetLanguages.ON_SELECTED_USER_EMAIL_INVALID_ERROR_MESSAGE
                        ]
                    }
                ]
            })
        );

        SetIsFormInvalid(
            (GetUsername === GetSelectedUser.Username &&
                GetEmail === GetSelectedUser.Email &&
                GetRole === GetSelectedUser.Role) ||
                !GetUsername.length ||
                GetErrors.Username !== undefined ||
                GetErrors.Email !== undefined ||
                GetErrors.Role !== undefined
        );
    }, [GetUsername, GetRole, GetEmail]); // eslint-disable-line react-hooks/exhaustive-deps

    const OnSubmit = (Event) => {
        Event.preventDefault();
        if (!GetIsComponentMounted) return;
        OnUpdateUser({
            OnStart: () => SetIsLoading(true),
            OnFinish: () => SetIsLoading(false),
            UserIdentifier: GetSelectedUser._id,
            OnResolve: () => {
                SetMessage(
                    FormatString({
                        UnformattedString: GetLanguages.SELECTED_USER_UPDATE_MESSAGE,
                        Values: { Username: GetUsername }
                    })
                );
                SetWaitingMessage(GetLanguages.SELECTED_USER_UPDATE_WAITING_MESSAGE);
                SetExecuteRefresh(true);
                SetSelectedUser(null);
            },
            Data: {
                Username: GetUsername,
                Email: GetEmail,
                Role: GetRole
            }
        });
    };

    return (
        <aside className="Modifier-Aside">
            <section>
                <article className="Modifier-Aside-Information">
                    <div>
                        <h1>
                            {FormatString({
                                UnformattedString: GetLanguages.SELECTED_USER_INFORMATION_TITLE,
                                Values: { Username: GetSelectedUser.Username }
                            })}
                        </h1>
                        <p>{GetLanguages.SELECTED_USER_INFORMATION_SUBTITLE}</p>
                    </div>

                    <figure>
                        <img src={AuthUpdateUserImage} alt="Update User Img" />
                    </figure>
                </article>

                <article className="Modifier-Aside-Form">
                    <div>
                        <div>
                            <h3>{GetLanguages.SELECTED_USER_FORM_TITLE}</h3>
                            <i onClick={() => SetSelectedUser(null)} className="Link Big">
                                <IoClose />
                            </i>
                        </div>
                        <div className="Form-Help-Text">
                            <p>{GetLanguages.SELECTED_USER_FORM_SUBTITLE}</p>
                        </div>
                    </div>

                    <form method="POST" onSubmit={OnSubmit}>
                        <label className="Form-Item" htmlFor="Username">
                            <TextField
                                type="text"
                                name="Username"
                                error={Boolean(GetErrors.Username)}
                                onChange={(Event) => SetUsername(Event.target.value)}
                                value={GetUsername}
                                required={true}
                                fullWidth={true}
                                placeholder={
                                    GetLanguages.SELECTED_USER_FORM_USERNAME_INPUT_PLACEHOLDER
                                }
                                helperText={
                                    GetErrors.Username
                                        ? GetErrors.Username
                                        : FormatString({
                                              UnformattedString:
                                                  GetLanguages.SELECTED_USER_FORM_USERNAME_INPUT_HELP_TEXT,
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

                        {GetSelectedUser.Email && (
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
                                        GetLanguages.SELECTED_USER_FORM_EMAIL_INPUT_PLACEHOLDER
                                    }
                                    helperText={
                                        GetErrors.Email
                                            ? GetErrors.Email
                                            : GetLanguages.SELECTED_USER_FORM_EMAIL_INPUT_HELP_TEXT
                                    }
                                />
                            </label>
                        )}

                        {GetSelectedUser.Role && (
                            <label className="Form-Item">
                                <FormControl size="small" fullWidth={true}>
                                    <InputLabel>
                                        {GetLanguages.SELECTED_USER_ROLE_FORM_LABEL}
                                    </InputLabel>
                                    <Select
                                        value={GetRole}
                                        onChange={(Event) => SetRole(Event.target.value)}
                                        input={<OutlinedInput label="Role" />}
                                    >
                                        {Validator.Role.Enum.map((Role, Index) => (
                                            <MenuItem key={Index} value={Role}>
                                                <ListItemText primary={Role} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>
                                        {SelectedUser.SELECTED_USER_FORM_ROLE_HELP_TEXT}
                                    </FormHelperText>
                                </FormControl>
                            </label>
                        )}

                        <label className="Form-Item">
                            <Button
                                variant="text"
                                onClick={() => HandleUserDelete(GetSelectedUser)}
                                type="button"
                                className="Link Button"
                            >
                                {GetLanguages.SELECTED_USER_FORM_DELETE_BUTTON_TEXT}
                            </Button>
                            <div className="Form-Help-Text Use-Padding">
                                <p>{GetLanguages.SELECTED_USER_FORM_DELETE_HELP_TEXT}</p>
                            </div>
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
                                    {GetLanguages.SELECTED_USER_FORM_SUBMIT_BUTTON_TEXT}
                                </Button>
                            ) : (
                                <CircularProgress className="Circular-Loader" size={'2rem'} />
                            )}
                        </div>
                    </form>
                </article>
            </section>
        </aside>
    );
};

export default SelectedUser;
