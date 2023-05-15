import React, {useEffect, useState} from 'react';
import fetchWrapper, {checkLoggedIn} from "../utils/Utils";
import {useNavigate} from "react-router-dom";
import {DataGrid, GridColDef, GridRowsProp} from "@mui/x-data-grid";
import {Button, Grid, Link, Paper} from "@mui/material";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TenantDialog from "./dialogs/TenantDialog";
import {Tenant} from "../classes/Tenant";

function Tenants() {
    const navigate = useNavigate();
    const [rows, setRows] = useState<GridRowsProp>([]);
    const [tenants, setTenants] = useState<Array<Tenant>>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [edit, setEdit] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

    const columns: GridColDef[] = [
        {field: 'id', headerName: 'ID', width: 70},
        {field: 'name', headerName: 'Nombre', width: 190},
        {field: 'last_name', headerName: 'Apellido', width: 190},
        {
            field: 'stores', headerName: 'Locales', width: 70, renderCell: (params) => {
                if (params.value.length > 0) {
                    return <Link href={'/locales?ids=' + params.value}>
                        {params.value.length}
                    </Link>
                }
                return 0
            }
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <Button onClick={() => {
                            editTenant(params.row.id)
                        }}><ModeEditIcon/></Button>
                        &nbsp;&nbsp;
                        <Button onClick={() => {
                            deleteTenant(params.row.id)
                        }}><DeleteIcon/>
                        </Button>
                    </>
                )
            }
        }
    ]

    const newTenant = () => {
        setSelectedTenant(null)
        setOpenDialog(true)
        setEdit(false)
    }

    const editTenant = (id: any) => {
        let index = tenants.findIndex((tenant: Tenant) => tenant.id === id)
        let tenant = null
        if (index !== -1) {
            tenant = tenants[index]
        }
        setSelectedTenant(tenant)
        setOpenDialog(true)
        setEdit(true)
    }

    const saveTenant = async (tenant: Tenant) => {
        let tenantId = edit ? `${tenant.id}/` : '';
        let url = `${process.env.REACT_APP_API_PATH}/tenants/` + tenantId;

        await fetchWrapper(url, {
            method: edit ? 'PUT' : 'POST',
            body: JSON.stringify(tenant)
        }).then(() => {
            setSelectedTenant(null)
        }).then(() => {
            setOpenDialog(false)
        }).catch(err => {
            if (err.message === '401') {
                navigate('/');
            }
        });

        getTenantsFromServer()
    }

    const deleteTenant = async (id: any) => {
        let url = `${process.env.REACT_APP_API_PATH}/tenants/` + id;
        await fetchWrapper(url, {
            method: 'DELETE'
        }).catch(err => {
            if (err.message === '401') {
                navigate('/');
            }
        });

        getTenantsFromServer()
    }

    function getTenantsFromServer() {
        fetchWrapper(`${process.env.REACT_APP_API_PATH}/tenants/`, {method: 'GET'})
            .then((data) => {
                //@ts-ignore
                //setTenants(data)
                //@ts-ignore
                setRows(data.map((tenant: Tenant) => {
                    return {
                        id: tenant.id,
                        name: tenant.name,
                        last_name: tenant.last_name,
                        stores: tenant.stores
                    }
                }))
            }).catch(err => {
                if (err.message === '401') {
                    navigate('/');
                }
            });
    }

    useEffect(() => {
        checkLoggedIn(navigate);
        getTenantsFromServer();

    }, []);




    return (
        <>
            <Paper elevation={10} style={{width: "800px"}}>
                <Grid container columns={1}>
                    <Grid item xs={1} style={{textAlign: 'left'}}>
                        <Button onClick={newTenant}>
                            <AddCircleIcon/>
                        </Button>
                    </Grid>
                    <Grid item xs={1}>
                        <DataGrid columns={columns} rows={rows}/>
                    </Grid>
                </Grid>
            </Paper>
            <TenantDialog edit={edit} saveTenant={saveTenant} open={openDialog} setOpen={setOpenDialog}
                          selectedTenant={selectedTenant}/>
        </>
    );

}


export default Tenants;