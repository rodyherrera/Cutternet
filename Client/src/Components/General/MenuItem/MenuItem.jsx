import React from 'react';
import { Link } from 'react-router-dom';
import './MenuItem.css';

const MenuItem = ({ Icon, Title, To = '', OnClick = () => {} }) => {
    return (
        <li onClick={OnClick} className="Menu-Item">
            <Link className="Link" to={To}>
                <i>{Icon}</i>
                <span>{Title}</span>
            </Link>
        </li>
    );
};

export default MenuItem;
