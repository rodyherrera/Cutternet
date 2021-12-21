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
import React, { useContext } from 'react';
import './Link.css';
import { LinkRoutes } from '../../../../Infrastructure';
import { Popover, Menu as EverMenu, Position } from 'evergreen-ui';
import { ExtractMonthFromDate, SlugToTitle, RedirectUser } from '../../../../Utils/Shortcuts';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router';
import {
    BsTrash,
    SiSimpleanalytics,
    GrConnect,
    FiEdit2,
    BsCodeSlash,
    AiOutlineSetting,
    AiOutlineDisconnect,
    IoAnalyticsOutline,
    MdContentCopy,
    VscPreview
} from 'react-icons/all';
import { LanguageContext } from '../../../../Services/Language/Context';

const Link = ({
    LinkData,
    HandleLinkDeletion,
    HandleLinkUpdate,
    SetSelectedLink,
    HandleCopy,
    HandleEmbeddedCodeCopy,
    GetFormattedLinkURL
}) => {
    const { GetLanguages } = useContext(LanguageContext);
    const ChangeLinkStatus = () =>
        HandleLinkUpdate({ ...LinkData, IsActive: !LinkData.IsActive }, LinkData.Name);

    const GetLinkURL = GetFormattedLinkURL(LinkRoutes.GetLink, LinkData);
    const Navigate = useNavigate();

    return (
        <article className="Generic-Links-Link">
            <div className="Truncate">
                <div onClick={() => SetSelectedLink(LinkData)}>
                    {LinkData.CreatedAt && (
                        <span className="Text-Muted">
                            {ExtractMonthFromDate(LinkData.CreatedAt)}
                        </span>
                    )}
                    <h3>{SlugToTitle(LinkData.Name, true)}</h3>
                </div>
                <a href={GetLinkURL}>{GetLinkURL}</a>
            </div>
            <div>
                <div>
                    <Popover
                        position={Position.BOTTOM_LEFT}
                        content={
                            <EverMenu>
                                <EverMenu.Group>
                                    <EverMenu.Item
                                        onClick={() => HandleCopy(GetLinkURL, LinkData.Name)}
                                        icon={<MdContentCopy />}
                                    >
                                        {GetLanguages.LINK_COPY_ICON_MESSAGE}
                                    </EverMenu.Item>
                                    <EverMenu.Item
                                        onClick={() => HandleEmbeddedCodeCopy(LinkData)}
                                        icon={<BsCodeSlash />}
                                    >
                                        {GetLanguages.LINK_EMBEDDED_COPY_ICON_MESSAGE}
                                    </EverMenu.Item>
                                    <EverMenu.Item
                                        onClick={() => RedirectUser(GetLinkURL)}
                                        icon={<VscPreview />}
                                    >
                                        {GetLanguages.LINK_VISIT_ICON_MESSAGE}
                                    </EverMenu.Item>
                                    <EverMenu.Item
                                        onClick={() =>
                                            Navigate(
                                                GetFormattedLinkURL(
                                                    LinkRoutes.GetStatistics,
                                                    LinkData,
                                                    false
                                                )
                                            )
                                        }
                                        icon={<IoAnalyticsOutline />}
                                    >
                                        {GetLanguages.LINK_STATISTIC_ICON_MESSAGE}
                                    </EverMenu.Item>
                                </EverMenu.Group>
                                <EverMenu.Divider />
                                <EverMenu.Group>
                                    <EverMenu.Item
                                        onClick={() => SetSelectedLink(LinkData)}
                                        icon={<FiEdit2 />}
                                    >
                                        {GetLanguages.LINK_UPDATE_ICON_MESSAGE}
                                    </EverMenu.Item>
                                    <EverMenu.Item
                                        onClick={() => HandleLinkDeletion(LinkData, LinkData.Name)}
                                        icon={<BsTrash />}
                                    >
                                        {GetLanguages.LINK_DELETE_ICON_MESSAGE}
                                    </EverMenu.Item>
                                    {LinkData.IsActive !== undefined &&
                                        (LinkData.IsActive ? (
                                            <EverMenu.Item
                                                onClick={ChangeLinkStatus}
                                                icon={<AiOutlineDisconnect />}
                                            >
                                                {GetLanguages.LINK_DISABLED_ICON_MESSAGE}
                                            </EverMenu.Item>
                                        ) : (
                                            <EverMenu.Item
                                                onClick={ChangeLinkStatus}
                                                icon={<GrConnect />}
                                            >
                                                {GetLanguages.LINK_ACTIVATED_ICON_MESSAGE}
                                            </EverMenu.Item>
                                        ))}
                                </EverMenu.Group>
                            </EverMenu>
                        }
                    >
                        <Button className="Link Big Button-AsText" variant="text">
                            <AiOutlineSetting />
                        </Button>
                    </Popover>
                </div>
                {LinkData.Visits !== undefined && (
                    <div>
                        <i>
                            <SiSimpleanalytics />
                        </i>
                        <span>{LinkData.Visits}</span>
                    </div>
                )}
            </div>
        </article>
    );
};

export default Link;
