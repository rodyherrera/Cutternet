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
import React, { useContext, useEffect } from 'react';
import { LanguageContext } from '../../../../Services/Language/Context';
import { AuthContext } from '../../../../Services/Auth/Context';
import { FormatString, SetFormattedTitle } from '../../../../Utils/Shortcuts';
import './Home.css';
import HomeHeaderImage from '../../../../Assets/Images/Home-Header.png';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { AuthRoutes, LinkRoutes } from '../../../../Infrastructure';
import HomeAnalyticFeatureImage from '../../../../Assets/Images/Home-AnalyticFeature.png';
import HomeLimitFeatureImage from '../../../../Assets/Images/Home-LimitFeature.png';
import HomePrivacyFeatureImage from '../../../../Assets/Images/Home-PrivacyFeature.png';
import Accordion from '../../../../Components/General/Accordion/';
import Feature from '../../../../Components/Home/Feature/';
import { Popover, Menu as EverMenu, Position } from 'evergreen-ui';
import {
    AiOutlinePlus,
    AiOutlineLogin,
    AiOutlineUserAdd,
    MdOutlineRestore,
    IoCreateOutline,
    RiLinksLine
} from 'react-icons/all';
import Fade from 'react-reveal';

const Home = () => {
    const { GetLanguages } = useContext(LanguageContext);
    const { IsAuthenticated, GetUser } = useContext(AuthContext);
    const Navigate = useNavigate();

    useEffect(() => {
        SetFormattedTitle(GetLanguages.HOME_TITLE, GetLanguages);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <main id="Home-Main">
            <Fade clear>
                <section id="Home-Presentation">
                    {IsAuthenticated ? (
                        <article>
                            <h1>
                                {FormatString({
                                    UnformattedString: GetLanguages.HOME_AUTHENTICATED_HEADER_TITLE,
                                    Values: { Username: GetUser.Username }
                                })}
                            </h1>
                            <p>{GetLanguages.HOME_AUTHENTICATED_HEADER_SUBTITLE}</p>
                            <div>
                                <Popover
                                    position={Position.TOP_RIGHT}
                                    content={
                                        <EverMenu>
                                            <EverMenu.Group>
                                                <EverMenu.Item
                                                    onClick={() => Navigate(LinkRoutes.CreateLink)}
                                                    icon={<IoCreateOutline />}
                                                >
                                                    {GetLanguages.HOME_CREATE_LINK_ICON_MESSAGE}
                                                </EverMenu.Item>
                                                <EverMenu.Item
                                                    onClick={() => Navigate(LinkRoutes.GetMyLinks)}
                                                    icon={<RiLinksLine />}
                                                >
                                                    {GetLanguages.HOME_MANAGE_LINK_ICON_MESSAGE}
                                                </EverMenu.Item>
                                            </EverMenu.Group>
                                        </EverMenu>
                                    }
                                >
                                    <Button variant="outlined" className="Link Button">
                                        {GetLanguages.HOME_AUTHENTICATED_HEADER_BUTTON_MESSAGE}
                                    </Button>
                                </Popover>
                            </div>
                        </article>
                    ) : (
                        <article>
                            <h1>{GetLanguages.HOME_HEADER_TITLE}</h1>
                            <p>{GetLanguages.HOME_HEADER_SUBTITLE}</p>
                            <div>
                                <Popover
                                    position={Position.TOP_RIGHT}
                                    content={
                                        <EverMenu>
                                            <EverMenu.Group>
                                                <EverMenu.Item
                                                    onClick={() => Navigate(AuthRoutes.SignIn)}
                                                    icon={<AiOutlineLogin />}
                                                >
                                                    {GetLanguages.HOME_SIGN_IN_ICON_MESSAGE}
                                                </EverMenu.Item>
                                                <EverMenu.Item
                                                    onClick={() => Navigate(AuthRoutes.SignUp)}
                                                    icon={<AiOutlineUserAdd />}
                                                >
                                                    {GetLanguages.HOME_SIGN_UP_ICON_MESSAGE}
                                                </EverMenu.Item>
                                            </EverMenu.Group>
                                            <EverMenu.Divider />
                                            <EverMenu.Group>
                                                <EverMenu.Item
                                                    onClick={() =>
                                                        Navigate(AuthRoutes.ForgotPassword)
                                                    }
                                                    icon={<MdOutlineRestore />}
                                                >
                                                    {GetLanguages.HOME_FORGOT_PASSWORD_ICON_MESSAGE}
                                                </EverMenu.Item>
                                            </EverMenu.Group>
                                        </EverMenu>
                                    }
                                >
                                    <Button variant="outlined" className="Link Button">
                                        {GetLanguages.HOME_HEADER_BUTTON_MESSAGE}
                                    </Button>
                                </Popover>
                            </div>
                        </article>
                    )}
                    <figure>
                        <img src={HomeHeaderImage} alt="Home Presentation Img" />
                    </figure>
                </section>
                <section id="Home-Features">
                    <article>
                        <h3>{GetLanguages.HOME_FEATURES_TITLE}</h3>
                        <p>{GetLanguages.HOME_FEATURES_SUBTITLE}</p>
                    </article>

                    <article>
                        <Feature
                            Image={HomeAnalyticFeatureImage}
                            Alt="Analytic Feature Img"
                            Title={GetLanguages.HOME_ANALYTIC_FEATURE_TITLE}
                            Content={GetLanguages.HOME_ANALYTIC_FEATURE_CONTENT}
                        />
                        <Feature
                            Image={HomeLimitFeatureImage}
                            Alt="Limit Feature Img"
                            Title={GetLanguages.HOME_LIMIT_FEATURE_TITLE}
                            Content={GetLanguages.HOME_LIMIT_FEATURE_CONTENT}
                        />
                        <Feature
                            Image={HomePrivacyFeatureImage}
                            Alt="Privacy Feature Img"
                            Title={GetLanguages.HOME_PRIVACY_FEATURE_TITLE}
                            Content={GetLanguages.HOME_PRIVACY_FEATURE_CONTENT}
                        />
                    </article>
                </section>

                <section id="Home-Frequently-Questions">
                    <article>
                        <h3>{GetLanguages.HOME_QUESTIONS_TITLE}</h3>
                    </article>
                    <article>
                        <Accordion
                            Title={GetLanguages.HOME_QUESTIONS_WHAT_IS_TITLE}
                            Content={<p>{GetLanguages.HOME_QUESTIONS_WHAT_IS_CONTENT}</p>}
                            Icon={<AiOutlinePlus />}
                        />
                        <Accordion
                            Title={GetLanguages.HOME_QUESTIONS_BENEFITS_TITLE}
                            Content={<p>{GetLanguages.HOME_QUESTIONS_BENEFITS_CONTENT}</p>}
                            Icon={<AiOutlinePlus />}
                        />
                        <Accordion
                            Title={GetLanguages.HOME_QUESTIONS_WHY_CUTTERNET_TITLE}
                            Content={<p>{GetLanguages.HOME_QUESTIONS_WHY_CUTTERNET_CONTENT}</p>}
                            Icon={<AiOutlinePlus />}
                        />
                    </article>
                </section>
            </Fade>
        </main>
    );
};

export default Home;
