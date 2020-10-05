const express = require('express')
const bcrypt = require('bcrypt')
const Usuario = require('../models/usuario')
var jwt = require('jsonwebtoken');

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
module.exports = app