// Create react dialog for store types

import React, {useEffect, useState} from 'react';
import {StoreType} from "../../classes/StoreType";
import {Button, Dialog, DialogTitle, Grid, MenuItem, Paper, Select, TextField} from "@mui/material";

interface StoreTypeDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    selectedStoreType: StoreType | undefined
    saveStoreType: (storeType: StoreType) => void
}

function StoreTypeDialog({open, setOpen, selectedStoreType, saveStoreType}: StoreTypeDialogProps) {
    let defaultStoreType: StoreType = {id: 0, type: '', price: 0}
    const [storeType, setStoreType] = useState<StoreType>(selectedStoreType ? selectedStoreType : defaultStoreType)

    function setPrice(value: string) {
        console.log(value)
        //@ts-ignore
        setStoreType({...storeType, price: value})
        console.log(storeType)
    }

    useEffect(() => {
        //@ts-ignore
        setStoreType(selectedStoreType)
    }, [open]);


    return (
        <Dialog open={open} onClose={() => {
            setOpen(false)
        }}>
            <DialogTitle>{'Modificar tipo de local'}</DialogTitle>
            <Paper elevation={10}
                   style={{marginLeft: '5px', marginRight: '5px', marginTop: '5px', marginBottom: '5px'}}>
                <Grid container columns={21} rowSpacing={2} style={{marginTop: "5px"}}>
                    <Grid item xs={10}><TextField label={'Tipo'} value={storeType?.type} disabled/></Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={10}>
                        <TextField type={'number'} label={'Precio'} value={storeType?.price}
                                   onChange={(e) => setPrice(e.currentTarget.value)}/>
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={10}></Grid>
                    <Grid item xs={5}></Grid>
                    <Grid item xs={3}>
                        <Button onClick={() => {
                            //@ts-ignore
                            saveStoreType(storeType)
                        }}>Guardar</Button>
                    </Grid>

                </Grid>
            </Paper>
        </Dialog>
    );
}

export default StoreTypeDialog;