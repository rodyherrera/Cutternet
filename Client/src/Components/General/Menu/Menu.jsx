import React, { useContext } from 'react';
import { AuthContext } from '../../../Services/Auth/Context';
import { Pane, Avatar } from 'evergreen-ui';
import { RedirectUser } from '../../../Utils/Shortcuts';
import { IconButton } from '@mui/material';
import {
    CgPassword,
    RiLockPasswordLine,
    RiLinksFill,
    RiUserSettingsLine,
    IoExitOutline,
    IoLanguageSharp,
    IoKeyOutline,
    IoClose,
    SiPluscodes,
    BsGithub,
    FiUsers,
    FaRegUser,
    BiCut,
    AiOutlineUserDelete
} from 'react-icons/all';
import { AuthRoutes, LanguageRoutes, LinkRoutes, AboutProject } from '../../../Infrastructure';
import MenuItem from '../MenuItem/';
import './Menu.css';
import { LanguageContext } from '../../../Services/Language/Context';

const Menu = ({ SetDisplayMenu }) => {
    const { GetLanguages } = useContext(LanguageContext);
    const { IsAuthenticated, GetUser, OnLogout, OnDeleteMe } = useContext(AuthContext);

    return !IsAuthenticated ? (
        <>{SetDisplayMenu(false)}</>
    ) : (
        <aside id="Navegation-Menu">
            <section id="Navegation-Menu-Links">
                <article>
                    <div id="Navegation-Menu-Header">
                        <div id="Navegation-Menu-Avatar">
                            <Pane>
                                <Avatar name={GetUser.Username} size={40} />
                            </Pane>
                            <h1>{GetUser.Username}</h1>
                        </div>
                        <IconButton size="small" onClick={() => SetDisplayMenu(false)}>
                            <IoClose />
                        </IconButton>
                    </div>
                </article>
                <article className="Display-On-Mobile">
                    <div className="Navegation-Menu-Identifier">
                        <h3>{GetLanguages.MENU_GENERAL_SECTION_TITLE}</h3>
                    </div>
                    <ul>
                        <MenuItem
                            Title="Github"
                            Icon={<BsGithub />}
                            OnClick={() => RedirectUser(AboutProject.Github)}
                        />
                    </ul>
                </article>
                <article>
                    <div className="Navegation-Menu-Identifier">
                        <h3>{GetLanguages.MENU_AUTH_SECTION_TITLE}</h3>
                    </div>
                    <ul>
                        <MenuItem
                            Title={GetLanguages.MENU_AUTH_UPDATE_PROFILE_TITLE}
                            Icon={<RiUserSettingsLine />}
                            To={AuthRoutes.UpdateMyProfile}
                        />
                        <MenuItem
                            Title={GetLanguages.MENU_AUTH_FORGOT_PASSWORD_TITLE}
                            Icon={<CgPassword />}
                            To={AuthRoutes.ForgotPassword}
                        />
                        <MenuItem
                            Title={GetLanguages.MENU_AUTH_UPDATE_PASSWORD_TITLE}
                            Icon={<RiLockPasswordLine />}
                            To={AuthRoutes.UpdateMyPassword}
                        />
                        <MenuItem
                            Title={GetLanguages.MENU_AUTH_MY_PROFILE_TITLE}
                            Icon={<FaRegUser />}
                            To={AuthRoutes.MyProfile}
                        />
                        <MenuItem
                            Title={GetLanguages.MENU_AUTH_LOGOUT_TITLE}
                            Icon={<IoExitOutline />}
                            To="/"
                            OnClick={OnLogout}
                        />
                        <MenuItem
                            Title={GetLanguages.MENU_AUTH_DELETE_ACCOUNT_TITLE}
                            Icon={<AiOutlineUserDelete />}
                            To="/"
                            OnClick={OnDeleteMe}
                        />
                    </ul>
                </article>
                <article>
                    <div className="Navegation-Menu-Identifier">
                        <h3>{GetLanguages.MENU_LINK_SECTION_TITLE}</h3>
                    </div>
                    <ul>
                        <MenuItem
                            Title={GetLanguages.MENU_LINK_CREATE_LINK_TITLE}
                            Icon={<BiCut />}
                            To={LinkRoutes.CreateLink}
                        />
                        <MenuItem
                            Title={GetLanguages.MENU_LINK_GET_MY_LINKS_TITLE}
                            To={LinkRoutes.GetMyLinks}
                            Icon={<SiPluscodes />}
                        />
                    </ul>
                </article>
                {GetUser.Role === 'admin' && (
                    <article>
                        <div className="Navegation-Menu-Identifier">
                            <h3>{GetLanguages.MENU_ADMIN_SECTION_TITLE}</h3>
                        </div>
                        <ul>
                            <MenuItem
                                Title={GetLanguages.MENU_ADMIN_MANAGE_USERS_TITLE}
                                Icon={<FiUsers />}
                                To={AuthRoutes.ManageUsers}
                            />
                            <MenuItem
                                Title={GetLanguages.MENU_ADMIN_MANAGE_LINKS_TITLE}
                                Icon={<RiLinksFill />}
                                To={LinkRoutes.ManageLinks}
                            />
                            <MenuItem
                                Title={GetLanguages.MENU_ADMIN_MANAGE_LANGUAGES_TITLE}
                                Icon={<IoLanguageSharp />}
                                To={LanguageRoutes.ManageLanguages}
                            />
                            <MenuItem
                                Title={GetLanguages.MENU_ADMIN_CREATE_LANGUAGE_KEY_TITLE}
                                Icon={<IoKeyOutline />}
                                To={LanguageRoutes.CreateLanguage}
                            />
                        </ul>
                    </article>
                )}
            </section>
        </aside>
    );
};

export default Menu;
