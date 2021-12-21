import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { AuthContext } from '../../../Services/Auth/Context';
import { AuthRoutes, AboutProject, GeneralRoutes } from '../../../Infrastructure';
import { LanguageContext } from '../../../Services/Language/Context';
import { Popover, Menu as EverMenu, Position } from 'evergreen-ui';
import { RedirectUser } from '../../../Utils/Shortcuts';
import Menu from '../Menu';
import { IconButton, CircularProgress } from '@mui/material/';
import Loader from 'react-loader-spinner';
import './Layout.css';
import IconText from '../IconText';
import Fade from 'react-reveal';
import {
    BsGithub,
    AiOutlineLogin,
    AiOutlineUserAdd,
    MdOutlineRestore,
    MdSecurity,
    RiMenu2Fill,
    GoHome,
    VscAccount
} from 'react-icons/all';

const Layout = ({ OnlyMain = false }) => {
    const { IsAuthenticated } = useContext(AuthContext);
    const { GetIsLanguageLoading, GetLanguages } = useContext(LanguageContext);
    const [GetIsConnectionLost, SetIsConnectionLost] = useState(false);
    const [GetDisplayMenu, SetDisplayMenu] = useState(false);
    const Navigate = useNavigate();
    const Location = useLocation();

    window.addEventListener('offline', () => SetIsConnectionLost(true));
    window.addEventListener('online', () => SetIsConnectionLost(false));

    useEffect(() => {
        return () => {
            SetIsConnectionLost(false);
            SetDisplayMenu(false);
        };
    }, []);

    useEffect(() => {
        SetDisplayMenu(false);
    }, [Location]);

    return GetIsLanguageLoading || GetIsConnectionLost ? (
        <aside id="Loader">
            {GetIsLanguageLoading && (
                <Fade clear>
                    <Loader type="Grid" color="#35CA5C" height={100} width={100} />
                </Fade>
            )}

            {GetIsConnectionLost && (
                <Fade clear>
                    <CircularProgress className="Circular-Loader" size={'2rem'} />
                    <p>{GetLanguages.ON_CONNECTION_LOST_MESSAGE}</p>
                </Fade>
            )}
        </aside>
    ) : OnlyMain ? (
        <Outlet />
    ) : (
        <>
            <Fade clear>
                <header id="Header">
                    <nav id="Header-Navegation">
                        <section id="Header-Navegation-Brand">
                            <Link className="Title" to="/">
                                <h1>{GetLanguages.LAYOUT_HEADER_TITLE}</h1>
                            </Link>
                        </section>
                        <ul id="Header-Navegation-Links">
                            <li onClick={() => Navigate('/')}>
                                <IconText
                                    ApplyScreenAdapter={true}
                                    Text={GetLanguages.LAYOUT_HOME_ICON_MESSAGE}
                                    Icon={<GoHome className="Icon-Mobile-Big Icon" />}
                                />
                            </li>
                            {!IsAuthenticated && (
                                <>
                                    <li>
                                        <Popover
                                            position={Position.BOTTOM_LEFT}
                                            content={
                                                <EverMenu>
                                                    <EverMenu.Group>
                                                        <EverMenu.Item
                                                            onSelect={() =>
                                                                Navigate(AuthRoutes.SignIn)
                                                            }
                                                            icon={<AiOutlineLogin />}
                                                        >
                                                            {
                                                                GetLanguages.LAYOUT_NOT_AUTHENTICATED_SIGN_IN_ICON_MESSAGE
                                                            }
                                                        </EverMenu.Item>
                                                        <EverMenu.Item
                                                            onSelect={() =>
                                                                Navigate(AuthRoutes.SignUp)
                                                            }
                                                            icon={<AiOutlineUserAdd />}
                                                        >
                                                            {
                                                                GetLanguages.LAYOUT_NOT_AUTHENTICATED_SIGN_UP_ICON_MESSAGE
                                                            }
                                                        </EverMenu.Item>
                                                    </EverMenu.Group>
                                                    <EverMenu.Divider />
                                                    <EverMenu.Group>
                                                        <EverMenu.Item
                                                            onSelect={() =>
                                                                Navigate(AuthRoutes.ForgotPassword)
                                                            }
                                                            icon={<MdOutlineRestore />}
                                                        >
                                                            {
                                                                GetLanguages.LAYOUT_NOT_AUTHENTICATED_FORGOT_PASSWORD_ICON_MESSAGE
                                                            }
                                                        </EverMenu.Item>
                                                    </EverMenu.Group>
                                                </EverMenu>
                                            }
                                        >
                                            <div>
                                                <IconText
                                                    ApplyScreenAdapter={true}
                                                    Text={GetLanguages.LAYOUT_ACCOUNT_ICON_MESSAGE}
                                                    Icon={
                                                        <VscAccount className="Icon-Mobile-Big Icon" />
                                                    }
                                                />
                                            </div>
                                        </Popover>
                                    </li>
                                </>
                            )}
                            <li
                                className="Display-On-Desktop"
                                onClick={() => RedirectUser(AboutProject.Github)}
                            >
                                <IconText
                                    ApplyScreenAdapter={true}
                                    Text={GetLanguages.LAYOUT_GITHUB_ICON_MESSAGE}
                                    Icon={<BsGithub className="Icon Icon-Mobile-Big" />}
                                />
                            </li>
                            <li onClick={() => Navigate(GeneralRoutes.ServiceConditions)}>
                                <IconText
                                    Text={GetLanguages.LAYOUT_CONDITIONS_ICON_MESSAGE}
                                    ApplyScreenAdapter={true}
                                    Icon={<MdSecurity className="Icon Icon-Mobile-Big" />}
                                />
                            </li>
                            {IsAuthenticated && (
                                <li onClick={() => SetDisplayMenu(!GetDisplayMenu)}>
                                    <IconButton className="Icon" size="small">
                                        <RiMenu2Fill />
                                    </IconButton>
                                </li>
                            )}
                        </ul>
                    </nav>
                </header>
            </Fade>

            {GetDisplayMenu && <Menu SetDisplayMenu={SetDisplayMenu} />}

            <Fade clear>
                <Outlet />
            </Fade>

            <Fade clear>
                <footer>
                    <p>
                        {GetLanguages.LAYOUT_FOOTER_MESSAGE}{' '}
                        <a href={AboutProject.Github}>{GetLanguages.LAYOUT_FOOTER_MESSAGE_LINK}</a>
                    </p>
                </footer>
            </Fade>
        </>
    );
};

export default Layout;
