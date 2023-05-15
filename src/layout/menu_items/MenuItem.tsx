import {ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {CSSProperties} from "react";
import {useNavigate} from "react-router-dom";

export interface MenuItemConfig {
    text: string,
    icon: any,
    path?: string,
    hide: boolean,
    style?: CSSProperties
}

const MenuItem = (config: MenuItemConfig) => {
    const navigate = useNavigate();


    const navigateTo = () => {
        if (config.path) {
            navigate(config.path);
        }
        return null;
    }

    return (
        <ListItemButton style={config.style} onClick={navigateTo}>
            <ListItemIcon>{config.icon}</ListItemIcon>
            <ListItemText primary={config.text}/>
        </ListItemButton>
    );
};

export default MenuItem;