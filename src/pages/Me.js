import React, { useState, useEffect } from 'react';
import { useFirestore, useAuth } from 'reactfire';
import { makeStyles } from '@material-ui/core/styles';
import { Input, Grid, Paper, TextField, Typography, Button, Box, Card, CardContent, CardMedia, Divider, Select } from '@material-ui/core';
import { Dialog, DialogContent, DialogTitle, DialogActions } from '@material-ui/core';
import ViewOffer from "./ViewOffer";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  btYellow: {
      backgroundColor: "#ffe400",
  },
  card: {
      display: 'flex',
      width: '100%',
      paddingLeft: '10px',
  },
  cardDetails: {
      flex: 1,
  },
  cardItem: {
      marginTop: '4px',
  },
  cardMedia: {
      alignSelf: 'center',
      width: '128px',
      height: '128px',
      marginBottom: '4px',
  },
}));

function Me({user = null, ...props}) {
  const classes = useStyles();
  const [data,setData] = useState(null);
  const [dataInside,setDataInside] = useState(null);

  const firestore = useFirestore();
  const auth = useAuth();
  const [isLoading,setIsLoading] = useState(false);
  const [runOnce,setRunOnce] = useState(true);

  const [showPopup,setShowPopup] = useState(false);
  const [popupData,setPopupData] = useState(null);

  useEffect(() => {
    if (runOnce) {
      setRunOnce(false);
      refreshList();
    }
  });

  const simulateShipCost = (shipCost, quantity) => {
    return ((shipCost * (1+( (quantity-1)/20)) ) / quantity).toFixed(2)
  }

  function showOfferPopup({...offerData}) {
    setPopupData(offerData);
    setShowPopup(true);
  }

  const refreshList = () => {
    firestore.collection("Offers").get().then((querySnapshot) => {
      //setData(resp);
      //console.log(querySnapshot);
      let offers = [];
      let offersInside = [];
      querySnapshot.forEach((documentSnapshot) => {
        let data = documentSnapshot.data();
        let exists = false;

        exists = data.participants.some(
          (participant) => participant.email === user.email
        );

        if (exists) {

            let isCreator = false;
            if (data.creatorEmail === user.email) {
                isCreator = true;
            }

            if(isCreator) {
                offers.push({
                    ...documentSnapshot.data(),
                    id: documentSnapshot.id,
                });
            } else {
                offersInside.push({
                    ...documentSnapshot.data(),
                    id: documentSnapshot.id,
                });
            }
        }
      });

      if (offers.length === 0 && offersInside.length === 0) {
        alert("Nenhuma oferta foi encontrada!\nTente novamente mais tarde ou adicione ofertas!");
        setData([]);
        setDataInside([]);
      } else {
        setData(offers);
        setDataInside(offersInside);
      }
    }).catch(error => {
      console.log(error);
    });
  };

  return (
    <div className={classes.root}>
      <Grid container justify="center" spacing={3}>
      <Grid container justify="flex-start">
        <Typography variant="h5" style={{marginLeft: "15px"}}>Minhas Ofertas: </Typography>
      </Grid>
      {data == null 
        ?
        <Grid item xs={12}>
            <Paper className={classes.paper}>Carregando Ofertas Disponíveis...</Paper>
        </Grid>
        : data.length === 0 
        ?
        <Grid item xs={12}>
            <Paper className={classes.paper}>Nenhuma oferta foi encontrada.</Paper>
        </Grid>
        :
        data.map(({id, productId, productName, productCost, productShipCost, productThumb, vendorInfo, city, state,  endDate, participants, creatorName, ...props}) => {
          //console.log("shipObject: ",shipObject, " - Tipo: ",props.shipping.mode);
           return (
              <Grid item xs={12} key={id}>
                          <Card className={classes.card} >
                              <CardContent className={classes.cardDetails} >
                                  <Grid item>
                                  <Typography variant="subtitle1" color="primary">Destino: <b>{city}</b> - <b>{state}</b></Typography>
                                    <Divider style={{marginTop: "5px", marginBottom: "5px"}}/>
                                  </Grid>
                                  <Grid container direction="row"  alignItems="center" justify="space-between">
                                      <Grid item>
                                          <Grid container direction="row"  alignItems="center" justify="space-between">
                                              <Grid item>
                                                  <CardMedia component="img" className={classes.cardMedia} src={productThumb} />
                                              </Grid>
                                              <Grid item>
                                              <Grid container direction="column"  alignItems="flex-start" style={{marginLeft: "5px"}}>
                                                  <Typography component="h2" variant="h5">
                                                      {productName.length > 50 ? productName.slice(0,46)+"..." : productName}
                                                  </Typography>
                                                  <Typography variant="subtitle1" color="textSecondary">
                                                      Endereço Vendedor: <b>{vendorInfo}</b>
                                                  </Typography>
                                                  <Typography variant="subtitle1" color="textSecondary">
                                                      Prazo Final: <b>{endDate}</b>
                                                  </Typography>
                                                  <Typography variant="subtitle1" color="textSecondary">
                                                      Preço: <b>R$ {productCost}</b>
                                                  </Typography>
                                                  <Typography variant="h6">
                                                      Total: R$ { (parseFloat(productCost) + parseFloat(simulateShipCost(productShipCost,participants.length))).toFixed(2) } (Produto + Frete Atual)
                                                  </Typography>
                                              </Grid>
                                              </Grid>
                                          </Grid>
                                      </Grid>
                                      <Grid item>
                                          <Grid container direction="column"  alignItems="stretch" justify="space-between">
                                          <Typography>Custos de Frete para essa Oferta:</Typography>
                                          <Typography color={ participants.length === 1 ? "primary" : "initial" }>1 Comprador: <b>R$ {productShipCost}</b></Typography>
                                          <Typography color={ participants.length === 2 ? "primary" : "initial" }>2 Compradores: <b>R$ {simulateShipCost(productShipCost,2)}</b> (para cada)</Typography>
                                          <Typography color={ participants.length === 3 ? "primary" : "initial" }>3 Compradores: <b>R$ {simulateShipCost(productShipCost,3)}</b> (para cada)</Typography>
                                          <Box mt={1}>
                                              <Typography color="primary"><b>{participants.length === 1 ? "1 pessoa já ingressou nessa oferta." : `${participants.length} pessoas já ingressaram nessa oferta.` }</b></Typography>
                                          </Box>
                                          <Box mt={1}>
                                              <Button variant="contained" fullWidth color="primary" onClick={() => showOfferPopup({id, productId, productName, productCost, productShipCost, productThumb, vendorInfo, city, state,  endDate, participants, creatorName, ...props})}>Visualizar Como Vendedor</Button>
                                          </Box>
                                          </Grid>
                                      </Grid>
                                  </Grid>
                              </CardContent>
                          </Card>
                      </Grid>
        )})
        }
      </Grid>
      <Grid container justify="center" spacing={3}>
        <Grid container justify="flex-start">
            <Typography variant="h5" style={{marginLeft: "15px", marginTop: "15px"}} align="left">Ofertas que Ingressei: </Typography>
        </Grid>
        {dataInside == null 
        ?
        <Grid item xs={12}>
            <Paper className={classes.paper}>Carregando Ofertas Disponíveis...</Paper>
        </Grid>
        : dataInside.length === 0 
        ?
        <Grid item xs={12}>
            <Paper className={classes.paper}>Nenhuma oferta foi encontrada.</Paper>
        </Grid>
        :
        dataInside.map(({id, productId, productName, productCost, productShipCost, productThumb, vendorInfo, city, state,  endDate, participants, creatorName, ...props}) => {
          //console.log("shipObject: ",shipObject, " - Tipo: ",props.shipping.mode);
           return (
              <Grid item xs={12} key={id}>
                          <Card className={classes.card} >
                              <CardContent className={classes.cardDetails} >
                                  <Grid item>
                                  <Typography variant="subtitle1" color="primary">Destino: <b>{city}</b> - <b>{state}</b></Typography>
                                    <Divider style={{marginTop: "5px", marginBottom: "5px"}}/>
                                  </Grid>
                                  <Grid container direction="row"  alignItems="center" justify="space-between">
                                      <Grid item>
                                          <Grid container direction="row"  alignItems="center" justify="space-between">
                                              <Grid item>
                                                  <CardMedia component="img" className={classes.cardMedia} src={productThumb} />
                                              </Grid>
                                              <Grid item>
                                              <Grid container direction="column"  alignItems="flex-start" style={{marginLeft: "5px"}}>
                                                  <Typography component="h2" variant="h5">
                                                      {productName.length > 50 ? productName.slice(0,46)+"..." : productName}
                                                  </Typography>
                                                  <Typography variant="subtitle1" color="textSecondary">
                                                      Endereço Vendedor: <b>{vendorInfo}</b>
                                                  </Typography>
                                                  <Typography variant="subtitle1" color="textSecondary">
                                                      Criador da Oferta: <b>{creatorName}</b>
                                                  </Typography>
                                                  <Typography variant="subtitle1" color="textSecondary">
                                                      Prazo Final: <b>{endDate}</b>
                                                  </Typography>
                                                  <Typography variant="subtitle1" color="textSecondary">
                                                      Preço: R$ {productCost}
                                                  </Typography>
                                                  <Typography variant="h6">
                                                      Total: R$ { (parseFloat(productCost) + parseFloat(simulateShipCost(productShipCost,participants.length))).toFixed(2) } (Produto + Frete Atual)
                                                  </Typography>
                                              </Grid>
                                              </Grid>
                                          </Grid>
                                      </Grid>
                                      <Grid item>
                                          <Grid container direction="column"  alignItems="stretch" justify="space-between">
                                          <Typography>Custos de Frete para essa Oferta:</Typography>
                                          <Typography color={ participants.length === 1 ? "primary" : "initial" }>1 Comprador: <b>R$ {productShipCost}</b></Typography>
                                          <Typography color={ participants.length === 2 ? "primary" : "initial" }>2 Compradores: <b>R$ {simulateShipCost(productShipCost,2)}</b> (para cada)</Typography>
                                          <Typography color={ participants.length === 3 ? "primary" : "initial" }>3 Compradores: <b>R$ {simulateShipCost(productShipCost,3)}</b> (para cada)</Typography>
                                          <Box mt={1}>
                                              <Typography color="primary"><b>{participants.length === 1 ? "1 pessoa já ingressou nessa oferta." : `${participants.length} pessoas já ingressaram nessa oferta.` }</b></Typography>
                                          </Box>
                                          <Box mt={1}>
                                            <Button variant="contained" fullWidth color="primary" onClick={() => showOfferPopup({id, productId, productName, productCost, productShipCost, productThumb, vendorInfo, city, state,  endDate, participants, creatorName, ...props})}>Visualizar Como Vendedor</Button>
                                          </Box>
                                          </Grid>
                                      </Grid>
                                  </Grid>
                              </CardContent>
                          </Card>
                      </Grid>
        )})
        }
      </Grid>
      {
          showPopup 
          ?
          popupData != null 
          ?
          <ViewOffer offerData={popupData} showPopup={setShowPopup} />
          : null
          : null
      }
    </div>
  );
}

export default Me;