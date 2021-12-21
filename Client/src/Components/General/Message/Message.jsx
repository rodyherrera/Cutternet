import React from 'react';
import { FlashMessageConfig } from '../../../Infrastructure';
import FlashMessage from 'react-flash-message';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import './Message.css';

const Message = ({ Text }) => {
    return (
        <FlashMessage
            duration={FlashMessageConfig.Duration}
            persistOnHover={FlashMessageConfig.PersistOnHover}
        >
            <div className="Form-Info" id="Message-Container">
                <i>
                    <IoIosInformationCircleOutline />
                </i>
                <p>{Text}</p>
            </div>
        </FlashMessage>
    );
};

export default Message;
