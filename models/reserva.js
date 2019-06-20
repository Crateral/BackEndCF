var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reservaSchema = new Schema({

    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    clase: { type: Schema.Types.ObjectId, ref: 'Clase' },
    estado: { type: String, default: 'ACTIVA' },
    fechaReserva: { type: String }

}, { collection: 'reservas' });

module.exports = mongoose.model('Reserva', reservaSchema);