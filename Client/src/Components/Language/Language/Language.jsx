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
import { Popover, Menu as EverMenu, Position } from 'evergreen-ui';
import { Button } from '@mui/material';
import './Language.css';
import { AiOutlineSetting, BsTrash, FiEdit2 } from 'react-icons/all';
import { LanguageContext } from '../../../Services/Language/Context';

const Language = ({ LanguageData, HandleLanguageDelete, SetSelectedLanguage }) => {
    const { GetLanguages } = useContext(LanguageContext);

    return (
        <div className="Generic-Language">
            <div onClick={() => SetSelectedLanguage(LanguageData)} className="Truncate">
                <div>
                    {LanguageData.Language && (
                        <div>
                            <span className="Text-Muted">{LanguageData.Language}</span>
                        </div>
                    )}
                    <div className="Generic-Language-Key">
                        <span>{LanguageData.Key}</span>
                    </div>
                </div>
                {LanguageData.Value && (
                    <div className="Generic-Language-Value">
                        <span>{LanguageData.Value}</span>
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
                                    onClick={() => SetSelectedLanguage(LanguageData)}
                                    icon={<FiEdit2 />}
                                >
                                    {GetLanguages.LANGUAGE_UPDATE_ICON_MESSAGE}
                                </EverMenu.Item>
                                <EverMenu.Item
                                    onClick={() => HandleLanguageDelete(LanguageData)}
                                    icon={<BsTrash />}
                                >
                                    {GetLanguages.LANGUAGE_DELETE_ICON_MESSAGE}
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

export default Language;
