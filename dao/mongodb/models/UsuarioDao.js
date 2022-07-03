const { db } = require('../Connection');
const DaoObject = require('../DaoObject');
module.exports = class UsuariosDao extends DaoObject {
  constructor(db = null) {
    super(db, 'Usuarios_JordyCastillo');
  }
  async setup() {
    if (process.env.MONGODB_SETUP) {
     const indexExists = await this.collection.indexExists('email_1');
     if (!indexExists) {
      await this.collection.createIndex({email:1}, {unique:true});
     }
    }
  }

  getAll() {
    return this.find();
  }

  getById({ codigo }) {
    return this.findById(codigo);
  }

  getByEmail({ email }) {
    return this.findOne({email});
  }

  getByToken({ contraseniaTemporal }) {
    return this.findOne({contraseniaTemporal});
  }

  insertOne({ email, password, nombre, avatar, estado }) {
    const newUser = {
      email,
      password,
      nombre,
      avatar,
      estado,
      created: new Date().toISOString(),
    }
    return super.insertOne(newUser);
  }

  updateOne({ codigo, password, nombre, avatar, estado, email }) {
    const updateCommand = {
      "$set": {
        nombre,
        password,
        avatar,
        estado,
        email,
        updated: new Date().toISOString()
      }
    }
    return super.updateOne(codigo, updateCommand);
  }

  updateContra({codigo,password})
  {
    const updateCommand = {
      "$set": {
        password
      }
    }

    return super.updateOne(codigo, updateCommand);
  }

  aggToken({codigo,contraseniaTemporal})
  {
    const updateCommand = {
      "$set": {
        contraseniaTemporal
      }
    }
    return super.updateOne(codigo, updateCommand);
  }
  deleteOne({ codigo }) {
    const updateCommand = {
      "$set": {
        estado:'INA',
        updated: new Date().toISOString()
      }
    }
    return super.updateOne(codigo, updateCommand);
  }

}
