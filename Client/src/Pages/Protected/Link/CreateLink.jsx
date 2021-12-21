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
import { useNavigate } from 'react-router';
import { DataValidation, LinkRoutes } from '../../../Infrastructure';
import { LanguageContext } from '../../../Services/Language/Context';
import { LinkContext } from '../../../Services/Link/Context';
import { CheckErrors, FormatString, SetFormattedTitle } from '../../../Utils/Shortcuts';
import isURL from 'validator/lib/isURL';
import { BsInfoCircle } from 'react-icons/bs';
import { CircularProgress, Button, TextField } from '@mui/material';
import '../../../Assets/StyleSheet/Creator.css';
import LinkCreateImage from '../../../Assets/Images/Link-Create.png';
import Fade from 'react-reveal';

const CreateLink = () => {
    const { OnCreateLink, GetMessage, SetMessage } = useContext(LinkContext);
    const { GetLanguages } = useContext(LanguageContext);
    const [GetName, SetName] = useState('');
    const [GetLink, SetLink] = useState('');
    const [GetIsFormInvalid, SetIsFormInvalid] = useState(false);
    const [GetIsLoading, SetIsLoading] = useState(false);
    const [GetIsComponentMounted, SetIsComponentMounted] = useState(true);
    const [GetErrors, SetErrors] = useState({});
    const Navigate = useNavigate();
    const Validator = DataValidation.Link;

    useEffect(() => {
        SetFormattedTitle(GetLanguages.CREATE_LINK_TITLE, GetLanguages);
        return () => {
            SetName('');
            SetLink('');
            SetIsFormInvalid(false);
            SetIsLoading(false);
            SetIsComponentMounted(false);
            SetErrors({});
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        SetIsFormInvalid(
            !GetName.length ||
                !GetLink.length ||
                GetErrors.Name !== undefined ||
                GetErrors.Link !== undefined
        );
    }, [GetErrors]); // eslint-disable-line react-hooks/exhaustive-deps

    const OnSubmit = (Event) => {
        Event.preventDefault();
        if (!GetIsComponentMounted) return;
        OnCreateLink({
            OnStart: () => SetIsLoading(true),
            OnRejection: () => SetIsLoading(false),
            OnResolve: () => {
                SetMessage([
                    FormatString({
                        UnformattedString: GetLanguages.ON_CREATE_LINK_MESSAGE,
                        Values: { Link: GetName },
                        SafeLength: true
                    })
                ]);
                Navigate(LinkRoutes.GetMyLinks, { replace: true });
            },
            Data: { Name: GetName, Link: GetLink }
        });
    };

    useEffect(() => {
        SetErrors(
            CheckErrors({
                Validator: 'Link',
                States: [
                    {
                        Identifier: 'Name',
                        Getter: GetName,
                        OnLengthError: GetLanguages.ON_CREATE_LINK_NAME_LENGTH_MESSAGE_ERROR
                    },
                    {
                        Identifier: 'Link',
                        Getter: GetLink,
                        Validator: [
                            () => isURL(GetLink),
                            GetLanguages.ON_CREATE_LINK_URL_INVALID_MESSAGE
                        ]
                    }
                ]
            })
        );
    }, [GetName, GetLink]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <main className="Creator-Main">
            <Fade clear>
                <section className="Creator-Information">
                    <article>
                        <h1>{GetLanguages.CREATE_LINK_INFORMATION_TITLE}</h1>
                        <p>{GetLanguages.CREATE_LINK_INFORMATION_SUBTITLE}</p>
                    </article>

                    <figure>
                        <img src={LinkCreateImage} alt="Create Link Img" />
                    </figure>
                </section>

                <section className="Creator-Form">
                    <article>
                        <div>
                            <h3>{GetLanguages.CREATE_LINK_FORM_TITLE}</h3>
                            <div className="Form-Help-Text">
                                <p>{GetLanguages.CREATE_LINK_FORM_SUBTITLE}</p>
                            </div>
                        </div>

                        <form method="POST" onSubmit={OnSubmit}>
                            <label className="Form-Item" htmlFor="Name">
                                <TextField
                                    autoFocus={window.innerWidth > 768}
                                    type="text"
                                    name="Name"
                                    error={Boolean(GetErrors.Name)}
                                    onChange={(Event) => SetName(Event.target.value)}
                                    value={GetName}
                                    required={true}
                                    fullWidth={true}
                                    placeholder={
                                        GetLanguages.CREATE_LINK_FORM_NAME_INPUT_PLACEHOLDER
                                    }
                                    helperText={
                                        GetErrors.Name
                                            ? GetErrors.Name
                                            : FormatString({
                                                  UnformattedString:
                                                      GetLanguages.CREATE_LINK_FORM_NAME_INPUT_HELPER_TEXT,
                                                  Values: {
                                                      MaxLength: Validator.Name.MaxLength,
                                                      MinLength: Validator.Name.MinLength
                                                  }
                                              })
                                    }
                                    inputProps={{
                                        maxLength: Validator.Name.MaxLength,
                                        minLength: Validator.Name.MinLength
                                    }}
                                />
                            </label>

                            <label className="Form-Item" htmlFor="Link">
                                <TextField
                                    type="url"
                                    name="Link"
                                    error={Boolean(GetErrors.Link)}
                                    onChange={(Event) => SetLink(Event.target.value)}
                                    value={GetLink}
                                    required={true}
                                    fullWidth={true}
                                    placeholder={
                                        GetLanguages.CREATE_LINK_FORM_URL_INPUT_PLACEHOLDER
                                    }
                                    helperText={
                                        GetErrors.Link
                                            ? GetErrors.Link
                                            : GetLanguages.CREATE_LINK_FORM_URL_INPUT_HELPER_TEXT
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
                                        disabled={GetIsFormInvalid}
                                        variant="outlined"
                                        type="submit"
                                        className="Link Button"
                                    >
                                        {GetLanguages.CREATE_LINK_FORM_SUBMIT_BUTTON_TEXT}
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

export default CreateLink;
