import React, {useEffect} from 'react';
import {Grid} from "@mui/material";
import userService from "../services/userService";
import {useNavigate} from "react-router-dom";
import {checkLoggedIn} from "../utils/Utils";


function Dashboard() {
    const navigate = useNavigate();
    useEffect(() => {
        checkLoggedIn(navigate);
    }, []);



    return (
        <Grid container>
            <Grid item xs={6}>
                <h1>Dashboard</h1>
            </Grid>
        </Grid>
    );
}

export default Dashboard;
