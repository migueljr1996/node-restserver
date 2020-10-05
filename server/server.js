require("./config/config")
const express = require('express')
const app = express()
const mongoose = require('mongoose');

var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
    //Contiene las rutas
app.use(require('./routes/index'))

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err;
    else {
        console.log('bd online')
    }
});

app.listen(process.env.PORT, () => {
    console.log(`PUERTO ${process.env.PORT}`)
})