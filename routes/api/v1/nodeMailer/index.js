
const express = require('express');
const router = express.Router();

const Correo = require("../../../../libs/nodeMailer/index")
const correo = new Correo();


const Usuario = require('../../../../libs/usuarios');
const UsuarioDao = require('../../../../dao/mongodb/models/UsuarioDao');
const userDao = new UsuarioDao();
const user = new Usuario(userDao);
user.init();


const {jwtSignNodeMailer} = require('../../../../libs/security');

router.post('/enviarCorreo', async (req, res) => {
    try {
      const {email = ''} = req.body;
      if (/^\s*$/.test(email)) {
        return res.status(400).json({
          error: 'Se espera valor de correo'
        });
      }
      const userData = await user.getUsuarioByEmail({email});
      const {password, created, contraseniaTemporal:temporal,updated,...jwtUser} = userData;

      const contraseniaTemporal = await jwtSignNodeMailer({jwtUser, generated: new Date().getTime()});


      const informacion = await correo.EnviarCorreo({email,contraseniaTemporal});

      const codigo = userData._id

      const aggtoken = await user.aggToken({codigo,contraseniaTemporal});
      //return res.status(200).json(informacion.envelope);
      return res.status(200).json(aggtoken)
    } catch(ex){
      console.error(ex);
      return res.status(502).json({error:'Error al procesar solicitud'});
    }
  });

  router.post('/modificarContrasenia', async (req, res) => {
    try {
      const {contraseniaTemporal = '', contraseniaNueva = ''} = req.body;
      if (/^\s*$/.test(contraseniaTemporal)) {
        return res.status(400).json({
          error: 'Se espera valor de contrasenia temporal'
        });
      }

      if (/^\s*$/.test(contraseniaNueva)) {
        return res.status(400).json({
          error: 'Se espera valor de contrasenia'
        });
      }

      var {jwtVerifyNodeMailer} = require('../../../../libs/security');

        try{

            const codigoUsuario = await user.getUsuarioByToken({contraseniaTemporal});

            const codigo = codigoUsuario._id
            const token= contraseniaTemporal
            const password = contraseniaNueva;
        
            const jwtInfo = await jwtVerifyNodeMailer(token);
           
            const informacion = await user.updatePass({codigo,password})
            return res.status(200).json(jwtInfo);
            
        } catch (ex) {
            console.error('jwtAuthorizer: ', {ex});
            return res.status(401).json({'error':'unauthorized'});
        }



        
    } catch(ex){
      console.error(ex);
      return res.status(502).json({error:'Error al procesar solicitud'});
    }
  });


  module.exports = router;