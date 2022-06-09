import React, {useContext} from 'react';
import NavButton from "./NavButton";
import AuthContext from "../context/AuthContext";
import LogButton from "./LogButton";

function NavBar(props) {
    let {user, logoutUser} = useContext(AuthContext)
    return (
        <div>
            <ul className={'nav-list grid grid-cols-3'}>
                <NavButton name={'/'} title={'Home'}/>
                <NavButton name={'/roles'} title={'Roles'}/>
                <LogButton />
            </ul>
        </div>
    );
}

export default NavBar;