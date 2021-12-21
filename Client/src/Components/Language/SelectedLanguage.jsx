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
import { DataValidation } from '../../Infrastructure';
import { LanguageContext } from '../../Services/Language/Context';
import { CheckErrors, FormatString } from '../../Utils/Shortcuts';
import { TextField, Button, CircularProgress } from '@mui/material';
import LanguageUpdateImage from '../../Assets/Images/Language-Update.png';
import { BsInfoCircle, IoClose } from 'react-icons/all';
const SelectedLanguage = ({
    SetSelectedLanguage,
    GetSelectedLanguage,
    SetExecuteRefresh,
    SetWaitingMessage,
    GetMessage,
    HandleLanguageDelete
}) => {
    const { OnUpdateLanguage, SetMessage, GetLanguages } = useContext(LanguageContext);
    const [GetKey, SetKey] = useState(GetSelectedLanguage.Key);
    const [GetValue, SetValue] = useState(GetSelectedLanguage.Value);
    const [GetLanguage, SetLanguage] = useState(GetSelectedLanguage.Language);
    const [GetIsLoading, SetIsLoading] = useState(false);
    const [GetIsFormInvalid, SetIsFormInvalid] = useState(false);
    const [GetErrors, SetErrors] = useState({});
    const [GetIsComponentMounted, SetIsComponentMounted] = useState(true);
    const Validator = DataValidation.Language;

    useEffect(() => {
        SetMessage('');
        return () => {
            SetKey('');
            SetValue('');
            SetLanguage('');
            SetIsLoading(false);
            SetIsFormInvalid(false);
            SetErrors({});
            SetIsComponentMounted(false);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        SetErrors(
            CheckErrors({
                Validator: 'Language',
                States: [
                    {
                        Identifier: 'Key',
                        Getter: GetKey,
                        OnLengthError: GetLanguages.ON_SELECTED_LANGUAGE_KEY_LENGTH_ERROR_MESSAGE
                    },
                    {
                        Identifier: 'Value',
                        Getter: GetValue,
                        OnLengthError: GetLanguages.ON_SELECTED_LANGUAGE_VALUE_LENGTH_ERROR_MESSAGE
                    },
                    {
                        Identifier: 'Language',
                        Getter: GetLanguage,
                        OnLengthError:
                            GetLanguages.ON_SELECTED_LANGUAGE_LANGUAGE_LENGTH_ERROR_MESSAGE
                    }
                ]
            })
        );

        SetIsFormInvalid(
            (GetKey === GetSelectedLanguage.Key &&
                GetLanguage === GetSelectedLanguage.Language &&
                GetValue === GetSelectedLanguage.Value) ||
                !GetKey.length ||
                GetErrors.Key !== undefined ||
                GetErrors.Language !== undefined ||
                GetErrors.Value !== undefined
        );
    }, [GetKey, GetValue, GetLanguage]); // eslint-disable-line react-hooks/exhaustive-deps

    const OnSubmit = (Event) => {
        Event.preventDefault();
        if (!GetIsComponentMounted) return;
        OnUpdateLanguage({
            OnStart: () => SetIsLoading(true),
            OnFinish: () => SetIsLoading(false),
            LanguageIdentifier: GetSelectedLanguage._id,
            OnResolve: () => {
                SetMessage(
                    FormatString({
                        UnformattedString: GetLanguages.SELECTED_LANGUAGE_UPDATE_MESSAGE,
                        Values: { Key: GetKey },
                        SafeLength: true
                    })
                );
                SetSelectedLanguage(null);
                SetExecuteRefresh(true);
                SetWaitingMessage(GetLanguages.SELECTED_LANGUAGE_UPDATE_WAITING_MESSAGE);
            },
            Data: {
                Key: GetKey,
                Value: GetValue,
                Language: GetLanguage
            }
        });
    };

    return (
        <aside className="Modifier-Aside">
            <section>
                <article className="Modifier-Aside-Information">
                    <div>
                        <h1>{GetLanguages.SELECTED_LANGUAGE_INFORMATION_TITLE}</h1>
                        <p>{GetLanguages.SELECTED_LANGUAGE_INFORMATION_SUBTITLE}</p>
                    </div>

                    <figure>
                        <img src={LanguageUpdateImage} alt="Update Language Img" />
                    </figure>
                </article>

                <article className="Modifier-Aside-Form">
                    <div>
                        <div>
                            <h3>{GetLanguages.SELECTED_LANGUAGE_FORM_TITLE}</h3>
                            <i onClick={() => SetSelectedLanguage(null)} className="Link Big">
                                <IoClose />
                            </i>
                        </div>
                        <div className="Form-Help-Text">
                            <p>{GetLanguages.SELECTED_LANGUAGE_FORM_SUBTITLE}</p>
                        </div>
                    </div>

                    <form method="POST" onSubmit={OnSubmit}>
                        <label className="Form-Item" htmlFor="Key">
                            <TextField
                                autoFocus={window.innerWidth > 768}
                                type="text"
                                name="Key"
                                error={Boolean(GetErrors.Key)}
                                onChange={(Event) => SetKey(Event.target.value)}
                                value={GetKey}
                                required={true}
                                fullWidth={true}
                                placeholder={
                                    GetLanguages.SELECTED_LANGUAGE_FORM_KEY_INPUT_PLACEHOLDER
                                }
                                helperText={
                                    GetErrors.Key
                                        ? GetErrors.Key
                                        : FormatString({
                                              UnformattedString:
                                                  GetLanguages.SELECTED_LANGUAGE_FORM_KEY_INPUT_HELP_TEXT,
                                              Values: {
                                                  MaxLength: Validator.Key.MaxLength,
                                                  MinLength: Validator.Key.MinLength
                                              }
                                          })
                                }
                                inputProps={{
                                    maxLength: Validator.Key.MaxLength,
                                    minLength: Validator.Key.MinLength
                                }}
                            />
                        </label>

                        {GetSelectedLanguage.Value && (
                            <label className="Form-Item" htmlFor="Value">
                                <TextField
                                    type="text"
                                    name="Value"
                                    error={Boolean(GetErrors.Value)}
                                    onChange={(Event) => SetValue(Event.target.value)}
                                    value={GetValue}
                                    required={true}
                                    fullWidth={true}
                                    placeholder={
                                        GetLanguages.SELECTED_LANGUAGE_FORM_VALUE_INPUT_PLACEHOLDER
                                    }
                                    helperText={
                                        GetErrors.Value
                                            ? GetErrors.Value
                                            : FormatString({
                                                  UnformattedString:
                                                      GetLanguages.SELECTED_LANGUAGE_FORM_VALUE_INPUT_HELP_TEXT,
                                                  Values: {
                                                      MaxLength: Validator.Value.MaxLength,
                                                      MinLength: Validator.Value.MinLength
                                                  }
                                              })
                                    }
                                    inputProps={{
                                        maxLength: Validator.Value.MaxLength,
                                        minLength: Validator.Value.MinLength
                                    }}
                                />
                            </label>
                        )}

                        {GetSelectedLanguage.Language && (
                            <label className="Form-Item" htmlFor="Language">
                                <TextField
                                    type="text"
                                    name="Language"
                                    error={Boolean(GetErrors.Language)}
                                    onChange={(Event) => SetLanguage(Event.target.value)}
                                    value={GetLanguage}
                                    required={true}
                                    fullWidth={true}
                                    placeholder={
                                        GetLanguages.SELECTED_LANGUAGE_FORM_LANGUAGE_INPUT_PLACEHOLDER
                                    }
                                    helperText={
                                        GetErrors.Language
                                            ? GetErrors.Language
                                            : GetLanguages.SELECTED_LANGUAGE_FORM_LANGUAGE_INPUT_HELP_TEXT
                                    }
                                    inputProps={{
                                        maxLength: Validator.Language.MaxLength,
                                        minLength: Validator.Language.MinLength
                                    }}
                                />
                            </label>
                        )}

                        <label className="Form-Item">
                            <Button
                                variant="text"
                                onClick={() => HandleLanguageDelete(GetSelectedLanguage)}
                                type="button"
                                className="Link Button"
                            >
                                {GetLanguages.SELECTED_LANGUAGE_FORM_DELETE}
                            </Button>
                            <div className="Form-Help-Text Use-Padding">
                                <p>{GetLanguages.SELECTED_LANGUAGE_FORM_DELETE_HELP_TEXT}</p>
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
                                    variant="outlined"
                                    type="submit"
                                    disabled={GetIsFormInvalid}
                                    className="Link Button"
                                >
                                    {GetLanguages.SELECTED_LANGUAGE_FORM_SUBMIT_BUTTON_TEXT}
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

export default SelectedLanguage;
