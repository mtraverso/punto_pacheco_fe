import React, {useEffect, useState} from 'react';
import {Tenant} from "../../classes/Tenant";
import {Button, Dialog, DialogTitle, Grid, Paper, TextField} from "@mui/material";

interface TenantDialogPropTypes {
    edit: boolean
    open: boolean
    setOpen: (open: boolean) => void
    selectedTenant: Tenant | null
    saveTenant: (tenant: Tenant) => void
}

function TenantDialog({edit, open, setOpen, selectedTenant, saveTenant}: TenantDialogPropTypes) {
    const defaultTenant = {id: -1, name: '', last_name: '', stores: []}

    const [tenant, setTenant] = useState<Tenant>(selectedTenant !== null ? selectedTenant : defaultTenant)

    useEffect(() => {
        setTenant(selectedTenant !== null ? selectedTenant : defaultTenant)
    }, [selectedTenant])

    function setValue(name: string, value: string) {
        setTenant({...tenant, [name]: value})
    }

    return (
        <Dialog open={open} onClose={() => {
            setOpen(false)
        }}>
            <DialogTitle>{edit ? 'Modificar inquilino' : 'Nuevo inquilino'}</DialogTitle>
            <Paper elevation={10}
                   style={{marginLeft: '5px', marginRight: '5px', marginTop: '5px', marginBottom: '5px'}}>
                <Grid container columns={21}>
                    <Grid item xs={10}><TextField label={'Nombre'} value={tenant?.name}
                                                  onChange={(e) => setValue('name', e.currentTarget.value)}/></Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={10}><TextField label={'Apellido'} value={tenant?.last_name}
                                                  onChange={(e) => setValue('last_name', e.currentTarget.value)}/></Grid>
                    <Grid item xs={17}></Grid>
                    <Grid item xs={3}>
                        <Button onClick={() => {
                            saveTenant(tenant)
                        }}>Guardar</Button>
                    </Grid>

                </Grid>
            </Paper>
        </Dialog>
    );
}

export default TenantDialog;