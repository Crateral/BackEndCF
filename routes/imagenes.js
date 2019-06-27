// Requires
var express = require('express');

// Inicializar variables
var app = express();

const path = require('path');
const fs = require('fs');

app.get('/usuarios/:img', (req, res, next) => {

    var imagen = req.params.img;

    var pathImagen = path.resolve(__dirname, `../uploads/usuarios/${imagen}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }

});

module.exports = app;