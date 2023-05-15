import React, {useEffect, useState} from 'react';
import userService from "../services/userService";
import {useNavigate} from "react-router-dom";
import {checkLoggedIn, fetchWrapper} from "../utils/Utils";
import {Button, Grid, Paper} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import StoreDialog from "./dialogs/StoreDialog";
import ContractDialog, {defaultContract} from "./dialogs/ContractDialog";
import {DataGrid, GridColDef, GridRowsProp} from "@mui/x-data-grid";
import {Contract} from '../classes/Contract';
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

function Contracts() {
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedContract, setSelectedContract] = React.useState<Contract>(defaultContract);
    const [contracts, setContracts] = React.useState([]);
    const [edit, setEdit] = React.useState(false);
    const [rows, setRows] = useState<GridRowsProp>([]);

    function editContract(id: number) {
        setSelectedContract(contracts.filter((contract: Contract) => contract.id === id)[0])
        setOpenDialog(true)
        setEdit(true)
    }

    function deleteContract(id: number) {
        fetchWrapper(`${process.env.REACT_APP_API_PATH}/contracts/${id}/`, {method: 'DELETE'})
            .then(() => {
                fetchWrapper(`${process.env.REACT_APP_API_PATH}/contracts/`, {method: 'GET'})
                    .then((data) => {
                        //@ts-ignore
                        setContracts(data)
                        //@ts-ignore
                        setRows(data)
                    });
            })
    }

    const columns: GridColDef[] = [
        {field: 'id', headerName: 'ID', width: 70},
        {field: 'tenant', headerName: 'Tenant', width: 130},
        {field: 'store', headerName: 'Store', width: 130},
        {field: 'start_date', headerName: 'Start Date', width: 130},
        {field: 'renovation_date', headerName: 'Renovation Date', width: 130},
        {field: 'deposit', headerName: 'Deposit', width: 130},
        {
            field: 'paid_key', headerName: 'Paid Key', width: 130, renderCell: (params) => {
                if (params.value) {
                    return 'Si'
                }
                return 'No'
            }
        },
        {field: 'price', headerName: 'Price', width: 130},
        {
            'field': 'actions', 'headerName': 'Acciones', 'width': 200, renderCell: (params) => {
                return (
                    <>
                        <Button onClick={() => {
                            editContract(params.row.id)
                        }}><ModeEditIcon/></Button>
                        &nbsp;&nbsp;
                        <Button onClick={() => {
                            deleteContract(params.row.id)
                        }}><DeleteIcon/>
                        </Button>
                    </>
                )
            }
        }
    ]


    function getContracts() {
        fetchWrapper(`${process.env.REACT_APP_API_PATH}/contracts/`, {method: 'GET'})
            .then((data) => {
                //@ts-ignore
                setContracts(data)
                //@ts-ignore
                setRows(data)
            });
    }

    useEffect(() => {
        checkLoggedIn(navigate);
        getContracts();
    }, []);

    function newContract() {
        setSelectedContract(defaultContract)
        setOpenDialog(true)
        setEdit(false)
    }

    const saveContract = (contract: Contract) => {
        let url = `${process.env.REACT_APP_API_PATH}/contracts/`;
        if (edit) {
            url += `${contract.id}/`
        }
        fetchWrapper(url, {
            method: edit ? 'PUT' : 'POST',
            body: JSON.stringify(contract)
        }).then(() => {
            setOpenDialog(false)
            getContracts()
        })
    }

    return (
        <>
            <Paper elevation={10} style={{width: "1300px", marginLeft: -350}}>
                <Grid container columns={1}>
                    <Grid item xs={1} style={{textAlign: 'left'}}>
                        <Button onClick={newContract}>
                            <AddCircleIcon/>
                        </Button>
                    </Grid>
                    <Grid item xs={1}>
                        <DataGrid columns={columns} rows={rows}/>
                    </Grid>
                </Grid>
            </Paper>
            <ContractDialog edit={edit} saveContract={saveContract} open={openDialog} setOpen={setOpenDialog}
                            selectedContract={selectedContract}/>
        </>
    );
}

export default Contracts;