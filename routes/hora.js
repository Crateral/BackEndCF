// Requires
var express = require('express');
var Hora = require('../models/hora');

// Inicializar variables
var app = express();

//===============================
//Obtener todas las horas
//===============================
app.get('/', (req, res, next) => {

    Hora.find().sort({ "horaInicio": 1 }).collation({ locale: "en_US", numericOrdering: true })
        .exec(
            (err, horas) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando horas de la BD',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    horas: horas
                });
            });

});

//===============================
// Crear horas
//===============================
app.post('/', (req, res) => {

    var body = req.body;

    var hora = new Hora({
        horaInicio: body.horaInicio,
        horaFin: body.horaFin
    });

    hora.save((err, horaGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear la hora',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hora: horaGuardada,
        });

    });

});

module.exports = app;