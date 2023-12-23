const { paginacion } = require("../config");
const { list,filtro_list, nuevo, save,insert_path,update_foto_path, save_contacto, update_contacto,eliminar_contacto, save_referencia, update_referencia, eliminar_referencia, save_ingreso, update_ingreso, eliminar_ingreso, edit_cliente, sector, municipios, contactos, referencias, ingresos, documentos, encargados_dep, encargados, edit_empleado, puesto_empleado, departamentos, sucursales, update, out_empleado, activar_empleado, edit_user, data_accesos, save_user, update_user, delete_user, insert_access, licencia, guardar_lic, guardar_amonestacion, recibir_correo, recibir_correo_ck, delete_recibir_correo, save_recibir_correo, } = require('../services/clienteService');

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
    // const empleados = await list(empresa)
    res.render('cliente_list', {
        // data: empleados,
        paginacion,
        empresa: req.jhobrosoftsession.empresa,
        accesos: req.jhobrosoftsession.accesos
    });
}

controller.filtro_list = async (req, res) => {
    const empresa = req.jhobrosoftsession.empresa;
    let { sucursal, cartera, estado, inicio, valor } = req.params;
    
    if (valor == "aaaaaaaaaaaa") {
        valor = "";
    }

    let nunreg = paginacion;// paginacion;
    let nuevoinicio = (inicio - 1) * nunreg

    const clientes = await filtro_list(sucursal, cartera, estado, valor, nuevoinicio, nunreg);
    let registros = await filtro_list(sucursal, cartera, estado, valor);
    
    clientes.push({ registros });
    res.send(clientes);
}

controller.new = async (req, res) => {
    console.log('a crear cliente nuevo')
    const cliente = await nuevo();
    // jhobrosoftsession
    
    // const sucursal = await sucursal(req.jhobrosoftsession.empresa);
    res.render('clientes', {
        nac: cliente[0],
        gra: cliente[1],
        graac: cliente[2],
        niv: cliente[3],
        est: cliente[4],
        rel: cliente[5],
        ocu: cliente[6],
        tcon: cliente[7],
        tingre: cliente[8],
        cartera: cliente[9],
        moneda: cliente[10],
        prov: cliente[11],
        emp: cliente[12],
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

    // const encargadosdep = await encargados_dep(id);
    // console.log(encargadosdep[0].id_departamento)
    const cliente_detalle = await nuevo();
    const cliente = await edit_cliente(id);
    
    
    const losMunicipios = await municipios(cliente[0].id_provincia);
    const losSectores = await sector(cliente[0].id_municipio);

    const losContactos = await contactos(cliente[0].id_cliente);
    const lasReferencias = await referencias(cliente[0].id_cliente);
    const losIngresos = await ingresos(cliente[0].id_cliente);
    const losDocumentos = await documentos(cliente[0].id_cliente);
    

    const sucursalesList = await sucursales(req.jhobrosoftsession.empresa);
    console.log(losIngresos)
    // const puestos = await puesto_cliente(cliente[14][0].id_negocio);

    // const departamentosList = await departamentos(cliente[14][0].id_negocio);

    // const sucursale = await sucursales(cliente[14][0].id_negocio);

    // const encergadosList = await encargados(cliente[14][0].id_puesto,cliente[14][0].id_negocio);
    // console.log(departamentosList); 

    // cliente[14][0].fecha_nacimiento = formatFecha(cliente[14][0].fecha_nacimiento);
    // cliente[14][0].fecha_entrada = formatFecha(cliente[14][0].fecha_entrada);

    // console.log(cliente[14][0])
    // console.log(cliente[14][0].id_empresa)
    res.render('cliente_edit', {
        cliente: cliente[0],
        nac: cliente_detalle[0],
        gra: cliente_detalle[1],
        graac: cliente_detalle[2],
        niv: cliente_detalle[3],
        est: cliente_detalle[4],
        rel: cliente_detalle[5],
        ocu: cliente_detalle[6],
        tcon: cliente_detalle[7],
        tingre: cliente_detalle[8],
        cartera: cliente_detalle[9],
        moneda: cliente_detalle[10],
        prov: cliente_detalle[11],
        emp: cliente_detalle[12],
        
        sec: losSectores,
        mun: losMunicipios,
        suc: sucursalesList[0],
        contact: losContactos,
        refe: lasReferencias,
        ingre: losIngresos,
        docs: losDocumentos,
        empresa: req.jhobrosoftsession.empresa,
        accesos: req.jhobrosoftsession.accesos
    });

}

// var sqlInsert = 'INSERT INTO `jr_movimiento_cliente`(`id_salida_empleado`, `id_salida`, `id_empleado`, `motivo`, `realizadopor`, `fecha`, `accion`) VALUES (null, ?, ?, ?, ?, ?,"salida")';
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
        console.log(r_correo, r_correo_ck,)

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
    console.log(recibir_correo);
    await delete_recibir_correo(id);
    await save_recibir_correo(recibir_correo, id);
    const values = [usuario, clave, id];

    if (id_usuario == '') {
        console.log('guardar usuarios')
        const insertedUser = await save_user(values);
        id_usuario = insertedUser.insertId;
    } else {
        console.log('Actualizar usuarios')
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
    console.log(empleado[11])
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
    console.log(values)
    if (data.name != '') {

        await guardar_amonestacion(values);
        res.redirect('/empleado');

    } else {
        res.redirect('/empleado');
    }


}

controller.save = async (req, res) => {

    let { nombres, apellidos, apodo, rnc, cedula, pasaporte, sexo, fecha_nacimiento, estado_civil, ndependientes, nacionalidad, provincia, municipio, sector, direccion, geo, celular, correo, contacto, tipo_contacto, grado_ac, nivel, ocupacion, nombre_persona,idrefefencia,nombre_referencia,empresa_referencia, telefono_referencia, extension, celular_referencia, correo_referencia, relacion, id_ingreso, nombre_ingreso, telefono_ingreso, actividad_economica,posicion_ocupada, tiempo_laborando, moneda, monto_ingreso, tipo_ingreso, comentario, id_empresa, sucursal, cartera, estado, foto_cliente }  = req.body;
    let registradopor = req.jhobrosoftsession.id_empleado;
    let id_cliente =0;
    if (nombres != '') {
        try {
            var values = [nombres, apellidos, apodo, rnc, cedula, pasaporte, sexo, estado_civil, grado_ac, nivel, ocupacion, comentario, fecha_nacimiento, ndependientes, registradopor, provincia, municipio, sector, direccion, geo, celular, correo, nacionalidad, id_empresa, sucursal, cartera, estado];
            const insertedCliente = await save(values)
            id_cliente = insertedCliente.insertId;
            console.log("cliente guardado")
            // reviso si hay contacto y si es asi verifico si hay mas de uno y lo guardo
            if(contacto){
                if(typeof(contacto) == 'object'){
                    for (let i = 0; i < contacto.length; i++) {
                        values = [contacto[i],tipo_contacto[i],id_cliente];
                        await save_contacto(values);
                    }
                    console.log("varios contactos guardado")
                }else{
                    values = [contacto,tipo_contacto,id_cliente];
                    await save_contacto(values);
                        console.log("un guardado")
                }
            }

            // reviso si hay referencias personales y si es asi verifico si hay mas de uno y lo guardo
            if(nombre_referencia){
                if(typeof(nombre_referencia) == 'object'){
                    console.log("ver varias referencias")
                    for (let i = 0; i < nombre_referencia.length; i++) {
                        values = [nombre_referencia[i], empresa_referencia[i],telefono_referencia[i],extension[i], celular_referencia[i],correo_referencia[i], relacion[i],id_cliente];
                        console.log("veo los values ====> "+values)
                        await save_referencia(values);
                    }
                    console.log("varias referencias guardado")
                }else{
                    values = [nombre_referencia, empresa_referencia,telefono_referencia,extension, celular_referencia,correo_referencia, relacion,id_cliente];
                    await save_referencia(values);
                    console.log("una referencia guardado")
                }
            }

            // reviso si hay ingresos  y si es asi verifico si hay mas de uno y lo guardo
            if(nombre_ingreso){
                if(typeof(nombre_ingreso) == 'object'){
                    console.log("veo varios ingresos")
                    for (let i = 0; i < nombre_ingreso.length; i++) {
                        values = [nombre_ingreso[i], telefono_ingreso[i],actividad_economica[i],posicion_ocupada[i], tiempo_laborando[i],moneda[i],monto_ingreso[i], tipo_ingreso[i],id_cliente];
                        console.log("veo los values ====> "+values)
                        await save_ingreso(values);
                    }
                    console.log("varios ingresos guardado")
                }else{
                    values = [nombre_ingreso, telefono_ingreso,actividad_economica,posicion_ocupada, tiempo_laborando,moneda,monto_ingreso, tipo_ingreso,id_cliente];
                    console.log("un ingresos")
                    await save_ingreso(values);
                    console.log("un ingreso guardado")
                }
            }
            
            res.redirect('/cliente');
        } catch (error) {
            console.log("Muestro el error" + error)
        }

    } else {
        res.redirect('/cliente');
    }


}


controller.update = async (req, res) => {
    const { id } = req.params;
    let { nombres, apellidos, apodo, rnc, cedula, pasaporte, sexo, fecha_nacimiento, estado_civil, ndependientes, nacionalidad, provincia, municipio, sector, direccion, geo, celular, correo, id_contacto, contacto, tipo_contacto, grado_ac, nivel, ocupacion, nombre_persona,idrefefencia,nombre_referencia,empresa_referencia, telefono_referencia, extension, celular_referencia, correo_referencia, relacion, id_ingreso, nombre_ingreso, telefono_ingreso, actividad_economica,posicion_ocupada, tiempo_laborando, moneda, monto_ingreso, tipo_ingreso, comentario, id_empresa, sucursal, cartera, estado, foto_cliente,id_contacto_eliminar,id_referencia_eliminar,id_ingreso_eliminar,descripcion }  = req.body;
    let registradopor = req.jhobrosoftsession.id_empleado;
    let id_cliente =0;
    if (nombres != '') {
        try {
            //`nombres`=?,`apellidos`=?,`apodo`=?,`cedula`=?,`pasaporte`=?,`sexo`=?,`estado_civil`=?,`id_grado_ac`=?,`id_nivel`=?,`id_ocupacion`=?,`comentario`=?,`fechadenacimiento`=?,`ndependientes`=?,`id_provincia`=?,`id_municipio`=?,`id_sector`=?,`direccion`=?,`referencia1`=?,`referencia2`=?,`referencia3`=?,`georeferencia`=?,`id_nacionalidad`=?,`id_empresa`=?,`id_sucursal`=?,`id_cartera`=?,`id_estado`=? WHERE `id_cliente`=?
            var values = [nombres, apellidos, apodo, rnc, cedula, pasaporte, sexo, estado_civil, grado_ac, nivel, ocupacion, comentario, fecha_nacimiento, ndependientes, provincia, municipio, sector, direccion, geo, celular, correo, nacionalidad, id_empresa, sucursal, cartera, estado, id];
            const insertedCliente = await update(values)
            id_cliente = id;

            // reviso si hay contacto y si es asi verifico si hay mas de uno y lo guardo
            if(contacto){
                if(typeof(contacto) == 'object'){
                    for (let i = 0; i < contacto.length; i++) {
                        if(id_contacto[i]=='0'){
                            values = [contacto[i],tipo_contacto[i],id_cliente];
                            await save_contacto(values);
                        }else{
                            //`contacto`=?,`idtipo_contacto`=?,`id_cliente`=? WHERE `idcontacto`=?
                            values = [contacto[i],tipo_contacto[i],id_cliente,id_contacto[i]];
                            await update_contacto(values);
                        }
                    }
                }else{
                    if(id_contacto=='0'){
                        values = [contacto,tipo_contacto,id_cliente];
                        await save_contacto(values);
                    }else{
                        //`contacto`=?,`idtipo_contacto`=?,`id_cliente`=? WHERE `idcontacto`=?
                        values = [contacto,tipo_contacto,id_cliente,id_contacto];
                        await update_contacto(values);
                    }
                }
            }

            if(id_contacto_eliminar){
                if(typeof(id_contacto_eliminar) == 'object'){
                    for (let t = 0; t < id_contacto_eliminar.length; t++) {
                        await eliminar_contacto(id_contacto_eliminar[t]);
                    }
                }else{
                    await eliminar_contacto(id_contacto_eliminar);
                }
            }

            // reviso si hay referencias personales y si es asi verifico si hay mas de uno y lo guardo
            if(nombre_referencia){
                if(typeof(nombre_referencia) == 'object'){
                    
                    for (let r = 0; r < nombre_referencia.length; r++) {
                        if(idrefefencia[r]=='0'){
                            console.log('entro al objeto a guardar')
                            values = [nombre_referencia[r], empresa_referencia[r],telefono_referencia[r],extension[r], celular_referencia[r],correo_referencia[r], relacion[r],id_cliente];
                            await save_referencia(values);
                        }else{
                            // console.log('entro al objeto a actualizar', idrefefencia[r])
                            // console.log('entro al objeto a actualizar', extension[r])
                            values = [nombre_referencia[r], empresa_referencia[r],telefono_referencia[r],extension[r], celular_referencia[r],correo_referencia[r], relacion[r],id_cliente,idrefefencia[r]];
                            console.log(values)
                            await update_referencia(values);
                        }
                    }
                }else{
                    if(idrefefencia=='0'){
                        values = [nombre_referencia, empresa_referencia,telefono_referencia,extension, celular_referencia,correo_referencia, relacion,id_cliente];
                        await save_referencia(values);
                    }else{
                        values = [nombre_referencia, empresa_referencia,telefono_referencia,extension, celular_referencia,correo_referencia, relacion,id_cliente,idrefefencia];
                        await update_referencia(values);
                    }
                    
                }
            }
            if(id_referencia_eliminar){
                if(typeof(id_referencia_eliminar) == 'object'){
                    for (let t = 0; t < id_referencia_eliminar.length; t++) {
                        await eliminar_referencia(id_referencia_eliminar[t]);
                    }
                }else{
                    await eliminar_referencia(id_referencia_eliminar);
                }
            }
            // reviso si hay ingresos  y si es asi verifico si hay mas de uno y lo guardo
            if(nombre_ingreso){
                if(typeof(nombre_ingreso) == 'object'){
                    for (let i = 0; i < nombre_ingreso.length; i++) {
                        if(id_ingreso[i]=='0'){
                            values = [nombre_ingreso[i], telefono_ingreso[i],actividad_economica[i],posicion_ocupada[i], tiempo_laborando[i],moneda[i],monto_ingreso[i], tipo_ingreso[i],id_cliente];
                            await save_ingreso(values);
                        }else{
                            values = [nombre_ingreso[i], telefono_ingreso[i],actividad_economica[i],posicion_ocupada[i], tiempo_laborando[i],moneda[i],monto_ingreso[i], tipo_ingreso[i],id_cliente,id_ingreso[i]];                            
                            await update_ingreso(values);
                        }
                    }
                }else{
                    if(id_ingreso=='0'){
                        values = [nombre_ingreso, telefono_ingreso,actividad_economica,posicion_ocupada, tiempo_laborando, moneda,monto_ingreso, tipo_ingreso,id_cliente];
                        await save_ingreso(values);
                    }else{
                        values = [nombre_ingreso, telefono_ingreso,actividad_economica,posicion_ocupada, tiempo_laborando,moneda,monto_ingreso, tipo_ingreso,id_cliente,id_ingreso];                            
                        await update_ingreso(values);
                    }
                }
            }

            if(id_ingreso_eliminar){
                if(typeof(id_ingreso_eliminar) == 'object'){
                    for (let t = 0; t < id_ingreso_eliminar.length; t++) {
                        await eliminar_ingreso(id_ingreso_eliminar[t]);
                    }
                }else{
                    await eliminar_ingreso(id_ingreso_eliminar);
                }
            }
            if(req.file){
                console.log('hago el insert de los docs del cliente')
                let path = 'cliente\\'+ req.file.filename;//req.file.path;
                //paths = paths.replace('public\$', '');
                const data_path = [descripcion,path, id];
                console.log(data_path)
                const doc = await insert_path(data_path);
                //aqui enviaria el correo
            }
            res.redirect('/cliente');
        } catch (error) {
            console.log("Muestro el error" + error)
        }

    } else {
        res.redirect('/empleado');
    }


}

controller.foto_cliente = async (req, res) => {
    const { id } = req.params;
    // let { nombres, apellidos, apodo, cedula, pasaporte, sexo, fecha_nacimiento, estado_civil, ndependientes, nacionalidad, provincia, municipio, sector, direccion, geo, referencia1, ref1, ref2, ref3, id_contacto, contacto, tipo_contacto, grado_ac, nivel, ocupacion, nombre_persona,idrefefencia,nombre_referencia,empresa_referencia, telefono_referencia, extension, celular_referencia, correo_referencia, relacion, id_ingreso, nombre_ingreso, telefono_ingreso, actividad_economica,posicion_ocupada, tiempo_laborando, moneda, monto_ingreso, tipo_ingreso, comentario, id_empresa, sucursal, cartera, estado, foto_cliente,id_contacto_eliminar,id_referencia_eliminar,id_ingreso_eliminar,descripcion }  = req.body;
    // let registradopor = req.jhobrosoftsession.id_empleado;
    // let id_cliente =0;
    console.log('guardando la foto')
    try {
        if(req.file){
            let path = 'cliente_foto\\'+ req.file.filename;//req.file.path;
            const data_path = [path, id];
            const doc = await update_foto_path(data_path);
        }
        res.redirect(`/cliente/update/${id}`);
    } catch (error) {
        console.log(error)
        res.redirect(`/cliente/update/${id}`);
    }
}

controller.edita = (req, res) => {
    const { id } = req.params;
    //console.log(id)
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM `jr_empleado` WHERE id_empleado =?', [id], (err, empleado) => {
            console.log(empleado[0])
            res.render('empleado_edit', {
                data: empleado[0],
                accesos: req.jhobrosoftsession.accesos
            });
        });
    })
}

controller.updateOLD = async (req, res) => {
    const { id } = req.params;
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

    if (data.nombre_empleado != '') {
        var values = [cedula, nombres, apellidos, usuario, codigo, tarjeta_punto, id_empresa, id_departamento, id_puesto, email_personal, fecha_nacimiento, tel, cel, sexo, estado_civil, nhijos, id_provincia, id_municipio, id_sector, direccion, email_institucional, id_estado, id_grado_ac, id_nivel, id_encargado, fecha_entrada, id_grado, id_sueldo, id_tipo_empleado, id_nacionalidad, contacto_emergencia, id_relacion, tel_emergencia, cel_emergencia, enfermedad, tipo_enfermedad, alergia, tipo_alergia, medicacion, tipo_medicamento, tarjeta_combustible, monto_combustible, monto_vehiculo, id];
        const empleados = await update(values)
        res.redirect('/empleado');
    } else {
        res.redirect('/empleado');
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
