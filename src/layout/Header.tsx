import React, {createRef, useContext, useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import {Grid, IconButton, Menu, MenuItem, Popover, styled, Tooltip, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AccountIcon from '@mui/icons-material/AccountCircle';
import logoExt from "../images/logo-ext.png";
import logo from "../images/logo.png";
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import {drawerWidth} from "./Sidebar";
import {AccountCircle} from "@mui/icons-material";


const roleMap: { [key: number]: string } = {1: "Admin", 2: "Manager"}

const locationMap: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/locales': 'Locales',
    '/inquilinos': 'Inquilinos',
    '/contratos': 'Contratos',
    '/cajas': 'Cajas',
    '/configuracion': 'Configuración',
    '/tipos_locales': 'Tipos de locales',
    '/cuentas' : 'Cuentas',
    '/': 'Login',
}

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        //width: `calc(100%)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
    height:"48px",
}));

interface HeaderPropTypes {
    open: boolean,
    setOpen: (open: boolean) => void
}

function Header({open, setOpen}: HeaderPropTypes) {
    const navigate = useNavigate();
    const {user} = useContext(AuthContext)
    const location = useLocation()
    const [tooltipOpen, setTooltipOpen] = useState<boolean>(false)
    const anchor = createRef<HTMLDivElement>()


    useEffect(() => {
        if (!user) {
            // @ts-ignore
            navigate('/')
        }
    }, []);

    useEffect(() => {
        if (user) {
            console.log("Logged out")
        }
    }, [user]);


    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const toggleClick = () => {
        setTooltipOpen(!tooltipOpen)
    }

    return (
        <AppBar open={open} color={'transparent'} className={'header'}>
            <Grid container columns={10}>
                <Grid item xs={0.2} alignItems={'center'} justifyContent={'center'}></Grid>
                <Grid item xs={0.5} alignItems={'center'} justifyContent={'center'}>
                    {!open ?
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{mr: 2}}
                        >
                            <MenuIcon/>
                        </IconButton>
                        :
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerClose}
                            edge="start"
                            sx={{mr: 2}}
                        >
                            <ChevronLeftIcon/>
                        </IconButton>
                    }
                </Grid>
                <Grid item xs={1}>
                     <img src={logoExt} alt="Logo" height={"46vh"} width={"166vw"} className={'image1'}/>
                    <img src={logo} alt="Logo" height={"46vh"} width={"50vw"} className={'image2'}/>
                </Grid>
                <Grid item xs={6} ><Typography variant="h5" style={{marginLeft:"-5vw", marginTop:"1vh"}}>{locationMap[location.pathname]}</Typography></Grid>
                <Grid item xs={2} className={'user'} >
                    {user && (
                    <div ref={anchor}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={toggleClick}
                            color="inherit"

                        >
                            <AccountCircle />
                        </IconButton>
                        <Popover
                            open={tooltipOpen}
                            anchorEl={anchor.current}
                            //anchorOrigin={{
                            //    vertical: 'top',
                            //    horizontal: 'right',
                            //}}
                            anchorPosition={{ top: 40, left: 1450 }}
                            anchorReference={'anchorPosition'}
                            onClick={toggleClick}
                        >
                            <Typography sx={{ p: 2 }}>{user.name}</Typography>
                            <Typography sx={{ p: 2 }}>{roleMap[user.role]}</Typography>
                        </Popover>

                    </div>
                    )}
                </Grid>

            </Grid>

        </AppBar>

    );
}

export default Header;