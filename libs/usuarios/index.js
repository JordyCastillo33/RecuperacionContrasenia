const DaoObject = require('../../dao/mongodb/DaoObject');
const bcrypt = require('bcryptjs');
module.exports = class Usuario {
  usuarioDao = null;

  constructor(usuarioDao = null) {
    if (!(usuarioDao instanceof DaoObject)) {
      throw new Error('An Instance of DAO Object is Required');
    }
    this.usuarioDao = usuarioDao;
  }
  async init() {
    await this.usuarioDao.init();
    await this.usuarioDao.setup();
  }
  async getVersion() {
    return {
      entity: 'Usuarios',
      version: '1.0.0',
      description: 'CRUD de Usuarios'
    };
  }

  async addUsuarios({
    email,
    nombre,
    avatar,
    password,
    estado
  }) {
    const result = await this.usuarioDao.insertOne(
      {
        email,
        nombre,
        avatar,
        password: bcrypt.hashSync(password),
        estado
      }
    );
    return {
      email,
      nombre,
      avatar,
      estado,
      result
    };
  };

  async getUsuarios() {
    return this.usuarioDao.getAll();
  }

  async getUsuarioById({ codigo }) {
    return this.usuarioDao.getById({ codigo });
  }

  async getUsuarioByEmail({email}) {
    return this.usuarioDao.getByEmail({email});
  }

  async getUsuarioByToken({contraseniaTemporal}) {
    return this.usuarioDao.getByToken({contraseniaTemporal});
  }

  comparePasswords(rawPassword, dbPassword) {
    return bcrypt.compareSync(rawPassword, dbPassword);
  }

  async updateUsuario({ 
    nombre,
    avatar,
    password,
    estado,
    codigo,
    email
    }) {
    const result = await this.usuarioDao.updateOne({
      codigo,
      nombre,
      avatar,
      password: bcrypt.hashSync(password),
      estado, 
      email });
    return {
      nombre,
      avatar,
      estado,
      codigo,
      email,
      modified: result
    }
  }

  
  async updatePass({codigo,password})
  {
    const result = await this.usuarioDao.updateContra({codigo,password: bcrypt.hashSync(password)});

    return {codigo,password,modified: result}
  }

  async aggToken({codigo,contraseniaTemporal})
  {
    const result = await this.usuarioDao.aggToken({codigo,contraseniaTemporal});

    return {codigo,contraseniaTemporal,modified: result}
  }

  async deleteUsuario({ codigo }) {
    const usuarioToDelete = await this.usuarioDao.getById({ codigo });
    const result = await this.usuarioDao.deleteOne({ codigo });
    return {
      ...usuarioToDelete,
      deleted: result.changes
    };
  }
}
