var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var planSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre del plan es requerido'] },
    descripcion: { type: String, required: [true, 'La informacion del plan es requerida'] },
    valor: { type: String, required: [true, 'El valor del plan es requerido'] }

}, { collection: 'planes' });

module.exports = mongoose.model('Plan', planSchema);