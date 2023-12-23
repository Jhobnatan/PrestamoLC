const { filtro_negocio, codigo_postal, filtro_permisos, puestos, departamentos,sucursales, filtro_reclutamiento_rrhh, filtro_reclutamiento, subzonas, municipios, sector, encargados, permiso_grupo, filtro_empleados, ajuste_empleados, salida_empleado, saveInfoBancaria, updateInfoBancaria, eliminarInfoBancaria, info_bank, filtro_invitados, filtro_invitado, inert_invitado, update_invitado, filtro_responsables, responsable, detalle_cita, id_por_fecha } = require('../services/form_dataService');
const { historial, producto, nombre_empleado, nombre_ejecutivo_externo, laprovincia, elmunicipio, elsector, lacategoria, lainformacion_bancaria, tipo_afiliacion, pago_electronico } = require('../services/negocioService');
const { paginacion } = require("../config");
const controller = {};

controller.puesto = async (req, res) => {
    const { empresa } = req.params;
    // console.log(empresa)
    const puestosList = await puestos(empresa);
    // console.log(puestosList)
    res.send(puestosList);
}

controller.departamento = async (req, res) => {
    const { empresa } = req.params;
    const departamentosList = await departamentos(empresa);
    // console.log(departamentosList)
    res.send(departamentosList);
}

controller.sucursal = async (req, res) => {
    const { empresa } = req.params;
    const sucursalesList = await sucursales(empresa);
    // console.log('veo filtro =======',sucursalesList)
    res.send(sucursalesList);
}

controller.codigo_postal = async (req, res) => {
    const { id } = req.params;
    //console.log(id)

    const cod = await codigo_postal(id);
    res.send(cod);
    ///res.send('funciona editar')
}

controller.subzona = async (req, res) => {
    const { id } = req.params;
    const subzon = await subzonas(id);
    res.send(subzon);
}

controller.municipio = async (req, res) => {
    const { id } = req.params;

    const mun = await municipios(id);
    res.send(mun);
}

controller.sector = async (req, res) => {
    const { id } = req.params;
    const sectores = await sector(id);
    res.send(sectores);
}

controller.encargado = async (req, res) => {
    const { id } = req.params;
    let id_negocio = req.jhobrosoftsession.empresa;
    const encargado = await encargados(id,id_negocio);
    // console.log(encargado)
    res.send(encargado);
}

controller.ajuste_empleado = async (req, res) => {

    const { cod } = req.params;

    const ajuste_emplead = await ajuste_empleados(cod);
    // console.log(ajuste_emplead)
    res.send(ajuste_emplead);
}

controller.info_bank = async (req, res) => {
    const { id } = req.params;
    //console.log(id)

    const info = await info_bank(id);
    res.send(info);
    ///res.send('funciona editar')

}

controller.datos_salida = async (req, res) => {
    let { id } = req.params;
    //console.log(valor);
    const salida = await salida_empleado(id);
    res.send(salida);
}


controller.filtro_empleados = async (req, res) => {
    let { valor, estado, inicio} = req.params;
   
    if (valor === "aaaaaaaaaaaa") {
        valor = "";
    }

    let nunreg = paginacion;
    let nuevoinicio = (inicio - 1) * nunreg;
    let empresa = req.jhobrosoftsession.empresa;
    // console.log(empresa.empresa)/

    let data = await filtro_empleados(valor, estado, empresa, nuevoinicio, nunreg);
    let registros = await filtro_empleados(valor, estado, empresa);
    data.push({ registros });
    res.send(data);
    ///res.send('funciona editar')

}


controller.save_informacion_bancaria = async (req, res) => {
    let { banco, tipo_cuenta, frecuencia, cuenta_debito, cuenta_credito, negocio } = req.params;

    let save_sucursal = [tipo_cuenta, cuenta_debito, cuenta_credito, frecuencia, banco, negocio];
    // console.log('guardando info'+banco+tipo_cuenta+frecuencia+cuenta_debito+cuenta_credito+negocio)
    try {
        // console.log("PROCEDIENDO A GUARDAR...")
        let sucursalInserted = await saveInfoBancaria(save_sucursal)
        // console.log("GUARDADO")
        // console.log(sucursalInserted)
        res.send(sucursalInserted);
    } catch (error) {
        console.log(error)
    }
    // res.sendStatus

}

controller.update_informacion_bancaria = async (req, res) => {
    let { banco, tipo_cuenta, frecuencia, cuenta_debito, cuenta_credito, negocio, id_info } = req.params;

    let update_info = [tipo_cuenta, cuenta_debito, cuenta_credito, frecuencia, banco, negocio, id_info];
    
    try {
        let id_empleado = req.jhobrosoftsession.id_empleado;
        // console.log("PROCEDIENDO A GUARDAR...")
        let sucursalInserted = await updateInfoBancaria(update_info, id_empleado)
        // console.log("GUARDADO")
        // console.log(sucursalInserted)
        res.send(sucursalInserted);
    } catch (error) {
        console.log(error)
    }
    // res.sendStatus

}

controller.eliminar_informacion_bancaria = async (req, res) => {
    let { id, negocio } = req.params;
    
    try {
        // aqui debo verificar si solo tiene una informacion bancaria no se puede eliminar, 
        // para poder eliminar la informacion debe haber agregado la informacion nueva primero y luego eliminar la vieja
        let id_empleado = req.jhobrosoftsession.id_empleado;
        let sucursalInserted = await eliminarInfoBancaria(id, id_empleado)
        
        res.send(sucursalInserted);
    } catch (error) {
        console.log(error)
    }
    // res.sendStatus

}

controller.filtro_reclutamiento_rrhh = async (req, res) => {
    let { valor } = req.params;

    if (valor === "aaaaaaaaaaaa") {
        valor = "";
    }
    let data = await filtro_reclutamiento_rrhh(valor)
    res.send(data);

}

controller.filtro_reclutamiento = async (req, res) => {
    let { valor } = req.params;
    let id_empleado = req.jhobrosoftsession.id_empleado;
    if (valor === "aaaaaaaaaaaa") {
        valor = "";
    }

    let data = await filtro_reclutamiento(valor, id_empleado);
    res.send(data);

}

controller.filtro_permisos = async (req, res) => {
    let { valor } = req.params;
    //console.log(valor);
    if (valor === "aaaaaaaaaaaa") {
        valor = "";
    }
    let { provincia } = req.query;
    const data = req.body;
    let permisos = await filtro_permisos(valor)

    res.send(permisos);

}
controller.filtro_negocio = async (req, res) => {
    let { valor, est, inicio } = req.params;

    if (valor === "aaaaaaaaaaaa") {
        valor = "";
    }

    let nunreg = paginacion;// 10;
    let nuevoinicio = (inicio - 1) * nunreg;


    const data = req.body;
    let negocios = await filtro_negocio(valor, est, nuevoinicio, nunreg);
    let registros = await filtro_negocio(valor, est)
    negocios.push({ registros });
    // console.log(registros)
    res.send(negocios);

}
controller.detalles_cita = async (req, res) => {
    let { id } = req.params;
    // console.log(id)
    // const data = req.body;
    let detalle = await detalle_cita(id)
    // console.log(detalle)
    res.send(detalle);

}

controller.id_fecha = async (req, res) => {
    let { id, fecha } = req.params;
    // console.log(id)
    // const data = req.body;
    let detalle = await id_por_fecha(id, fecha)
    // console.log(detalle)
    res.send(detalle);

}
controller.filtro_responsables = async (req, res) => {
    let { valor } = req.params;
    // console.log("valor");
    if (valor === "aaaaaaaaaaaa") {
        valor = "";
    }
    const data = req.body;
    let responsables = await filtro_responsables(valor)

    res.send(responsables);

}

controller.historial_filtro = async (req, res) => {

    let { id, inicio, fecha_desde, fecha_hasta } = req.params;
    
    let historico = [];
    let productoss = [];

    // let inicio = 1;
    let nunreg = paginacion;// 10;
    let nuevoinicio = (inicio - 1) * nunreg;
    
    const historial_negocio = await historial(id, 'jr_negocio_general', fecha_desde, fecha_hasta, nuevoinicio, nunreg);
    
    let registros = await historial(id, 'jr_negocio_general', fecha_desde, fecha_hasta);
    
    for (let element of historial_negocio[0]) {
        // console.log(JSON.parse(element.data));
        let ng = JSON.parse(element.data)
        let el_que_edita = JSON.parse(element.id_empleado)

        let elng = ng.negocio_general;
        // console.log(elng)
        let elpro = ng.productos_negocio;
        for (let product of elpro) {
            // console.log('busco el id del producto =======>',product.id_producto)
            let pro = await producto(product.id_producto);
            // console.log('busco la descripcion del producto =======>',pro)
            productoss.push(pro[0].producto)
        }

        let crea = await nombre_empleado(elng[0].id_empleado);
        let edita = await nombre_empleado(el_que_edita);

        let t_afiliacion = await tipo_afiliacion(elng[0].id_tipo_afiliacion);

        let p_electronico = await pago_electronico(elng[0].id_pago_electronico);
        // console.log(p_electronico[0].tipo_pago_electronico)
        historico.push({
            id_negocio: id,
            id_logs: element.id_logs,
            fecha: element.fecha,
            id_empleado: element.id_empleado,
            tabla: element.tabla,
            razon_social: elng[0].razon_social,
            rnc: elng[0].rnc,
            id_empleado: elng[0].id_empleado,
            emp: crea[0].empleado,
            edita: edita[0].empleado,
            cant_sucursales: elng[0].cant_sucursales,
            red_social: elng[0].red_social,
            sap_acreedor: elng[0].sap_acreedor,
            sap_deudor: elng[0].sap_deudor,
            fecha_creacion: elng[0].fecha_creacion,
            estado: elng[0].estado,
            id_tipo_afiliacion: elng[0].id_tipo_afiliacion,
            ta: t_afiliacion[0].tipo_afiliacion,
            id_pago_electronico: elng[0].id_pago_electronico,
            pe: p_electronico[0].tipo_pago_electronico,
            productos: productoss,
            rm_vence: elng[0].rm_vence,
            proceso: elng[0].proceso,
        });
        productoss = [];

    }
    historico.push({ registros });
    //   console.log(historico)
    res.send(historico);

}

controller.historial_filtro_sucursal = async (req, res) => {

    const data = req.body;
    let { su, inicio, fecha_desde, fecha_hasta } = req.params;

    let historico = [];
    let listaAfiliado = [];

    // inicio = 1;
    let nunreg = paginacion;// 10;
    let nuevoinicio = (inicio - 1) * nunreg;

    const historial_sucursal = await historial(su, 'jr_sucursal', fecha_desde, fecha_hasta, nuevoinicio, nunreg);

    let registros = await historial(su, 'jr_sucursal', fecha_desde, fecha_hasta);

    for (let element of historial_sucursal[0]) {

        let suc = JSON.parse(element.data)
        let el_que_edita = JSON.parse(element.id_empleado)
 
        let lasu = suc.sucursal;
        let id_ejecutivo_interno = suc.vs_sucursal[0].id_empleado;
        let id_ejecutivo_banco = suc.vs_sucursal[0].id_ejecutivo;
        let id_ejecutivo_pago = suc.vs_sucursal[0].id_ejecutivo_pago;
        let responsable = suc.responsable;

        let afiliados = suc.vscarnet;

        for (let afiliado of afiliados) {
            listaAfiliado.push(afiliado.merchand_id);
        }

        let losAfiliadosCarnet = JSON.stringify(listaAfiliado)
        listaAfiliado = [];

        let crea = await nombre_empleado(lasu.id_empleado);
        let edita = await nombre_empleado(el_que_edita);
        let ejecutivointerno = await nombre_empleado(id_ejecutivo_interno);
        let ejecutivobanco = await nombre_ejecutivo_externo(id_ejecutivo_banco);
        let ejecutivopago = await nombre_ejecutivo_externo(id_ejecutivo_pago);
        let nomejcban = '';
        if (id_ejecutivo_banco != 0) {
            nomejcban = ejecutivobanco[0].nombre;
        }
        let nomejcpago = '';
        if (id_ejecutivo_banco != 0) {
            nomejcpago = ejecutivopago[0].nombre;
        }

        let provincia = await laprovincia(lasu.id_provincia);
        let municipio = await elmunicipio(lasu.id_municipio);
        let sector = await elsector(lasu.id_sector);
        let categoria = await lacategoria(lasu.id_categoria);
        let informacion_bancaria = await lainformacion_bancaria(lasu.id_informacion_bancaria);

        historico.push({
            fecha: element.fecha,
            id_sucursal: lasu.id_sucursal,
            nombre_sucursal: lasu.nombre_sucursal,
            id_empleado: lasu.id_empleado,
            creadopor: crea[0].empleado,
            id_provincia: lasu.id_provincia,
            provincia: provincia[0].provincia,
            id_municipio: lasu.id_municipio,
            municipio: municipio[0].municipio,
            id_sector: lasu.id_sector,
            sector: sector[0].sector,
            direccion: lasu.direccion,
            codigo_postal: lasu.codigo_postal,
            telefono: lasu.telefono,
            fax: lasu.fax,
            email: lasu.email,
            cantidad_lectores: lasu.cantidad_lectores,
            codigo_fidelium: lasu.codigo_fidelium,
            descuento_redencion: lasu.descuento_redencion,
            descuento_otorgado: lasu.descuento_otorgado,
            limite_piso: lasu.limite_piso,
            apertura: lasu.apertura,
            cierre: lasu.cierre,
            geo: lasu.geo,
            fecha_creacion: lasu.fecha_creacion,
            referencia1: lasu.referencia1,
            referencia2: lasu.referencia2,
            referencia3: lasu.referencia3,
            id_negocio: lasu.id_negocio,
            id_informacion_bancaria: lasu.id_informacion_bancaria,
            banco: informacion_bancaria[0].banco,
            banco_tipo_cuenta: informacion_bancaria[0].banco_tipo_cuenta,
            frecuencia_pago_cheque: informacion_bancaria[0].frecuencia_pago_cheque,
            cuenta_debito: informacion_bancaria[0].cuenta_debito,
            cuenta_credito: informacion_bancaria[0].cuenta_credito,
            id_categoria: lasu.id_categoria,
            categoria: categoria[0].categoria,
            estado: lasu.estado,
            edita: edita[0].empleado,
            ejecutivointerno: ejecutivointerno[0].empleado,
            ejecutivobanco: nomejcban,
            ejecutivopago: nomejcpago,
            responsable: responsable,
            losAfiliados: losAfiliadosCarnet,
            zona: lasu.zona,
            subzona: lasu.subzona,
        });
    }
    historico.push({ registros });
    //   console.log(historico)
    res.send(historico);

}

controller.historial_filtro_cita = async (req, res) => {

    const data = req.body;
    let { id_cita, inicio, fecha_desde, fecha_hasta } = req.params;
    
    let historico = [];
    let listaInvistadosSucursal = [];

    // inicio = 1;
    let nunreg = paginacion;// 10;
    let nuevoinicio = (inicio - 1) * nunreg;
    
    const historial_cita = await historial(id_cita, 'jr_cita', fecha_desde, fecha_hasta, nuevoinicio, nunreg);
    
    let registros = await historial(id_cita, 'jr_cita', fecha_desde, fecha_hasta);

    for (let element of historial_cita[0]) {

        let jsonCita = JSON.parse(element.data)
        let el_que_edita = JSON.parse(element.id_empleado)
        
        let lacita = jsonCita.cita[0];
        let id_ejecutivo_interno = jsonCita.invitados[0].id_ejecutivo_interno;


        let id_ejecutivo_banco = jsonCita.invitados[0].id_ejecutivo_banco;
        let id_ejecutivo_pago = jsonCita.invitados[0].id_ejecutivo_pago;

        let invitados_externo = jsonCita.invitados_externo;

        let ejecutivo_interno = await nombre_empleado(id_ejecutivo_interno);
        let nombre_ejecutivo_interno = '';
        if (id_ejecutivo_interno != 0) {
            nombre_ejecutivo_interno = ejecutivo_interno[0].empleado;
        }

        let ejecutivo_banco = await nombre_ejecutivo_externo(id_ejecutivo_banco);
        let nombre_ejecutivo_banco = '';
        if (id_ejecutivo_banco != 0) {
            nombre_ejecutivo_banco = ejecutivo_banco[0].nombre;
        }

        let ejecutivo_pago = await nombre_ejecutivo_externo(id_ejecutivo_pago);
        let nombre_ejecutivo_pago = '';
        if (id_ejecutivo_banco != 0) {
            nombre_ejecutivo_pago = ejecutivo_pago[0].nombre;
        }
        let crea = await nombre_empleado(lacita.registrada_por);
        let edita = await nombre_empleado(el_que_edita);
        historico.push({
            fecha_edicion: element.fecha,
            titulo: lacita.titulo,
            fecha: lacita.fecha,
            hora_inicio: lacita.hora_inicio,
            hora_fin: lacita.hora_fin,
            color: lacita.color,
            motivo: lacita.motivo,
            estado: lacita.estado,
            recordatorio: lacita.recordatorio,
            minuta: lacita.minuta,
            fecha_registro: lacita.fecha_registro,
            registrada_por: lacita.registrada_por,
            lugar: lacita.lugar,
            geo: lacita.geo,
            fecha: lacita.fecha,
            fecha: lacita.fecha,
            fecha: lacita.fecha,
            fecha: lacita.fecha,
            fecha: lacita.fecha,
            empresa: lacita.empresa,
            nombre_ejecutivo_interno,
            nombre_ejecutivo_banco,
            nombre_ejecutivo_pago,
            creadopor: crea[0].empleado,
            edita: edita[0].empleado,
            invitados_externo: invitados_externo
        });

    }
    historico.push({ registros });
    res.send(historico);

}

controller.el_responsable = async (req, res) => {
    let { id } = req.params;

    let responsabl = await responsable(id)
    res.send(responsabl);

}

controller.filtro_invitados = async (req, res) => {
    let { valor } = req.params;
    if (valor === "aaaaaaaaaaaa") {
        valor = "";
    }
    const data = req.body;
    let invitados = await filtro_responsables(valor)

    res.send(invitados);
}

controller.filtro_invitado = async (req, res) => {
    let { id } = req.params;
    let invitado = await responsable(id)
    res.send(invitado);
}

controller.insert_invitado = async (req, res) => {
    let { nom, car, ced, cel, cor } = req.params;
    await inert_invitado(nom, car, ced, cel, cor, 'Activo')
    res.send('Datos insertados corretamente')
}

controller.update_invitado = async (req, res) => {
    let { nom, car, ced, tel, cor, per } = req.params;
    await update_invitado(nom, car, ced, tel, cor, per)

    res.send('Datos Actualizados corretamente')

}

controller.permiso_grupo = async (req, res) => {
    let { valor } = req.params;

    const data = req.body;
    let accesos = await permiso_grupo(valor)
    res.send(accesos);
}

controller.save = (req, res) => {
    //console.log(req)
    const data = req.body;
    // console.log(data);
    //console.log('mis datos son'+data.name+"y mas nada");
    if (data.nombre_empresa != '') {
        req.getConnection((err, conn) => {  //`id_empresa`, `rnc`, `razon_social`, `nombre_empresa`, `telefono`
            conn.query('INSERT INTO `jr_empresa` set ?', [data], (err, empresa) => {
                res.redirect('/empresa');
                //res.send("funciona el insert")
            });
        })
    } else {
        res.redirect('/empresa');
    }


}

controller.edit = (req, res) => {
    const { id } = req.params;
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM `jr_empresa` WHERE id_empresa =?', [id], (err, empresa) => {
            res.render('empresa_edit', {
                data: empresa[0]
            });
        });
    })
    
}

controller.update = (req, res) => {
    const { id } = req.params;
    const newCustomer = req.body;
    
    req.getConnection((err, conn) => {
        conn.query('UPDATE `jr_empresa` SET ? WHERE id_empresa =?', [newCustomer, id], (err, rows) => {
            res.redirect('/empresa');
        })
    })
}

controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM `jr_empresa` WHERE id_empresa = ?', [id])
        res.redirect('/empresa');
    })
}

module.exports = controller;
