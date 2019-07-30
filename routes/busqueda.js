// Requires
var express = require('express');
var Usuario = require('../models/usuario');
var Plan = require('../models/plan');
var Clase = require('../models/Clase');
var Reserva = require('../models/reserva');
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

app.get('/clase/:diaI/:mesI/:anioI/:diaF/:mesF/:anioF', (req, res, next) => {

    var fechaInicio = req.params.diaI + '/' + req.params.mesI + '/' + req.params.anioI;
    var fechaFin = req.params.diaF + '/' + req.params.mesiF + '/' + req.params.anioiF;
    var promesa = buscarClasesSemanales(fechaInicio, fechaFin);

    promesa.then(data => {
        return res.status(200).json({
            ok: true,
            clases: data
        });
    }).catch(data => {
        return res.status(400).json({
            ok: false,
            clases: data
        });
    });

});

app.get('/clase/:diaI/:mesI/:anioI/:horaI', (req, res, next) => {

    var fechaInicio = req.params.diaI + '/' + req.params.mesI + '/' + req.params.anioI;
    var promesa = buscarClasesPorFechaYHora(fechaInicio, req.params.horaI);

    promesa.then(data => {
        return res.status(200).json({
            ok: true,
            clases: data
        });
    }).catch(data => {
        return res.status(400).json({
            ok: false,
            clases: data
        });
    });

});

app.get('/reserva/:dia/:mes/:anio', (req, res, next) => {


    var fecha = req.params.dia + '/' + req.params.mes + '/' + req.params.anio;
    var promesa = buscarReservasPorFecha(fecha);

    promesa.then(data => {
        return res.status(200).json({
            ok: true,
            reservas: data
        });
    }).catch(data => {
        return res.status(400).json({
            ok: false,
            reservas: data
        });
    });

});

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({ nombre: regex }, 'nombre email img role fechaInscripcion plan estado fechaInicioPlan fechaFinPlan cedula rh fechaNacimiento telefono nombreContacto telefonoContacto direccion descuento porcentajeDescuento totalValorPlan').populate('plan')
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
        Plan.find({ nombre: regex }, 'nombre valor descripcion')
            .exec((err, planes) => {
                if (err) {
                    reject('Error al cargar planes', err);
                } else {
                    resolve(planes);
                }
            });
    });
}

function buscarClasesSemanales(fechaInicio, fechaFin) {
    return new Promise((resolve, reject) => {
        Clase.find({ fecha: { $gte: fechaInicio, $lte: fechaFin } })
            .exec((err, clases) => {
                if (err) {
                    reject('Error al cargar clases', err);
                } else {
                    resolve(clases);
                }
            });
    });
}

function buscarClasesPorFechaYHora(fechaInicio, horaInicio) {
    return new Promise((resolve, reject) => {
        Clase.find({ fecha: fechaInicio, horaInicio: horaInicio })
            .exec((err, clases) => {
                if (err) {
                    reject('Error al cargar clases', err);
                } else {
                    resolve(clases);
                }
            });
    });
}

function buscarReservasPorFecha(fecha) {
    return new Promise((resolve, reject) => {
        Reserva.find({ 'fechaReserva': fecha })
            .populate('usuario', 'nombre email telefono')
            .populate('clase')
            .exec((err, reserva) => {
                if (err) {
                    reject('Error al cargar reservas', err);
                } else {
                    resolve(reserva);
                }
            });
    });
}

module.exports = app;