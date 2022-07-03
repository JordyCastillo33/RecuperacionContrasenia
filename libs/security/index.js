const jwt = require('jsonwebtoken');
const expiresIn = parseInt(process.env.JWT_AGE_SECONDS);
const expiresInNM = parseInt(process.env.JWT_AGE_SECONDS_NM);
module.exports = { 
  jwtSign : async (payload)=>jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {expiresIn}
  ),
  jwtVerify: async (token)=>jwt.verify(token, process.env.JWT_SECRET),
  
  jwtSignNodeMailer : async (payload)=>jwt.sign(
    payload,
    process.env.JWT_SECRET_NM,
    {expiresIn : expiresInNM}
  ),

  jwtVerifyNodeMailer: async (token)=>jwt.verify(token, process.env.JWT_SECRET_NM),
}
