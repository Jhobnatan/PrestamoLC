
const { estado_emp, nuevo, save, encargados_dep, encargados, edit_empleado, puesto_empleado, departamentos, sucursales, update,insert_path, update_foto_path, documentos, out_empleado, activar_empleado, edit_user, data_accesos, save_user, update_user, delete_user, insert_access, licencia, guardar_lic, guardar_amonestacion, recibir_correo, recibir_correo_ck, delete_recibir_correo, save_recibir_correo } = require('../services/empleadoService');
const { paginacion } = require("../config");
const { encargado, edit } = require("./form_dataController");
var moment = require('moment');
const controller = {};

controller.show = (req, res) => {
    res.render('empleados')
}
function formatFecha(fecha) {
    let fechavieja = new Date(fecha).toLocaleDateString();
    let nueva = fechavieja.split("/");
    if (nueva[1].length == 1) {
        nueva[1] = "0" + nueva[1];
    }
    if (nueva[0].length == 1) {
        nueva[0] = "0" + nueva[0];
    }
    fecha = nueva[2] + '-' + nueva[1] + '-' + nueva[0];
    return fecha;
}

controller.list = async (req, res) => {
    // const empresa = req.jhobrosoftsession.empresa;
    const estados = await estado_emp();
    // console.log(estados)
    res.render('empleado_list', {
        // data: empleados,
        est: estados,
        empresa: req.jhobrosoftsession.empresa,
        accesos: req.jhobrosoftsession.accesos,
        paginacion,
    });
}

controller.new = async (req, res) => {
    const empleado = await nuevo(req.jhobrosoftsession.empresa);
    const sucursale = await sucursales(req.jhobrosoftsession.empresa);
    // jhobrosoftsession
    // console.log(empleado[5])
    // const sucursal = await sucursal(req.jhobrosoftsession.empresa);
    res.render('empleados', {
        data: empleado[0],
        nac: empleado[1],
        prov: empleado[2],
        emp: empleado[3],
        dep: empleado[4],
        pue: empleado[5],
        mod: empleado[6],
        gra: empleado[7],
        suel: empleado[8],
        graac: empleado[9],
        niv: empleado[10],
        est: empleado[11],
        rel: empleado[12],
        sm: empleado[13],
        banco: empleado[14],
        suc: sucursale[0],
        empresa: req.jhobrosoftsession.empresa,
        accesos: req.jhobrosoftsession.accesos
    });

}

controller.edit = async (req, res) => {
    const { id } = req.params;
    // console.log(id)
    const data = req.body;
    // console.log(data)
    const roll = req.jhobrosoftsession.rol;

    const encargadosdep = await encargados_dep(id);
    // console.log(encargadosdep[0].id_departamento)


    const empleado = await edit_empleado(id, encargadosdep[0].id_departamento);

    const puestos = await puesto_empleado(empleado[14][0].id_negocio);

    const departamentosList = await departamentos(empleado[14][0].id_negocio);

    const sucursale = await sucursales(empleado[14][0].id_negocio);

    const encergadosList = await encargados(empleado[14][0].id_puesto,empleado[14][0].id_negocio);

    const losDocumentos = await documentos(id);
    // console.log(departamentosList);
    res.render('empleado_edit', {
        empleado: empleado[14][0],
        nac: empleado[1],
        prov: empleado[2],
        emp: empleado[3],
        dep: departamentosList[0],//empleado[4],
        pue: puestos,
        mod: empleado[6],
        gra: empleado[7],
        suel: empleado[8],
        graac: empleado[9],
        niv: empleado[10],
        est: empleado[11],
        mun: empleado[12],
        sec: empleado[13],
        enc: encergadosList,//empleado[15],
        rel: empleado[16],
        sal: empleado[17],
        sm: empleado[18],
        banco: empleado[19],
        rol: roll,
        suc: sucursale[0],
        docs: losDocumentos,
        accesos: req.jhobrosoftsession.accesos
    });

}

// var sqlInsert = 'INSERT INTO `jr_movimiento_empleado`(`id_salida_empleado`, `id_salida`, `id_empleado`, `motivo`, `realizadopor`, `fecha`, `accion`) VALUES (null, ?, ?, ?, ?, ?,"salida")';
//                     let values = [salida,id,motivo,realizadopor,fecha_salida];
controller.edit_user = async (req, res) => {
    const { id } = req.params; //SELECT `id_usuario`, `usuario`, `clave`, `id_empleado` FROM `jr_usuario` WHERE 1
    // console.log(id)
    if ("" != id) {
        const usuario = await edit_user(id);
        // console.log(usuario[0].id_usuario)
        const r_correo = await recibir_correo();
        const r_correo_ck = await recibir_correo_ck(id);
        id_usuario = 0;
        if (usuario[0]) {
            id_usuario = usuario[0].id_usuario;
        }
        let empresa = req.jhobrosoftsession.empresa;
        const datas = await data_accesos(id_usuario,empresa);
        // console.log(r_correo, r_correo_ck,)

        res.render('usuario', {
            us: usuario[0],
            ug: datas[1],
            gru: datas[0],
            rc: r_correo,
            rcck: r_correo_ck,
            emp: id,
            accesos: req.jhobrosoftsession.accesos
        });
    } else {
        res.redirect('/empleado');
    }
}

controller.save_user = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    // console.log(data)
    var { id_usuario } = req.body;
    const { usuario } = req.body;
    const { clave } = req.body;
    const { recibir_correo } = req.body;
    // console.log(recibir_correo);
    await delete_recibir_correo(id);
    await save_recibir_correo(recibir_correo, id);
    const values = [usuario, clave, id];

    if (id_usuario == '') {
        // console.log('guardar usuarios')
        const insertedUser = await save_user(values);
        id_usuario = insertedUser.insertId;
    } else {
        // console.log('Actualizar usuarios')
        const valuesUpdate = [usuario, clave, id_usuario];
        const updatedUser = await update_user(valuesUpdate);
    }

    let datos = data.grupo;

    await delete_user(id_usuario);

    if (datos != undefined) {
        if (datos.length == 1) {
            let valores = [datos, id_usuario];
            await insert_access(valores);
        } else {
            for (i = 0; i < datos.length; i++) {
                let valores = [datos[i], id_usuario];
                await insert_access(valores);
            }
        }
    }

    res.redirect('/empleado');

}

controller.licencia = async (req, res) => {
    const { id } = req.params;
    // console.log(id)
    const data = req.body;
    // console.log(data)
    const roll = req.jhobrosoftsession.rol;

    const encargadosdep = await encargados_dep(id);
    // console.log(encargadosdep[0].id_departamento)
    const empleado = await licencia(id, encargadosdep[0].id_departamento);

    // empleado[14][0].fecha_nacimiento = formatFecha(empleado[14][0].fecha_nacimiento);
    // empleado[14][0].fecha_entrada = formatFecha(empleado[14][0].fecha_entrada);
    // console.log(empleado[11])
    // console.log(empleado[14][0])
    res.render('empleado_licencia', {
        empleado: empleado[14][0],
        data: empleado[0],
        nac: empleado[1],
        prov: empleado[2],
        emp: empleado[3],
        dep: empleado[4],
        pue: empleado[5],
        mod: empleado[6],
        gra: empleado[7],
        suel: empleado[8],
        graac: empleado[9],
        niv: empleado[10],
        est: empleado[11],
        mun: empleado[12],
        sec: empleado[13],
        enc: empleado[15],
        rel: empleado[16],
        tipo_lic: empleado[17],
        rol: roll,
        accesos: req.jhobrosoftsession.accesos
    });

}

controller.guardar_lic = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    // console.log(data)
    const id_tipo_licencia = data.tipo_lic;
    const fecha_salida = data.fecha_salida;
    const fecha_entrada = data.fecha_entrada;
    const constancia = data.constancia;
    const motivo_lic = data.motivo_lic;
    const estado_lic = data.estado_lic;
    let id_rrhh = req.jhobrosoftsession.id_empleado;
    //console.log(data.fecha);
    //console.log('mis datos son'+data.name+"y mas nada");
    const values = [id, id_tipo_licencia, fecha_salida, fecha_entrada, motivo_lic, constancia, id_rrhh, estado_lic]
    // var sql ='INSERT INTO `jr_licencia`(`id_empleado`, `id_tipo_licencia`, `fecha_salida`, `fecha_entrada`, `motivo`, `constancia`, `id_rrhh`, `estado`) VALUES ( ? )';
    if (data.name != '') {

        await guardar_lic(values);
        res.redirect('/empleado');

    } else {
        res.redirect('/empleado');
    }


}
controller.amonestacion = async (req, res) => {
    const { id } = req.params;
    //console.log(id)
    const data = req.body;
    const roll = req.jhobrosoftsession.rol;

    const encargadosdep = await encargados_dep(id);
    // console.log(encargadosdep[0].id_departamento)
    const empleado = await licencia(id, encargadosdep[0].id_departamento);

    // console.log(empleado[15][0])
    res.render('empleado_amonestacion', {
        empleado: empleado[14][0],
        data: empleado[0],
        nac: empleado[1],
        prov: empleado[2],
        emp: empleado[3],
        dep: empleado[4],
        pue: empleado[5],
        mod: empleado[6],
        gra: empleado[7],
        suel: empleado[8],
        graac: empleado[9],
        niv: empleado[10],
        est: empleado[11],
        mun: empleado[12],
        sec: empleado[13],
        enc: empleado[15],
        rel: empleado[16],
        tipo_lic: empleado[17],
        rol: roll,
        accesos: req.jhobrosoftsession.accesos
    });

}

controller.guardar_amonestacion = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    // console.log(data)
    const id_autoriza = data.encargado;
    const motivo = data.motivo;
    const tipo = data.tipo;
    let id_rrhh = req.jhobrosoftsession.id_empleado;
    //console.log(data.fecha);
    let path_doc = 'amonestacion\\' + req.file.filename;//req.file.path;
    //console.log('mis datos son'+data.name+"y mas nada");
    const values = [id, tipo, id_rrhh, id_autoriza, motivo, path_doc];
    // console.log(values)
    if (data.name != '') {

        await guardar_amonestacion(values);
        res.redirect('/empleado');

    } else {
        res.redirect('/empleado');
    }


}

controller.save = async (req, res) => {
    const data = req.body;
    //console.log(data.cedula);
try {
    
    let cedula = data.cedula;
    let nombres = data.nombres;
    let apellidos = data.apellidos;
    let usuario = data.cedula;//como el usuario debe de ser unico se le puso la cedula de manera temporal
    let codigo = data.codigo;
    let tarjeta_punto = data.tarjeta_punto;
    let id_empresa = data.empresa;
    let id_departamento = data.departamento;
    let id_puesto = data.puesto;
    let email_personal = data.email_personal;
    let fecha_nacimiento = data.fecha_nacimiento;
    let tel = data.telefono;
    let cel = data.celular;
    let sexo = data.sexo;
    let estado_civil = data.estado_civil;
    let nhijos = data.nhijos;
    let id_provincia = data.provincia;
    let id_municipio = data.municipio;
    let id_sector = data.sector;
    let direccion = data.direccion;
    let email_institucional = data.email_institucional;
    let id_estado = data.estado;
    let id_grado_ac = data.grado_ac;
    let id_nivel = data.nivel;
    let id_encargado = data.encargado;
    let fecha_entrada = data.fecha_entrada;
    let id_grado = data.grado;
    let id_sueldo = data.sueldo;
    let id_tipo_empleado = data.tipo_empleado;
    let id_nacionalidad = data.nacionalidad;
    let contacto_emergencia = data.contacto;
    let id_relacion = data.relacion;
    let tel_emergencia = data.tel;
    let cel_emergencia = data.cel;
    let enfermedad = data.enfermedad;
    let tipo_enfermedad = data.tipo_enfermedad;
    let alergia = data.alergia;
    let tipo_alergia = data.tipo_alergia;
    let medicacion = data.medicacion;
    let tipo_medicamento = data.tipo_medicamento;
    let tarjeta_combustible = data.tarjeta_combustible;
    let monto_combustible = data.monto_combustible == '' ? 0 : data.monto_combustible;
    let monto_vehiculo = data.monto_vehiculo == '' ? 0 : data.monto_vehiculo;

    let flota = data.flota;
    let seguro_medico = data.seguro_medico;
    let numero_cuenta = data.numero_cuenta;
    let banco = data.banco;
    
    let descripcion = data.descripcion;
    let id_sucursal = data.sucursal;

    if (data.nombre_empleado != '') {
        var values = [cedula, nombres, apellidos, usuario, codigo, tarjeta_punto, id_empresa, id_departamento, id_puesto, email_personal, fecha_nacimiento, tel, cel, sexo, estado_civil, nhijos, id_provincia, id_municipio, id_sector, direccion, email_institucional, id_estado, id_grado_ac, id_nivel, id_encargado, fecha_entrada, id_grado, id_sueldo, id_tipo_empleado, id_nacionalidad, contacto_emergencia, id_relacion, tel_emergencia, cel_emergencia, enfermedad, tipo_enfermedad, alergia, tipo_alergia, medicacion, tipo_medicamento, tarjeta_combustible, monto_combustible, monto_vehiculo,flota,seguro_medico,numero_cuenta,banco, id_sucursal];
        const empleados = await save(values)
        res.redirect('/empleado');
    } else {
        res.redirect('/empleado');
    }
} catch (error) {
    console.log(error)
    res.redirect('/empleado');
}


}

controller.edita = (req, res) => {
    const { id } = req.params;
    //console.log(id)
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM `jr_empleado` WHERE id_empleado =?', [id], (err, empleado) => {
            // console.log(empleado[0])
            res.render('empleado_edit', {
                data: empleado[0],
                accesos: req.jhobrosoftsession.accesos
            });
        });
    })
}

controller.update = async (req, res) => {
    const { id } = req.params;
    try {
        const data = req.body;

    let cedula = data.cedula;
    let nombres = data.nombres;
    let apellidos = data.apellidos;
    let usuario = data.cedula;//como el usuario debe de ser unico se le puso la cedula de manera temporal
    let codigo = data.codigo;
    let tarjeta_punto = data.tarjeta_punto;
    let id_empresa = data.empresa;
    let id_departamento = data.departamento;
    let id_puesto = data.puesto;
    let email_personal = data.email_personal;
    let fecha_nacimiento = data.fecha_nacimiento;
    let tel = data.telefono;
    let cel = data.celular;
    let sexo = data.sexo;
    let estado_civil = data.estado_civil;
    let nhijos = data.nhijos;
    let id_provincia = data.provincia;
    let id_municipio = data.municipio;
    let id_sector = data.sector;
    let direccion = data.direccion;
    let email_institucional = data.email_institucional;
    let id_estado = data.estado;
    let id_grado_ac = data.grado_ac;
    let id_nivel = data.nivel;
    let id_encargado = data.encargado;
    let fecha_entrada = data.fecha_entrada;
    let id_grado = data.grado;
    let id_sueldo = data.sueldo;
    let id_tipo_empleado = data.tipo_empleado;
    let id_nacionalidad = data.nacionalidad;
    let contacto_emergencia = data.contacto;
    let id_relacion = data.relacion;
    let tel_emergencia = data.tel;
    let cel_emergencia = data.cel;
    let enfermedad = data.enfermedad;
    let tipo_enfermedad = data.tipo_enfermedad;
    let alergia = data.alergia;
    let tipo_alergia = data.tipo_alergia;
    let medicacion = data.medicacion;
    let tipo_medicamento = data.tipo_medicamento;
    let tarjeta_combustible = data.tarjeta_combustible;
    let monto_combustible = data.monto_combustible == '' ? 0 : data.monto_combustible;
    let monto_vehiculo = data.monto_vehiculo == '' ? 0 : data.monto_vehiculo;

    let flota = data.flota;
    let seguro_medico = data.seguro_medico;
    let numero_cuenta = data.numero_cuenta;
    let banco = data.banco;
    
    let descripcion = data.descripcion;
    let id_sucursal = data.sucursal;

    if (data.nombre_empleado != '') {
        var values = [cedula, nombres, apellidos, usuario, codigo, tarjeta_punto, id_empresa, id_departamento, id_puesto, email_personal, fecha_nacimiento, tel, cel, sexo, estado_civil, nhijos, id_provincia, id_municipio, id_sector, direccion, email_institucional, id_estado, id_grado_ac, id_nivel, id_encargado, fecha_entrada, id_grado, id_sueldo, id_tipo_empleado, id_nacionalidad, contacto_emergencia, id_relacion, tel_emergencia, cel_emergencia, enfermedad, tipo_enfermedad, alergia, tipo_alergia, medicacion, tipo_medicamento, tarjeta_combustible, monto_combustible, monto_vehiculo,flota,seguro_medico,numero_cuenta,banco, id_sucursal, id];
        const empleados = await update(values)

        if(req.file){
            // console.log('hago el insert de los docs del cliente')
            let path = 'empleado\\'+ req.file.filename;//req.file.path;
            //paths = paths.replace('public\$', '');
            const data_path = [descripcion,path, id];
            // console.log(data_path)
            const doc = await insert_path(data_path);
            //aqui enviaria el correo
        }
        res.redirect('/empleado');
    } else {
        res.redirect('/empleado');
    }
    } catch (error) {
        console.log("Error al intentar actualizar "+error)
        res.redirect('/empleado');
    }
}

controller.foto_empleado = async (req, res) => {
    const { id } = req.params;
    // let { nombres, apellidos, apodo, cedula, pasaporte, sexo, fecha_nacimiento, estado_civil, ndependientes, nacionalidad, provincia, municipio, sector, direccion, geo, referencia1, ref1, ref2, ref3, id_contacto, contacto, tipo_contacto, grado_ac, nivel, ocupacion, nombre_persona,idrefefencia,nombre_referencia,empresa_referencia, telefono_referencia, extension, celular_referencia, correo_referencia, relacion, id_ingreso, nombre_ingreso, telefono_ingreso, actividad_economica,posicion_ocupada, tiempo_laborando, moneda, monto_ingreso, tipo_ingreso, comentario, id_empresa, sucursal, cartera, estado, foto_cliente,id_contacto_eliminar,id_referencia_eliminar,id_ingreso_eliminar,descripcion }  = req.body;
    // let registradopor = req.jhobrosoftsession.id_empleado;
    // let id_cliente =0;
    // console.log('guardando la foto')
    try {
        if(req.file){
            let path = 'empleado_foto\\'+ req.file.filename;//req.file.path;
            const data_path = [path, id];
            const doc = await update_foto_path(data_path);
        }
        res.redirect(`/empleado/update/${id}`);
    } catch (error) {
        console.log(error)
        res.redirect(`/empleado/update/${id}`);
    }
}

/////////////////////////

controller.out = async (req, res) => {
    //console.log(req.jhobrosoftsession)
    const { id } = req.params;
    const data = req.body;
    let salida = data.salida;
    let motivo = data.motivo;
    let fecha_salida = data.fecha_salida;
    let realizadopor = req.jhobrosoftsession.id_empleado;

    if (data.motivo != '') {
        let values = [salida, id, motivo, realizadopor, fecha_salida, "salida"];
        const empleados = await out_empleado(values, id)

        res.redirect('/empleado');
    } else {
        res.redirect('/empleado');
    }
}

/////////////////////
controller.activar = async (req, res) => {
    //console.log(req.jhobrosoftsession)
    const { id } = req.params;
    // const data = req.body;
    let salida = 5;//data.salida; // tipo de salida
    let motivo = 'reingreso';//data.motivo;
    let fecha_salida = moment().format('YYYY-MM-DD HH:mm:ss');
    let realizadopor = req.jhobrosoftsession.id_empleado;

    if (id != '') {
        let values = [salida, id, motivo, realizadopor, fecha_salida, "reingreso"];
        const empleados = await activar_empleado(values, id)
        res.redirect('/empleado');

    } else {
        res.redirect('/empleado');
    }
}

/////////////////////

controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM `jr_empleado` WHERE id_empleado = ?', [id])
        res.redirect('/empleado');
    })
}

module.exports = controller;
