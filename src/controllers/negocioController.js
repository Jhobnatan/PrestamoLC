const { list, nuevo, negocio_general, save_negocio, update_negocio,actualiza_proceso_negocio, update_producto, delete_producto_negocio, save_informacion_bancaria, historial, producto, save_sucursal, sucursal_edit, update_sucursal, save_afiliado, delete_afiliado, save_persona_sucursal, update_persona_sucursal, edit, list_sucursales, list_sucursal, delete_vs_sucursales, nueva_sucursal, encargados_dep, creadopor, nombre_empleado, correo_empleado, nombre_ejecutivo_externo, laprovincia, elmunicipio, elsector, lacategoria, lainformacion_bancaria, tipo_afiliacion, pago_electronico,insert_path } = require('../services/negocioService');
const { lista_correo_comercial,lista_correo_finanza, lista_correo_crear_sucursal, lista_correo_operaciones, lista_correo_mercadeo, send_mail } = require('../services/emailService');
const { paginacion } = require("../config");

var moment = require('moment');
const controller = {};

controller.list = async (req, res) => {

    // const negocios = await list()
    res.render('negocio_list', {
        // data: negocios,
        paginacion,
        accesos: req.jhobrosoftsession.accesos
    });
}

controller.new = async (req, res) => {

    const empleado = await nuevo();
    res.render('negocio', {
        ejec: empleado[0],
        externo: empleado[1],
        ban: empleado[2],
        ta: empleado[3],
        cat: empleado[4],
        prov: empleado[5],
        pe: empleado[6],
        pago: empleado[7],
        prod_ng: empleado[8],
        prod: empleado[9],
        zon: empleado[10],
        subzon: empleado[11],
        accesos: req.jhobrosoftsession.accesos
    });

}

controller.edit = async (req, res) => {
    const { id } = req.params;
    // console.log(id)
    const data = req.body;

    const roll = req.jhobrosoftsession.rol;

    const empleado = await edit(id);
    // console.log(empleado[4]);
    // console.log(empleado[5]);
    res.render('negocio_edit', {
        ng: empleado[0][0],
        ta: empleado[1],
        cat: empleado[2],
        pe: empleado[3],
        prod_ng: empleado[4],
        prod: empleado[5],
        docs: empleado[6],
        accesos: req.jhobrosoftsession.accesos
    });

}
controller.historial = async (req, res) => {
    let { id, inicio } = req.params;
    // console.log(id)
    // const data = req.body;
    // let { inicio, fecha_desde, fecha_hasta } =req.body;

    let historico = [];
    let productoss = [];

    // inicio = 1;
    let nunreg = paginacion;// 10;
    let nuevoinicio = (inicio - 1) * nunreg;
    // console.log("La fecha desde: ",fecha_desde)
    // console.log("La fecha hasta: ",fecha_hasta)
    // let ahora = moment().format('YYYY-MM-DD HH:mm');
    // let ayer = 
    let ng_actual = await negocio_general(id)
    let fecha_desde = moment().add(-2, 'd').format('YYYY-MM-DD HH:mm');
    let fecha_hasta = moment().format('YYYY-MM-DD HH:mm');
    //  console.log("La fecha desde: ",fecha_desde)
    // console.log("La fecha hasta: ",fecha_hasta)
    // id, fecha_desde, fecha_hasta ,inicio, nunreg
    const historial_negocio = await historial(id, 'jr_negocio_general', fecha_desde, fecha_hasta, nuevoinicio, nunreg);
    // console.log(id, fecha_desde, fecha_hasta ,nuevoinicio, nunreg)
    let registros = await historial(id, 'jr_negocio_general', fecha_desde, fecha_hasta);
    // console.log('los registros son: ',registros[0][0].total)
    // console.log("PONGO TODO EN JSON ==========>",historial_negocio[0]);
    for (let element of historial_negocio[0]) {
        // console.log(JSON.parse(element.data));
        let ng = JSON.parse(element.data)
        let el_que_edita = JSON.parse(element.id_empleado)
        // for (let product of ng.productos_negocio) {
        //     console.log(product.id_producto)
        //     let pro = await producto(product.id_producto);
        //     productoss.push(JSON.stringify(pro))
        // }

        // console.log("PONGO TODO EN JSON ==========>",ng);
        ////datos del negocio

        let elng = ng.negocio_general;
        // console.log("PONGO TODO EN JSON ==========>",elng)
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

        // console.log('El datos =  === ====/..>>>>',ng.productos_negocio)

    }
    // console.log('Muestro el historico old=========>',historico);
    // console.log(productoss);
    res.render('negocio_historial', {
        historial: historico,
        fecha_desde: fecha_desde,
        fecha_hasta: fecha_hasta,
        razon_social: ng_actual[0].razon_social,
        id_negocio: ng_actual[0].id_negocio,
        reg: registros[0][0].total ? registros[0][0].total : 0,
        accesos: req.jhobrosoftsession.accesos
    });

}


controller.sucursal = async (req, res) => {
    const { id, ayer, ahora } = req.params;
    console.log(id)
    const data = req.body;

    const roll = req.jhobrosoftsession.rol;
    const empleado = await edit(id);
    // await delete_vs_sucursales(id);

    const sucursales = await list_sucursales(id);
    console.log(sucursales);
    res.render('negocio_sucursal', {
        ng: empleado[0][0],
        ta: empleado[1],
        cat: empleado[2],
        pe: empleado[3],
        prod_ng: empleado[4],
        prod: empleado[5],
        zon: empleado[6],
        subzon: empleado[7],
        su: sucursales,
        ayer,
        ahora,
        accesos: req.jhobrosoftsession.accesos
    });

}

controller.sucursal_new = async (req, res) => {

    const { id } = req.params;

    const empleado = await nueva_sucursal(id);
    res.render('negocio_sucursal_new', {
        ejec: empleado[0],
        externo: empleado[1],
        ban: empleado[2],
        ta: empleado[3],
        cat: empleado[4],
        prov: empleado[5],
        pe: empleado[6],
        pago: empleado[7],
        ng: empleado[8][0],
        ib: empleado[9],
        prod_ng: empleado[10],
        prod: empleado[11],
        zon: empleado[12],
        subzon: empleado[13],
        accesos: req.jhobrosoftsession.accesos
    });

}
controller.sucursal_save = async (req, res) => {
    const { id } = req.params; //id_negocio

    const data = req.body;
    // console.log(req.body);
    // console.log(radio_info_bank);
    // const { afiliado, nombre_persona, cargo, cedula, tel_persona, email_persona } = req.body;
    let { radio_info_bank, afiliado, nombre_persona, cargo, cedula, tel_persona, email_persona, fecha, razon_social, rnc, cant_sucursales, red_social, ejecutivointerno, externo, ejecutivo_pago, banco, tipo_cuenta, cuenta_debito, cuenta_credito, frecuencia, sap_acreedor, sap_deudor, tipo_afiliacion, nombre_sucursal, apertura, cierre, categoria, provincia, municipio, sector, direccion, codigo_postal, referencia1, referencia2, referencia3, geo, tel_sucursal, fax_sucursal, email_sucursal, codigo_fidelium, cantidad_lectores, descuento_reduccion, descuento_otorgado, limite_piso, pago_electronico, zona, subzona } = req.body;

    const arrays = [afiliado, nombre_persona, cargo, cedula, tel_persona, email_persona]; //afiliado carnet y personas del negocio 

    let id_empleado = req.jhobrosoftsession.id_empleado;

    const estado = 'Prospecto';
    //INSERT INTO `razon_social`, `rnc`, `id_empleado`, `cant_sucursales`, `red_social`, `sap_acreedor`, `sap_deudor`, `fecha_creacion`, `estado`, `id_tipo_afiliacion`, `id_pago_electronico`) 
    var negocio = [razon_social, rnc, id_empleado, cant_sucursales, red_social, sap_acreedor, sap_deudor, estado, tipo_afiliacion, pago_electronico];
    // console.log('manda'+radio_info_bank);

    if (data.nombre_persona != '') {

        //
        // const empleados = await save(arrays, negocio, sucursal,ejecutivointerno, externo)
        const negocioId = id;


        // var info_bancaria = [tipo_cuenta, cuenta_debito, cuenta_credito, frecuencia, banco, negocioId];
        // const infoId = await save_informacion_bancaria(info_bancaria)
        if (cantidad_lectores == "") {
            cantidad_lectores = 0;
        }
        if (descuento_reduccion == "") {
            descuento_reduccion = 0;
        }
        if (descuento_otorgado == "") {
            descuento_otorgado = 0;
        }
        if (limite_piso == "") {
            limite_piso = 0;
        }

        const estad = 'Sin Transaccion';
        var sucursal = [nombre_sucursal, id_empleado, provincia, municipio, sector, direccion, codigo_postal, tel_sucursal, fax_sucursal, email_sucursal, cantidad_lectores, codigo_fidelium, descuento_reduccion, descuento_otorgado, limite_piso, apertura, cierre, geo, referencia1, referencia2, referencia3, negocioId, radio_info_bank, categoria, estad, zona, subzona];

        //`nombre_sucursal`, `id_empleado`, `id_provincia`, `id_municipio`, `id_sector`, `direccion`, `codigo_postal`, `telefono`, `fax`, `email`, `cantidad_lectores`, `codigo_fidelium`, `descuento_redencion`, `descuento_otorgado`, `limite_piso`, `apertura`, `cierre`, `geo`, `referencia1`, `referencia2`, `referencia3`, `id_negocio`, `estado`) 
        const sucursalId = await save_sucursal(sucursal)

        const lista_crear_sucursal = await lista_correo_crear_sucursal();
        // console.log(lista_crear_sucursal[0].email_institucional)
        if (typeof lista_crear_sucursal != "object") {
            send_mail(lista_crear_sucursal.email_institucional, `Nueva sucursal creada por ${req.jhobrosoftsession.nombres + ' ' + req.jhobrosoftsession.apellido}`, `Negocio: <strong>${razon_social}</strong>`, `<br><br><strong><strong> ${req.jhobrosoftsession.nombres + ' ' + req.jhobrosoftsession.apellido}</strong> acaba de crear la sucursal: <strong>${nombre_sucursal}</strong> del negocio: <strong>${razon_social}</strong>.</strong> `,);
        } else {
            for (let i = 0; i < lista_crear_sucursal.length; i++) { //inserto el id afiliado  let id_rrhh = req.jhobrosoftsession.id_empleado;
                send_mail(lista_crear_sucursal[i].email_institucional, `Nueva sucursal creada por ${req.jhobrosoftsession.nombres + ' ' + req.jhobrosoftsession.apellido}`, `Negocio: <strong>${razon_social}</strong>`, `<br><br><strong><strong> ${req.jhobrosoftsession.nombres + ' ' + req.jhobrosoftsession.apellido}</strong> acaba de crear la sucursal: <strong>${nombre_sucursal}</strong> del negocio: <strong>${razon_social}</strong>.</strong> `,);
            }
        }
        await save_afiliado(sucursalId, arrays)

        await save_persona_sucursal(sucursalId, arrays, ejecutivointerno, externo, ejecutivo_pago)


        res.redirect('/negocio');

    } else {
        res.redirect('/negocio');
    }


}


controller.sucursal_edit = async (req, res) => {

    const { id, su, ayer, ahora } = req.params;

    const empleado = await sucursal_edit(id, su);
    console.log(empleado[10][0])
    // console.log(empleado[15])
    // suc.id_subzona
    res.render('negocio_sucursal_edit', {
        ejec: empleado[0],
        externo: empleado[1],
        ban: empleado[2],
        ta: empleado[3],
        cat: empleado[4],
        prov: empleado[5],
        pe: empleado[6],
        pago: empleado[7],
        ng: empleado[8][0],
        ib: empleado[9],
        suc: empleado[10][0],
        mun: empleado[11],
        sec: empleado[12],
        vscarnet: empleado[13],
        vssucursal: empleado[14],
        resp: empleado[15],
        prod_ng: empleado[16],
        prod: empleado[17],
        zon: empleado[18],
        subzon: empleado[19],
        ayer,
        ahora,
        accesos: req.jhobrosoftsession.accesos
    });

}

controller.sucursal_update = async (req, res) => {

    const { id, su, ayer, ahora } = req.params; //id_negocio
    // console.log(id, su)
    const data = req.body;

    // console.log(radio_info_bank);
    // const { afiliado, nombre_persona, cargo, cedula, tel_persona, email_persona } = req.body;
    let { radio_info_bank, afiliado, persona, nombre_persona, cargo, cedula, tel_persona, email_persona, fecha, razon_social, rnc, cant_sucursales, red_social, ejecutivointerno, externo, ejecutivo_pago, banco, tipo_cuenta, cuenta_debito, cuenta_credito, frecuencia, sap_acreedor, sap_deudor, tipo_afiliacion, nombre_sucursal, apertura, cierre, categoria, provincia, municipio, sector, direccion, codigo_postal, referencia1, referencia2, referencia3, geo, tel_sucursal, fax_sucursal, email_sucursal, codigo_fidelium, cantidad_lectores, descuento_reduccion, descuento_otorgado, limite_piso, pago_electronico, zona, subzona } = req.body;

    const arrays = [afiliado, nombre_persona, cargo, cedula, tel_persona, email_persona, persona]; //afiliado carnet y personas del negocio  

    let id_empleado = req.jhobrosoftsession.id_empleado;
    // const historial = await sucursal_edit(id,su); 
    if (radio_info_bank == null) {
        radio_info_bank = 0;
    }
    if (data.nombre_persona != '') {

        //
        // const empleados = await save(arrays, negocio, sucursal,ejecutivointerno, externo)
        const negocioId = id;


        // var info_bancaria = [tipo_cuenta, cuenta_debito, cuenta_credito, frecuencia, banco, negocioId];
        // const infoId = await save_informacion_bancaria(info_bancaria)

        const estad = 'Sin Transaccion';

        var sucursal = [nombre_sucursal, provincia, municipio, sector, direccion, codigo_postal, tel_sucursal, fax_sucursal, email_sucursal, cantidad_lectores, codigo_fidelium, descuento_reduccion, descuento_otorgado, limite_piso, apertura, cierre, geo, referencia1, referencia2, referencia3, negocioId, radio_info_bank, categoria, estad, zona, subzona, su];

        //`nombre_sucursal`, `id_empleado`, `id_provincia`, `id_municipio`, `id_sector`, `direccion`, `codigo_postal`, `telefono`, `fax`, `email`, `cantidad_lectores`, `codigo_fidelium`, `descuento_redencion`, `descuento_otorgado`, `limite_piso`, `apertura`, `cierre`, `geo`, `referencia1`, `referencia2`, `referencia3`, `id_negocio`, `estado`) 

        try {
            const lasucursal = await list_sucursal(su);
            // console.log(lasucursal)
            /////////////////////////////////////////////////////////////////////////////////////
            let codigo_fidelium_actual = lasucursal[0].codigo_fidelium;
            // console.log('el codigo Actual es ///========>', codigo_fidelium_actual)
            // console.log('el codigo Fidelium es ///========>', codigo_fidelium)

            if ((codigo_fidelium_actual == '') && (codigo_fidelium_actual != codigo_fidelium)) {
                let valores = ['Mercadeo',id]
                await actualiza_proceso_negocio(valores);
                const creado_por = await creadopor(id);
                const lista_mercadeo = await lista_correo_mercadeo();
                
                if (typeof lista_mercadeo != "object") {
                    send_mail(lista_mercadeo.email_institucional, `Fidelium Negocio`, `Notificación de nuevo negocio. `, `<strong>${creado_por[0].registradopor}</strong> ha creado un nuevo negocio. <br><br> Negocio: <strong>${razon_social}</strong>, <br>Sucursal: <strong>${nombre_sucursal}</strong>.<br> Código fidelium: <strong>${codigo_fidelium}</strong>.`,);
                } else {
                    for (let i = 0; i < lista_mercadeo.length; i++) { //inserto el id afiliado
                        send_mail(lista_mercadeo[i].email_institucional, `Fidelium Negocio`, `Notificación de nuevo negocio. `, `<strong>${creado_por[0].registradopor}</strong> ha creado un nuevo negocio. <br><br> Negocio: <strong>${razon_social}</strong>, <br>Sucursal: <strong>${nombre_sucursal}</strong>.<br> Código fidelium: <strong>${codigo_fidelium}</strong>.`,);
                    }
                }
            }
            if (codigo_fidelium_actual != '' && codigo_fidelium_actual != codigo_fidelium) {
                let valoress = ['Mercadeo',id]
                await actualiza_proceso_negocio(valoress);

                const creado_por = await creadopor(id);
                const lista_mercadeo = await lista_correo_mercadeo();
                // console.log(lista_mercadeo[0].email_institucional)
                if (typeof lista_mercadeo != "object") {
                    send_mail(lista_mercadeo.email_institucional, `Fidelium Negocio`, `Notificación de cambio de código fidelium en negocio. `, `Se ha realizado un cambio del código <strong>${codigo_fidelium_actual}</strong> al código <strong>${codigo_fidelium}</strong>.<br><br> Negocio: <strong>${razon_social}</strong>. <br> sucursal: <strong>${nombre_sucursal}</strong>. `,);
                } else {
                    for (let i = 0; i < lista_mercadeo.length; i++) { //inserto el id afiliado
                        send_mail(lista_mercadeo[i].email_institucional, `Fidelium Negocio`, `Notificación de cambio de código fidelium en negocio. `, `Se ha realizado un cambio del código <strong>${codigo_fidelium_actual}</strong> al código <strong>${codigo_fidelium}</strong>.<br><br> Negocio: <strong>${razon_social}</strong>. <br> sucursal: <strong>${nombre_sucursal}</strong>. `,);
                    }
                }
            }
            /////////////////////////////////////////////////////////////////////////////////////

            // console.log('elimino las sucursales')
            await update_sucursal(sucursal, id_empleado)
            await delete_vs_sucursales(su)
            // console.log('actualizo las sucursales')
            await delete_afiliado(su)

            await save_afiliado(su, arrays)

            let ressult = await update_persona_sucursal(su, arrays, ejecutivointerno, externo, ejecutivo_pago)
            console.log(ressult)
            console.log('actualizo el versus y las personas')
            await res.redirect(`/negocio/sucursal/${id}`);
        } catch (error) {
            console.log(error);
        }

    } else {
        res.redirect(`/negocio/sucursal/${id}`);
    }


}


controller.sucursal_historial = async (req, res) => {

    // const { id,su } =req.params; //id_negocio
    // console.log(su)
    const data = req.body;
    let { id, su, inicio, razon_social } = req.params;
    // console.log(id)
    // const data = req.body;
    // let { inicio, fecha_desde, fecha_hasta } =req.body;

    let historico = [];
    let listaAfiliado = [];

    // inicio = 1;
    let nunreg = paginacion;// 10;
    let nuevoinicio = (inicio - 1) * nunreg;
    // console.log("La fecha desde: ",fecha_desde)
    // console.log("La fecha hasta: ",fecha_hasta)
    let fecha_desde = moment().add(-1, 'd').format('YYYY-MM-DD HH:mm');
    let fecha_hasta = moment().format('YYYY-MM-DD HH:mm');
    //  console.log("La fecha desde: ",fecha_desde)
    // console.log("La fecha hasta: ",fecha_hasta)
    // id, fecha_desde, fecha_hasta ,inicio, nunreg
    let suc_actual = await list_sucursal(su)

    const historial_sucursal = await historial(su, 'jr_sucursal', fecha_desde, fecha_hasta, nuevoinicio, nunreg);
    // console.log(id, fecha_desde, fecha_hasta ,nuevoinicio, nunreg)

    // console.log(historial_sucursal)
    let registros = await historial(su, 'jr_sucursal', fecha_desde, fecha_hasta);
    // console.log('los registros son: ', registros[0][0].total)
    // console.log('datos ===========>: ', historial_sucursal)
    // console.log("PONGO TODO EN JSON ==========>",JSON.parse(historial_sucursal[0]));
    for (let element of historial_sucursal[0]) {
        // console.log("ELEMENTO ACTUAL ==========>",element);
        // console.log('datos EL QUE EDITA ===========>: ',element.id_empleado);
        let suc = JSON.parse(element.data)
        let el_que_edita = JSON.parse(element.id_empleado)
        // for (let product of ng.productos_negocio) {
        //     console.log(product.id_producto)
        //     let pro = await producto(product.id_producto);
        //     productoss.push(JSON.stringify(pro))
        // }


        ////datos del negocio

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
        // console.log(losAfiliadosCarnet);
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
        if (id_ejecutivo_pago != 0) {
            nomejcpago = ejecutivopago[0].nombre;
        }
        //  console.log('Veo el ejecutivo banco =================>', ejecutivobanco[0].nombre)
        // console.log('Veo el ejecutivo pago =================>', ejecutivopago[0].nombre)

        let provincia = await laprovincia(lasu.id_provincia);
        let municipio = await elmunicipio(lasu.id_municipio);
        let sector = await elsector(lasu.id_sector);
        let categoria = await lacategoria(lasu.id_categoria);
        let informacion_bancaria = await lainformacion_bancaria(lasu.id_informacion_bancaria);

        // let t_afiliacion = await tipo_afiliacion(elng[0].id_tipo_afiliacion);

        // let p_electronico = await pago_electronico(elng[0].id_pago_electronico);
        // console.log(p_electronico[0].tipo_pago_electronico)
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
            id_informacion_bancaria: informacion_bancaria != '' ? lasu.id_informacion_bancaria : '',
            banco: informacion_bancaria != '' ? informacion_bancaria[0].banco : '',
            banco_tipo_cuenta: informacion_bancaria != '' ? informacion_bancaria[0].banco_tipo_cuenta : '',
            frecuencia_pago_cheque: informacion_bancaria != '' ? informacion_bancaria[0].frecuencia_pago_cheque : '',
            cuenta_debito: informacion_bancaria != '' ? informacion_bancaria[0].cuenta_debito : '',
            cuenta_credito: informacion_bancaria != '' ? informacion_bancaria[0].cuenta_credito : '',
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

        // console.log('El datos =  === ====/..>>>>',ng.productos_negocio)

    }
    // console.log('El historico ===========================================>',historico);
    // console.log(productoss);
    res.render('negocio_sucursal_historial', {
        historial: historico,
        fecha_desde: fecha_desde,
        fecha_hasta: fecha_hasta,
        razon_social: razon_social,
        nombre_sucursal: suc_actual[0].nombre_sucursal,
        id_sucursal: suc_actual[0].id_sucursal,
        reg: registros[0][0].total ? registros[0][0].total : 0,
        accesos: req.jhobrosoftsession.accesos
    });
}

controller.save = async (req, res) => {
    const data = req.body;
    // console.log(data);
    // const { afiliado, nombre_persona, cargo, cedula, tel_persona, email_persona } = req.body;
    let { afiliado, nombre_persona, cargo, cedula, tel_persona, email_persona, fecha, razon_social, rnc, cant_sucursales, red_social, ejecutivointerno, externo, ejecutivo_pago, banco, tipo_cuenta, cuenta_debito, cuenta_credito, frecuencia, sap_acreedor, sap_deudor, tipo_afiliacion, nombre_sucursal, apertura, cierre, categoria, provincia, municipio, sector, direccion, codigo_postal, referencia1, referencia2, referencia3, geo, tel_sucursal, fax_sucursal, email_sucursal, codigo_fidelium, cantidad_lectores, descuento_reduccion, descuento_otorgado, limite_piso, pago_electronico, producto, zona, subzona,fecha_vencimiento_rm } = req.body;

    const arrays = [afiliado, nombre_persona, cargo, cedula, tel_persona, email_persona]; //afiliado carnet y personas del negocio 

    let id_empleado = req.jhobrosoftsession.id_empleado;

    const estado = 'Prospecto';
    const proceso = "Ejecutivo"
    //INSERT INTO `razon_social`, `rnc`, `id_empleado`, `cant_sucursales`, `red_social`, `sap_acreedor`, `sap_deudor`, `fecha_creacion`, `estado`, `id_tipo_afiliacion`, `id_pago_electronico`) 
    var negocio = [razon_social, rnc, id_empleado, cant_sucursales, red_social, sap_acreedor, sap_deudor, estado, tipo_afiliacion, pago_electronico,fecha_vencimiento_rm,proceso];

    if (data.nombre_persona != '') {

        //
        // const empleados = await save(arrays, negocio, sucursal,ejecutivointerno, externo)
        const negocioId = await save_negocio(negocio)


        var info_bancaria = [tipo_cuenta, cuenta_debito, cuenta_credito, frecuencia, banco, negocioId];
        let infoId = 0;
        if (banco != "") {
            infoId = await save_informacion_bancaria(info_bancaria)
        }

        if (cantidad_lectores == "") {
            cantidad_lectores = 0;
        }
        if (descuento_reduccion == "") {
            descuento_reduccion = 0;
        }
        if (descuento_otorgado == "") {
            descuento_otorgado = 0;
        }
        if (limite_piso == "") {
            limite_piso = 0;
        }

        const estad = 'Sin Transaccion';
        var sucursal = [nombre_sucursal, id_empleado, provincia, municipio, sector, direccion, codigo_postal, tel_sucursal, fax_sucursal, email_sucursal, cantidad_lectores, codigo_fidelium, descuento_reduccion, descuento_otorgado, limite_piso, apertura, cierre, geo, referencia1, referencia2, referencia3, negocioId, infoId, categoria, estad, zona, subzona];

        const sucursalId = await save_sucursal(sucursal)
        // console.log('sucursal id: ', sucursalId)
        await save_afiliado(sucursalId, arrays)

        await save_persona_sucursal(sucursalId, arrays, ejecutivointerno, externo, ejecutivo_pago)
        await update_producto(negocioId, producto);
        const lista_crear_sucursal = await lista_correo_crear_sucursal();
        if (typeof lista_crear_sucursal != "object") {
        var sucursal = [nombre_sucursal, id_empleado, provincia, municipio, sector, direccion, codigo_postal, tel_sucursal, fax_sucursal, email_sucursal, cantidad_lectores, codigo_fidelium, descuento_reduccion, descuento_otorgado, limite_piso, apertura, cierre, geo, referencia1, referencia2, referencia3, negocioId, infoId, categoria, estad, zona, subzona];
            send_mail(lista_crear_sucursal.email_institucional, `Nueva sucursal creada por ${req.jhobrosoftsession.nombres + ' ' + req.jhobrosoftsession.apellido} `, `Negocio: ${razon_social}`, `Sucursal ${nombre_sucursal} creada con exito, verificar que los datos sean correctos`,);
        } else {
            // console.log(lista_crear_sucursal[0].email_institucional)
            for (let i = 0; i < lista_crear_sucursal.length; i++) { //inserto el id afiliado  let id_rrhh = req.jhobrosoftsession.id_empleado;
                send_mail(lista_crear_sucursal[i].email_institucional, `Nueva sucursal creada por ${req.jhobrosoftsession.nombres + ' ' + req.jhobrosoftsession.apellido} `, `Negocio: ${razon_social}`, `Sucursal ${nombre_sucursal} creada con exito, verificar que los datos sean correctos`,);
            }
        }

        res.redirect('/negocio');

    } else {
        res.redirect('/negocio');
    }


}

controller.edita = (req, res) => {
    const { id } = req.params;
    //console.log(id)
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM `jr_empleado` WHERE id_empleado =?', [id], (err, empleado) => {
            res.render('empleado_edit', {
                data: empleado[0],
                accesos: req.jhobrosoftsession.accesos
            });
        });
    })
}

controller.update = async (req, res) => {
    // console.log(req.body)
    let id_empleado = req.jhobrosoftsession.id_empleado;
    const { id } = req.params;

    var { razon_social, rnc, cant_sucursales, red_social, tipo_cuenta, cuenta_debito, cuenta_credito, frecuencia, sap_acreedor, sap_deudor, estado, tipo_afiliacion, banco, pago_electronico, producto, descripcion,fecha_vencimiento_rm, proceso, motivo_rechazo,revisado,aprobar,rechazar } = req.body;
    const neg_gral = await negocio_general(id);
    // console.log("Negocio general ===========",neg_gral[0].id_empleado)
    
    if(estado == 'Afiliado'){
        
    if(proceso == 'Ejecutivo'){
        
            proceso = 'Comercial';
            const lista_comercial = await lista_correo_comercial();
            // console.log(lista_comercial[0].email_institucional)
            if (typeof lista_comercial != "object") {
                await send_mail(lista_comercial.email_institucional, `Nuevo negocio afiliado`, `Negocio: ${razon_social}`, 'Favor revisar que todos los datos esten correctos para aprobar',);
            } else {
                for (let i = 0; i < lista_comercial.length; i++) { //inserto el id afiliado
                    await send_mail(lista_comercial[i].email_institucional, `Nuevo negocio afiliado`, `Negocio: ${razon_social}`, 'Favor revisar que todos los datos esten correctos para aprobar',);
                }
            }

        
    }else if(proceso == 'En revisión'){
        
        if(revisado =='true'){
            
            proceso = 'Comercial'
            
            const lista_comercial = await lista_correo_comercial();
            console.log(lista_comercial[0].email_institucional)
            if (typeof lista_comercial != "object") {
                send_mail(lista_comercial.email_institucional, `Negocio afiliado revisado`, `Negocio: ${razon_social}`, 'Favor revisar que todos los datos esten correctos para aprobar',);
            } else {
                for (let i = 0; i < lista_comercial.length; i++) { //inserto el id afiliado
                    send_mail(lista_comercial[i].email_institucional, `Negocio afiliado revisado`, `Negocio: ${razon_social}`, 'Favor revisar que todos los datos esten correctos para aprobar',);
                }
            }

        }
    }else if(proceso == 'Comercial'){
        if(aprobar== 'true'){
            
            proceso = 'Finanzas';
            // console.log('proceso actual ========> ', proceso)
            const lista_finanza = await lista_correo_finanza();
            // console.log(lista_finanza[0].email_institucional)
            if (typeof lista_finanza != "object") {
                send_mail(lista_finanza.email_institucional, `Negocio ${razon_social} afiliado`, `Completar requerimiento a la brevedad`, 'Favor agregar la cuenta Sap acreedor y Sap Deudor',);
            } else {
                for (let i = 0; i < lista_finanza.length; i++) { //inserto el id afiliado
                    send_mail(lista_finanza[i].email_institucional, `Negocio ${razon_social} afiliado`, `Completar requerimiento a la brevedad`, 'Favor agregar la cuenta Sap acreedor y Sap Deudor',);
                }
            }
        }else if(rechazar == 'true'){
            proceso = 'En revisión';
            // buscar el correo del ejecutivo asignado para enviarle el correo
            const email_empleado = await correo_empleado(neg_gral[0].id_empleado);
            send_mail(email_empleado[0].email_institucional, `Solicitud de revisión`, `Negocio: ${razon_social}`,`Favor revisar ${motivo_rechazo}`,);
            
        }
    }else if(proceso == 'Finanzas'){
        if(aprobar == 'true'){
            proceso = 'Operaciones';
            const lista_operaciones = await lista_correo_operaciones();
            let mensaje = `Negocio: <strong>${razon_social} </strong> <br><br>`;
            mensaje += `La cuenta Sap acreedor: <strong>${sap_acreedor} </strong> y Sap deudor: <strong>${sap_deudor} </strong>, agregadas con exito.`
            if (typeof lista_operaciones != "object") {
                send_mail(lista_operaciones.email_institucional, `Cuentas Sap del negocio ${razon_social} agregadas con exito`, `Reporte de cambio`, mensaje,);
            } else {
                for (let i = 0; i < lista_operaciones.length; i++) { //inserto el id afiliado
                    send_mail(lista_operaciones[i].email_institucional, `Cuentas Sap del negocio ${razon_social} agregadas con exito`, `Reporte de cambio`, mensaje,);
                }
            }
        }else if(rechazar == 'true'){
            proceso = 'Comercial';
            const lista_comercial = await lista_correo_comercial();
            // console.log(lista_comercial[0].email_institucional)
            if (typeof lista_comercial != "object") {
                send_mail(lista_comercial.email_institucional, `Negocio afiliado incompleto`, `Negocio: ${razon_social}`,`Favor revisar ${motivo_rechazo}`,);
            } else {
                for (let i = 0; i < lista_comercial.length; i++) { //inserto el id afiliado
                    send_mail(lista_comercial[i].email_institucional, `Negocio afiliado incompleto`, `Negocio: ${razon_social}`,`Favor revisar ${motivo_rechazo}`,);
                }
            }
        }
    }
}
// console.log('veo mis procesos ===========> ', proceso)
    // else if(proceso == 'Operaciones'){
    //     if(revisado){
    //         proceso == 'Mercadeo'
            
    //     }
    // }
    var negocio = [razon_social, rnc, cant_sucursales, red_social, sap_acreedor, sap_deudor, estado, tipo_afiliacion, pago_electronico,fecha_vencimiento_rm, proceso, id];
    // console.log('impresion ========>', negocio)
    if (razon_social != '') {
        // const empleados = await save(arrays, negocio, sucursal,ejecutivointerno, externo)
        
        const negocioId = await update_negocio(negocio, id_empleado)
        // console.log('impresion ========>', req)
        if(req.file){
            // console.log('hago el insert de los docs de cita')
            let path = 'negocio\\'+ req.file.filename;//req.file.path;
            //paths = paths.replace('public\$', '');
            const data_path = [descripcion,path, id]
            const doc = await insert_path(data_path);
            //aqui enviaria el correo
        }
        // console.log('mis productos >')
        // console.log(producto)
        await delete_producto_negocio(id)
        await update_producto(id, producto)

        ///////////////////////////////////////////////////////////////////////////////////////

        // let negocio_estado_actual = neg_gral[0].estado;
        // // console.log('el estado del negocio es ///========>', negocio_estado_actual)

        // if (estado == 'Afiliado' && negocio_estado_actual != 'Afiliado') {
        //     const lista_finanza = await lista_correo_finanza();
        //     // console.log(lista_finanza[0].email_institucional)
        //     if (typeof lista_finanza != "object") {
        //         send_mail(lista_finanza.email_institucional, `Negocio ${razon_social} afiliado`, `Completar requerimiento a la brevedad`, 'Favor agregar la cuenta Sap acreedor y Sap Deudor',);
        //     } else {
        //         for (let i = 0; i < lista_finanza.length; i++) { //inserto el id afiliado
        //             send_mail(lista_finanza[i].email_institucional, `Negocio ${razon_social} afiliado`, `Completar requerimiento a la brevedad`, 'Favor agregar la cuenta Sap acreedor y Sap Deudor',);
        //         }
        //     }
        // }
        /////////////////////////////////////////////////////////////////////////////////////
        // if ((neg_gral[0].sap_acreedor != sap_acreedor && neg_gral[0].sap_acreedor != '' || neg_gral[0].sap_deudor != sap_deudor && neg_gral[0].sap_deudor != '') && estado == 'Afiliado') {
        //     const lista_operaciones = await lista_correo_operaciones();
        //     let mensaje = `Negocio: ${razon_social} <br><br>`;
        //     if (neg_gral[0].sap_acreedor != sap_acreedor) {
        //         mensaje += `La cuenta Sap acreedor ${neg_gral[0].sap_acreedor} a cambiado por ${sap_acreedor}. <br><br>`
        //     }
        //     if (neg_gral[0].sap_deudor != sap_deudor) {
        //         mensaje += `La cuenta Sap deudor ${neg_gral[0].sap_deudor} a cambiado por ${sap_deudor}. <br><br>`
        //     }
        //     if (typeof lista_operaciones != "object") {
        //         send_mail(lista_operaciones.email_institucional, `Cambio en las cuentas del negocio ${razon_social}`, `Reporte de cambio`, mensaje,);
        //     } else {
        //         for (let i = 0; i < lista_operaciones.length; i++) { //inserto el id afiliado
        //             send_mail(lista_operaciones[i].email_institucional, `Cambio en las cuentas del negocio ${razon_social}`, `Reporte de cambio`, mensaje,);
        //         }
        //     }

        // }
        /////////////////////////////////////////////////////////////////////////////////////
        // if ((neg_gral[0].sap_acreedor != sap_acreedor && neg_gral[0].sap_acreedor == '' || neg_gral[0].sap_deudor != sap_deudor && neg_gral[0].sap_deudor == '') && estado == 'Afiliado') {
        //     const lista_operaciones = await lista_correo_operaciones();
        //     let mensaje = `Negocio: <strong>${razon_social} </strong> <br><br>`;
        //     mensaje += `La cuenta Sap acreedor: <strong>${sap_acreedor} </strong> y Sap deudor: <strong>${sap_deudor} </strong>, agregadas con exito.`
        //     if (typeof lista_operaciones != "object") {
        //         send_mail(lista_operaciones.email_institucional, `Cuentas Sap del negocio ${razon_social} agregadas con exito`, `Reporte de cambio`, mensaje,);
        //     } else {
        //         for (let i = 0; i < lista_operaciones.length; i++) { //inserto el id afiliado
        //             send_mail(lista_operaciones[i].email_institucional, `Cuentas Sap del negocio ${razon_social} agregadas con exito`, `Reporte de cambio`, mensaje,);
        //         }
        //     }
        // }
        /////////////////////////////////////////////////////////////////////////////////////
        res.redirect('/negocio');

    } else {
        res.redirect('/negocio');
    }

}

/////////////////////////

controller.out = (req, res) => {
    //console.log(req.jhobrosoftsession)
    const { id } = req.params;
    const data = req.body;
    let salida = data.salida;
    let motivo = data.motivo;
    let fecha_salida = data.fecha_salida;
    let realizadopor = req.jhobrosoftsession.id_empleado;

    if (data.motivo != '') {
        var sql = 'UPDATE `jr_empleado` SET `id_estado`=3 WHERE `id_empleado`=?';
        req.getConnection((err, conn) => {
            var sqlInsert = 'INSERT INTO `jr_movimiento_empleado`(`id_salida_empleado`, `id_salida`, `id_empleado`, `motivo`, `realizadopor`, `fecha`, `accion`) VALUES (null, ?, ?, ?, ?, ?,"salida")';
            let values = [salida, id, motivo, realizadopor, fecha_salida];
            conn.query(sqlInsert, values, (err, salida) => {
                //console.log(salida)
                if (salida) {
                    conn.query(sql, [id], (err, estado) => {
                        res.redirect('/empleado');
                        //res.send("funciona el insert")
                    });
                }
            });
        })
    } else {
        res.redirect('/empleado');
    }
}

/////////////////////
controller.activar = (req, res) => {
    //console.log(req.jhobrosoftsession)
    const { id } = req.params;
    // const data = req.body;
    let salida = 5;//data.salida; // tipo de salida
    let motivo = 'reingreso';//data.motivo;
    // let fecha_salida = data.fecha_salida;
    let realizadopor = req.jhobrosoftsession.id_empleado;

    if (id != '') {
        var sql = 'UPDATE `jr_empleado` SET `id_estado`=2 WHERE `id_empleado`=?';
        req.getConnection((err, conn) => {
            var sqlInsert = 'INSERT INTO `jr_movimiento_empleado`(`id_salida_empleado`, `id_salida`, `id_empleado`, `motivo`, `realizadopor`, `fecha`, `accion`) VALUES (null, ?, ?, ?, ?, now(),"reingreso")';
            let values = [salida, id, motivo, realizadopor];
            conn.query(sqlInsert, values, (err, salida) => {
                // console.log(salida)
                if (salida) {
                    conn.query(sql, [id], (err, estado) => {
                        res.redirect('/empleado');
                        //res.send("funciona el insert")
                    });
                }
            });
        })
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
