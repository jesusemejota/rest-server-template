
const{ Router } = require('express');
const{ check } = require('express-validator');

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
    } = require('../middlewares');

const { isValidRole, existEmail, existUserById } = require('../helpers/db-validators');

const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete } = require('../controllers/user.controller');

const router = Router();


router.get('/', usuariosGet );

router.put('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( (id) => existUserById(id)),
    check('rol').custom( (rol) => isValidRole(rol) ),
    validarCampos
],usuariosPut );

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener más de 6 caracteres').isLength(6),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( (correo) => existEmail(correo)),
    check('rol').custom( (rol) => isValidRole(rol) ), // Es equivalente a check('rol').custom( isValidRole )
    validarCampos
], usuariosPost );

router.delete('/:id', [
    validarJWT,
    // esAdminRole,                         // Tiene que ser administrador
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'), // Puede tener cualquiera de los roles que se le pasen como parametro
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( (id) => existUserById(id)),
    validarCampos
], usuariosDelete );



module.exports = router;