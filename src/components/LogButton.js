import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import AuthContext from "../context/AuthContext";

function LogButton() {
    let {user, logoutUser} = useContext(AuthContext)
    return (
        <li className={'bg-gray-700 py-2 hover:bg-gray-600 cursor-pointer'}>
            {user? (
                <p className={'nav-link nav-p text-2xl'} onClick={logoutUser}>Logout</p>
            ):(
                <Link to={'/login'} className={'nav-link text-2xl'}>Login</Link>
            )}
        </li>
    );
}

export default LogButton;