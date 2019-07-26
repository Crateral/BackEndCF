var nodemailer = require('nodemailer');
var config = require('../config/config');
// email sender function
exports.sendEmail = function(req, res) {
    // Definimos el transporter
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: config.CORREO,
            pass: config.PASSWORD
        }
    });
    // Definimos el email
    var mailOptions = {
        from: config.CORREO,
        to: req,
        subject: config.ASUNTO,
        text: config.MENSAJE
    };
    // Enviamos el email
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.send(500, err.message);
        } else {
            console.log("Email sent");
            res.status(200).jsonp(req.body);
        }
    });
};