var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var horaSchema = new Schema({

    horaInicio: { type: String, required: [true, 'La hora de inicio es requerida'] },
    horaFin: { type: String, required: [true, 'La hora de finalizacion es requerida'] }

}, { collection: 'horas' });

module.exports = mongoose.model('Hora', horaSchema);