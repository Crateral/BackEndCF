// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// BodyParser
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())


// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var planRoutes = require('./routes/plan');
var claseRoutes = require('./routes/clase');
var reservaRoutes = require('./routes/reserva');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');
var horaRoutes = require('./routes/hora');

// Conexion BD
mongoose.connection.openUri('mongodb://localhost:27017/CrossfitDB', (err, res) => {
    if (err) {
        throw err;
    }

    console.log('Bade de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/plan', planRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/clase', claseRoutes);
app.use('/reserva', reservaRoutes);
app.use('/upload', uploadRoutes);
app.use('/imagenes', imagenesRoutes);
app.use('/hora', horaRoutes);
app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});