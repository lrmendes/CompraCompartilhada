import React, { useState, useEffect } from 'react';
import { useFirestore, useAuth } from 'reactfire';
import { makeStyles } from '@material-ui/core/styles';
import { Input, Grid, Paper, TextField, Typography, Button, Box, Card, CardContent, CardMedia, Divider, Select } from '@material-ui/core';
import { Dialog, DialogContent, DialogTitle, DialogActions } from '@material-ui/core';

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

function Offers({user = null, ...props}) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [data,setData] = useState(null);
  const [dataAll,setDataAll] = useState(null);

  const firestore = useFirestore();
  const auth = useAuth();
  const [offerSize, setOfferSize] = useState(0);
  const [locationList,setLocationList] = useState([]);
  const [localFilter,setLocalFilter] = useState("Todas");
  const [isLoading,setIsLoading] = useState(false);
  const [runOnce,setRunOnce] = useState(true);

  useEffect(() => {
    if (runOnce) {
      setRunOnce(false);
      refreshList();
    }
    /*if (user == null || (Object.keys(user).length === 0 && user.constructor === Object) || user === undefined) {
      auth
      .signOut()
      .then(() => {
          // Logout
      });
    } else {
      console.log(user);
    }*/
    //console.log("Rodou 1x");
  });

  const simulateShipCost = (shipCost, quantity) => {
    return ((shipCost * (1+( (quantity-1)/20)) ) / quantity).toFixed(2)
  }


  const refreshList = () => {
    firestore.collection("Offers").get().then((querySnapshot) => {
      //setData(resp);
      //console.log(querySnapshot);
      let offers = [];
      let locations = [];
      querySnapshot.forEach((documentSnapshot) => {

        let data = documentSnapshot.data();
        let exists = false;

        exists = data.participants.some(
          (participant) => participant.email === user.email
        );

        let locationAlready = locations.some(localaux => localaux === data.city+" - "+data.state);
        if (locationAlready === false) {
          locations.push(data.city+" - "+data.state);
        } 

        let isLocal = false;
        if (user.city === data.city) {
          isLocal = true;
        }

        if (data.participants.length <= 2) {
          offers.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
            isInside: exists,
            isLocal: isLocal,
          });
        }
      });
      //console.log(offers);
      //console.log("Finalized");

      if (offers.length === 0) {
        alert("Nenhuma oferta foi encontrada!\nTente novamente mais tarde ou adicione ofertas!");
        setData([]);
        setDataAll([]);
        setLocationList([]);
        setLocalFilter("Todas");
      } else {
        setData(offers);
        setLocationList(locations);
        setDataAll(offers);
        setLocalFilter("Todas");
      }
      setOfferSize(offers.length);

    }).catch(error => {
      console.log(error);
    });
  };

  const changeFilter = (event) => {
    setLocalFilter(event.target.value);
    if (event.target.value === "Todas") {
      setData(dataAll)
      setOfferSize(dataAll.length);
    } else {
      let offers = dataAll;
      offers = offers.filter(ofer => (ofer.city+" - "+ofer.state) === event.target.value);
      setData(offers);
      setOfferSize(offers.length);
    }
    //console.log("Rodou Filter");
  }

  const myUserData = useFirestore.FieldValue.arrayUnion({name: user.name, address: user.address, zip_code: user.zip_code, email: user.email});

  const singInOffer = (offer) => {
    setIsLoading(true);
		firestore.collection("Offers")
			.doc(offer.id)
			.update({
        participants: myUserData
			})
			.then(() => {
				setIsLoading(false);
        //setActiveIndex(activeIndex + 1);
        alert("Você Ingressou na Oferta com Sucesso!");
        refreshList();
			})
			.catch((error) => {
				setIsLoading(false);
				//console.log(error);
			});
  };

  return (
    <div className={classes.root}>
      <Grid container justify="center" spacing={3}>
        <Grid item xs={11}>
          <Paper className={classes.paper}>
            <Grid container direction="row" justify="space-evenly" alignItems="center">
                <Box ml={2}>
                    Filtrar Por Localidade:  
                    <Select
                    native
                    value={localFilter}
                    onChange={changeFilter}
                    inputProps={{
                      name: 'filter',
                    }}
                  >
                    <option value={"Todas"}>Todas</option>
                    {
                      locationList.map(local => {
                        return <option key={local} value={local}>{local}</option>
                      })
                    }
                  </Select>
                </Box>
                <Box ml={2}>
                  Ofertas encontradas: {offerSize}
                </Box>
                <Box ml={2}>
                    <Button variant="contained" color="primary" disabled={loading} onClick={refreshList}>Atualizar Ofertas</Button>
                </Box>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Grid container justify="center" spacing={3}>
        {data == null 
        ?
        <Grid item xs={9}>
            <Paper className={classes.paper}>Carregando Ofertas Disponíveis...</Paper>
        </Grid>
        : 
        data.map(({id, productId, productName, productCost, productShipCost, productThumb, isLocal, vendorInfo, city, state,  isInside, endDate, participants, creatorName, ...props}) => {
          //console.log("shipObject: ",shipObject, " - Tipo: ",props.shipping.mode);
           return (
              <Grid item xs={12} key={id}>
                          <Card className={classes.card} >
                              <CardContent className={classes.cardDetails} >
                                  <Grid item>
                                  <Typography variant="subtitle1" color="primary">Oferta de Compartilhamento Disponível para Compradores de <b>{city}</b> - <b>{state}</b></Typography>
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
                                                  <Typography variant="h5">
                                                      R$ {productCost}
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
                                              <Button variant="contained" fullWidth color="primary" disabled={isInside || !isLocal || isLoading}  onClick={() => singInOffer({id, productName, productCost, city, state, productThumb, productShipCost})}>Ingressar na Oferta</Button>
                                          </Box>
                                          {isLocal ? (isInside ? <Typography style={{marginTop: 4}} align="center" color="secondary">Você já ingressou nessa oferta.</Typography> : null) : <Typography style={{marginTop: 4}} align="center" color="secondary">Oferta não disponível para sua cidade.</Typography>}
                                          </Grid>
                                      </Grid>
                                  </Grid>
                              </CardContent>
                          </Card>
                      </Grid>
        )})
        }
      </Grid>
    </div>
  );
}

export default Offers;
