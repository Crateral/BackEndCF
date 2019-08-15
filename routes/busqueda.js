// Requires
var express = require('express');
var Usuario = require('../models/usuario');
var Plan = require('../models/plan');
var Clase = require('../models/clase');
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

app.get('/clase/:fechaInicio/:fechaFin', (req, res, next) => {

    var promesa = buscarClasesSemanales(req.params.fechaInicio, req.params.fechaFin);

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

app.get('/clase/dia/:fechaInicio/:horaI', (req, res, next) => {

    //var fechaInicio = req.params.diaI + '/' + req.params.mesI + '/' + req.params.anioI;
    var promesa = buscarClasePorFechaYHora(req.params.fechaInicio, req.params.horaI);

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

app.get('/reserva/:fecha', (req, res, next) => {

    //var fecha = req.params.dia + '/' + req.params.mes + '/' + req.params.anio;
    var promesa = buscarReservasPorFecha(req.params.fecha);

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

app.get('/reserva/ids/:idCalse/:idUsuario', (req, res, next) => {

    //var fecha = req.params.dia + '/' + req.params.mes + '/' + req.params.anio;
    var promesa = buscarReservasPorIds(req.params.idCalse, req.params.idUsuario);

    promesa.then(data => {
        return res.status(200).json({
            ok: true,
            reserva: data
        });
    }).catch(data => {
        return res.status(400).json({
            ok: false,
            reserva: data
        });
    });

});

app.get('/reserva/usuario/:idUsuario', (req, res, next) => {

    //var fecha = req.params.dia + '/' + req.params.mes + '/' + req.params.anio;
    var promesa = buscarReservasPorUsuario(req.params.idUsuario);

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
        Usuario.find({ 'role': 'USER_ROLE' }, 'nombre email img role fechaInscripcion plan estado fechaInicioPlan fechaFinPlan cedula rh fechaNacimiento telefono nombreContacto telefonoContacto direccion descuento porcentajeDescuento totalValorPlan')
            .or([{ 'nombre': regex }, { 'estado': regex }])
            .populate('plan')
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
        Clase.find({ 'fecha': { $gte: fechaInicio, $lte: fechaFin } })
            .exec((err, clases) => {
                if (err) {
                    reject('Error al cargar clases', err);
                } else {
                    resolve(clases);
                }
            });
    });
}

function buscarClasePorFechaYHora(fechaInicio, horaInicio) {
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

    fechaFinal = new Date(fecha).toISOString();

    return new Promise((resolve, reject) => {
        Reserva.find({ fechaReserva: fechaFinal })
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

function buscarReservasPorIds(idClase, idUsuario) {

    return new Promise((resolve, reject) => {
        Reserva.find({ clase: idClase, usuario: idUsuario })
            .populate('usuario', 'nombre email telefono')
            .populate('clase')
            .exec((err, reserva) => {
                if (err) {
                    reject('Error al cargar reserva', err);
                } else {
                    resolve(reserva);
                }
            });
    });
}

function buscarReservasPorUsuario(idUsuario) {

    return new Promise((resolve, reject) => {
        Reserva.find({ 'usuario': idUsuario })
            .populate('usuario', 'nombre email telefono')
            .populate('clase')
            .exec((err, reservas) => {
                if (err) {
                    reject('Error al cargar reserva', err);
                } else {
                    resolve(reservas);
                }
            });
    });
}

module.exports = app;