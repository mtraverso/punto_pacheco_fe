import React, {useEffect, useState} from 'react';
import {Contract} from "../../classes/Contract";
import {Button, Checkbox, Dialog, DialogTitle, Grid, MenuItem, Paper, Select, TextField} from "@mui/material";
import {Store} from "../../classes/Store";
import {Tenant} from "../../classes/Tenant";
import fetchWrapper from "../../utils/Utils";
import {DatePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import moment from "moment/moment";

interface ContractDialogProps {
    edit: boolean
    open: boolean
    setOpen: (open: boolean) => void
    selectedContract: Contract | null
    saveContract: (contract: Contract) => void
}

export const defaultContract: Contract = {
    //@ts-ignore
    tenant: '',
    //@ts-ignore
    store: '',
    start_date: '',
    renovation_date: '',
    deposit: 0,
    price: 0,
    id: 0,
    paid_key: false,
}

function ContractDialog({edit, open, setOpen, selectedContract, saveContract}: ContractDialogProps) {
    //@ts-ignore

    const [tenants, setTenants] = useState<Tenant[]>([])
    const [stores, setStores] = useState<Store[]>([])
    const [contract, setContract] = useState<Contract>(selectedContract !== null ? selectedContract : defaultContract)

    useEffect(() => {
        fetchWrapper(`${process.env.REACT_APP_API_PATH}/tenants/`, {method: 'GET'})
            .then((data) => {
                //@ts-ignore
                setTenants(data)
                //@ts-ignore
                if(!selectedContract)
                    //@ts-ignore
                    setContract({...contract, tenant: data[0].id})
            })
        fetchWrapper(`${process.env.REACT_APP_API_PATH}/stores/`, {method: 'GET'})
            .then((data) => {
                //@ts-ignore
                setStores(data)
                //@ts-ignore
                if(!selectedContract)
                    //@ts-ignore
                    setContract({...contract, store: data[0].id})
            });

    }, [open]);

    useEffect(() => {
        if(edit)
            //@ts-ignore
            setContract(selectedContract)
        else{
            setContract(defaultContract)
        }
    }, [selectedContract]);




    function setValue(type: string, value: any) {
        if (type ==='store'){
            let store = stores.filter((store) => store.id === value)[0]
            setContract({...contract, [type]: value, price: store.price, deposit: store.key})
        }
        else if (type === 'start_date' || type === 'renovation_date') {
            value = value.format('YYYY-MM-DD')
            setContract({...contract, [type]: value})
        } else {
            setContract({...contract, [type]: value})
        }
    }

    return (
        <Dialog open={open} onClose={() => {
            setOpen(false)
        }}>
            <DialogTitle>{edit ? 'Ver contrato' : 'Nuevo contrato'}</DialogTitle>
            <Paper elevation={10}
                   style={{marginLeft: '5px', marginRight: '10px', marginTop: '5px', marginBottom: '5px'}}>
                <Grid container columns={21} rowSpacing={2} style={{marginTop: "5px"}}>
                    <Grid item xs={10}>
                        <TextField value={contract.tenant} select
                                   onChange={(e) => {
                                       setValue('tenant', e.target.value)
                                   }} fullWidth label={"Inquilino"}>
                            {tenants.map((tenant) =>
                                <MenuItem value={tenant.id} key={tenant.id}>{tenant.name} {tenant.last_name}</MenuItem>)
                            }
                        </TextField>
                    </Grid>
                    <Grid item xs={1}></Grid>

                    <Grid item xs={10}>
                        <TextField value={contract.store} onChange={(e) => {
                            //@ts-ignore
                            setValue('store', e.target.value)
                        }} fullWidth label={"Local"} select>
                            {stores.map((store) =>
                                <MenuItem value={store.id} key={store.id}>{store.id}</MenuItem>)
                            }
                        </TextField>

                    </Grid>
                    <Grid item xs={10}>
                        <DatePicker
                            label="Fecha inicio"
                            value={moment(contract.start_date, 'YYYY-MM-DD')}
                            onChange={(newValue) => setValue('start_date', newValue)}
                            className={"datepicker"}
                            format={'DD/M/YYYY'}
                        />
                    </Grid>

                    <Grid item xs={1}></Grid>

                    <Grid item xs={10}>
                        <DatePicker
                            label="Fecha fin"
                            value={moment(contract.renovation_date, 'YYYY-MM-DD')}
                            onChange={(newValue) => setValue('renovation_date', newValue)}
                            className={"datepicker"}
                            format={'D/M/YYYY'}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label={"Precio"} value={contract.price}
                                   onChange={(e) => setValue('price', e.currentTarget.value)} fullWidth/>
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={6}>
                        <TextField label={"Deposito"} value={contract.deposit}
                                   onChange={(e) => setValue('deposit', e.currentTarget.value)} fullWidth/>
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={6}>
                        <label>Llave pagada</label>
                        <Checkbox value={contract.paid_key} onChange={(e) => setValue('paid_key', e.target.checked)}/>
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={17}></Grid>
                    <Grid item xs={3}>
                        <Button onClick={() => {
                            saveContract(contract)
                        }}>Guardar</Button>
                    </Grid>

                </Grid>
            </Paper>
        </Dialog>
    );
}

export default ContractDialog;