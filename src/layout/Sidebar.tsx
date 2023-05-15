import React, {useContext, useState} from 'react';
import {Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import PersonIcon from '@mui/icons-material/Person';
import BallotIcon from '@mui/icons-material/Ballot';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import StoreIcon from '@mui/icons-material/Store';
import StorefrontIcon from '@mui/icons-material/Storefront';
import {useNavigate} from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import ExpandableMenuItem, {ExpandableMenuItemConfig} from "./menu_items/ExpandableMenuItem";
import MenuItem, {MenuItemConfig} from "./menu_items/MenuItem";

interface SidebarPropTypes {
    open: boolean
}

export const drawerWidth = 250;

function Sidebar({open}: SidebarPropTypes) {
    const {user} = useContext(AuthContext);
    const navigate = useNavigate()
    const [itemOpen, setItemOpen] = useState<Array<boolean>>([])

    const firstSection: Array<MenuItemConfig> = [
        {
            text: 'Dashboard',
            icon: <DashboardIcon/>,
            path: '/dashboard',
            hide: true,
        }
    ]

    const secondSection: Array<ExpandableMenuItemConfig> = [
        {
            text: 'Locales',
            icon: <LocalMallIcon/>,
            hide: true,
            children: [
                {
                    text: 'Locales',
                    icon: <StoreIcon/>,
                    path: '/locales',
                    hide: true,
                },
                {
                    text: 'Tipos de locales',
                    icon: <StorefrontIcon/>,
                    path: '/tipos_locales',
                    hide: true,
                }
            ]
        },
        {
            text: 'Inquilinos',
            icon: <PersonIcon/>,
            path: '/inquilinos',
            hide: true,
        },
        {
            text: 'Contratos',
            icon: <BallotIcon/>,
            path: '/contratos',
            hide: true,
        }
    ]

    const thirdSection: Array<MenuItemConfig> = [
        {
            text: 'Cuentas',
            icon: <AccountBalanceIcon/>,
            path: '/cuentas',
            hide: true,
        }
    ]

    const fourthSection: Array<MenuItemConfig> = [
        {
            text: 'Configuración',
            icon: <SettingsIcon/>,
            path: '/configuracion',
            hide: true,
        }]

    const fifthSection: Array<MenuItemConfig> = [
        {
            text: 'Logout',
            icon: <LogoutIcon/>,
            path: '/logout',
            hide: true,
        }]
    const sections = [firstSection, secondSection, thirdSection, fourthSection, fifthSection]

    const buildMenuItems = (item: MenuItemConfig, index: number) => {

        return (
            <Box key={item.text}>
                {Object.hasOwn(item, 'children') ? <ExpandableMenuItem key={index} {...item} /> :
                    <MenuItem key={index} {...item} />}
            </Box>);
    }

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    zIndex: 100,
                    top: '48px'
                },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            {user && sections.map((section: Array<MenuItemConfig>, index: number) => (
                <Box key={index}>
                    <List key={index}>
                        {section.map((item: MenuItemConfig, itemNumber: number) => (
                            buildMenuItems(item, itemNumber)
                        ))}
                    </List>
                    <Divider />
                </Box>
            ))}
            {!user &&
                <List>
                    <Box key={'login'}>
                        <List>
                            <MenuItem text={'Login'} icon={<LoginIcon />} hide={false} path={'/'}/>
                        </List>
                    </Box>
                </List>}
        </Drawer>
    )
}

export default Sidebar;