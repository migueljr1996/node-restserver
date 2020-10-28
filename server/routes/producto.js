const express = require('express')
const app = express()
const { verificarToken, verificarRol } = require('../middlewares/autenticacion');
let Producto = require('../models/producto')






//==============================
// Mostrar todas las categorias
//==============================
app.get('/producto', verificarToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limit = req.query.limit || 5;
    limit = Number(limit);
    Producto.find({ disponible: true })
        .limit(limit).skip(desde)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!producto) {
                res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto
            })
        })


})

//==============================
// Mostrar una Producto por ID
//==============================

app.get('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec(
            (err, productoDB) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        err
                    })
                }
                if (!productoDB) {
                    res.status(400).json({
                        ok: false,
                        err: {
                            message: 'El id no es correcto'
                        }
                    })
                }
                res.json({
                    ok: true,
                    categoria: productoDB
                })
            })




})

app.get('/producto/buscar/:termino', verificarToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i')
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, producto) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto
            })
        })
})



//==============================
// Crear nueva categoria
//==============================

app.post('/producto', verificarToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });
    producto.save((err, productoDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

//==============================
// Actualizar nombre de categoria
//==============================

app.put('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            res.status(400), json({
                ok: false,
                err: {
                    message: 'Producto no encontrada'
                }
            })
        }
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.save((err, productoGuardado) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto: productoGuardado
            })

        })

    })
})

//==============================
// Crear nueva categoria
//==============================

app.delete('/producto/:id', [verificarToken, verificarRol], (req, res) => {
    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            res.status(400), json({
                ok: false,
                err: {
                    message: 'Producto no encontrada'
                }
            })
        }
        productoDB.disponible = false;
        productoDB.save((err, productoBorrado) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto: productoBorrado
            })

        })

    })
})


module.exports = app;