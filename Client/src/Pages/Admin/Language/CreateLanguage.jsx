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
import React, { useContext, useState, useEffect } from 'react';
import { LanguageContext } from '../../../Services/Language/Context';
import { DataValidation, LanguageRoutes } from '../../../Infrastructure';
import { useNavigate } from 'react-router-dom';
import { CheckErrors, FormatString, SetFormattedTitle } from '../../../Utils/Shortcuts';
import '../../../Assets/StyleSheet/Creator.css';
import { CircularProgress, Button, TextField } from '@mui/material';
import { BsInfoCircle } from 'react-icons/bs';
import LanguageCreateImage from '../../../Assets/Images/Language-Create.png';
import Fade from 'react-reveal';

const CreateLanguage = () => {
    const { OnCreateLanguage, GetMessage, SetMessage, GetLanguages } = useContext(LanguageContext);
    const [GetKey, SetKey] = useState('');
    const [GetValue, SetValue] = useState('');
    const [GetLanguage, SetLanguage] = useState('');
    const [GetIsLoading, SetIsLoading] = useState(false);
    const [GetIsFormInvalid, SetIsFormInvalid] = useState(false);
    const [GetIsComponentMounted, SetIsComponentMounted] = useState(true);
    const [GetErrors, SetErrors] = useState({});
    const Navigate = useNavigate();
    const Validator = DataValidation.Language;

    useEffect(() => {
        SetFormattedTitle(GetLanguages.CREATE_LANGUAGE_TITLE, GetLanguages);
        return () => {
            SetKey('');
            SetValue('');
            SetLanguage('');
            SetIsLoading(false);
            SetIsFormInvalid(false);
            SetIsComponentMounted(false);
            SetErrors({});
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        SetIsFormInvalid(
            !GetKey.length ||
                !GetValue.length ||
                !GetLanguage.length ||
                GetErrors.Key !== undefined ||
                GetErrors.Value !== undefined ||
                GetErrors.Language !== undefined
        );
    }, [GetErrors]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        SetErrors(
            CheckErrors({
                Validator: 'Language',
                States: [
                    {
                        Identifier: 'Key',
                        Getter: GetKey,
                        OnLengthError: GetLanguages.ON_CREATE_LANGUAGE_KEY_LENGTH_ERROR_MESSAGE
                    },
                    {
                        Identifier: 'Value',
                        Getter: GetValue,
                        OnLengthError: GetLanguages.ON_CREATE_LANGUAVE_VALUE_LENGTH_ERROR_MESSAGE
                    },
                    {
                        Identifier: 'Language',
                        Getter: GetLanguage,
                        OnLengthError: GetLanguages.ON_CREATE_LANGUAGE_LANGUAGE_LENGTH_ERROR_MESSAGE
                    }
                ]
            })
        );
    }, [GetKey, GetValue, GetLanguage]); // eslint-disable-line react-hooks/exhaustive-deps

    const HandleOnSubmit = (Event) => {
        Event.preventDefault();
        if (!GetIsComponentMounted) return;
        OnCreateLanguage({
            OnStart: () => SetIsLoading(true),
            OnRejection: () => SetIsLoading(false),
            OnResolve: () => {
                SetMessage([
                    FormatString({
                        UnformattedString: GetLanguages.ON_CREATE_LANGUAGE_MESSAGE,
                        Values: { Key: GetKey },
                        SafeLength: true
                    })
                ]);
                Navigate(LanguageRoutes.ManageLanguages);
            },
            Data: {
                Key: GetKey,
                Value: GetValue,
                Language: GetLanguage
            }
        });
    };

    return (
        <main className="Creator-Main">
            <Fade clear>
                <section className="Creator-Information">
                    <article>
                        <h1>{GetLanguages.CREATE_LANGUAGE_INFORMATION_TITLE}</h1>
                        <p>{GetLanguages.CREATE_LANGUAGE_INFORMATION_SUBTITLE}</p>
                    </article>

                    <figure>
                        <img src={LanguageCreateImage} alt="Create Language Img" />
                    </figure>
                </section>

                <section className="Creator-Form">
                    <article>
                        <div>
                            <h3>{GetLanguages.CREATE_LANGUAGE_FORM_TITLE}</h3>
                            <div className="Form-Help-Text">
                                <p>{GetLanguages.CREATE_LANGUAGE_FORM_SUBTITLE}</p>
                            </div>
                        </div>

                        <form method="POST" onSubmit={HandleOnSubmit}>
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
                                        GetLanguages.CREATE_LANGUAGE_FORM_KEY_INPUT_PLACEHOLDER
                                    }
                                    helperText={
                                        GetErrors.Key
                                            ? GetErrors.Key
                                            : FormatString({
                                                  UnformattedString:
                                                      GetLanguages.CREATE_LANGUAGE_FORM_KEY_INPUT_HELPER_TEXT,
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
                                        GetLanguages.CREATE_LANGUAGE_FORM_VALUE_INPUT_PLACEHOLDER
                                    }
                                    helperText={
                                        GetErrors.Value
                                            ? GetErrors.Value
                                            : FormatString({
                                                  UnformattedString:
                                                      GetLanguages.CREATE_LANGUAGE_FORM_VALUE_INPUT_HELPER_TEXT,
                                                  Values: {
                                                      MaxLength: Validator.Value.MaxLength
                                                  }
                                              })
                                    }
                                    inputProps={{
                                        maxLength: Validator.Value.MaxLength
                                    }}
                                />
                            </label>

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
                                        GetLanguages.CREATE_LANGUAGE_FORM_LANGUAGE_INPUT_PLACEHOLDER
                                    }
                                    helperText={
                                        GetErrors.Language
                                            ? GetErrors.Language
                                            : FormatString({
                                                  UnformattedString:
                                                      GetLanguages.CREATE_LANGUAGE_FORM_LANGUAGE_INPUT_HELPER_TEXT,
                                                  Values: {
                                                      MaxLength: Validator.Language.MaxLength
                                                  }
                                              })
                                    }
                                    inputProps={{
                                        maxLength: Validator.Language.MaxLength,
                                        minLength: Validator.Language.MinLength
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
                                        {GetLanguages.CREATE_LANGUAGE_FORM_SUBMIT_BUTTON_TEXT}
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

export default CreateLanguage;
