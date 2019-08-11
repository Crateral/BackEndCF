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

    Clase.find()
        .exec((err, clases) => {
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

        });

});

//===============================
// Crear Clase
//===============================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var fecha = body.fecha.split("-");

    var clase = new Clase({
        horaInicio: body.horaInicio,
        horaFinal: body.horaFinal,
        fecha: body.fecha, //new Date(fecha[0], (fecha[1] - 1), fecha[2]).toISOString(),
        descripcion: body.descripcion,
        coach: body.coach,
        wod: body.wod
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

//===============================
// Actualizar Clase
//===============================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Clase.findById(id, 'horaInicio horaFinal fecha descripcion coach ubicacion cupo').exec(
        (err, clase) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar la clase',
                    errors: err
                });
            }

            if (!clase) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La clase con el ID: ' + id + ' no existe.',
                    errors: { message: 'No existe clase con el ID: ' + id }
                });
            }
            clase.descripcion = body.descripcion;
            clase.coach = body.coach;
            clase.cupo = body.cupo;
            clase.wod = body.wod;

            clase.save((err, claseGuardada) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar la clase',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    clase: claseGuardada,
                });

            });

        });
});

//===============================
// Borrar Clase por ID
//===============================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Clase.findByIdAndRemove(id, (err, claseBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar la clase con ID: ' + id,
                errors: err
            });
        }

        if (!claseBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe la clase con ID: ' + id,
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            clase: claseBorrada,
        });
    })

});

module.exports = app;