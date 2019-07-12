var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var planSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre del plan es requerido'] },
    valor: { type: String, required: [true, 'El valor del plan es requerido'] }

}, { collection: 'planes' });

module.exports = mongoose.model('Plan', planSchema);