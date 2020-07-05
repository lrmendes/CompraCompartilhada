import React,{useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import {Grid,Divider, Box, IconButton} from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';

import Home from "../pages/Home";
import Offers from "../pages/Offers";
import Me from "../pages/Me";
import { Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";

import {
    useAuth,
    useFirestore,
    useFirestoreDocData
} from 'reactfire';

const drawerWidth = 240;
const history = createBrowserHistory();

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    backgroundColor: "#ffe400",
    boxShadow: "0px 1px 1px #9E9E9E",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  defaultBlack: {
      color: "#000000",
      flexGrow: 1,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#fafafa",
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },  
  menuButton: {
    marginRight: theme.spacing(2),
    color: "#000000"
  },
}));

const pages = [
    {id: 0, title: "Produtos", icon: <HomeOutlinedIcon /> , route: "/"},
    {id: 1, title: "Ofertas de Partilha", icon: <LocalOfferOutlinedIcon /> ,route: "/offers"},
    {id: 2, title: "Minhas Ofertas", icon: <ShoppingCartOutlinedIcon />, route: "/me"},
]

export default function PermanentDrawerLeft() {
  const [title, setTitle] = useState('Início');
  const classes = useStyles();
  
  const auth = useAuth();
  const firestore = useFirestore();

  const onItemClick = title => () => {
    setTitle(title);
  };

  const doLogout = () => {
    auth
    .signOut()
    .then(() => {
        // Logout
    });
  }

  const userRef = firestore
  .collection('Users')
  .doc(auth.currentUser.email);

  const [user,setUser] = useState(useFirestoreDocData(userRef));

  /*useEffect(() => {
    if (user == null || (Object.keys(user).length === 0 && user.constructor === Object) || user === undefined) {
      auth
      .signOut()
      .then(() => {
          // Logout
      });
      alert("Erro ao conectar usuário.\nPor favor, faça login novamente!");
    } else {
      console.log(user);
    }
  });*/

  return (
    <div className={classes.root}>
    <Router history={history}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography className={classes.defaultBlack} variant="h6" noWrap>
            {title}
          </Typography>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={doLogout}>
            <ExitToAppOutlinedIcon />
        </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div
        className={classes.toolbar}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant={"h6"} style={{ color: "#000000" }}>
          Compra Compartilhada
        </Typography>
      </div>
        <Divider />
        <List>
        {pages.map(({id,title,icon, route}) => (
            <ListItem button component={Link} to={route} onClick={onItemClick(title)} key={id}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={title} />
            </ListItem>
          ))}
            <ListItem button onClick={doLogout}>
              <ListItemIcon><ExitToAppOutlinedIcon/></ListItemIcon>
              <ListItemText primary={"Sair"} />
            </ListItem>
        </List>
        <Divider />
        <Grid container direction="column" style={{paddingLeft: "15px"}}>
            <Box mt={1}>
                <Typography variant="h6">Perfil:</Typography>
            </Box>
            <Box mt={1}>
                <Typography>Usuário:</Typography>
            </Box>
            <Typography><b>{user.name}</b></Typography>
            <Box mt={1}>
                <Typography>CEP:</Typography>
            </Box>
            <Typography><b>{user.zip_code}</b></Typography>
            <Box mt={1}>
                <Typography>Cidade:</Typography>
            </Box>
            <Typography><b>{user.city}</b></Typography>
            <Box mt={1}>
                <Typography>Estado:</Typography>
            </Box>
            <Typography><b>{user.state}</b></Typography>
            <Box mt={1}>

            </Box>
        </Grid>
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
            <Route exact path="/" component={() => <Home user={user} />} />
            <Route path="/offers" component={() => <Offers user={user}/>} />
            <Route path="/me" component={() => <Me user={user}/>} />
      </main>
    </Router>
    </div>
  );
}