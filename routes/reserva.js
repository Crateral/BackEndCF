// Requires
var express = require('express');
var Reserva = require('../models/reserva');

var mdAutenticacion = require('../middlewares/autenticacion');

// Inicializar variables
var app = express();

//===============================
//Obtener todos las reservas
//===============================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Reserva.find().populate('usuario', 'nombre email telefono')
        .populate('clase')
        .exec(
            (err, reservas) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando reservas de la BD',
                        errors: err
                    });
                }

                Reserva.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        reservas: reservas,
                        total: conteo
                    });
                });

            });

});

//===============================
// Actualizar reservas 
//===============================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Reserva.findById(id).exec(
        (err, reserva) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar reserva',
                    errors: err
                });
            }

            if (!reserva) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La reserva con el ID: ' + id + ' no existe.',
                    errors: { message: 'No existe seson con el ID: ' + id }
                });
            }

            reserva.estado = body.estado;

            reserva.save((err, reservaGuardada) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar reserva',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    reserva: reservaGuardada,
                });

            });

        });
});

//===============================
// Crear reserva
//===============================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var reserva = new Reserva({
        usuario: body.usuario,
        clase: body.clase,
        fechaReserva: body.fechaReserva
    });

    reserva.save((err, reservaGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el reserva',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            reserva: reservaGuardada,
        });

    });

});

//===============================
// Borrar Reserva por ID
//===============================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Reserva.findByIdAndRemove(id, (err, reservaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar la reserva con ID: ' + id,
                errors: err
            });
        }

        if (!reservaBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe la reserva con ID: ' + id,
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            reserva: reservaBorrada,
        });
    })

});

module.exports = app;