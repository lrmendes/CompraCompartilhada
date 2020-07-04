import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, InputLabel, TextField, Typography, Select } from '@material-ui/core';

import { CssBaseline, Container, Avatar, MenuItem } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CheckIcon from '@material-ui/icons/Check';
import { green } from '@material-ui/core/colors';
import axios from 'axios';
import { Link } from "react-router-dom";

import {
    useAuth,
    useFirestore
  } from 'reactfire';

import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        minHeight: 50,
    },
    toggleContainer: {
        margin: theme.spacing(2, 0),
    },
    input: {
        display: 'none',
    },
}));


function AuthPage({...props}) {
    const classes = useStyles();

    function getAddressAPI() {
        if (cep.length != 8) {
            return alert('Verifique o cep digitado! O cep deve conter somente números!');
        }

        axios.get(`https://api.mercadolibre.com/countries/BR/zip_codes/${cep}#json`)
            .then((response) => {
                if (response.data.erro) {
                    return alert('Verifique o cep digitado! O cep deve conter somente números!');
                }
                setAddress(response.data);
            })
            .catch((error) => {
                alert('Verifique o cep digitado! O cep deve conter somente números!');
            });
    }

    const history = useHistory();

    const apiCep = axios.create({
        baseURL: 'https://viacep.com.br/ws/',
        timeout: 2000,
    });

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    
    const [loginEmail, setLoginEmail] = useState("");
    const [loginSenha, setLoginSenha] = useState("");

    const [senhaConfirm, setSenhaConfirm] = useState("");
    
    const [isLogin, setIsLogin] = useState(true);

    const [cep, setCep] = useState("");
    const [address, setAddress] = useState(null);

    const auth = useAuth();
    const firestore = useFirestore();

    useEffect(() => {

    }, [address]);

    function handleRegister() {
        if (name === "" || !name) {
            return alert("O campo nome deve ser preenchido");
        }
        if (email === "" || !email) {
            return alert("O campo email deve ser preenchido");
        }
        if (senha === "" || !senha) {
            return alert("O campo senha deve ser preenchido");
        }
        if (senha != senhaConfirm) {
            return alert("As senhas digitadas devem ser iguais!");
        }
        if (cep === "" || !cep) {
            return alert("O campo CEP deve ser preenchido!");
        }
        if (address === null || !address) {
            return alert("Você deve buscar um cep válido!");
        }

        auth.createUserWithEmailAndPassword(email, senha).then(res => {
            firestore
            .collection('Users').doc(email).set(
                { email: email, name: name, zip_code: address.zip_code, city: address.city.name, state: address.state.name, address: address.extended_attributes.address }
             ).then(() => {
                 console.log("User Registred");
             }).catch(erro => {
                console.log("Registry Error");
                console.log(erro);
             });
        }).catch(e => {
            if (e.code === "auth/email-already-in-use") {
                alert("Esse endereço de email foi cadastrado!");
            } else {
                alert("Erro ao comunicar com o banco de dados!\nMsg: ",e.message);
                console.log(e);
            }
        });
    }

    function handleLogin() {
        auth.signInWithEmailAndPassword(loginEmail,loginSenha).then(res => {
            console.log("Entrou");
        }).catch(error => {
            if (error.code === "auth/wrong-password") {
                alert("Password incorreto!");
            } else if (error.code === "auth/user-not-found") {
                alert("Email não encontrado!");
            } else {
                alert("Não foi possível realizar o login!");
                console.log(error);
            }
        })
    }


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Autenticação
                </Typography>
                <Grid container style={{marginBottom: 10, marginTop: 20}}>
                    <Grid item  xs={6}>
                    <Button fullWidth style={{minHeight: 50, marginRight: 2}} variant={isLogin ? "contained" : "outlined"} value="usuario" aria-label="usuario" color="primary" onClick={() => setIsLogin(true)}>
                        Login
                    </Button>
                    </Grid>
                    <Grid item xs={6}>
                    <Button fullWidth style={{minHeight: 50, marginLeft: 2}} variant={isLogin ? "outlined" : "contained"}  value="empresa" aria-label="empresa" color="primary" onClick={() => setIsLogin(false)}>
                        Cadastro
                    </Button>
                    </Grid>
                </Grid>
                { isLogin 
                ? <form className={classes.form} noValidate>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                onChange={(e) => setLoginEmail(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                        <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={(e) => setLoginSenha(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleLogin}
                    >
                        CONECTAR
                    </Button>
                </form>
                : <form className={classes.form} noValidate>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="nome"
                            name="nome"
                            autoComplete="nome"
                            label="Nome"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password Confirm"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={(e) => setSenhaConfirm(e.target.value)}
                        />
                        </Grid>
                    {address != null
                        ? (
                            <Grid container direction="column" alignItems="center">
                                <Typography>{address.extended_attributes.address}</Typography>
                                <Typography>{ address.city.name}</Typography>
                                <Typography>{ address.state.name}</Typography>
                                <Typography>CEP: {address.zip_code}</Typography>
                                <Button size="small" variant="contained" color="primary" onClick={() => setAddress(null)}>Alterar/Remover</Button>
                            </Grid>
                        )
                        : (
                            <Grid item xs={8}>
                                <TextField
                                    id="inputCep"
                                    variant="outlined"
                                    label="CEP"
                                    required
                                    size="small"
                                    onChange={(e) => setCep(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                        )}
                    {address == null ?
                        (
                            <Grid item xs={4}>
                                <Button size="large" fullWidth variant="contained" color="primary" onClick={getAddressAPI}>Buscar</Button>
                            </Grid>
                        ) : null
                    }


                </Grid>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={handleRegister}
                >
                    Cadastrar
                </Button>
            </form>
                }
            </div>
        </Container >

    );
}
export default AuthPage;