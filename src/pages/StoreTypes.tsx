import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Grid, Paper} from "@mui/material";
import {DataGrid, GridRowsProp} from "@mui/x-data-grid";
import {checkLoggedIn, fetchWrapper} from '../utils/Utils';
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import {StoreType} from "../classes/StoreType";
import StoreTypeDialog from "./dialogs/StoreTypeDialog";

function StoreTypes() {
    const navigate = useNavigate();
    const [rows, setRows] = useState<GridRowsProp>([])
    const [open, setOpen] = useState(false);
    const [storeTypes, setStoreTypes] = useState<Array<StoreType>>([]);
    const [selectedStoreType, setSelectedStoreType] = useState<StoreType>();

    function editStoreType(id: number) {
        setOpen(true)
        const storeType = storeTypes.find((storeType) => storeType.id === id)
        setSelectedStoreType(storeType)
    }

    const saveStoreType = (storeType: StoreType) => {
        fetchWrapper(`${process.env.REACT_APP_API_PATH}/stores/store_types/${storeType.id}/`, {
            method: 'PUT',
            body: JSON.stringify(storeType)
        })
            .then((data) => {
                getStoreTypes()
                setOpen(false)
            });
    }

    const columns = [
        {field: 'id', headerName: 'ID', width: 70},
        {field: 'type', headerName: 'Tipo', width: 190},
        {field: 'price', headerName: 'Precio', width: 190},
        {
            'field': 'actions', 'headerName': 'Acciones', 'width': 200, renderCell: (params: any) => {
                return (
                    <>
                        <Button onClick={() => {
                            editStoreType(params.row.id)
                        }}><ModeEditIcon/></Button>
                    </>
                )
            }
        }
    ]

    function getStoreTypes() {
        const url = `${process.env.REACT_APP_API_PATH}/stores/store_types/`;
        fetchWrapper(url).then((data) => {
            // @ts-ignore
            setStoreTypes(data);
            return data;
        }).then((stores) => {
            // @ts-ignore
            setRows(stores.map((store) => {
                return {
                    id: store.id,
                    price: store.price,
                    type: store.type,
                    key: store.key,
                    is_available: store.is_available
                }
            }))
        })
    }

    useEffect(() => {
        checkLoggedIn(navigate);
        getStoreTypes();
    }, []);

    return (
        <>
            <Paper elevation={10} style={{width: "800px"}}>
                <Grid container columns={1}>
                    <Grid item xs={1}>
                        <DataGrid columns={columns} rows={rows}/>
                    </Grid>
                </Grid>
            </Paper>
            <StoreTypeDialog selectedStoreType={selectedStoreType} open={open}
                             setOpen={setOpen} saveStoreType={saveStoreType}/>
        </>
    );
}

export default StoreTypes;