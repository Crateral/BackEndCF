// Requires
var express = require('express');
var Plan = require('../models/plan');

var mdAutenticacion = require('../middlewares/autenticacion');

// Inicializar variables
var app = express();

//===============================
// Obtener planes por usuario
//===============================
app.get('/:usuario', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    var idUsuario = req.params.usuario;

    Plan.find({ usuario: idUsuario }, (err, planes) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando planes de la BD',
                errors: err
            });
        }

        Plan.count({}, (err, conteo) => {
            res.status(200).json({
                ok: true,
                planes: planes,
                total: conteo
            });
        });

    }).skip(desde).limit(5);

});

//===============================
// Actualizar Plan
//===============================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Plan.findById(id, 'nombre descripcion').exec(
        (err, plan) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar plan',
                    errors: err
                });
            }

            if (!plan) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El plan con el ID: ' + id + ' no existe.',
                    errors: { message: 'No existe plan con el ID: ' + id }
                });
            }

            plan.nombre = body.nombre;
            plan.descripcion = body.descripcion;
            plan.valor = body.valor;

            plan.save((err, planGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar plan',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    plan: planGuardado,
                });

            });

        });
});

//===============================
// Crear Plan
//===============================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var plan = new Plan({
        nombre: body.nombre,
        descripcion: body.descripcion,
        valor: body.valor
    });

    plan.save((err, planGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el plan',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            plan: planGuardado,
        });

    });

});


//===============================
// Consultar todos los planes
//===============================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Plan.find((err, planes) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando planes de la BD',
                errors: err
            });
        }

        Plan.count({}, (err, conteo) => {
            res.status(200).json({
                ok: true,
                planes: planes,
                total: conteo
            });
        });

    }).skip(desde).limit(5);

});

//===============================
// Borrar Plan por ID
//===============================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Plan.findByIdAndRemove(id, (err, planBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar el plan con ID: ' + id,
                errors: err
            });
        }

        if (!planBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el plan con ID: ' + id,
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            plan: planBorrado,
        });
    })

});

module.exports = app;