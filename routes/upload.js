// Requires
var express = require('express');
var fileUpload = require('express-fileupload');
var Usuario = require('../models/usuario');
var fs = require('fs');

// Inicializar variables
var app = express();

// default options
app.use(fileUpload());

app.put('/usuarios/:id', (req, res, next) => {

    var idUsuario = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se ha seleccionado archivo',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    //Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreArchivo = archivo.name.split('.');
    var extencion = nombreArchivo[nombreArchivo.length - 1];

    //Validar extenciones
    var extencionesValidas = ['png', 'jpg', 'jpeg', 'gif', ];

    if (extencionesValidas.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extencion no valida',
            errors: { message: 'Las extenciones validas son: ' + extencionesValidas.join(', ') }
        });
    }

    //Nombre de archivo personalizado 
    var nombreArchivoNuevo = `${ idUsuario }-${new Date().getMilliseconds()}.${extencion}`;

    //Mover el archivo a un path especifico
    var path = `./uploads/usuarios/${nombreArchivoNuevo}`;
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(idUsuario, nombreArchivoNuevo, res);

    });


});

function subirPorTipo(id, nombreArchivo, response) {

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return response.status(400).json({
                ok: false,
                mensaje: 'El Usuario con el id: ' + id + ' no existe en la base de datos',
                errors: err
            });
        }

        var pathAntiguo = './uploads/usuarios/' + usuario.img;

        //Boorar la imagen anteriormente cargada
        if (fs.existsSync(pathAntiguo)) {
            fs.unlink(pathAntiguo, (err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al reemplazar la Imagen',
                        errors: err
                    });
                }
            });
        }

        usuario.img = nombreArchivo;

        usuario.save((err, usuarioActualizado) => {

            if (err) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'El Usuario con el id: ' + id + ' no existe en la base de datos',
                    errors: err
                });
            }

            usuarioActualizado.password = '.|.';

            return response.status(200).json({
                ok: true,
                mensaje: 'Imagen de usuario actualizada',
                usuario: usuarioActualizado
            });
        });

    });

}

module.exports = app;