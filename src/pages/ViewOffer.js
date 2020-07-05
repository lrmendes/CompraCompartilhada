import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Button, Box, Card, CardContent, CardMedia, Divider } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    popup: {
        position: "fixed",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: "auto",
        backgroundColor: "rgba(0,0,0, 0.5)"
      },
      popup_inner: {
        position: "absolute",
        overflow: "scroll",
        borderWidth: "1",
        borderRadius: 10,
        left: "25%",
        right: "10%",
        top: "15%",
        bottom: "25%",
        margin: "auto",
        background: "#fafafa",
      }
  }));

function ViewOffer({ offerData=null, showPopup }) {
    // create state `open` with default as false
    const classes = useStyles();

    const simulateShipCost = (shipCost, quantity) => {
        if (quantity === 1) {
            return shipCost
        } else {
        return ((shipCost * (1+( (quantity-1)/20)) ) / quantity).toFixed(2)
        }
    }

    return (
        <div className={classes.popup}>
            <div className={classes.popup_inner}>
                <Grid container justify="center">
                    <Grid container direction="column" justify="center">
                        <Button variant="contained" fullWidth color="primary" onClick={() => showPopup(false)}>Fechar</Button>
                        <Typography variant="h5" align={"center"} style={{marginTop: "10px"}}>Resumo de Venda do Tipo Compartilhada</Typography>
                        <Divider style={{marginTop: "5px", marginBottom: "5px"}}/>
                    </Grid>
                    {offerData != null
                    ? 
                    <Grid item xs={11} key={offerData.productId}>
                        <Typography variant="h6"  style={{marginTop: "10px", marginLeft: "5px"}}>Detalhes do Produto: </Typography>
                        <Card className={classes.card} >
                            <CardContent className={classes.cardDetails} >
                                <Grid item>
                                <Typography variant="subtitle1" color="primary">Destino da Compra Compartilhada: <b>{offerData.city}</b> - <b>{offerData.state}</b></Typography>
                                <Divider style={{marginTop: "5px", marginBottom: "5px"}}/>
                                </Grid>
                                <Grid container direction="row"  alignItems="center" justify="space-between">
                                    <Grid item>
                                        <Grid container direction="row"  alignItems="center" justify="space-between">
                                            <Grid item>
                                                <CardMedia component="img" className={classes.cardMedia} src={offerData.productThumb} />
                                            </Grid>
                                            <Grid item>
                                            <Grid container direction="column"  alignItems="flex-start" style={{marginLeft: "5px"}}>
                                                <Typography variant="h6">
                                                    {offerData.productName.length > 70 ? offerData.productName.slice(0,66)+"..." : offerData.productName}
                                                </Typography>
                                                <Typography variant="subtitle1">
                                                    ID Produto: <b>{offerData.productId}</b>
                                                </Typography>
                                                <Typography variant="subtitle1">
                                                    Preço Unitário: <b>R$ {offerData.productCost}</b>
                                                </Typography>
                                                <Typography>
                                                    Frete Unitário: <b>R$ { simulateShipCost(offerData.productShipCost,offerData.participants.length) }</b>
                                                </Typography>
                                            </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                <Divider style={{marginTop: "5px", marginBottom: "5px"}}/>
                                <Typography variant="subtitle1">
                                    Total Compradores: <b>{offerData.participants.length}</b>
                                </Typography>
                                <Typography variant="subtitle1">
                                    Frete Total: <b>R$ { (parseFloat( simulateShipCost(offerData.productShipCost,offerData.participants.length)) * offerData.participants.length ).toFixed(2) }</b>
                                </Typography>
                                <Typography variant="subtitle1">
                                    Produtos Total: <b>R$ { (parseFloat(offerData.productCost) * offerData.participants.length).toFixed(2) }</b>
                                </Typography>
                                <Typography variant="subtitle1">Total da Venda (Produtos+Frete): <b>R$ { ( (parseFloat(offerData.productCost) * offerData.participants.length)  + parseFloat( simulateShipCost(offerData.productShipCost,offerData.participants.length)) * offerData.participants.length ).toFixed(2)  }</b></Typography>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                : null }
                
                {offerData != null 
                ? offerData.participants.map( (participant, index) => {
                    return (
                        <Grid item xs={11} key={participant.email}>
                        <Typography style={{marginTop: "15px", marginLeft: "5px"}} variant="h6">Dados do Comprador #{(index+1)}: </Typography>
                        <Card className={classes.card} >
                            <CardContent className={classes.cardDetails} >
                                <Grid container direction="row"  alignItems="center" justify="space-between">
                                    <Grid item>
                                        <Grid container direction="row"  alignItems="center" justify="space-between">
                                            <Grid item>
                                            <Grid container direction="column"  alignItems="flex-start" style={{marginLeft: "5px"}}>
                                                <Typography>
                                                    Nome: <b>{participant.name}</b>
                                                </Typography>
                                                <Typography>
                                                    Email: <b>{participant.email}</b>
                                                </Typography>
                                                <Typography>
                                                    Endereço: <b>{participant.address}</b>
                                                </Typography>
                                                <Typography>
                                                    Cidade/Estado: <b>{offerData.city}</b> - <b>{offerData.state}</b>
                                                </Typography>
                                                <Typography>
                                                    Cep: <b>{participant.zip_code}</b>
                                                </Typography>
                                            </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Divider style={{marginTop: "5px", marginBottom: "5px"}}/>
                                    <Typography>Produto: <b>{offerData.productName}</b></Typography>
                                    <Typography>Quantidade: <b>1 Unidade</b></Typography>
                                    <Typography>Total Pago: <b>R$ { (parseFloat(offerData.productCost) + parseFloat(simulateShipCost(offerData.productShipCost,offerData.participants.length))).toFixed(2) }</b></Typography>
                                </Grid>
                            </CardContent>
                        </Card>
                        <Box mt={2}>
                        </Box>
                    </Grid>
                    );
                })
                : null}


            </Grid>
            </div>
        </div>
    );
};

export default ViewOffer;