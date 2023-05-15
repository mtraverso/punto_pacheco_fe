import React, {useState} from 'react';
import './App.css';
import Dashboard from "./pages/Dashboard";
import Login from "./pages/user_mgmt/Login";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./layout/Header";
import userService from "./services/userService";
import AuthContext, {AuthContextData} from "./contexts/AuthContext";
import './styles/main.css'
import Sidebar from "./layout/Sidebar";
import Stores from "./pages/Stores";
import Tenants from "./pages/Tenants";
import {Box, styled} from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import Logout from './pages/user_mgmt/Logout';
import Balances from "./pages/Balances";
import Settings from "./pages/Settings";
import Contracts from './pages/Contracts';
import StoreTypes from './pages/StoreTypes';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";


const drawerWidth = 250;
const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})<{
    open?: boolean;
}>(({theme, open}) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        //marginLeft: `${drawerWidth}px`,
    }),
}));


function App() {
    //@ts-ignore
    const [user, setUser] = useState<User | null>(userService.getCurrentUser());
    const [token, setToken] = useState<string | null>(userService.getToken());
    const [open, setOpen] = useState<boolean>(false);
    const login = userService.login;
    const logout = userService.logout;
    const data: AuthContextData = {user, token, setUser, setToken, login, logout}

    // @ts-ignore
    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <AuthContext.Provider value={data}>
                    <BrowserRouter>
                        <div className="App">
                            <header className={'header'}>
                                <Header open={open} setOpen={setOpen}/>
                            </header>

                            <Sidebar open={open}/>

                            <Main className={'content'} open={open} style={{marginLeft: "50%"}}>

                                <Routes>
                                    <>
                                        <Route path='/dashboard' element={<Dashboard/>}/>
                                        <Route path='/locales' element={<Stores/>}/>
                                        <Route path='/tipos_locales' element={<StoreTypes/>}/>
                                        <Route path='/inquilinos' element={<Tenants/>}/>
                                        <Route path='/cuentas' element={<Balances/>}/>
                                        <Route path='/contratos' element={<Contracts/>}/>
                                        <Route path='/configuracion' element={<Settings/>}/>
                                        <Route path='/' element={<Login/>}/>
                                        <Route path='/logout' element={<Logout/>}/>
                                    </>
                                </Routes>
                            </Main>

                        </div>

                    </BrowserRouter>
                </AuthContext.Provider>
            </LocalizationProvider>

        </Box>
    )
        ;
}

export default App;
