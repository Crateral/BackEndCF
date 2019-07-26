var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesario'] },
    img: { type: String, required: false },
    role: { type: String, required: false, default: 'USER_ROLE' },
    fechaInscripcion: { type: String, required: [true, 'La feacha de inscripcion es necesaria'] },
    plan: { type: Schema.Types.ObjectId, ref: 'Plan' },
    estado: { type: String, required: false, default: 'ACTIVO' },
    fechaInicioPlan: { type: String, required: false },
    fechaFinPlan: { type: String, required: false },
    cedula: { type: String, required: false },
    rh: { type: String, required: false },
    fechaNacimiento: { type: String, required: false },
    telefono: { type: String, required: false },
    nombreContacto: { type: String, required: false },
    telefonoContacto: { type: String, required: false },
    direccion: { type: String, required: false },
    descuento: { type: Boolean, required: false, default: false },
    porcentajeDescuento: { type: String, required: false },
    totalValorPlan: { type: String, required: false }

});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);