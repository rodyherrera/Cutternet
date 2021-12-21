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
import { Pane, Avatar } from 'evergreen-ui';
import { Popover, Menu as EverMenu, Position } from 'evergreen-ui';
import { Button } from '@mui/material';
import './User.css';
import { AiOutlineSetting, FiEdit2, BsTrash } from 'react-icons/all';
import { LanguageContext } from '../../../../Services/Language/Context';

const User = ({ UserData, SetSelectedUser, HandleUserDelete }) => {
    const { GetLanguages } = useContext(LanguageContext);

    return (
        <div className="Generic-User">
            <div className="Truncate" onClick={() => SetSelectedUser(UserData)}>
                {UserData.Role && (
                    <div>
                        <span className="Text-Muted">{UserData.Role}</span>
                    </div>
                )}
                <div className="Generic-User-Avatar">
                    <Pane>
                        <Avatar size={30} name={UserData.Username} />
                    </Pane>
                    <span>{UserData.Username}</span>
                </div>
                {UserData.Email && (
                    <div>
                        <span>{UserData.Email}</span>
                    </div>
                )}
            </div>
            <div>
                <Popover
                    position={Position.BOTTOM_LEFT}
                    content={
                        <EverMenu>
                            <EverMenu.Group>
                                <EverMenu.Item
                                    onClick={() => SetSelectedUser(UserData)}
                                    icon={<FiEdit2 />}
                                >
                                    {GetLanguages.USER_UPDATE_ICON_MESSAGE}
                                </EverMenu.Item>
                                <EverMenu.Item
                                    onClick={() => HandleUserDelete(UserData)}
                                    icon={<BsTrash />}
                                >
                                    {GetLanguages.USER_DELETE_ICON_MESSAGE}
                                </EverMenu.Item>
                            </EverMenu.Group>
                        </EverMenu>
                    }
                >
                    <Button className="Link Big Button-AsText" variant="text">
                        <AiOutlineSetting />
                    </Button>
                </Popover>
            </div>
        </div>
    );
};

export default User;
