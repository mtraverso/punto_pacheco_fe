/* Create login form that points to /token endpoint on rest api */

import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import userService from "../../services/userService";
import AuthContext from "../../contexts/AuthContext";
import {Grid, Paper} from "@mui/material";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()
    const {user, token, login, setUser, setToken, logout} = useContext(AuthContext)

    useEffect(() => {
        if (!userService.getCurrentUser()) {
            navigate('/')
        }
    }, []);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login(email, password).then((details) => {
            // @ts-ignore
            setToken(details.token)
            // @ts-ignore
            setUser(details.user)
            // @ts-ignore
            navigate('/dashboard')
        })

    }

    return (
       <Paper>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={e => setEmail(e.target.value)}/>
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)}/>
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>

        </Paper>
    )
}

export default Login;


