// Requires
var express = require('express');
var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// Inicializar variables
var app = express();

app.post('', (req, res) => {

    var body = req.body;

    Usuario.findOne({
            email: body.email
        },
        (err, usuarioBD) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuarios',
                    errors: err
                });
            }

            if (!usuarioBD) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas - email',
                    errors: err
                });
            }

            if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas - password',
                    errors: err
                });
            }

            usuarioBD.password = '';

            //Crear un token
            var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 });


            res.status(200).json({
                ok: true,
                usuario: usuarioBD,
                token: token,
                id: usuarioBD._id,
                menu: cargarMenu(usuarioBD.role)
            });
        }).populate('plan');

});

function cargarMenu(role) {

    if (role === 'ADMIN_ROLE') {
        menu = [{
                titulo: 'Administracion',
                icono: 'mdi mdi-gauge',
                submenu: [
                    { titulo: 'Administrar Usuarios', url: '/administrarUsuarios' },
                    { titulo: 'Administrar Planes', url: '/administrarPlanes' },
                    { titulo: 'Administrar Clases', url: '/administrarClases' },
                    { titulo: 'Administrar Reservas', url: '/administrarReservas' }
                ]
            },
            {
                titulo: 'Administracion Ingresos',
                icono: 'mdi mdi-gauge',
                submenu: [
                    { titulo: 'Crear plan', url: '/progress' },
                    { titulo: 'Ver resultados', url: '/graficas1' }
                ]
            }
        ];
    } else if (role === 'COACH_ROLE') {
        menu = [{
            titulo: 'Reservas',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Reservas', url: '/reservasCoach' }
            ]
        }];
    } else {
        menu = [{
            titulo: 'Clases y Plan',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Clases', url: '/reservasUsuarios' },
                { titulo: 'Plan', url: '/planUsuario' }
            ]
        }]
    }


    return menu;
}

module.exports = app;