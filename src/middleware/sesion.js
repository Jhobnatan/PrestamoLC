const { redirect } = require("express/lib/response");
const {getAccess} = require('../services/loginService');

async function checkSesion (req, res, next)  {
    // console.log('Request Status:', req.jhobrosoftsession.estado)
    if (req.jhobrosoftsession.estado != 'OK') {
        res.redirect('/');
    } else {
        if (req.jhobrosoftsession.estado == 'OK') {
            const id_usuario = req.jhobrosoftsession.id_usuario;
            const id_empleado = req.jhobrosoftsession.id_empleado;

        const accesos = await getAccess(id_usuario, id_empleado)
        const user = accesos[1];
        req.jhobrosoftsession.estado = 'OK';
                req.jhobrosoftsession.id_empleado = id_empleado;
                req.jhobrosoftsession.id_usuario = id_usuario;
                // req.jhobrosoftsession.clave = clave;
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
                req.jhobrosoftsession.provincia_sucursal =`${user[0].provincia}, ${user[0].sector}` ;
                req.jhobrosoftsession.direccion_sucursal =`${user[0].direccion}` ;
                req.jhobrosoftsession.telefono_sucursal = user[0].telefono;
                req.jhobrosoftsession.email_sucursal = user[0].email;

                var arreglo={};
                const permisos = accesos[0];
                if(permisos) {
                    for(var i =0;i < permisos.length;i++){
                        arreglo[permisos[i].acceso]='true'
                     }
                    }
                    arreglo['nom'] = req.jhobrosoftsession.nombres; 
                    req.jhobrosoftsession.accesos = arreglo;
                req.jhobrosoftsession.error = "";
                req.jhobrosoftsession.success = "";
                next();
        }
        else {
            req.jhobrosoftsession.error = 'Clave o usuario NO autorizado';
            res.render('login', {
                error: req.jhobrosoftsession.error
            });

        }

    }

}
module.exports = checkSesion;