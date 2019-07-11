// Requires
var express = require('express');
var Usuario = require('../models/usuario')

// Inicializar variables
var app = express();

app.get('/usuario/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    var promesa = buscarUsuarios(busqueda, regex);

    promesa.then(data => {
        return res.status(200).json({
            ok: true,
            usuarios: data
        });
    }).catch(data => {
        return res.status(400).json({
            ok: false,
            usuarios: data
        });
    });

});

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({ nombre: regex }, 'nombre plan estado').populate('plan')
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;