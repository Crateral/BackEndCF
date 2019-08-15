var nodemailer = require('nodemailer');
var config = require('../config/config');
// email sender function
exports.sendEmail = function(req, res) {
    // Definimos el transporter
    var transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true, //ssl
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
            res.send(500, error.message);
        } else {
            console.log("Email sent");
            res.status(200).jsonp(req.body);
        }
    });
};