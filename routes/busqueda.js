// Requires
var express = require('express');
var Usuario = require('../models/usuario');
var Plan = require('../models/plan');
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

app.get('/plan/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    var promesa = buscarPlanes(busqueda, regex);

    promesa.then(data => {
        return res.status(200).json({
            ok: true,
            planes: data
        });
    }).catch(data => {
        return res.status(400).json({
            ok: false,
            planes: data
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

function buscarPlanes(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Plan.find({ nombre: regex }, 'nombre valor')
            .exec((err, planes) => {
                if (err) {
                    reject('Error al cargar planes', err);
                } else {
                    resolve(planes);
                }
            });
    });
}

module.exports = app;