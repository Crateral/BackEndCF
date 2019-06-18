var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var claseSchema = new Schema({

    horaInicio: { type: String, required: [true, 'La hora de inicio es necesaria'] },
    horaFinal: { type: String, required: [true, 'La hora de finalizacion es necesaria'] },
    fecha: { type: String, required: [true, 'La fecha es necesaria'] },
    descripcion: { type: String, required: false },
    coach: { type: String, required: false },
    ubicacion: { type: String, required: false }

}, { collection: 'clases' });

module.exports = mongoose.model('Clase', claseSchema);