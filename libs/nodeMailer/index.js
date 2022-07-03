const nodemailer = require("nodemailer");
module.exports = class Correo {

    async EnviarCorreo({email, contraseniaTemporal})
    {

        const transporte = nodemailer.createTransport(
            {
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.correo_origen,
                    pass:process.env.correo_contrasena,
    
                },
            }
        );

        const configuracionCorreo = {
            from: process.env.correo_origen,
            to: email,
            subject:"Recuperaración de contraseña",
            text: "Su contraseña temporal es: " + contraseniaTemporal,
    
        };

        await transporte.verify( async function(error,success) {
            if(error)
            {
                console.log(error);
                return false;
            }
            else{
                console.log("Se esta enviando el correo");
            }
        });
    
        return await transporte.sendMail(configuracionCorreo);
    }

}


