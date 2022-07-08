import React, { useState, useEffect } from 'react';
import { withStyles } from '@mui/styles';
import {
    TextField, Dialog, DialogActions, DialogContent, Grid,
    DialogTitle, Button, Snackbar
} from '@mui/material'

import { api } from '../../utils';

const styles = theme => ({

})

function InventoryModal({
    classes,
    handleClose,

    onSubmit,
    data,
    operation,
    character, 
    totalSpace
}) {
    const [inventory, setInventory] = useState({
        description: '',
        weight: null,
        character_id: character
    });

    useEffect(() => {
        if(!data) {
            return;
        }

        setInventory({
            description: data.inventory.description,
            weight: data.inventory.weight,
            character_id: character
        });
    }, [data]);
    
    const resetState = () => {
        return setInventory({
            description: '',
            weight: null,
            character_id: character
        });
    }

    const submit = () => {
        if(!inventory.description || !inventory.weight) { // Verifica se a descrição e peso esta preenchida
            alert('Preencha todos os campos');
            // return (<Snackbar
            //     open={open}
            //     autoHideDuration={6000}
            //     onClose={handleClose}
            //     message="Preencha a Descrição e o Peso"
            // />)
            return;
        }

        if (inventory.weight > totalSpace){ // Verifica se o novo item cabe no inventario
            alert('Este item não cabe no inventario');
            return;
        }

        // Se a operação for criar
        if(operation === 'create') {
            api.post('/inventory', inventory)
                .then(() => {
                    // Callback
                    onSubmit();

                    // Close modal
                    handleClose();

                    // Limpa aa informações
                    resetState();
                })
                .catch(() => {
                    alert('Erro ao criar o item!');
                });
        }  else if (operation === 'edit') { // Se a operação for editar
            api.put(`/inventory/${data.inventory.id}`, inventory)
                .then(() => {
                    // Callback
                    onSubmit();

                    // Close modal
                    handleClose();

                    resetState();
                })
                .catch(err => {
                    alert('Erro ao editar o item!');
                });
        }
    }

    return (
        <Dialog
            open={true}
            onClose={handleClose}
        >
            <DialogTitle> { operation === 'create' ? 'Adicionar um novo item' : 'Editar item' }</DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            style={{
                                marginTop: '15px'
                            }}
                            autoFocus
                            label="Descrição"
                            type="text"
                            fullWidth
                            variant="standard"                           
                            defaultValue={data? (
                                data.inventory.description
                            ): ("")}
                            onChange={
                                ({ target }) => {
                                    const value = target.value;

                                    setInventory(prevState => ({
                                        ...prevState,
                                        description: value
                                    }));
                                }
                            }
                            spellCheck={false}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            style={{
                                marginTop: '15px'
                            }}
                            label="Peso"
                            type="number"
                            fullWidth
                            multiline
                            variant="standard"
                            defaultValue={data ? (
                                data.inventory.weight
                            ): ("")}
                            onChange={
                                ({ target }) => {
                                    const value = Number(target.value);

                                    setInventory(prevState => ({
                                        ...prevState,
                                        weight: value
                                    }));
                                }
                            }
                            spellCheck={false}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancelar
                </Button>
                <Button onClick={submit}>
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default withStyles(styles)(InventoryModal);