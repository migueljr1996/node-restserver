const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');
const { verificarTokenImagen } = require('../middlewares/autenticacion');

app.get('/imagen/:tipo/:img', verificarTokenImagen, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen)

    } else {
        let noImage = path.resolve(__dirname, '../assets/no-image.jpg')
        res.sendFile(noImage);
    }
})




module.exports = app