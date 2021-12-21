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
import { AuthContext } from '../../../../Services/Auth/Context';
import { LanguageContext } from '../../../../Services/Language/Context';
import { FormatString, SetFormattedTitle, SafeLength } from '../../../../Utils/Shortcuts';
import '../../../../Assets/StyleSheet/Creator.css';
import ProfileImage from '../../../../Assets/Images/Auth-Profile.png';
import { AuthRoutes, LinkRoutes } from '../../../../Infrastructure';
import { Pane, Avatar } from 'evergreen-ui';
import './MyProfile.css';
import { LinkContext } from '../../../../Services/Link/Context';
import { CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { Popover, Menu as EverMenu, Position } from 'evergreen-ui';
import IconText from '../../../../Components/General/IconText';
import {
    AiOutlineSetting,
    AiOutlineQuestion,
    BiReset,
    BsTrash,
    MdOutlineUpdate,
    IoIosLogOut
} from 'react-icons/all';
import Fade from 'react-reveal';

const MyProfile = () => {
    const { OnGetMyLinks, OnLogout, OnDeleteMe } = useContext(LinkContext);
    const { GetUser } = useContext(AuthContext);
    const { GetLanguages } = useContext(LanguageContext);
    const [GetTotalLinks, SetTotalLinks] = useState(0);
    const [GetIsComponentMounted, SetIsComponentMounted] = useState(true);
    const [GetIsLoading, SetIsLoading] = useState(true);
    const Navigate = useNavigate();

    useEffect(() => {
        SetFormattedTitle(GetLanguages.MY_PROFILE_TITLE, GetLanguages);
        OnGetMyLinks({
            OnStart: () => SetIsLoading(true),
            OnFinish: () => SetIsLoading(false),
            OnResolve: (Response) => GetIsComponentMounted && SetTotalLinks(Response.TotalResults),
            Filter: {
                Paginate: { Limit: undefined, Page: undefined },
                Fields: undefined,
                Sort: undefined,
                Search: undefined
            }
        });
        return () => {
            SetTotalLinks(0);
            SetIsComponentMounted(false);
            SetIsLoading(false);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <main className="Creator-Main">
            <Fade clear>
                <section className="Creator-Information">
                    <article>
                        <h1>
                            {FormatString({
                                UnformattedString: GetLanguages.MY_PROFILE_INFORMATION_TITLE,
                                Values: { Username: GetUser.Username }
                            })}
                        </h1>
                        <p>{GetLanguages.MY_PROFILE_INFORMATION_SUBTITLE}</p>
                    </article>

                    <figure>
                        <img src={ProfileImage} alt="Auth Profile Img" />
                    </figure>
                </section>

                <section className="Creator-Form">
                    <article id="My-Profile-Information">
                        <div>
                            <div>
                                <Pane>
                                    <Avatar name={GetUser.Username} size={100} />
                                </Pane>
                            </div>
                            <div>
                                <div>
                                    <h3>@{GetUser.Username}</h3>
                                </div>
                                <div>
                                    <p className="No-Relevant-Font-Size">
                                        {SafeLength(GetUser.Email, 32)}
                                    </p>
                                </div>
                                <div>
                                    <p className="Text-Muted">{GetUser.Role}</p>
                                </div>
                            </div>
                        </div>

                        <div id="My-Profile-Settings">
                            <Popover
                                position={Position.BOTTOM_LEFT}
                                content={
                                    <EverMenu>
                                        <EverMenu.Group>
                                            <EverMenu.Item
                                                onClick={() => Navigate(AuthRoutes.ForgotPassword)}
                                                icon={<AiOutlineQuestion />}
                                            >
                                                {
                                                    GetLanguages.MY_PROFILE_FORM_FORGOT_PASSWORD_ICON_MESSAGE
                                                }
                                            </EverMenu.Item>
                                            <EverMenu.Item
                                                onClick={() =>
                                                    Navigate(AuthRoutes.UpdateMyPassword)
                                                }
                                                icon={<BiReset />}
                                            >
                                                {
                                                    GetLanguages.MY_PROFILE_FORM_UPDATE_MY_PASSWORD_ICON_MESSAGE
                                                }
                                            </EverMenu.Item>
                                            <EverMenu.Item
                                                onClick={() => Navigate(AuthRoutes.UpdateMyProfile)}
                                                icon={<MdOutlineUpdate />}
                                            >
                                                {
                                                    GetLanguages.MY_PROFILE_FORM_UPDATE_MY_PROFILE_ICON_MESSAGE
                                                }
                                            </EverMenu.Item>
                                        </EverMenu.Group>
                                        <EverMenu.Divider />
                                        <EverMenu.Group>
                                            <EverMenu.Item
                                                onClick={OnLogout}
                                                icon={<IoIosLogOut />}
                                            >
                                                {GetLanguages.MY_PROFILE_FORM_LOGOUT_ICON_MESSAGE}
                                            </EverMenu.Item>
                                            <EverMenu.Item onClick={OnDeleteMe} icon={<BsTrash />}>
                                                {
                                                    GetLanguages.MY_PROFILE_FORM_DELETE_MY_ACCOUNT_MESSAGE
                                                }
                                            </EverMenu.Item>
                                        </EverMenu.Group>
                                    </EverMenu>
                                }
                            >
                                <div>
                                    <IconText
                                        Text={
                                            GetLanguages.MY_PROFILE_FORM_MORE_SETTINGS_ICON_MESSAGE
                                        }
                                        Icon={<AiOutlineSetting />}
                                    />
                                </div>
                            </Popover>
                        </div>

                        <div id="My-Profile-Links">
                            <Button
                                variant="text"
                                className="Link Button"
                                onClick={() => Navigate(LinkRoutes.GetMyLinks)}
                            >
                                {GetIsLoading ? (
                                    <CircularProgress className="Circular-Loader" size={'1rem'} />
                                ) : (
                                    <p>{GetTotalLinks}</p>
                                )}
                            </Button>
                            <div>
                                <p className="Text-Muted">
                                    {GetLanguages.MY_PROFILE_FORM_LINKS_BOX_TITLE}
                                </p>
                            </div>
                        </div>
                    </article>
                </section>
            </Fade>
        </main>
    );
};

export default MyProfile;
