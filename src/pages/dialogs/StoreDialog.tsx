import React, {useEffect, useState} from 'react';
import {Store} from "../../classes/Store";
import {Button, Dialog, DialogTitle, Grid, MenuItem, Paper, Select, SelectChangeEvent, TextField} from "@mui/material";
import {StoreType} from "../../classes/StoreType";
import fetchWrapper from "../../utils/Utils";

interface StoreDialogPropTypes {
    edit: boolean
    open: boolean
    setOpen: (open: boolean) => void
    selectedStore: Store | null
    saveStore: (store: Store) => void
}

function StoreDialog({edit, open, setOpen, selectedStore, saveStore}: StoreDialogPropTypes) {
    const [storeTypes, setStoreTypes] = useState<StoreType[]>([])
    //@ts-ignore
    const defaultStore: Store = {id: '', price: '', key: '', type: {id: 1}, is_available: false}
    const [store, setStore] = useState<Store>(selectedStore !== null ? selectedStore : defaultStore)

    useEffect(() => {
        setStore(selectedStore !== null ? selectedStore : defaultStore)
        fetchWrapper(`${process.env.REACT_APP_API_PATH}/stores/store_types/`, {method: 'GET'})
            .then((data) => {
                //@ts-ignore
                setStoreTypes(data)
            })
    }, [open])

    useEffect(() => {
        if (selectedStore === null) {
            setValue('type', store.type.id);
        }
    }, [storeTypes]);


    const setValue = (name: string, value: any) => {
        if (name === 'type') {
            let index = storeTypes.findIndex((storeType) => storeType.id === value)
            if (index !== -1) {
                value = storeTypes[index]
                let typePrice = value.price
                let key = typePrice * 4;
                setStore({...store, [name]: value, price: typePrice, key: key})
            }
        } else {
            setStore({...store, [name]: value})
        }
    }

    return (
        <Dialog open={open} onClose={() => {
            setOpen(false)
        }}>
            <DialogTitle>{edit ? 'Modificar local' : 'Nuevo local'}</DialogTitle>
            <Paper elevation={10}
                   style={{marginLeft: '5px', marginRight: '5px', marginTop: '5px', marginBottom: '5px'}}>
                <Grid container columns={21} rowSpacing={2} style={{marginTop: "5px"}}>
                    <Grid item xs={10}><TextField label={'Numero'} value={store.id}
                                                  onChange={(e) => setValue('id', e.currentTarget.value)}/></Grid>
                    <Grid item xs={1}></Grid>

                    <Grid item xs={7}>
                        <TextField title={'Tipo'} label={'Tipo'} value={store.type.id} fullWidth select
                                onChange={(e) => setValue('type', e.target.value)}>
                            {storeTypes.map((storeType) =>
                                <MenuItem key={storeType.id} value={storeType.id}>{storeType.type}</MenuItem>
                            )}
                        </TextField>
                    </Grid>
                    <Grid item xs={10}><TextField label={'Precio'} value={store.price}
                                                  onChange={(e) => setValue('price', e.currentTarget.value)}/></Grid>
                    <Grid item xs={1}></Grid>

                    <Grid item xs={10}>
                        <TextField label={'Llave'} value={store.key}
                                   onChange={(e) => setValue('key', e.currentTarget.value)}/>

                    </Grid>
                    <Grid item xs={16}></Grid>
                    <Grid item xs={3}>
                        <Button onClick={() => {
                            saveStore(store)
                        }}>Guardar</Button>
                    </Grid>

                </Grid>
            </Paper>
        </Dialog>

    );

}

export default StoreDialog;