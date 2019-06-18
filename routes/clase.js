// Requires
var express = require('express');
var Plan = require('../models/Clase');

var mdAutenticacion = require('../middlewares/autenticacion');

// Inicializar variables
var app = express();