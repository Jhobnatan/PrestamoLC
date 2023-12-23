const controller = {};

// const config = require("../config");
const { getLogIn } = require('../services/loginService');
const { getAccess } = require('../services/loginService');


// const { conexion } = require("../config");
// const mysql = require('./mysql');

controller.view = (req, res) => {
    // console.log(req)
    req.jhobrosoftsession.error = '';
    res.render('login', {
        error: req.jhobrosoftsession.error
    });
}

controller.log = async (req, res) => {
    const { usuario } = req.body;
    const { clave } = req.body;

    const login = await getLogIn(usuario, clave)

    if (login) {
        const accesos = await getAccess(login.id_usuario, login.id_empleado)
        const user = accesos[1];
        req.jhobrosoftsession.estado = 'OK';
        req.jhobrosoftsession.id_empleado = login.id_empleado;
        req.jhobrosoftsession.id_usuario = login.id_usuario;
        req.jhobrosoftsession.clave = clave;
        req.jhobrosoftsession.nombres = user[0].nombres;
        req.jhobrosoftsession.apellido = user[0].apellidos;
        req.jhobrosoftsession.empresa = user[0].id_negocio;
        req.jhobrosoftsession.sucursal = user[0].id_sucursal;
        req.jhobrosoftsession.cartera = user[0].id_cartera;
        req.jhobrosoftsession.departamento = user[0].id_departamento;
        req.jhobrosoftsession.puesto = user[0].id_puesto;
        req.jhobrosoftsession.foto = user[0].path_foto;

        req.jhobrosoftsession.nombre_empresa = user[0].negocio;
        req.jhobrosoftsession.rnc_empresa = user[0].rnc_negocio;
        req.jhobrosoftsession.nombre_sucursal = user[0].nombre_sucursal;
        req.jhobrosoftsession.provincia_sucursal = `${user[0].provincia}, ${user[0].sector}`;
        req.jhobrosoftsession.direccion_sucursal = `${user[0].direccion}`;
        req.jhobrosoftsession.telefono_sucursal = user[0].telefono;
        req.jhobrosoftsession.email_sucursal = user[0].email;

        var arreglo = {};
        const permisos = accesos[0];
        if (permisos) {
            for (var i = 0; i < permisos.length; i++) {
                arreglo[permisos[i].acceso] = 'true'
            }
        }
        arreglo['nom'] = req.jhobrosoftsession.nombres;
        req.jhobrosoftsession.accesos = arreglo;
        req.jhobrosoftsession.error = "";
        req.jhobrosoftsession.success = "";
        res.render('dashboard', {
            accesos: req.jhobrosoftsession.accesos
        });
    } else {
        console.log('no se logeo')
        req.jhobrosoftsession.error = 'Clave o usuario incorrecto';
        res.render('login', {
            error: req.jhobrosoftsession.error
        });
    }

}




controller.logout = (req, res) => {
    req.jhobrosoftsession.estado = undefined;
    req.jhobrosoftsession.id_empleado = undefined;
    req.jhobrosoftsession.nombres = undefined;
    req.jhobrosoftsession.apellido = undefined;
    req.jhobrosoftsession.empresa = undefined;
    req.jhobrosoftsession.departamento = undefined;
    req.jhobrosoftsession.puesto = undefined;
    req.jhobrosoftsession.rol = undefined;

    req.jhobrosoftsession.nombre_empresa = undefined;
    req.jhobrosoftsession.rnc_empresa = undefined;
    req.jhobrosoftsession.nombre_sucursal = undefined;
    req.jhobrosoftsession.provincia_sucursal = undefined;
    req.jhobrosoftsession.direccion_sucursal = undefined;
    req.jhobrosoftsession.telefono_sucursal = undefined;
    req.jhobrosoftsession.email_sucursal = undefined;
    req.jhobrosoftsession.accesos = {
        "empleado": undefined,
        "licencia": undefined,
        "crear_empleado": undefined,
        "empleados_inactivos": undefined,
        "empleados_activar": undefined,
        "empresa": undefined,
        "awm": undefined,
        "afg": undefined,
        "departamento": undefined,
        "puesto": undefined,
        "permiso": undefined,
        "registrar_licencia": undefined,
        "permiso_rrhh": undefined,
        "permiso_encargado": undefined,
        "permiso_empleado": undefined,
        "amonestacion": undefined,
        "grupo_acceso": undefined,
        "otras_empresas": undefined,
        "nom": undefined,
    }
    req.jhobrosoftsession.error = "";
    req.jhobrosoftsession.success = "";
    // req.jhobrosoftsession.reset;
    res.redirect('/');
}


controller.autoriza = async (req, res) => {
    const { usuario, clave } = req.body;
console.log('entro a logearse', usuario, clave)
    const login = await getLogIn(usuario, clave)

    if (login) {
        console.log("se logeo"+login.id_empleado)
        const accesos = await getAccess(login.id_usuario, login.id_empleado)
        const user = accesos[1];

        var arreglo = {};
        const permisos = accesos[0];
        if (permisos) {
            for (var i = 0; i < permisos.length; i++) {
                arreglo[permisos[i].acceso] = 'true'
            }
        }

        arreglo['id_supervisor'] = login.id_empleado;
        arreglo['id_sucursal'] = user[0].id_sucursal;
        arreglo['id_empresa'] = user[0].id_negocio;
        // if(arreglo['supervisa_caja']){
        //     alert("supervisa")
        // }
        res.send(arreglo)

    } else {
        console.log('no se logeo')
        res.send('Clave o usuario incorrecto');

    }

}

module.exports = controller;
