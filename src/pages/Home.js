import React, { useState } from 'react';
import { useFirestore } from 'reactfire';
import { makeStyles } from '@material-ui/core/styles';
import { Input, Grid, Paper, TextField, Typography, Button, Box, Card, CardContent, CardMedia, Divider } from '@material-ui/core';
import { Dialog, DialogContent, DialogTitle, DialogActions } from '@material-ui/core';

import axios from "axios";

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
    dialogText1: {
        color: "#00000",
        padding: 3,
        marginTop: 5,
    },
    dialogText2: {
        marginTop: 10,
    }
  }));

function Home({user = null, ...props}) {
    const classes = useStyles();

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const [search,setSearch] = useState(null);
    const [searchAux, setSearchAux] = useState("");

    const [loading, setLoading] = useState(false);
    const [data,setData] = useState(null);

    const firestore = useFirestore();

    const createOffer = ({...product}) => {
        //console.log(user);
        //console.log(product);
        setSelectedData(product);
        setOpenDialog(true);
    };

    const registerNewOffer = () => {
      // ID = Email_IDProduct (Garante um ID unico)
      //          { productId: selectedData.id, productName: selectedData.name, productThumb: null, productShipCost: null, productCost: null, city: null, state: null, creatorName: null, creatorAddress: null, part1Name: null, part1ZipCode: }
      var today = new Date();
      var date = (today.getDate()+1)+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
      firestore
      .collection('Offers').doc(user.email+"_"+selectedData.id).set(
          { productId: selectedData.id, productName: selectedData.title, productThumb: selectedData.thumbnail, productShipCost: selectedData.shipObject.list_cost, creatorEmail: user.email, creatorName: user.name, 
            vendorInfo: selectedData.address.city_name + " - " + selectedData.address.state_name, productCost: selectedData.price, city: user.city, endDate: date, state: user.state, participants:[{name: user.name, address: user.address, zip_code: user.zip_code, email: user.email}] }
      ).then(() => {
          setOpenDialog(false);
          //console.log("Offer Registred");
          //let newList = data;
          //newList.results = newList.results.filter(product => product.id !== selectedData.id)
          //setData(newList)
          alert("Oferta Criada com Sucesso!");
      }).catch(erro => {
        //console.log("Offer Error");
        setOpenDialog(false);
        alert("Erro ao Criar a Oferta!");
        //console.log(erro);
      });
    };

    const simulateShipCost = (shipCost, quantity) => {
        return ((shipCost * (1+( (quantity-1)/20)) ) / quantity).toFixed(2)
    }

  const doSearch = () => {
    if (searchAux != "" && searchAux != null && searchAux != undefined && searchAux != search) {
        setLoading(true);
        setSearch(searchAux);
        axios.get(`https://api.mercadolibre.com/sites/MLB/search?q=${searchAux}#json`)
        .then(async res => {
            let results = res.data;
            //console.log("Recebidos:",results.results.length)
            results.results = results.results.filter(product => !product.shipping.free_shipping);
            //console.log("Frete pago:",results.results.length)
            if (results.results.length >= 5) {
                results.results = results.results.slice(0,4);
            }
            //console.log("Limite:",results.results.length)
            //console.log("Dados:",results.results)

            let newResults = [];

            await Promise.all(results.results.map(async product => {    
                //console.log("Frete Calculed");
                await axios.get(`https://api.mercadolibre.com/items/${product.id}/shipping_options?zip_code=${user.zip_code}`).then(resShip => {
                    product["shipObject"] = resShip.data.options[0];
                    newResults.push(product);
                    //newResults[product].push({shipObject: resShip.data.options[0]});
                    //results.results[product] = product;
                    //console.log("Entrou: ",resShip.data);
                }).catch(errorShip => {
                    //product["shipObject"] = null;
                    //results.results.remove(product);
                    //results.results[product] = product;
                    //console.log("ERRO: ", errorShip);
                });
            }));
            //console.log("Setou Results");
            results.results = newResults;
            //console.log("Fim:", results);
            setData(results);
            setLoading(false);

        }).catch(error => {
            setLoading(false);
        });

    } else {
        //console.log("A busca exige algum termo e não pode ser igual a busca atual");
        //console.log(search);
        //console.log("aux: ",searchAux);
        alert("A busca exige algum termo e não pode ser igual a última pesquisa!");
    }
  }

  return (
    <div className={classes.root}>
      <Grid container justify="center" spacing={3}>
        <Grid item xs={9}>
          <Paper className={classes.paper}>
            <Grid container direction="row" justify="center" alignItems="center">
                Busca de Produtos: 
                <Box ml={2}>
                    <TextField id="standard-search" placeholder="Insira sua busca aqui..." type="search" onChange={e => setSearchAux(e.target.value)} />
                </Box>
                <Box ml={2}>
                    <Button variant="contained" color="primary" disabled={loading} onClick={doSearch}>Pesquisar</Button>
                </Box>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Grid container justify="center" spacing={3}>
        {search == null 
        ?
        <Grid item xs={9}>
            <Paper className={classes.paper}>Digite um termo de busca (celular, camiseta)...</Paper>
        </Grid>
        :
        data != null ? 
            data.results.slice(0, 10).map(({id, title,price, address, thumbnail, shipObject, ...props}) => {
                //console.log("shipObject: ",shipObject, " - Tipo: ",props.shipping.mode);
                 return (
                    <Grid item xs={11} key={id}>
                                <Card className={classes.card} >
                                    <CardContent className={classes.cardDetails} >
                                        <Grid container direction="row"  alignItems="center" justify="space-between">
                                            <Grid item>
                                                <Grid container direction="row"  alignItems="center" justify="space-between">
                                                    <Grid item>
                                                        <CardMedia component="img" className={classes.cardMedia} src={thumbnail} />
                                                    </Grid>
                                                    <Grid item>
                                                    <Grid container direction="column"  alignItems="flex-start">
                                                        <Typography component="h2" variant="h5">
                                                            {title.length > 50 ? title.slice(0,46)+"..." : title}
                                                        </Typography>
                                                        <Typography variant="subtitle1" color="textSecondary">
                                                            Endereço Vendedor: <b>{address.city_name} - {address.state_name}</b>
                                                        </Typography>
                                                        <Typography variant="h5">
                                                            R$ {price}
                                                        </Typography>
                                                    </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Grid container direction="column"  alignItems="stretch" justify="space-between">
                                                <Typography variant="h6" color="textSecondary">
                                                    Frete: R$ {shipObject.list_cost}
                                                </Typography>
                                                <Box mt={1}>
                                                    <Button variant="contained" color="primary" onClick={() => createOffer({id, title, price, address, thumbnail, shipObject})} >Compra Compartilhada</Button>
                                                </Box>
                                                <Box mt={1}>
                                                    <Button variant="contained" color="primary" fullWidth disabled={true}>Comprar</Button>
                                                </Box>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                )
             })
        : null
        }
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Criar Oferta de Compartilhamento</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography variant="h6">
            Informações Produto:
          </Typography>
          <Typography className={classes.dialogText1}>
            Produto: <b>{selectedData != null ? selectedData.title : ""}</b>
          </Typography>
          <Typography className={classes.dialogText1}>
            Preço: <b>R$ {selectedData != null ? selectedData.price : ""}</b>
          </Typography>
          <Typography className={classes.dialogText1}>
            Frete para sua Cidade: <b>R$ {selectedData != null ? selectedData.shipObject.list_cost : ""}</b>
          </Typography>
          <Divider />
          <Typography variant="h6" className={classes.dialogText2}>
            Informações da sua Oferta de Compartilhamento:
          </Typography>
          <Typography className={classes.dialogText1}>
            Oferta disponível para a região: <b>{user.city}</b> / <b>{user.state}</b>
          </Typography>
          <Typography className={classes.dialogText1}>
            Custo do frete compartilhado entre duas pessoas (2 compradores): <br/><b>R$ {selectedData != null ? simulateShipCost(selectedData.shipObject.list_cost,2) : ""}</b> para cada participante da compra.
          </Typography>
          <Typography className={classes.dialogText1}>
            Custo do frete compartilhado entre três pessoas (3 compradores): <br/><b>R$ {selectedData != null ? simulateShipCost(selectedData.shipObject.list_cost,3) : ""}</b> para cada participante da compra.
          </Typography>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary" variant="outlined">
            Cancelar
          </Button>
          <Button onClick={() => registerNewOffer()} className={classes.modalButtonRemove} color="primary" variant="contained">
            Criar Oferta
          </Button>
        </DialogActions>
      </Dialog>
      
    </div>
  );
}

export default Home;
