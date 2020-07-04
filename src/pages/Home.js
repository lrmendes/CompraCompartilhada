import React, { useState } from 'react';
import { useFirestoreDocData, useFirestore, SuspenseWithPerf } from 'reactfire';
import { makeStyles } from '@material-ui/core/styles';
import { Input, Grid, Paper, TextField, Typography, Button, Box, Card, CardContent, CardMedia, Divider,  } from '@material-ui/core';
import axios from "axios";
import { Link } from "react-router-dom";

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

function Home() {
    const classes = useStyles();
    const [search,setSearch] = useState(null);
    const [searchAux, setSearchAux] = useState("");
    const [loading, setLoading] = useState(false);

    const [data,setData] = useState(null);


  const doSearch = () => {
    if (searchAux != "" && searchAux != null && searchAux != undefined && searchAux != search) {
        setLoading(true);
        setSearch(searchAux);
        axios.get(`https://api.mercadolibre.com/sites/MLB/search?q=${searchAux}#json`)
        .then(res => {
            const results = res.data;
            setData(results);
            setLoading(false);
        }).catch(error => {
            setLoading(false);
        });

    } else {
        console.log("A busca exige algum termo e não pode ser igual a busca atual");
        console.log(search);
        console.log("aux: ",searchAux);
        //alert("A busca exige algum termo e não pode ser igual a busca atual");
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
            data.results.slice(0, 5).map(({id, title,price, address, thumbnail, ...props}) => {
                 return (
                    <Grid item xs={9} key={id}>
                                <Card className={classes.card} >
                                    <CardContent className={classes.cardDetails} >
                                        <Grid container direction="row"  alignItems="center" className={classes.cardItem} spacing={2}>
                                            <Grid item xs={3} >
                                                <CardMedia component="img" className={classes.cardMedia} src={thumbnail} />
                                            </Grid>
                                            <Grid item xs >
                                                <Typography component="h2" variant="h5">
                                                    {title}
                                                </Typography>
                                                <Typography variant="subtitle1" color="textSecondary">
                                                    --
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Divider />
                                        <Grid container direction="row" justify="space-between" alignItems="center" className={classes.cardItem} spacing={2}>
                                            <Grid item >
                                                <Typography variant="h5" color="textSecondary">
                                                    R$ {price}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Link to={`/produto/${id}`} style={{ textDecoration: 'none' }}>
                                                    <Button variant="contained" color="primary">Compra Compartilhada</Button>
                                                </Link>
                                                <Link to={`/produto/${id}`} style={{ textDecoration: 'none' }}>
                                                    <Button variant="contained" color="primary" disabled>Comprar</Button>
                                                </Link>
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
    </div>
  );
}

export default Home;
