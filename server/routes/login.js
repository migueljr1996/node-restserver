const express = require('express')
const bcrypt = require('bcrypt')
const Usuario = require('../models/usuario')
var jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express()

app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            //Es 500 porque es un error del servidor
            res.status(500).json({
                ok: false,
                err
            })
        }
        if (!usuarioDB) {
            //Es 400 porque no se encontro el usuario
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario incorrecto'
                }
            })
        }
        //Se compara la contraseña enviada con la encriptada pero como esta encriptada de una sola via bcrypt tiene una funcion para hacer el proceso inverso
        //Se comprobara si la contraseña hace match con la que esta en la bd
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            //Es 400 porque no se encontro la contraseña
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Contraseña incorrecto'
                }
            })
        }
        // En la expiracion es 60 segundos * 60 min * 24 horas * 30 dias === expira en 30 dias
        let token = jwt.sign({
                usuario: usuarioDB
            },
            process.env.SEED, { expiresIn: process.env.Caducidad_Token });
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    })
})

//Configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token).catch(e => {
        return res.status(403).json({
            ok: false,
            err: e
        })
    })

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            //Es 500 porque es un error del servidor
            res.status(500).json({
                ok: false,
                err
            })
        }
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                res.status(400).json({
                    ok: false,
                    err: { message: 'Auntentifica normal ps man' }
                })
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.Caducidad_Token });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        }
        //si el usuario no existe en la db
        else {
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre
            usuario.email = googleUser.email
            usuario.img = googleUser.img
            usuario.google = true
            usuario.password = ':D'
            usuario.save((err, usuarioDB) => {
                if (err) {
                    //Es 500 porque es un error del servidor
                    res.status(500).json({
                        ok: false,
                        err
                    })
                };

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.Caducidad_Token });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })


            })
        }
    })
})
module.exports = app