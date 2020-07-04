import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';

import Home from "../pages/Home";
import Offers from "../pages/Offers";
import { Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";

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
}));

const pages = [
    {id: 0, title: "Início", icon: <HomeOutlinedIcon /> , route: "/"},
    {id: 1, title: "Ofertas de Partilha", icon: <LocalOfferOutlinedIcon /> ,route: "/offers"},
    {id: 2, title: "Carrinho", icon: <ShoppingCartOutlinedIcon />, route: "/cart"},
    {id: 3, title: "Sair", icon: <ExitToAppOutlinedIcon/>  ,route: "/logout"},
]

export default function PermanentDrawerLeft() {
  const [title, setTitle] = useState('Início');
  const classes = useStyles();

  const onItemClick = title => () => {
    setTitle(title);
  };

  return (
    <div className={classes.root}>
    <Router history={history}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography className={classes.defaultBlack} variant="h6" noWrap>
            {title}
          </Typography>
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
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
            <Route exact path="/" component={Home} />
            <Route path="/offers" component={Offers} />
      </main>
    </Router>
    </div>
  );
}