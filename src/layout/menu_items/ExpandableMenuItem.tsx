import {CSSProperties, useState} from "react";
import {Collapse, ListItem, ListItemIcon, ListItemText, Menu} from "@mui/material";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import MenuItem, {MenuItemConfig} from "./MenuItem";

export interface ExpandableMenuItemConfig extends MenuItemConfig {
    text: string,
    icon: any,
    path?: string,
    hide: boolean,
    children?: Array<ExpandableMenuItemConfig>
}

const ExpandableMenuItem = (config: ExpandableMenuItemConfig) => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    const style: CSSProperties = {
        paddingLeft: "4vw"
    }

    return (
        <div>
            <ListItem onClick={handleClick}>
                <ListItemIcon>{config.icon}</ListItemIcon>
                <ListItemText primary={config.text}/>
                {open ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {config.children?.map((item, index) => {
                    return <MenuItem key={index} text={item.text} hide={item.hide} icon={item.icon} path={item.path}
                                     style={style}/>
                })
                }
            </Collapse>
        </div>
    )
};

export default ExpandableMenuItem;