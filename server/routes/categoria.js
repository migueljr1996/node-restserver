const express = require('express')
const app = express()
const { verificarToken, verificarRol } = require('../middlewares/autenticacion');
let Categoria = require('../models//categoria')

//==============================
// Mostrar todas las categorias
//==============================
app.get('/categoria', (req, res) => {


    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!categorias) {
                res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                categorias
            })
        })


})

//==============================
// Mostrar una categoria por ID
//==============================

app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no es correcto'
                }
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
})

//==============================
// Crear nueva categoria
//==============================

app.post('/categoria', verificarToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
})

//==============================
// Actualizar nombre de categoria
//==============================

app.put('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    descCategoria = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            res.status(400), json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
})

//==============================
// Crear nueva categoria
//==============================

app.delete('/categoria/:id', [verificarToken, verificarRol], (req, res) => {
    let id = req.params.id;
    let nuevoEstado = {
        estado: false
    }
    Categoria.findByIdAndUpdate(id, nuevoEstado, { new: true }, (err, CategoriaBorrada) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }
        if (!CategoriaBorrada) {
            res.status(400), json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            })
        }
        res.json({
            ok: true,
            message: 'Categoria Borrada'
        })
    })
})



module.exports = app