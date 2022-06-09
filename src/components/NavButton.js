import React from 'react';
import {Link} from "react-router-dom";

function NavButton({name, title}) {
    return (
        <li className={'nav-li bg-gray-700 py-2 hover:bg-gray-600 cursor-pointer'}>
            <Link to={name} className={'nav-link text-2xl'}>{title}</Link>
        </li>
    );
}

export default NavButton;