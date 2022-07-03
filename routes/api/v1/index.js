const express = require('express');
const router = express.Router();

const { authorizer } = require('./middlewares/authorizer');
const { jwtAuthorizer } = require('./middlewares/jwtAuthorizer');

const securityRoutes = require('./security');
const categoriesRoutes = require('./categorias');
const cashflowRoutes = require('./cashflow');
const usuariosRoutes = require('./usuarios');

const correoRoutes = require('./nodeMailer');


router.use('/auth', authorizer, securityRoutes);

router.use('/correo', authorizer, correoRoutes);

router.use('/categories', authorizer, jwtAuthorizer , categoriesRoutes);
router.use('/usuarios', authorizer, jwtAuthorizer , usuariosRoutes);
router.use('/cashflow', authorizer, jwtAuthorizer, cashflowRoutes);

module.exports = router;
