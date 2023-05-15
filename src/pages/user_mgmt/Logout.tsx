/* Create login form that points to /token endpoint on rest api */

import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import userService from "../../services/userService";
import AuthContext from "../../contexts/AuthContext";

function Logout() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()
    const {user, token, login, setUser, setToken, logout} = useContext(AuthContext)

    useEffect(() => {
        logout()
        setUser(null)
        setToken(null)
    }, []);


    return (
        <div>
            <h1>Logged out</h1>
            <p>Thank you for using this app</p>
        </div>
    )
}

export default Logout;


