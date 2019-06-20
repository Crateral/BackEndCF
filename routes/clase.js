// Requires
var express = require('express');
var Clase = require('../models/Clase');

var mdAutenticacion = require('../middlewares/autenticacion');
// Inicializar variables
var app = express();

//===============================
// Consultar todas las Clases
//===============================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Clase.find((err, clases) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando clases de la BD',
                errors: err
            });
        }

        Clase.count({}, (err, conteo) => {
            res.status(200).json({
                ok: true,
                clases: clases,
                total: conteo
            });
        });

    }).skip(desde).limit(5);

});

//===============================
// Crear Clase
//===============================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var clase = new Clase({
        horaInicio: body.horaInicio,
        horaFinal: body.horaFinal,
        fecha: body.fecha,
        descripcion: body.descripcion,
        coach: body.coach,
        ubicacion: body.ubicacion
    });

    clase.save((err, claseGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear la clase',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            clase: claseGuardada,
        });

    });

});

module.exports = app;