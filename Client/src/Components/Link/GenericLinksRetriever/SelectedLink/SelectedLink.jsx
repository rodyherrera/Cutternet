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
import { Button, CircularProgress, TextField } from '@mui/material';
import QRCode from 'react-qr-code';
import { LinkRoutes, DataValidation } from '../../../../Infrastructure';
import isURL from 'validator/lib/isURL';
import { LinkContext } from '../../../../Services/Link/Context';
import './SelectedLink.css';
import { useNavigate } from 'react-router';
import { Pane, Avatar } from 'evergreen-ui';
import LinkUpdateImage from '../../../../Assets/Images/Link-Update.png';
import { Popover, Menu as EverMenu, Position } from 'evergreen-ui';
import {
    FormatString,
    GenericFormattedDate,
    SlugToTitle,
    CheckErrors,
    RedirectUser
} from '../../../../Utils/Shortcuts';
import {
    AiOutlineClose,
    SiSimpleanalytics,
    BsInfoCircle,
    BsCalendarDate,
    BsTrash,
    BsCodeSlash,
    VscDebugDisconnect,
    VscPreview,
    GiWorld,
    GrAnalytics,
    MdContentCopy
} from 'react-icons/all';
import { LanguageContext } from '../../../../Services/Language/Context';

const SelectedLink = ({
    SetSelectedLink,
    GetSelectedLink,
    SetExecuteRefresh,
    SetMessage,
    HandleLinkDeletion,
    GetMessage,
    HandleCopy,
    GetFormattedLinkURL,
    SetWaitingMessage,
    HandleEmbeddedCodeCopy
}) => {
    const { GetLanguages } = useContext(LanguageContext);
    const { OnUpdateLink } = useContext(LinkContext);
    const [GetName, SetName] = useState(SlugToTitle(GetSelectedLink.Name));
    const [GetLink, SetLink] = useState(GetSelectedLink.Link);
    const [GetIsActive, SetIsActive] = useState(GetSelectedLink.IsActive);
    const [GetErrors, SetErrors] = useState({});
    const [GetIsComponentMounted, SetIsComponentMounted] = useState(true);
    const [GetLinkNameForUpdate, SetLinkNameForUpdate] = useState(GetSelectedLink.Name);
    const [GetIsLoading, SetIsLoading] = useState(false);
    const [GetLocalLink, SetLocalLink] = useState(
        GetFormattedLinkURL(LinkRoutes.GetLink, GetSelectedLink)
    );
    const [GetIsFormInvalid, SetIsFormInvalid] = useState(false);
    const Navigate = useNavigate();
    const Validator = DataValidation.Link;

    useEffect(() => {
        SetMessage('');
        return () => {
            SetName('');
            SetLink('');
            SetIsActive(undefined);
            SetErrors({});
            SetIsComponentMounted(false);
            SetLinkNameForUpdate('');
            SetIsLoading(false);
            SetLocalLink('');
            SetIsFormInvalid(false);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        SetErrors(
            CheckErrors({
                Validator: 'Link',
                States: [
                    {
                        Identifier: 'Name',
                        Getter: GetName,
                        OnLengthError: GetLanguages.ON_SELECTED_LINK_NAME_LENGTH_ERROR_MESSAGE
                    },
                    {
                        Identifier: 'Link',
                        Getter: GetLink,
                        Validator: [
                            () => isURL(GetLink),
                            GetLanguages.ON_SELECTED_LINK_URL_INVALID_ERROR_MESSAGE
                        ]
                    }
                ]
            })
        );

        SetIsFormInvalid(
            (GetName === SlugToTitle(GetSelectedLink.Name) &&
                GetLink === GetSelectedLink.Link &&
                GetIsActive === GetSelectedLink.IsActive) ||
                !GetName.length ||
                !GetLink.length ||
                GetErrors.Name !== undefined ||
                GetErrors.Link !== undefined
        );
    }, [GetName, GetLink, GetIsActive]); // eslint-disable-line react-hooks/exhaustive-deps

    const OnSubmit = (Event) => {
        Event.preventDefault();
        if (!GetIsComponentMounted) return;
        OnUpdateLink({
            OnStart: () => SetIsLoading(true),
            OnFinish: () => SetIsLoading(false),
            OnSuccess: () => {
                SetMessage(
                    FormatString({
                        UnformattedString: GetLanguages.SELECTED_LINK_UPDATE_MESSAGE,
                        Values: { Name: GetName },
                        SafeLength: true
                    })
                );
                SetWaitingMessage(GetLanguages.SELECTED_LINK_UPDATE_WAITING_MESSAGE);
                SetExecuteRefresh(true);
                SetSelectedLink(null);
            },
            Data: {
                Username: GetSelectedLink.User.Username,
                LinkName: GetLinkNameForUpdate,
                Name: GetName,
                Link: GetLink,
                IsActive: Boolean(GetIsActive)
            }
        });
    };

    return (
        <aside id="Selected-Link-Information">
            <section>
                <article>
                    <div id="Selected-Link-Information-Header">
                        <div onClick={() => RedirectUser(GetLocalLink)}>
                            <QRCode value={GetLocalLink} size={120} />
                        </div>
                        <div>
                            <div>
                                <Pane>
                                    <Avatar name={GetSelectedLink.User.Username} size={30} />
                                </Pane>
                                <span>{GetSelectedLink.User.Username}</span>
                            </div>
                            {GetSelectedLink.Visits !== undefined && (
                                <div>
                                    <i>
                                        <SiSimpleanalytics />
                                    </i>
                                    <span>
                                        {GetSelectedLink.Visits} {GetLanguages.SELECTED_LINK_VISITS}
                                    </span>
                                </div>
                            )}
                            {GetSelectedLink.IsActive !== undefined && (
                                <div>
                                    {GetSelectedLink.IsActive ? (
                                        <>
                                            <i>
                                                <GiWorld />
                                            </i>
                                            <span>{GetLanguages.SELECTED_LINK_ACTIVATED}</span>
                                        </>
                                    ) : (
                                        <>
                                            <i>
                                                <VscDebugDisconnect />
                                            </i>
                                            <span>{GetLanguages.SELECTED_LINK_DISABLED}</span>
                                        </>
                                    )}
                                </div>
                            )}
                            {GetSelectedLink.CreatedAt && (
                                <div>
                                    <i>
                                        <BsCalendarDate />
                                    </i>
                                    <span>{GenericFormattedDate(GetSelectedLink.CreatedAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div id="Selected-Link-Information-Details">
                        <figure>
                            <img src={LinkUpdateImage} alt="Link Update Img" />
                        </figure>
                        <div>
                            <Popover
                                statelessProps={{ zIndex: 50 }}
                                position={Position.BOTTOM_RIGHT}
                                content={
                                    <EverMenu className="Generic-Menu">
                                        <EverMenu.Group>
                                            <EverMenu.Item
                                                onClick={() =>
                                                    HandleCopy(GetLocalLink, GetSelectedLink.Name)
                                                }
                                                icon={<MdContentCopy />}
                                            >
                                                {GetLanguages.SELECTED_LINK_COPY_ICON_MESSAGE}
                                            </EverMenu.Item>
                                            <EverMenu.Item
                                                onClick={() =>
                                                    HandleEmbeddedCodeCopy(GetSelectedLink)
                                                }
                                                icon={<BsCodeSlash />}
                                            >
                                                {
                                                    GetLanguages.SELECTED_LINK_EMBEDDED_COPY_ICON_MESSAGE
                                                }
                                            </EverMenu.Item>
                                            <EverMenu.Item
                                                onClick={() => RedirectUser(GetLocalLink)}
                                                icon={<VscPreview />}
                                            >
                                                {GetLanguages.SELECTED_LINK_VISIT_ICON_MESSAGE}
                                            </EverMenu.Item>
                                            <EverMenu.Item
                                                onClick={() => {
                                                    SetSelectedLink(null);
                                                    HandleLinkDeletion(
                                                        GetSelectedLink,
                                                        GetSelectedLink.Name
                                                    );
                                                }}
                                                icon={<BsTrash />}
                                            >
                                                {GetLanguages.SELECTED_LINK_DELETE_ICON_MESSAGE}
                                            </EverMenu.Item>
                                        </EverMenu.Group>
                                        <EverMenu.Divider />
                                        <EverMenu.Group>
                                            <EverMenu.Item
                                                onClick={() =>
                                                    Navigate(
                                                        GetFormattedLinkURL(
                                                            LinkRoutes.GetStatistics,
                                                            GetSelectedLink,
                                                            false
                                                        )
                                                    )
                                                }
                                                icon={<GrAnalytics />}
                                            >
                                                {GetLanguages.SELECTED_LINK_STATISTIC_ICON_MESSAGE}
                                            </EverMenu.Item>
                                        </EverMenu.Group>
                                    </EverMenu>
                                }
                            >
                                <Button variant="outlined" type="button" className="Link Button">
                                    {GetLanguages.SELECTED_LINK_OPTIONS_MESSAGE}
                                </Button>
                            </Popover>
                        </div>
                    </div>
                </article>

                <form method="PATCH" onSubmit={OnSubmit}>
                    <div>
                        <div id="Selected-Link-Form-Title">
                            <h3>{GetLanguages.SELECTED_LINK_FORM_TITLE}</h3>
                            <i onClick={() => SetSelectedLink(null)}>
                                <AiOutlineClose />
                            </i>
                        </div>
                        <div className="Form-Help-Text">
                            <p>{GetLanguages.SELECTED_LINK_FORM_SUBTITLE}</p>
                        </div>
                    </div>

                    <label className="Form-Item" htmlFor="Name">
                        <TextField
                            type="text"
                            name="Name"
                            error={Boolean(GetErrors.Name)}
                            onChange={(Event) => SetName(Event.target.value)}
                            value={GetName}
                            required={true}
                            fullWidth={true}
                            placeholder={GetLanguages.SELECTED_LINK_FORM_NAME_INPUT_PLACEHOLDER}
                            helperText={
                                GetErrors.Name
                                    ? GetErrors.Name
                                    : FormatString({
                                          UnformattedString:
                                              GetLanguages.SELECTED_LINK_FORM_NAME_INPUT_HELP_TEXT,
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
                            type="text"
                            name="Link"
                            error={Boolean(GetErrors.Link)}
                            onChange={(Event) => SetLink(Event.target.value)}
                            value={GetLink}
                            required={true}
                            fullWidth={true}
                            placeholder={GetLanguages.SELECTED_LINK_FORM_URL_INPUT_PLACEHOLDER}
                            helperText={
                                GetErrors.Link
                                    ? GetErrors.Link
                                    : GetLanguages.SELECTED_LINK_FORM_URL_INPUT_HELP_TEXT
                            }
                        />
                    </label>

                    <label className="Form-Item">
                        {GetIsActive !== undefined &&
                            (GetIsActive ? (
                                <>
                                    <Button
                                        variant="text"
                                        onClick={() => SetIsActive(false)}
                                        type="button"
                                        className="Link Button"
                                    >
                                        {GetLanguages.SELECTED_LINK_DISABLED}
                                    </Button>
                                    <div className="Form-Help-Text Use-Padding">
                                        <p>{GetLanguages.SELECTED_LINK_DISABLED_HELP_TEXT}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="text"
                                        onClick={() => SetIsActive(true)}
                                        type="button"
                                        className="Link Button"
                                    >
                                        {GetLanguages.SELECTED_LINK_ACTIVATED}
                                    </Button>
                                    <div className="Form-Help-Text Use-Padding">
                                        <p>{GetLanguages.SELECTED_LINK_ACTIVATED_HELP_TEXT}</p>
                                    </div>
                                </>
                            ))}
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
                                {GetLanguages.SELECTED_LINK_FORM_SUBMIT_BUTTON_TEXT}
                            </Button>
                        ) : (
                            <CircularProgress className="Circular-Loader" size={'2rem'} />
                        )}
                    </div>
                </form>
            </section>
        </aside>
    );
};

export default SelectedLink;
