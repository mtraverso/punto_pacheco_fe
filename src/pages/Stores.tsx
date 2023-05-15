import React, {useEffect, useState} from 'react';
import userService from "../services/userService";
import {useNavigate} from "react-router-dom";
import fetchWrapper, {checkLoggedIn} from "../utils/Utils";
import {Button, darken, Grid, lighten, Paper, styled} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import StoreDialog from "./dialogs/StoreDialog";
import {Store} from "../classes/Store";

function Stores() {
    const getBackgroundColor = (color: string, mode: string) =>
        mode === 'dark' ? darken(color, 0.7) : lighten(color, 0.7);

    const getHoverBackgroundColor = (color: string, mode: string) =>
        mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

    const getSelectedBackgroundColor = (color: string, mode: string) =>
        mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

    const getSelectedHoverBackgroundColor = (color: string, mode: string) =>
        mode === 'dark' ? darken(color, 0.4) : lighten(color, 0.4);

    const StyledDataGrid = styled(DataGrid)(({theme}) => ({
        '& .super-app-theme--Available': {
            backgroundColor: getBackgroundColor(theme.palette.error.main, theme.palette.mode),
            '&:hover': {
                backgroundColor: getHoverBackgroundColor(
                    theme.palette.error.main,
                    theme.palette.mode,
                ),
            },
            '&.Mui-selected': {
                backgroundColor: getSelectedBackgroundColor(
                    theme.palette.error.main,
                    theme.palette.mode,
                ),
                '&:hover': {
                    backgroundColor: getSelectedHoverBackgroundColor(
                        theme.palette.error.main,
                        theme.palette.mode,
                    ),
                },
            },
        },
        '& .super-app-theme--Not-available': {
            backgroundColor: getBackgroundColor(theme.palette.info.main, theme.palette.mode),
            '&:hover': {
                backgroundColor: getHoverBackgroundColor(
                    theme.palette.info.main,
                    theme.palette.mode,
                ),
            },
            '&.Mui-selected': {
                backgroundColor: getSelectedBackgroundColor(
                    theme.palette.info.main,
                    theme.palette.mode,
                ),
                '&:hover': {
                    backgroundColor: getSelectedHoverBackgroundColor(
                        theme.palette.info.main,
                        theme.palette.mode,
                    ),
                },
            },
        },
    }));

    const [stores, setStores] = useState<Array<Store>>([]);
    const [rows, setRows] = useState<Array<Store>>([]);
    const [edit, setEdit] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);


    const columns: GridColDef[] = [{
        'field': 'id',
        'headerName': 'Numero',
        'width': 80
    }, {'field': 'price', 'headerName': 'Precio', 'width': 190}, {
        'field': 'type',
        'headerName': 'Tipo',
        'width': 190,
        renderCell: (params) => params.value.type
    }, {'field': 'key', 'headerName': 'Llave', 'width': 190}, {
        'field': 'is_available',
        'headerName': 'Disponible',
        'width': 120,
        renderCell: (params) => {
            if (params.value) {
                return 'Si'
            }
            return 'No'
        }
    }, {
        'field': 'actions', 'headerName': 'Acciones', 'width': 200, renderCell: (params) => {
            return (
                <>
                    <Button onClick={() => {
                        editStore(params.row.id)
                    }}><ModeEditIcon/></Button>
                    &nbsp;&nbsp;
                    <Button onClick={() => {
                        deleteStore(params.row.id)
                    }}><DeleteIcon/>
                    </Button>
                </>
            )
        }
    }]


    const navigate = useNavigate();

    function getStores() {
        const params = new URLSearchParams(window.location.search);
        const idsToSearch = params.get('ids')

        let url = `${process.env.REACT_APP_API_PATH}/stores/`;
        if (idsToSearch) {
            url += `?ids=${idsToSearch}`
        }

        fetchWrapper(url).then((data) => {
            // @ts-ignore
            setStores(data)
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
        }).catch(err => {
            if (err.message === '401') {
                navigate('/');
            }
        });
    }

    useEffect(() => {
        checkLoggedIn(navigate)
        getStores();
    }, []);

    function newStore() {
        setSelectedStore(null)
        setOpenDialog(true)
        setEdit(false)
    }

    const editStore = (id: any) => {
        let index = stores.findIndex((store: Store) => store.id === id)
        let store = null
        if (index !== -1) {
            store = stores[index]
        }
        setSelectedStore(store)
        setOpenDialog(true)
        setEdit(true)
    }

    function saveStore(store: Store) {
        let url = `${process.env.REACT_APP_API_PATH}/stores/`;
        if (edit) {
            url += `${store.id}/`
        }
        fetchWrapper(url, {
            method: edit ? 'PUT' : 'POST',
            body: JSON.stringify(store)
        }).then((data) => {
            setOpenDialog(false)
            getStores()
        });
        console.log(store)
    }

    function deleteStore(id: any) {
        fetchWrapper(`${process.env.REACT_APP_API_PATH}/stores/${id}`, {method: 'DELETE'})
            .then((data) => {
                console.log(data)
                getStores()
            });
    }


    return (
        <>
            <Paper elevation={10} style={{width: "1000px", marginLeft: -120}}>
                <Grid container columns={1}>
                    <Grid item xs={1} style={{textAlign: 'left'}}>
                        <Button onClick={newStore}>
                            <AddCircleIcon/>
                        </Button>
                    </Grid>
                    <Grid item xs={1}>
                        <StyledDataGrid columns={columns} rows={rows}
                                        getRowClassName={(params) =>
                                            `super-app-theme--${params.row.is_available ? 'Available' : 'Not-available'}`}/>
                    </Grid>
                </Grid>
            </Paper>
            <StoreDialog edit={edit} saveStore={saveStore} open={openDialog} setOpen={setOpenDialog}
                         selectedStore={selectedStore}/>
        </>
    );
}

export default Stores;