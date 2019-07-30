var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reservaSchema = new Schema({

    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    clase: { type: Schema.Types.ObjectId, ref: 'Clase' },
    fechaReserva: { type: String }

}, { collection: 'reservas' });

reservaSchema.index({
    clase: 1,
    usuario: 1
}, { unique: true });


module.exports = mongoose.model('Reserva', reservaSchema);