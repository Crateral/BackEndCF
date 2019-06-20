// Requires
var express = require('express');
var Plan = require('../models/Plan');

// Inicializar variables
var app = express();

app.get('/plan/:usuario', (req, res, next) => {

    var idUsuario = req.params.usuario;

    Promise.all([buscarPlanPorUsuario(idUsuario)])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                planes: respuestas[0]
            })
        });

});


function buscarPlanPorUsuario(idUsuario) {

    return new Promise((resolve, reject) => {
        Plan.find({ usuario: idUsuario }, (err, planes) => {

            if (err) {
                reject('Error al cargar los usuarios ', err);
            } else {
                resolve(planes);
            }
        })
    });
}

module.exports = app;