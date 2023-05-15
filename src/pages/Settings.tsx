import React, {useEffect} from 'react';
import userService from "../services/userService";
import {useNavigate} from "react-router-dom";
import {checkLoggedIn} from "../utils/Utils";

function Settings() {
    const navigate = useNavigate();
    useEffect(() => {
        checkLoggedIn(navigate)
    }, []);
    return (
        <div>Configuration</div>
    );
}

export default Settings;