const { list, consultaSucursales, consultaPedidoActual, consultaProductoPrecioCompra, consultaProductoCodigo, consultaUnidadProductoID, consultaProductoIdAlmacenCantidad, guardarProductoVentaTemporal, consultaVentaTemporal, editarCantidadProductoCliente, editarUnidadProductoCliente, guardarClienteBasico, cambiarCliente, eliminarProductoAlCliente, edit, update, categoria_empresa, consultaSecuenciaComprobante, actualizarSecuenciaComprobante, actualizarNotaDeCredito, guardarVentaProcesada, eliminarVentaTemporal, guardarProductoVenta, actualizaProductoAlmacenVenta, actualizaPrecioDeCostoTotalVenta, buscarDescripcionUnidad, producto_list, facturaList, buscarFactura, buscarDetalleFactura, verificaCajaAbierta, desgloseEnCaja, facturacionTotalEnCaja, guardarDevolucion, guardarDetalleDevolucion, restarCantidadPendienteAlProductoActualDeLaFactura, cambiarEstadoFactura, consultaEmpleadoReporte, consultaEmpleado, consultaCajaReporte, consultaTurnoReporte, filtroReporte, filtroReporteTiposDePago, consultaNotaDeCreditosNoVencidasALaFecha, consultaNotaDeCreditosNoVencidasALaFechaEnVenta, consultaMesa, consultaMesaCliente, consultaCamarero, clienteConFacturaTemporal, guardarMovimientoEnCaja } = require('../services/facturacionService');
const { consultaProductoAlmacen, consultaFactorDeConversionUnidadProducto, guardaProductoAlmacen, actualizaProductoAlmacen } = require('../services/ordenService');
// const { componente_list, componenteListProductos } = require('../services/productoService');
const { saveDesgloseDeCaja, cierreDeCajaUpdate, verDetalleCajaParaImprimir, verDesgloseFinal } = require('../services/cajaService');
const controller = {};

const { paginacion } = require("../config");

const PDFDocument = require('pdfkit');
const fs = require('fs');
const crypto = require('crypto');
const { Console } = require('console');

// Función para encriptar un valor utilizando una clave secreta y un vector de inicialización
controller.encriptar = async (req, res) => {
    const { valor, clave, iv } = req.params;
    const method = 'aes-256-cbc';
    const key = crypto.createHash('sha256').update(clave).digest();
    const cipher = crypto.createCipheriv(method, key, iv);
    let encrypted = cipher.update(valor);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    res.send(iv.toString('hex') + ':' + encrypted.toString('hex'));
}


// Función para desencriptar un valor utilizando una clave secreta y un vector de inicialización
controller.desencriptar = async (req, res) => {
    const { encriptado, clave } = req.params;
    const method = 'aes-256-cbc';
    const iv = Buffer.from(encriptado.slice(0, 32), 'hex');
    const key = crypto.createHash('sha256').update(clave).digest();
    const encryptedText = Buffer.from(encriptado.slice(33), 'hex');
    const decipher = crypto.createDecipheriv(method, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    res.send(decrypted.toString());
}


controller.chat = async (req, res) => {
    // const empresas = await list();
    // const categoria = await categoria_empresa();
    console.log(req.jhobrosoftsession.foto)
    let foto = req.jhobrosoftsession.foto ? '/../' + req.jhobrosoftsession.foto : '/../cliente_foto/fotodefault.png'
    const nombre = req.jhobrosoftsession.nombres + " " + req.jhobrosoftsession.apellido
    imprimirCuadreDeCaja(7, req)
    res.render('chat', {

        // data: empresas,
        // cat: categoria,
        foto,
        nombre,
        accesos: req.jhobrosoftsession.accesos
    });
}

controller.list = async (req, res) => {
    // const empresas = await list();
    let id_empleado = req.jhobrosoftsession.id_empleado;

    const caja_abierta = await verificaCajaAbierta(id_empleado);

    console.log('renderizando', caja_abierta)
    if (caja_abierta != "") {
        res.render('facturacion', {
            caja: caja_abierta[0],
            id_empleado: id_empleado,
            accesos: req.jhobrosoftsession.accesos
        });
    } else {
        res.redirect('/caja');
    }
}

controller.reporte = async (req, res) => {
    // const empresas = await list();
    let id_empleado = req.jhobrosoftsession.id_empleado;
    let id_empresa = req.jhobrosoftsession.empresa;
    let sucursales = await consultaSucursales(id_empresa);

    res.render('reporte', {
        // // data: empresas,
        suc: sucursales,
        id_empleado: id_empleado,
        accesos: req.jhobrosoftsession.accesos
    });
}

controller.cerrarCaja = async (req, res) => {
    console.log("CIERRE diferencia DE Ruta")
    let { caja, id_caja_detalle, diferencia, totalFinalEnCaja, notaFinalVenta, id_supervisor, dosMilFinalEnCaja, milFinalEnCaja, quinientosFinalEnCaja, doscientosFinalEnCaja, cienFinalEnCaja, cincuentaFinalEnCaja, veinticincoFinalEnCaja, diezFinalEnCaja, cincoFinalEnCaja, unoFinalEnCaja, decimalFinalEnCaja } = req.body;
    console.log("CIERRE diferencia DE CAJA", diferencia)
    try {

        //
        totalFinalEnCaja = totalFinalEnCaja.replace(/,/g, '');
        diferencia = diferencia.replace(/,/g, '');

        let values = [totalFinalEnCaja, diferencia, notaFinalVenta, id_supervisor, id_caja_detalle];
        let resoult = await cierreDeCajaUpdate(values);
        console.log("CIERRE DE CAJA", values)
        values = [caja, id_caja_detalle, 0, dosMilFinalEnCaja, milFinalEnCaja, quinientosFinalEnCaja, doscientosFinalEnCaja, cienFinalEnCaja, cincuentaFinalEnCaja, veinticincoFinalEnCaja, diezFinalEnCaja, cincoFinalEnCaja, unoFinalEnCaja, decimalFinalEnCaja, 'desglose_final'];
        await saveDesgloseDeCaja(values);
        console.log("CIERRE DE CAJA", values)
        //c.monto_inicial, SUM(v.total_itbis) AS suma_total_itbis, SUM(v.total_descuento) AS suma_total_descuento, SUM(v.tarjeta_debito) AS suma_tarjeta_debito, COUNT(CASE WHEN v.tarjeta_debito != 0 THEN v.tarjeta_debito END) AS cantidad_tarjeta_debito, SUM(v.tarjeta_credito) AS suma_tarjeta_credito, COUNT(CASE WHEN v.tarjeta_credito != 0 THEN v.tarjeta_credito END) AS cantidad_tarjeta_credito, SUM(v.cheque) AS suma_cheque, COUNT(CASE WHEN v.cheque != 0 THEN v.cheque END) AS cantidad_cheque, SUM(v.monto_nota) AS suma_monto_nota, COUNT(CASE WHEN v.monto_nota != 0 THEN v.monto_nota END) AS cantidad_monto_nota, SUM(v.bono) AS suma_bono, COUNT(CASE WHEN v.bono != 0 THEN v.bono END) AS cantidad_bono, SUM(v.efectivo) - SUM(v.devolver) AS suma_efectivo_neto, SUM(v.efectivo) AS suma_efectivo, SUM(v.devolver) AS suma_devolver, SUM(v.cuenta_por_cobrar) AS suma_cuenta_por_cobrar, COUNT(CASE WHEN v.cuenta_por_cobrar != 0 THEN v.cuenta_por_cobrar END) AS cantidad_cuenta_por_cobrar FROM jr_venta v JOIN jr_caja_detalle c ON c.id_caja_detalle = v.id_caja_detalle WHERE v.id_caja_detalle = ?
        imprimirCuadreDeCaja(parseInt(id_caja_detalle), req)

        res.redirect('/');

    } catch (error) {
        console.log("Algo anda mal en la actualizacion del cliente" + error)
        res.send("No se pudo Asignar el cliente");
    }
}

async function imprimirCuadreDeCaja(id_caja_detalle, req) {
    var datosX = []; // aqui van los datos totales de la factura y este es el array a devolver

    var productosX = []; // aqui van los productos


    async function agregarDato(UbicacionTexto, Texto1, Texto2, Monto) {
        datosX.push({ ubicacionTexto: UbicacionTexto, texto1: `${Texto1}`, texto2: `${Texto2}`, "monto": Monto });
    }

    const detalleCuadre = await verDetalleCajaParaImprimir(id_caja_detalle);//
    //SELECT id_caja_detalle, cd.id_caja, cd.id_turno, cd.id_cajero, (SELECT  CONCAT( nombres," ", apellidos) FROM jr_empleado WHERE id_empleado =cd.id_cajero) AS cajero, cd.id_supervisor, cd.id_empresa, cd.id_sucursal, cd.id_almacen, cd.estado, cd.fecha_apertura, cd.fecha_cierre, cd.monto_inicial, cd.monto_final, cd.diferencia, cd.observaciones, cd.desglose, c.nombre, c.descripcion FROM jr_caja_detalle cd, jr_caja c WHERE c.id_caja = cd.id_caja AND cd.id_caja_detalle = ?
    const detalleFacturacion = await facturacionTotalEnCaja(id_caja_detalle);

    let values = [id_caja_detalle, 'desglose_final']
    const desgloseFinal = await verDesgloseFinal(values)

    // let cajero = req.jhobrosoftsession.nombres + " " + req.jhobrosoftsession.apellido;
    let nombre_empresa = req.jhobrosoftsession.nombre_empresa;
    let rnc_empresa = req.jhobrosoftsession.rnc_empresa;
    let nombre_sucursal = req.jhobrosoftsession.nombre_sucursal;
    // let provincia_sucursal = req.jhobrosoftsession.provincia_sucursal;
    let direccion_sucursal = req.jhobrosoftsession.direccion_sucursal;
    let telefono_sucursal = req.jhobrosoftsession.telefono_sucursal;
    let email_sucursal = req.jhobrosoftsession.email_sucursal;
    // let paddedIdVenta = completaConCerosNumeroFactura(id_venta, 11, '0');/
    //aqui se imprime la factura
    await agregarDato("centro", "");
    await agregarDato("centroNegrita", nombre_empresa);
    await agregarDato("centro", nombre_sucursal);
    await agregarDato("centro", `RNC: ${rnc_empresa}, Tel: ${telefono_sucursal}`);
    // await agregarDato("centro", provincia_sucursal);
    await agregarDato("centro", direccion_sucursal);
    await agregarDato("centro", `${email_sucursal}`);

    await agregarDato("centro", "");

    await agregarDato("centroNegrita", "CUADRE DE CAJA");
    await agregarDato("centro", "");

    await agregarDato("izquierda", "CAJA:            " + detalleCuadre[0].nombre);
    await agregarDato("izquierda", "TURNO:           " + detalleCuadre[0].id_turno);
    await agregarDato("izquierda", "FECHA APERTURA:  " + detalleCuadre[0].fecha_apertura);
    await agregarDato("izquierda", "FECHA CIERRE:    " + detalleCuadre[0].fecha_cierre);
    await agregarDato("izquierda", "CAJERO:          " + detalleCuadre[0].cajero);
    await agregarDato("izquierda", "SUPERVISOR:      " + detalleCuadre[0].supervisor);

    await agregarDato("lineasGion", "");
    await agregarDato("centroNegrita", `DETALLE`);
    await agregarDato("lineasGion", "");

    let montoInicial = detalleFacturacion[0].monto_inicial;
    let tarjetaDebito = detalleFacturacion[0].suma_tarjeta_debito;
    let tarjetaCredito = detalleFacturacion[0].suma_tarjeta_credito;
    let cheque = detalleFacturacion[0].suma_cheque;
    let montoNotaCredito = detalleFacturacion[0].suma_monto_nota;
    let pagoConBono = detalleFacturacion[0].suma_bono;
    let totalIbis = detalleFacturacion[0].suma_total_itbis;
    let totalDescuento = detalleFacturacion[0].suma_total_descuento;
    let efectivo = detalleFacturacion[0].suma_efectivo_neto;
    let devolver = detalleFacturacion[0].suma_devolver;
    let cuentaPorCobrar = detalleFacturacion[0].suma_cuenta_por_cobrar;
    let diferencia = detalleCuadre[0].diferencia;
    let observaciones = detalleCuadre[0].observaciones;
    let totalVendido = (detalleFacturacion[0].suma_tarjeta_debito || 0) + (detalleFacturacion[0].suma_tarjeta_credito || 0) + (detalleFacturacion[0].suma_cheque || 0) + (detalleFacturacion[0].suma_monto_nota || 0) + (detalleFacturacion[0].suma_bono || 0) + (detalleFacturacion[0].suma_efectivo_neto || 0) + (detalleFacturacion[0].suma_cuenta_por_cobrar || 0);

    await agregarDato("agregarTotales", "   Monto Inicial.......$", null, montoInicial);

    await agregarDato("agregarTotales", "   Total vendido.......$", null, totalVendido);

    if (cuentaPorCobrar != "" && cuentaPorCobrar != 0) {
        await agregarDato("agregarTotales", "   Cuenta por cobrar...$", null, cuentaPorCobrar);
    }

    if (totalIbis != "" && totalIbis != 0) {
        await agregarDato("agregarTotales", "   Total Itbis.........$", null, totalIbis);
    }
    if (totalDescuento != "" && totalDescuento != 0) {
        await agregarDato("agregarTotales", "   Total descuento.....$", null, totalDescuento);
    }
    if (tarjetaDebito != "" && tarjetaDebito != 0) {
        await agregarDato("agregarTotales", "   Tarjeta de debito...$", null, tarjetaDebito);
    }
    if (tarjetaCredito != "" && tarjetaCredito != 0) {
        await agregarDato("agregarTotales", "   Tarjeta de credito..$", null, tarjetaCredito);
    }
    if (cheque != "" && cheque != 0) {
        await agregarDato("agregarTotales", "   Cheque..............$", null, cheque);
    }
    if (montoNotaCredito != "" && montoNotaCredito != 0) {
        await agregarDato("agregarTotales", "   Nota de credito.....$", null, montoNotaCredito);
    }
    if (pagoConBono != "" && pagoConBono != 0) {
        await agregarDato("agregarTotales", "   Pago con bono.......$", null, pagoConBono);
    }

    if (devolver != "" && devolver != 0) {
        await agregarDato("agregarTotales", "   Devolver............$", null, devolver);
    }
    if (efectivo != "" && efectivo != 0) {
        await agregarDato("agregarTotales", "   Efectivo............$", null, efectivo);
    }

    if (diferencia != "" && diferencia != 0) {
        await agregarDato("agregarTotales", "   Diferencia..........$", null, diferencia);
    }

    await agregarDato("lineasGion", "");
    await agregarDato("centroNegrita", `DESGLOSE FINAL`);
    await agregarDato("lineasGion", "");
    const registroCero = desgloseFinal[0];
    const valor2000 = registroCero['2000'];
    const valor1000 = registroCero['1000'];
    const valor500 = registroCero['500'];
    const valor200 = registroCero['200'];
    const valor100 = registroCero['100'];
    const valor50 = registroCero['50'];
    const valor25 = registroCero['25'];
    const valor10 = registroCero['10'];
    const valor5 = registroCero['5'];
    const valor1 = registroCero['1'];

    const completarConCeros = (numero, longitud) => {
        const strNumero = numero.toString();
        return strNumero.padStart(longitud, '0');
    };

    if (valor2000 !== 0) {
        await agregarDato("agregarTotales", `          2000 X ${completarConCeros(valor2000, 3)}  =`, null, (valor2000 * 2000));
    }
    if (valor1000 !== 0) {
        await agregarDato("agregarTotales", `          1000 X ${completarConCeros(valor1000, 3)}  =`, null, (valor1000 * 1000));
    }
    if (valor500 !== 0) {
        await agregarDato("agregarTotales", `           500 X ${completarConCeros(valor500, 3)}  =`, null, (valor500 * 500));
    }
    if (valor200 !== 0) {
        await agregarDato("agregarTotales", `           200 X ${completarConCeros(valor200, 3)}  =`, null, (valor200 * 200));
    }
    if (valor100 !== 0) {
        await agregarDato("agregarTotales", `           100 X ${completarConCeros(valor100, 3)}  =`, null, (valor100 * 100));
    }
    if (valor50 !== 0) {
        await agregarDato("agregarTotales", `            50 X ${completarConCeros(valor50, 3)}  =`, null, (valor50 * 50));
    }
    if (valor25 !== 0) {
        await agregarDato("agregarTotales", `            25 X ${completarConCeros(valor25, 3)}  =`, null, (valor25 * 25));
    }
    if (valor10 !== 0) {
        await agregarDato("agregarTotales", `            10 X ${completarConCeros(valor10, 3)}  =`, null, (valor10 * 10));
    }
    if (valor5 !== 0) {
        await agregarDato("agregarTotales", `             5 X ${completarConCeros(valor5, 3)}  =`, null, (valor5 * 5));
    }
    if (valor1 !== 0) {
        await agregarDato("agregarTotales", `             1 X ${completarConCeros(valor1, 3)}  =`, null, (valor1 * 1));
    }



    if (observaciones != "" && observaciones != null) {
        await agregarDato("centro", "");
        await agregarDato("izquierda", observaciones);
    }


    await agregarDato("centro", "");
    await agregarDato("centro", "");
    await agregarDato("centro", "");
    await agregarDato("centro", "__________________________________");
    await agregarDato("centro", "Cajero");

    await agregarDato("centro", "");
    await agregarDato("centro", "");
    await agregarDato("centro", "__________________________________");
    await agregarDato("centro", "Supervisor");
    await agregarDato("imprimir", "");

    //let values = [id_empleado, id_cliente, subTotal, masItbis, descuento, maselservicio, totalCobrar, secuencia[0].secncf, fechaDeVencimiento, tarjetaDebito, tarjetaCredito, cheque, notaCredito, montoNotaCredito, pagoConBono, efectivo, devolver, cuentaPorCobrar, notaVenta, condicionVenta, 'Procesada'];
    // Convertir los datos a una cadena JSON

    // Datos a enviar
    const axios = require('axios');

    // Realizar la solicitud POST
    axios.post("http://localhost:8081?printer=" + "POS80", JSON.stringify(datosX))
        .then(response => {
            console.log('Solicitud enviada con éxito');
            // console.log(response.data); // Puedes mostrar la respuesta del servidor si lo deseas
        })
        .catch(error => {
            console.error('Error al enviar la solicitud:', error);
        });


}

controller.desgloseEnCaja = async (req, res) => {
    let { idDetalleCaja } = req.params;

    const detalle = await desgloseEnCaja(idDetalleCaja);
    // console.log(detalle[0])
    res.send(detalle[0]);
}

controller.facturacionTotalEnCaja = async (req, res) => {
    let { idDetalleCaja } = req.params;
    console.log(idDetalleCaja)
    const detalle = await facturacionTotalEnCaja(idDetalleCaja);
    console.log(detalle[0])
    res.send(detalle[0]);
}

controller.buscarCodigoUnidadProducto = async (req, res) => {
    const { id_unidad, id_producto } = req.params;
    // const data = req.body;
    try {
        const producto = await consultaUnidadProductoID(id_unidad, id_producto);
        ////////////////////////////////////////////////////////////////////////

        ///////////////////////////////////////////////////////////////////////
        if (producto.length > 0) {
            // console.log(producto)
            res.send(producto);
        } else {
            console.log("No tiene venta temporal")
            res.send("No tiene codigo de barras esta unidad");

        }
    } catch (error) {
        console.log("Algo anda mal en la venta temproral X ====>" + error)
        res.send(error);
    }
}

controller.consultaProductoCodigoAlmacenCantidad = async (req, res) => {
    let { codigo, almacen, cantidad, id_cliente, suma, caja, mesa, id_camarero, numero_pedido } = req.params;

    console.log('son datos a buscar id_camarero ==>', req.params)
    // const data = req.body;
    try {
        const datosProducto = await consultaProductoCodigo(codigo);
        // console.log("datos del producto ==============>")
        // console.log("veo la cantidad ==============>" + cantidad)
        //SELECT `factor_conversion`, `id_producto`, `id_unidad`, `codigo_barras` FROM `jr_unidad_vs_producto` WHERE `codigo_barras` 
        let id_producto = datosProducto[0].id_producto;
        let factor_conversion = datosProducto[0].factor_conversion;
        let id_unidad = datosProducto[0].id_unidad;

        let pedidoActual = await consultaPedidoActual(id_cliente, id_producto, id_unidad)
        let lacantidad = 0;
        if (pedidoActual != "") {
            console.log("Veo que hay en el pedido actual =====>", pedidoActual)
            lacantidad = pedidoActual[0].cantidad;
            if (suma == 0) {
                lacantidad = 0;
            }
        }
        let cantidadAConsultar = (parseFloat(lacantidad) + parseFloat(cantidad)) * parseFloat(factor_conversion);

        // console.log("cantidad a consultar ===>", cantidadAConsultar)
        // /facturacion/consultaProductoCodigoAlmacenCantidad/123456789121/1/1/1/1/0/01/0/

        //AQUI DEBO DE CONSULTAR LA CANTIDAD QUE YA TENGO EN LA FACTURA PARA VER SI PUEDO AGREGARLE UN PRODUCTO MAS
        // console.log("veo los datos ==============>" + cantidad,factor_conversion,id_producto,id_unidad)
        const producto = await consultaProductoIdAlmacenCantidad(id_producto, almacen, cantidadAConsultar);
        // console.log("producto ==============>" + JSON.stringify(producto))
        if (producto.length > 0) {
            let existencia = producto[0].existencia;
            // console.log("entro a la ruta ==============>" + producto[0].existencia)
            // console.log(producto) res.send("Solo quedan disponible "+ producto[0].existencia_almacen);

            // Llenar los datos del producto para guardar en la tabla temporal
            const id_empleado = 1; // ID del empleado que realiza la venta

            // let descuento = 0; // Obtener el descuento del producto[0]
            // let itbis = 0; // Obtener el ITBIS del producto[0]
            // let precio_venta = producto[0].precio_detalle; // Obtener el precio de venta del producto[0]
            // if (producto[0].con_itbis == '1') {
            //     itbis = producto[0].itbis; // Obtener el ITBIS del producto[0]
            // }

            // if (producto[0].con_descuento == '1') {
            //     descuento = producto[0].descuento
            // }
            // console.log(producto[0].con_descuento)
            // console.log(itbis)
            // console.log(precio_venta)


            // const descuentoTotal = (precio_venta * descuento / 100) * cantidad;
            //     const itbisTotal = (precio_venta * itbis / 100) * cantidad;
            //     const importe = (precio_venta * cantidad) - descuentoTotal + itbisTotal;

            const id_producto = producto[0].id_producto; // Obtener el ID del producto

            // console.log(id_empleado, id_cliente, descuento, itbis, precio_venta, cantidad, id_producto)
            //suma = 0; indica que se cargo de la tabla por lo que se va a colocar la cantidad que viene desde la tabla
            let result = await guardarProductoVentaTemporal(id_empleado, id_cliente, cantidad, id_unidad, id_producto, suma, existencia, caja, mesa, id_camarero, numero_pedido)
            console.log("El result ===> " + result)
            res.send(result);
        } else {
            console.log("Cantidad insuficiente para cubir el pedido")
            res.send(`Cantidad insuficiente para cubir el pedido`);

        }
    } catch (error) {
        console.log("Algo anda mal al agregar producto XF ====>" + error)
        res.send(error);
    }
}


controller.consultaVentaTemporal = async (req, res) => {
    const { id_empleado, id_cliente, caja, mesa, numero_pedido } = req.body;
    console.log('DATOS DEL BODY ', req.body)
    // const data = req.body;
    try {

        const producto = await consultaVentaTemporal(id_empleado, id_cliente, caja, mesa, numero_pedido);
        ////////////////////////////////////////////////////////////////////////
        if (caja != '' && id_cliente == 1 && mesa == 0 && numero_pedido == 0) {
            console.log(`caso 1: LOAD PAGINA ===  ,CAJA = ${caja}, ID_CLIENTE = ${id_cliente}, ID_MESA = ${mesa}, NUMERO_PEDIDO = ${numero_pedido}`)

        } else if (caja == '' && id_cliente > 1 && mesa == 0 && numero_pedido > 0) {
            console.log(`caso 2: CLIENTE CON PEDIDO POR CAJA ===  ,CAJA = ${caja}, ID_CLIENTE = ${id_cliente}, ID_MESA = ${mesa}, NUMERO_PEDIDO = ${numero_pedido}`)

        } else if (caja == '' && id_cliente == 1 && mesa > 0 && numero_pedido == 0) {
            console.log(`caso 3: MESA CON PEDIDO SIN CLIENTE ===  ,CAJA = ${caja}, ID_CLIENTE = ${id_cliente}, ID_MESA = ${mesa}, NUMERO_PEDIDO = ${numero_pedido}`)

        } else if (caja == '' && id_cliente > 1 && mesa > 0 && numero_pedido > 0) {
            console.log(`caso 4: MESA CON CLIENTE Y CON PEDIDO  ,CAJA = ${caja}, ID_CLIENTE = ${id_cliente}, ID_MESA = ${mesa}, NUMERO_PEDIDO = ${numero_pedido}`)

        } else {
            console.log(`Situacion no manejada ,CAJA = ${caja}, ID_CLIENTE = ${id_cliente}, ID_MESA = ${mesa}, NUMERO_PEDIDO = ${numero_pedido}`)
        }
        console.log(`CAJA != '', ID_CLIENTE = 1, ID_MESA = 0, NUMERO_PEDIDO = 0`)
        ///////////////////////////////////////////////////////////////////////
        if (producto.length > 0) {
            // console.log(producto)
            res.send(producto);
        } else {
            console.log("No tiene venta temporal")
            res.send({ mensaje: 'No tiene venta temporal' });

        }
    } catch (error) {
        console.log("Algo anda mal en la venta temproral X ====>" + error)
        res.send(error);
    }
}

controller.eliminarProductoAlCliente = async (req, res) => {
    const { id_producto, id_cliente, id_unidad, caja, mesa, numero_pedido } = req.body;
    // const data = req.body;
    console.log("Numero de pedido a elimincar producto ", numero_pedido)
    try {
        const producto = await eliminarProductoAlCliente(id_producto, id_cliente, id_unidad, mesa, caja, numero_pedido);
        ////////////////////////////////////////////////////////////////////////

        ///////////////////////////////////////////////////////////////////////
        if (producto.length > 0) {
            // console.log(producto)
            res.send(producto);
        } else {
            console.log("No tiene venta temporal")
            res.send("No tiene venta temporal");

        }
    } catch (error) {
        console.log("Algo anda mal en la venta temproral X ====>" + error)
        res.send(error);
    }
}

controller.editarCantidadProductoCliente = async (req, res) => {
    let { id_producto, id_unidad, cantidad, id_empleado, id_cliente, almacen, caja, mesa, numero_pedido } = req.params;

    try {
        //aqui consulto e
        let consulta = await consultaUnidadProductoID(id_unidad, id_producto)
        let factorDeConversion = consulta[0].factor_conversion;
        let cantidadTotal = cantidad * factorDeConversion;
        const producto = await consultaProductoIdAlmacenCantidad(id_producto, almacen, cantidadTotal);

        if (producto.length > 0) {
            console.log("Consulta si hay existencia, " + producto)
            let existencia = producto[0].existencia_almacen;
            let descuento = 0; // Obtener el descuento del producto[0]
            let itbis = 0; // Obtener el ITBIS del producto[0]
            let precio_venta = producto[0].precio_detalle; // Obtener el precio de venta del producto[0]
            // if (producto[0].con_itbis == '1') {
            //     itbis = producto[0].itbis; // Obtener el ITBIS del producto[0]
            // }

            // if (producto[0].con_descuento == '1') {
            //     descuento = producto[0].descuento
            // }

            await editarCantidadProductoCliente(id_producto, id_unidad, cantidad, id_empleado, id_cliente, caja, mesa, numero_pedido);
            res.send("Cantidad actualizada");
        } else {
            res.send(`Cantidad insuficiente en éste almacen`);
        }

    } catch (error) {
        console.log("Algo anda mal en la venta temproral J ====>" + error)
        res.send(error);
    }
}


controller.editarUnidadProductoCliente = async (req, res) => {
    let { id_producto, id_unidad, id_cliente } = req.params;
    console.log("Entro Unidad actualizada")
    try {
        await editarUnidadProductoCliente(id_producto, id_unidad, id_cliente);
        console.log("Unidad actualizada")
        res.send("Unidad actualizada");

    } catch (error) {
        console.log("Algo anda mal en la venta temproral J ====>" + error)
        res.send(error);
    }
}

function completaConCerosNumeroFactura(number, length, character) {
    let str = String(number);
    while (str.length < length) {
        str = character + str;
    }
    return str;
}


controller.imprimeCobra = async (req, res) => {
    // Recibir los datos del cliente desde req.body
    let {
        id_almacen,
        subTotal,
        masItbis,
        descuento,
        servicio,
        maselservicio,
        totalCobrar,
        id_cliente,
        nombreCliente,
        rncCliente,
        celularCliente,
        codncf,
        comprobante,
        fechaDeVencimiento,
        tarjetaDebito,
        pagoConBono,
        cheque,
        condicionVenta,
        tarjetaCredito,
        notaDeCredito,
        notaCredito,
        montoNotaCredito,
        cuentaPorCobrar,
        efectivo,
        devolver,
        notaVenta,
        tabla,

        id_mesa,
        mesa,
        id_camarero,
        numero_pedido,// este numero pedido solo se usa para eliminar el pedido luego de procesado

        id_caja_detalle,
        id_caja,
        caja,
        id_turno,
        id_cajero,
        id_supervisor,
        id_empresa,
        dosmil_entrada,
        mil_entrada,
        quinientos_entrada,
        doscientos_entrada,
        cien_entrada,
        cincuenta_entrada,
        veinticinco_entrada,
        diez_entrada,
        cinco_entrada,
        uno_entrada,
        decimal_entrada,
        dosmil_salida,
        mil_salida,
        quinientos_salida,
        doscientos_salida,
        cien_salida,
        cincuenta_salida,
        veinticinco_salida,
        diez_salida,
        cinco_salida,
        uno_salida,
        decimal_salida
    } = req.body;

    var datosX = []; // aqui van los datos totales de la factura y este es el array a devolver

    var productosX = []; // aqui van los productos


    async function agregarDato(UbicacionTexto, Texto1, Texto2, Monto) {
        datosX.push({ ubicacionTexto: UbicacionTexto, texto1: `${Texto1}`, texto2: `${Texto2}`, "monto": Monto });
    }

    async function agregarProducto(articulo, cant, unidad, precio, itbis, importe) {
        productosX.push({ articulo, cant, unidad, precio, itbis, importe });
        // console.log("Productos agregados ======>" + JSON.stringify(productosX))
    }

    async function agregarArregloProductosADatos() {
        datosX.push({ productos: productosX }); // Agrega el arreglo de productos al objeto datos
        // console.log("Productos totales agregados ======>" + JSON.stringify(productosX))
    }

    comprobante = comprobante.toUpperCase();
    // console.log('Datos de la tabla =====> ' + JSON.stringify(tabla))
    try {
        subTotal = subTotal.replace(/,/g, '');
        masItbis = masItbis.replace(/,/g, '');
        descuento = descuento.replace(/,/g, '');
        maselservicio = maselservicio.replace(/,/g, '');
        totalCobrar = totalCobrar.replace(/,/g, '');
        montoNotaCredito = montoNotaCredito.replace(/,/g, '');
        tarjetaDebito = tarjetaDebito.replace(/,/g, '');
        pagoConBono = pagoConBono.replace(/,/g, '');
        cheque = cheque.replace(/,/g, '');
        tarjetaCredito = tarjetaCredito.replace(/,/g, '');
        cuentaPorCobrar = cuentaPorCobrar.replace(/,/g, '');
        efectivo = efectivo.replace(/,/g, '');
        devolver = devolver.replace(/,/g, '');
        let secuencia = await consultaSecuenciaComprobante(codncf);
        // console.log("NCF =====> ", secuencia) //si el codigo esta presente
        if (secuencia) {
            let precioDeCostoTotal = 0;
            // console.log("Secuencia =====> ", secuencia[0].secncf)
            let id_sucursal = req.jhobrosoftsession.sucursal;
            let id_empleado = req.jhobrosoftsession.id_empleado

            await actualizarSecuenciaComprobante(id_sucursal, secuencia[0].secncf, codncf);
            console.log("actualizo los comprobantes", descuento)



            // este numero pedido solo se usa para eliminar el pedido luego de procesado


            let values = [id_caja, id_caja_detalle, id_turno, id_supervisor, id_empresa, id_sucursal, id_empleado, id_cliente, id_mesa, mesa, id_camarero, subTotal, masItbis, descuento, maselservicio, totalCobrar, secuencia[0].secncf, comprobante, fechaDeVencimiento, tarjetaDebito, tarjetaCredito, cheque, notaCredito, montoNotaCredito, pagoConBono, efectivo, devolver, cuentaPorCobrar, notaVenta, condicionVenta, 'Procesada'];
            console.log("Lo ventas = ", values)
            let id_venta = await guardarVentaProcesada(values);
            // console.log("id venta ===> ",id_venta)
            await eliminarVentaTemporal(id_cliente, numero_pedido, caja, id_mesa);
            if (notaCredito != "") {
                await actualizarNotaDeCredito(id_venta, parseInt(notaCredito), montoNotaCredito);
            }


            // console.log("ID VENTA =====> ", id_venta)
            // tabla.forEach(async (fila) => {
            //     let [id_producto, codigo, descripcion, cantidad, unidad, descuento, itbis, precio, importe] = JSON.parse(fila);
            //     //`descuento`, `precio_venta`, `cantidad`, `id_unidad`, `id_producto`, `id_venta`
            //     // let id_venta=1;
            //     let launidad = await buscarDescripcionUnidad(unidad);
            //     console.log("Muestro la unidad ======>"+ launidad[0].unidad)
            //     agregarProducto(descripcion, cantidad, launidad[0].unidad, precio, itbis, importe); //para imprimir

            //     values = [descuento, precio, cantidad, unidad, id_producto, id_venta];
            //     await guardarProductoVenta(values);



            //     values = [id_producto, unidad];
            //     let factorDeConversion = await consultaFactorDeConversionUnidadProducto(values)
            //     let cantidadAMover = factorDeConversion[0].factor_conversion * cantidad; // esta se le resta a la existe cia 

            //     values = [id_producto, id_almacen];
            //     let productoAlmacen = await consultaProductoAlmacen(values);
            //     // console.log("productoAlmacen:", productoAlmacen[0].existencia);
            //     let existenciaNueva = parseFloat(productoAlmacen[0].existencia) - parseFloat(cantidadAMover);

            //     values = [existenciaNueva, id_almacen, id_producto]
            //     await actualizaProductoAlmacenVenta(values)
            //     // Haz lo que necesites con las variables individuales
            //     // console.log("id_producto:", id_producto);
            //     // console.log("CÓDIGO:", codigo);
            //     // console.log("DESCRIPCIÓN:", descripcion);
            //     // console.log("CANTIDAD:", cantidad);
            //     // console.log("UNIDAD:", unidad);
            //     // console.log("DESCUENTO:", descuento);
            //     // console.log("ITBIS:", itbis);
            //     // console.log("PRECIO:", precio);
            //     // console.log("IMPORTE:", importe);

            //     // console.log("");
            // });

            for (let i = 0; i < tabla.length; i++) {
                let [id_producto, codigo, descripcion, precioUnitario, cantidad, unidad, descuento, itbis, precio, importe] = JSON.parse(tabla[i]);
                console.log("entra al detalle TABLA =====> ", JSON.parse(tabla[i]))//
                importe = importe.replace(',', '');
                importe = parseFloat(importe);
                importe = importe.toFixed(2);

                precio = precio.replace(',', '');
                precio = parseFloat(precio);
                precio = precio.toFixed(2);

                descuento = descuento.replace(',', '');
                descuento = parseFloat(descuento);
                descuento = descuento.toFixed(2);

                itbis = itbis.replace(',', '');
                itbis = parseFloat(itbis);
                itbis = itbis.toFixed(2);

                let launidad = await buscarDescripcionUnidad(unidad);
                // console.log('unidad ', unidad)
                // console.log('busca la unidad ', launidad)
                // console.log("Muestro la unidad ======>"+ launidad[0].unidad);
                let cantidadActual = 0.00;
                cantidadActual = precio / cantidad;
                await agregarProducto(descripcion, cantidad, launidad[0].unidad, cantidadActual, itbis, importe);
                // console.log('agrega producto')//
                values = [id_producto, unidad];
                let factorDeConversion = await consultaFactorDeConversionUnidadProducto(values);
                // console.log('trae el factor de conversion')
                let productoPrecioCompra = await consultaProductoPrecioCompra(id_producto);
                let precio_compra = productoPrecioCompra[0].precio_compra;

                let precioDeCompra = precio_compra * factorDeConversion[0].factor_conversion;
                precioDeCosto = precio_compra * factorDeConversion[0].factor_conversion * cantidad;
                precioDeCostoTotal += precioDeCosto;

                values = [descuento, precio, cantidad, cantidad, unidad, itbis, importe, id_producto, precioDeCompra, precioDeCosto, id_venta];
                await guardarProductoVenta(values);
                // console.log('guarda producto')
                let cantidadAMover = factorDeConversion[0].factor_conversion * cantidad;

                values = [id_producto, id_almacen];
                    let productoAlmacen = await consultaProductoAlmacen(values);
                    let existenciaNueva = parseFloat(productoAlmacen[0].existencia) - parseFloat(cantidadAMover);
                    // console.log('existencia nueva ====> ', existenciaNueva)
                    values = [existenciaNueva, id_almacen, id_producto];
                    await actualizaProductoAlmacenVenta(values);

                //aqui haria la consulta a ver si el producto tiene componente

                // let id_productos = await componente_list(id_producto);// busco los id de las componentes
                // // console.log(id_productos)
                // let lista;
                // if (id_productos == '') {
                //     // lista = "Este producto no contiene componentes";
                //     // res.send(lista);
                //     values = [id_producto, id_almacen];
                //     let productoAlmacen = await consultaProductoAlmacen(values);
                //     let existenciaNueva = parseFloat(productoAlmacen[0].existencia) - parseFloat(cantidadAMover);
                //     // console.log('existencia nueva ====> ', existenciaNueva)
                //     values = [existenciaNueva, id_almacen, id_producto];
                //     await actualizaProductoAlmacenVenta(values);
                // } else {
                //     //si tiene componente entro aqui busco las componentes y 
                //     lista = await componenteListProductos(id_productos, id_producto)
                //     console.log('Ver kusta ', lista)
                //     for (let x = 0; x < lista.length; x++) {
                //         values = [lista[x].id_producto, id_almacen];
                //         let productoAlmacen = await consultaProductoAlmacen(values);
                //         let existenciaNueva = parseFloat(productoAlmacen[0].existencia) - (parseFloat(cantidadAMover)*parseFloat(lista[x].cantidad));//a la cantidad existente le resto la cantidad a mover multimplicada por la cantidad del productoComponente
                //         console.log('componente existencia nueva ====> ', existenciaNueva)
                //         values = [existenciaNueva, id_almacen, lista[x].id_producto];
                //         await actualizaProductoAlmacenVenta(values);
                //     }
                //     // res.send(lista);
                // }





            }
            values = [precioDeCostoTotal, id_venta];
            await actualizaPrecioDeCostoTotalVenta(values);
            // req.jhobrosoftsession.empresa = user[0].id_negocio;
            //     req.jhobrosoftsession.sucursal = user[0].id_sucursal;
            //     req.jhobrosoftsession.cartera = user[0].id_cartera;
            let cajero = req.jhobrosoftsession.nombres + " " + req.jhobrosoftsession.apellido;
            let nombre_empresa = req.jhobrosoftsession.nombre_empresa;
            let rnc_empresa = req.jhobrosoftsession.rnc_empresa;
            let nombre_sucursal = req.jhobrosoftsession.nombre_sucursal;
            let provincia_sucursal = req.jhobrosoftsession.provincia_sucursal;
            let direccion_sucursal = req.jhobrosoftsession.direccion_sucursal;
            let telefono_sucursal = req.jhobrosoftsession.telefono_sucursal;
            let email_sucursal = req.jhobrosoftsession.email_sucursal;
            let paddedIdVenta = completaConCerosNumeroFactura(id_venta, 11, '0');
            //aqui se imprime la factura
            await agregarDato("centro", "");
            await agregarDato("centroNegrita", nombre_empresa);
            await agregarDato("centro", nombre_sucursal);
            await agregarDato("centro", `RNC: ${rnc_empresa}, Tel: ${telefono_sucursal}`);
            // await agregarDato("centro", provincia_sucursal);
            await agregarDato("centro", direccion_sucursal);
            await agregarDato("centro", `${email_sucursal}`);

            await agregarDato("centro", "");
            if (condicionVenta == "CONTADO") {
                await agregarDato("centroNegrita", "F A C T U R A");
            } else {
                if (condicionVenta != "presentacion" && condicionVenta != "cajaChica") {
                    await agregarDato("centroNegrita", "F A C T U R A  A  C R E D I T O");
                }
            }
            await agregarDato("centro", "");

            await agregarDato("izquierda", `NCF: ${secuencia[0].secncf}`);//"NCF: B0200000001");
            await agregarDato("extremo", `CAJA: ${caja}`, `FACT. #: ${paddedIdVenta}`);

            // Obtener la fecha y hora actual
            var fechaActual = new Date();
            var fechaActualTexto = fechaActual.toLocaleDateString();
            var horaActualTexto = fechaActual.toLocaleTimeString();

            // Pasar la fecha y hora actual a la función await agregarDato
            await agregarDato("extremo", "FECHA: " + fechaActualTexto, "Hora: " + horaActualTexto);

            if (condicionVenta == "CONTADO") {
                await agregarDato("izquierda", `CONDICION: ${condicionVenta}`);
            } else {
                if (condicionVenta != "presentacion" && condicionVenta != "cajaChica") {
                    await agregarDato("izquierda", `CONDICION: A ${condicionVenta} DÍAS`);
                } else if (condicionVenta == "presentacion") {
                    await agregarDato("izquierda", `CONDICION: A PRESENTACIÓN`);
                } else if (condicionVenta == "cajaChica") {
                    await agregarDato("izquierda", `CONDICION: CAJA CHICA`);
                }
                await agregarDato("lineasGion", "");
                await agregarDato("izquierda", `CLIENTE: ${nombreCliente}`);
                await agregarDato("izquierda", `RNC: ${rncCliente}`);
            }

            await agregarDato("lineasGion", "");
            await agregarDato("izquierda", `VENDEDOR: ${cajero}`);
            if (id_mesa != 0) {
                await agregarDato("izquierda", `CAMARERO: ${await consultaEmpleado(id_camarero)}`);
                await agregarDato("izquierda", `MESA: ${mesa}`);
            }
            await agregarDato("lineasGion", "");
            await agregarDato("centroNegrita", `${comprobante}`);
            await agregarDato("lineasGion", "");
            await agregarDato("encabezado", "DESCRIPCIÓN                    ITBIS   IMPORTE");
            await agregarDato("lineasGion", "");
            await agregarArregloProductosADatos() // una vez cargado los productos del detalle de la factura se cargan al arreglo principal
            await agregarDato("lineasIgual", "");

            await agregarDato("agregarTotales", "         SUBTOTAL......$", null, subTotal);
            await agregarDato("agregarTotales", "         ITBIS.........$", null, masItbis);
            await agregarDato("agregarTotales", "         DESC..........$", null, descuento);
            if (maselservicio != "" && maselservicio != 0) {
                await agregarDato("agregarTotales", "         10% SERV......$", null, maselservicio);
            }
            await agregarDato("agregarTotales", "         TOTAL IMPORTE.$", null, totalCobrar);
            await agregarDato("lineasIgual", "");
            await agregarDato("centroNegrita", `FORMA DE PAGO`);
            await agregarDato("lineasGion", "");
            if (tarjetaDebito != "" && tarjetaDebito != 0) {
                await agregarDato("agregarTotales", "    Tarjeta de débito..$", null, tarjetaDebito);
            }
            if (tarjetaCredito != "" && tarjetaCredito != 0) {
                await agregarDato("agregarTotales", "    Tarjeta de crédito.$", null, tarjetaCredito);
            }
            if (cheque != "" && cheque != 0) {
                await agregarDato("agregarTotales", "    Cheque.............$", null, cheque);
            }
            if (montoNotaCredito != "" && montoNotaCredito != 0) {
                await agregarDato("agregarTotales", "    Nota de crédito....$", null, montoNotaCredito);
            }
            if (pagoConBono != "" && pagoConBono != 0) {
                await agregarDato("agregarTotales", "    Pago con bono......$", null, pagoConBono);
            }
            if (efectivo != "" && efectivo != 0) {
                await agregarDato("agregarTotales", "    Efectivo...........$", null, efectivo);
            }
            if (devolver != "" && devolver != 0) {
                await agregarDato("agregarTotales", "    Devolver...........$", null, devolver);
            }
            if (cuentaPorCobrar != "" && cuentaPorCobrar != 0) {
                await agregarDato("agregarTotales", "    Cuenta por cobrar..$", null, cuentaPorCobrar);
            }

            await agregarDato("centro", "");
            await agregarDato("centro", "");
            await agregarDato("centro", "¡¡¡GRACIAS POR SU COMPRA!!!");
            await agregarDato("imprimir", "");

            //let values = [id_empleado, id_cliente, subTotal, masItbis, descuento, maselservicio, totalCobrar, secuencia[0].secncf, fechaDeVencimiento, tarjetaDebito, tarjetaCredito, cheque, notaCredito, montoNotaCredito, pagoConBono, efectivo, devolver, cuentaPorCobrar, notaVenta, condicionVenta, 'Procesada'];
            // Convertir los datos a una cadena JSON
            var jsonData = JSON.stringify(datosX);
            datosX = [];
            // console.log(jsonData)//
            res.send(jsonData);
        } else {
            res.send('No queda de esta Secuencia');
        }


    } catch (error) {
        console.log("Algo anda mal en la venta temproral Imprime y cobra ====>" + error)
        res.send('Algo anda mal en la venta temproral');
    }
}


controller.fracionarFactura = async (req, res) => {
    // Recibir los datos del cliente desde req.body
    let {
        tablaOriginal,
        tablaFraccion,
        pedidoOriginal,
        id_camarero,
        id_mesa,
        caja,
        id_cliente
    } = req.body;

    try {
        await eliminarVentaTemporal(id_cliente, pedidoOriginal);

        console.log("tablaOriginal =====> ", tablaOriginal)
        console.log("tablaFraccion =====> ", tablaFraccion)

        let id_sucursal = req.jhobrosoftsession.sucursal;
        let id_empleado = req.jhobrosoftsession.id_empleado;
        let resultado = ''
        for (let i = 0; i < tablaOriginal.length; i++) {
            let {
                id_cliente,
                caja,
                id_mesa,
                id_camarero,
                cantidad,
                id_unidad,
                id_producto,
                numero_pedido
            } = tablaOriginal[i];
            if (cantidad > 0) {
                resultado = await guardarProductoVentaTemporal(id_empleado, id_cliente, cantidad, id_unidad, id_producto, 0, cantidad, caja, id_mesa, id_camarero, numero_pedido);
            }

        }

        for (let i = 0; i < tablaFraccion.length; i++) {
            let {
                id_cliente,
                caja,
                id_mesa,
                id_camarero,
                cantidad,
                id_unidad,
                id_producto,
                numero_pedido
            } = tablaFraccion[i];
            if (cantidad > 0) {
                resultado = await guardarProductoVentaTemporal(id_empleado, id_cliente, cantidad, id_unidad, id_producto, 0, cantidad, caja, id_mesa, id_camarero, numero_pedido);
            }
        }

        res.send({ "resultado": resultado });
    } catch (error) {
        console.log("Algo anda mal en la venta temproral Fraccionando====>" + error)
        res.status(500).send('Algo anda mal en la venta temproral Fraccionando');
    }
}


controller.guardarClienteBasico = async (req, res) => {
    const { nombres, apellidos, cedula, rnc, celular, correo } = req.body;
    try {
        // req.jhobrosoftsession.empresa = user[0].id_negocio;
        //         req.jhobrosoftsession.sucursal = user[0].id_sucursal;
        //         req.jhobrosoftsession.cartera = user[0].id_cartera;

        let registradopor = req.jhobrosoftsession.id_empleado;
        let empresa = req.jhobrosoftsession.empresa;
        let sucursal = req.jhobrosoftsession.sucursal;
        let cartera = req.jhobrosoftsession.cartera;
        let estado = 2;
        const data = [nombres, apellidos, rnc, cedula, registradopor, celular, correo, empresa, sucursal, cartera, estado];
        //INSERT INTO `jr_cliente`(`nombres`, `apellidos`, `rnc`, `cedula`, `id_registradopor`, `celular`, `correo`, `id_empresa`, `id_sucursal`, `id_cartera`, `id_estado`) VALUES ( 'Rafael', 'Mendez', '031-0564546-8', '', '', '' )"
        const id_cliente = await guardarClienteBasico(data);
        res.send(`${id_cliente}`);
    } catch (error) {

    }
}
controller.producto_list_filtro = async (req, res) => {
    let { valor } = req.params;
    let { inicio } = req.params;

    if (valor == "aaaaaaaaaaaa") {
        valor = "";
    }
    let nunreg = paginacion;//10;
    let nuevoinicio = (inicio - 1) * nunreg

    const productoes = await producto_list(valor, nuevoinicio, nunreg);
    let registros = await producto_list(valor);
    productoes.push({ registros });
    res.send(productoes);
}

controller.cambiarCliente = async (req, res) => {
    let { id_cliente, id_cliente_nuevo, caja, pedido_abierto, pedido_nuevo, lamesa } = req.body;

    try {
        let detalles = await cambiarCliente(id_cliente_nuevo, id_cliente, caja, pedido_abierto, pedido_nuevo, lamesa);
        console.log("Cliente actualizado")
        res.send(detalles);

    } catch (error) {
        console.log("Algo anda mal en la actualizacion del cliente" + error)
        res.send("No se pudo Asignar el cliente");
    }
}

controller.edit = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const empresa = await edit(id);
    const categoria = await categoria_empresa();
    res.render('empresa_edit', {
        data: empresa[0],
        cat: categoria,
        accesos: req.jhobrosoftsession.accesos
    });
}

controller.update = async (req, res) => {
    const { id } = req.params;
    const { nombre_empresa } = req.body;
    const { razon_social } = req.body;
    const { telefono } = req.body;
    const { rnc } = req.body;
    const { categoria } = req.body;

    const values = [nombre_empresa, razon_social, rnc, telefono, categoria, id];
    const empresa = await update(values);
    res.redirect('/empresa');

}

controller.delete = (req, res) => {


}

controller.facturas = async (req, res) => {
    let { fecha_inicial, fecha_final, estado, valor, inicio } = req.params;
    let values = [fecha_inicial, fecha_final, valor, inicio]
    // console.log("valor de busqueda =======> "+ values)
    if (valor == "aaaaaaaaaaaa") {
        valor = "";
    }
    let nunreg = paginacion;//10;
    let nuevoinicio = (inicio - 1) * nunreg

    const productoes = await facturaList(fecha_inicial, fecha_final, estado, valor, nuevoinicio, nunreg);
    // console.log("las facturas =======> "+ JSON.stringify(productoes))
    let registros = await facturaList(fecha_inicial, fecha_final, estado, valor);

    productoes.push({ registros });
    res.send(productoes);
}

controller.reimprimirFactura = async (req, res) => {
    // Recibir los datos del cliente desde req.body
    let { id_venta, estado } = req.params;

    var datosX = []; // aqui van los datos totales de la factura y este es el array a devolver

    var productosX = []; // aqui van los productos

    async function agregarDato(UbicacionTexto, Texto1, Texto2, Monto) {
        datosX.push({ ubicacionTexto: UbicacionTexto, texto1: `${Texto1}`, texto2: `${Texto2}`, "monto": Monto });
    }

    async function agregarProducto(articulo, cant, unidad, precio, itbis, importe) {
        productosX.push({ articulo, cant, unidad, precio, itbis, importe });
        // console.log("Productos agregados ======>" + JSON.stringify(productosX))
    }

    async function agregarArregloProductosADatos() {
        datosX.push({ productos: productosX }); // Agrega el arreglo de productos al objeto datos
        // console.log("Productos totales agregados ======>" + JSON.stringify(productosX))
    }


    try {
        let valores = [estado, id_venta]
        let factura = await buscarFactura(valores);
        // console.log('Sub total ',)
        let subTotal = factura[0].subtotal.toFixed(2);
        let masItbis = factura[0].total_itbis.toFixed(2);
        let descuento = factura[0].total_descuento.toFixed(2);
        let maselservicio = factura[0].monto_servicio.toFixed(2);
        let totalCobrar = factura[0].total_importe.toFixed(2);
        let montoNotaCredito = factura[0].monto_nota.toFixed(2);
        let tarjetaDebito = factura[0].tarjeta_debito.toFixed(2);
        let pagoConBono = factura[0].bono.toFixed(2);
        let cheque = factura[0].cheque.toFixed(2);
        let tarjetaCredito = factura[0].tarjeta_credito.toFixed(2);
        let cuentaPorCobrar = factura[0].cuenta_por_cobrar.toFixed(2);
        let efectivo = factura[0].efectivo.toFixed(2);
        let devolver = factura[0].devolver.toFixed(2);

        let secuencia = factura[0].secncf;
        let comprobante = factura[0].comprobante;
        comprobante = comprobante.toUpperCase();
        let nombreCliente = factura[0].cliente;
        let rncCliente = factura[0].rnc;
        let condicionVenta = factura[0].condicion;
        let caja = factura[0].caja;
        let id_mesa = factura[0].id_mesa;
        let mesa = factura[0].mesa;
        let id_camarero = factura[0].id_camarero;

        // console.log("NCF =====> ", secuencia) //si el codigo esta presente
        if (secuencia) {
            // console.log("Secuencia =====> ", secuencia[0].secncf)
            let id_sucursal = req.jhobrosoftsession.sucursal;
            let id_empleado = req.jhobrosoftsession.id_empleado

            let tabla = await buscarDetalleFactura(id_venta)
            // console.log('Datos de la tabla =====> ' + tabla)
            for (let i = 0; i < tabla.length; i++) {
                // let [descripcion, cantidad, id_unidad, itbis, precio_venta, importe] = tabla[i];
                let descripcion = tabla[i].descripcion;
                let cantidad = tabla[i].cantidad;
                let id_unidad = tabla[i].id_unidad;
                let itbis = tabla[i].itbis.toFixed(2);
                let precio_venta = tabla[i].precio_venta.toFixed(2);
                let importe = tabla[i].importe.toFixed(2);

                // Reemplazar la coma por un punto en el valor del precio
                // precio_venta = precio_venta.replace(',', '');

                // Convertir el valor del precio_venta a un número de punto flotante
                precio_venta = parseFloat(precio_venta);
                let launidad = await buscarDescripcionUnidad(id_unidad);
                // console.log("Muestro la unidad ======>" + launidad[0].unidad);
                await agregarProducto(descripcion, cantidad, launidad[0].unidad, precio_venta / cantidad, itbis, importe);

                // values = [descuento, precio, cantidad, unidad, id_producto, id_venta];
                // await guardarProductoVenta(values);

                // values = [id_producto, unidad];
                // let factorDeConversion = await consultaFactorDeConversionUnidadProducto(values);
                // let cantidadAMover = factorDeConversion[0].factor_conversion * cantidad;

                // values = [id_producto, id_almacen];
                // let productoAlmacen = await consultaProductoAlmacen(values);
                // let existenciaNueva = parseFloat(productoAlmacen[0].existencia) - parseFloat(cantidadAMover);

                // values = [existenciaNueva, id_almacen, id_producto];
                // await actualizaProductoAlmacenVenta(values);
            }
            // req.jhobrosoftsession.empresa = user[0].id_negocio;
            //     req.jhobrosoftsession.sucursal = user[0].id_sucursal;
            //     req.jhobrosoftsession.cartera = user[0].id_cartera;
            let cajero = req.jhobrosoftsession.nombres + " " + req.jhobrosoftsession.apellido;
            let nombre_empresa = req.jhobrosoftsession.nombre_empresa;
            let rnc_empresa = req.jhobrosoftsession.rnc_empresa;
            let nombre_sucursal = req.jhobrosoftsession.nombre_sucursal;
            let provincia_sucursal = req.jhobrosoftsession.provincia_sucursal;
            let direccion_sucursal = req.jhobrosoftsession.direccion_sucursal;
            let telefono_sucursal = req.jhobrosoftsession.telefono_sucursal;
            let email_sucursal = req.jhobrosoftsession.email_sucursal;
            let paddedIdVenta = completaConCerosNumeroFactura(id_venta, 11, '0');
            //aqui se imprime la factura
            await agregarDato("centro", "");
            await agregarDato("centroNegrita", nombre_empresa);
            await agregarDato("centro", nombre_sucursal);
            await agregarDato("centro", `RNC: ${rnc_empresa}, Tel: ${telefono_sucursal}`);
            // await agregarDato("centro", provincia_sucursal);
            await agregarDato("centro", direccion_sucursal);
            await agregarDato("centro", `${email_sucursal}`);

            await agregarDato("centro", "");
            if (condicionVenta == "CONTADO") {
                await agregarDato("centroNegrita", "F A C T U R A");
            } else {
                if (condicionVenta != "presentacion" && condicionVenta != "cajaChica") {
                    await agregarDato("centroNegrita", "F A C T U R A  A  C R E D I T O");
                }
            }
            await agregarDato("centro", "");

            await agregarDato("izquierda", `NCF: ${secuencia}`);//"NCF: B0200000001");
            await agregarDato("extremo", `CAJA: ${caja}`, `FACT. #: ${paddedIdVenta}`);

            // Obtener la fecha y hora actual
            let fecha = new Date(factura[0].fecha);
            let hora = fecha.getHours(); // Obtiene la hora (formato de 24 horas)
            let minutos = fecha.getMinutes(); // Obtiene los minutos
            let segundos = fecha.getSeconds(); // Obtiene los segundos

            let dia = fecha.getDate(); // Obtiene el día del mes
            let mes = fecha.getMonth() + 1; // Obtiene el mes (los meses comienzan en 0, por lo que se suma 1)
            let año = fecha.getFullYear(); // Obtiene el año

            // Formatear correctamente las variables numéricas a cadenas de texto
            var diaTexto = dia < 10 ? '0' + dia : dia.toString();
            var mesTexto = mes < 10 ? '0' + mes : mes.toString();
            var añoTexto = año.toString();
            var horaTexto = hora < 10 ? '0' + hora : hora.toString();
            var minutosTexto = minutos < 10 ? '0' + minutos : minutos.toString();
            var segundosTexto = segundos < 10 ? '0' + segundos : segundos.toString();

            var fechaActualTexto = `${diaTexto}/${mesTexto}/${añoTexto}`;
            var horaActualTexto = `${horaTexto}:${minutosTexto}:${segundosTexto}`;

            // Pasar la fecha y hora actual a la función await agregarDato
            await agregarDato("extremo", "FECHA: " + fechaActualTexto, "Hora: " + horaActualTexto);

            if (condicionVenta == "CONTADO") {
                await agregarDato("izquierda", `CONDICION: ${condicionVenta}`);
            } else {
                if (condicionVenta != "presentacion" && condicionVenta != "cajaChica") {
                    await agregarDato("izquierda", `CONDICION: A ${condicionVenta} DÍAS`);
                } else if (condicionVenta == "presentacion") {
                    await agregarDato("izquierda", `CONDICION: A PRESENTACIÓN`);
                } else if (condicionVenta == "cajaChica") {
                    await agregarDato("izquierda", `CONDICION: CAJA CHICA`);
                }
                await agregarDato("lineasGion", "");
                await agregarDato("izquierda", `CLIENTE: ${nombreCliente}`);
                await agregarDato("izquierda", `RNC: ${rncCliente}`);
            }

            await agregarDato("lineasGion", "");
            await agregarDato("izquierda", `VENDEDOR: ${cajero}`);
            if (id_mesa != 0) {
                await agregarDato("izquierda", `CAMARERO: ${await consultaEmpleado(id_camarero)}`);
                await agregarDato("izquierda", `MESA: ${mesa}`);
            }
            await agregarDato("lineasGion", "");
            await agregarDato("centroNegrita", `${comprobante}`);
            await agregarDato("lineasGion", "");
            await agregarDato("encabezado", "DESCRIPCIÓN                    ITBIS   IMPORTE");
            await agregarDato("lineasGion", "");
            await agregarArregloProductosADatos() // una vez cargado los productos del detalle de la factura se cargan al arreglo principal
            await agregarDato("lineasIgual", "");

            await agregarDato("agregarTotales", "         SUBTOTAL......$", null, subTotal);
            await agregarDato("agregarTotales", "         ITBIS.........$", null, masItbis);
            await agregarDato("agregarTotales", "         DESC..........$", null, descuento);
            if (maselservicio != "" && maselservicio != 0) {
                await agregarDato("agregarTotales", "         10% SERV......$", null, maselservicio);
            }
            await agregarDato("agregarTotales", "         TOTAL IMPORTE.$", null, totalCobrar);
            await agregarDato("lineasIgual", "");
            await agregarDato("centroNegrita", `FORMA DE PAGO`);
            await agregarDato("lineasGion", "");
            if (tarjetaDebito != "" && tarjetaDebito != 0) {
                await agregarDato("agregarTotales", "    Tarjeta de débito..$", null, tarjetaDebito);
            }
            if (tarjetaCredito != "" && tarjetaCredito != 0) {
                await agregarDato("agregarTotales", "    Tarjeta de crédito.$", null, tarjetaCredito);
            }
            if (cheque != "" && cheque != 0) {
                await agregarDato("agregarTotales", "    Cheque.............$", null, cheque);
            }
            if (montoNotaCredito != "" && montoNotaCredito != 0) {
                await agregarDato("agregarTotales", "    Nota de crédito....$", null, montoNotaCredito);
            }
            if (pagoConBono != "" && pagoConBono != 0) {
                await agregarDato("agregarTotales", "    Pago con bono......$", null, pagoConBono);
            }
            if (efectivo != "" && efectivo != 0) {
                await agregarDato("agregarTotales", "    Efectivo...........$", null, efectivo);
            }
            if (devolver != "" && devolver != 0) {
                await agregarDato("agregarTotales", "    Devolver...........$", null, devolver);
            }
            if (cuentaPorCobrar != "" && cuentaPorCobrar != 0) {
                await agregarDato("agregarTotales", "    Cuenta por cobrar..$", null, cuentaPorCobrar);
            }

            await agregarDato("centro", "");
            await agregarDato("centro", "");
            await agregarDato("centro", "¡¡¡GRACIAS POR SU COMPRA!!!");
            await agregarDato("centro", "-copia-");
            await agregarDato("imprimir", "");

            //let values = [id_empleado, id_cliente, subTotal, masItbis, descuento, maselservicio, totalCobrar, secuencia[0].secncf, fechaDeVencimiento, tarjetaDebito, tarjetaCredito, cheque, notaCredito, montoNotaCredito, pagoConBono, efectivo, devolver, cuentaPorCobrar, notaVenta, condicionVenta, 'Procesada'];
            // Convertir los datos a una cadena JSON
            var jsonData = JSON.stringify(datosX);
            console.log(jsonData)
            res.send(jsonData);
        }


    } catch (error) {
        console.log("Algo anda mal en la venta temproral Imprime y cobra ====>" + error)
        res.send('Algo anda mal en la venta temproral');
    }
}

controller.verFacturaConDetalle = async (req, res) => {
    // Recibir los datos del cliente desde req.body
    let { id_venta, estado } = req.body;
    var datosX = [];

    try {
        let valores = [estado, id_venta]
        let factura = await buscarFactura(valores);
        datosX.push(factura)
        let tabla = await buscarDetalleFactura(id_venta)
        datosX.push(tabla)

        var jsonData = JSON.stringify(datosX);
        console.log(jsonData)
        res.send(jsonData);


    } catch (error) {
        console.log("Algo anda mal en la venta temproral Imprime y cobra ====>" + error)
        res.send('Algo anda mal en la venta temproral');
    }
}

function montoEnLetras(monto) {
    // Arrays de palabras para unidades, decenas y centenas
    const unidades = ["", "UN", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
    const decenas = ["", "DIEZ", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
    const centenas = ["", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];

    // Función para convertir un número en letras
    function convertirNumeroEnLetras(numero) {
        if (numero < 10) {
            return unidades[numero];
        } else if (numero < 20) {
            const especiales = ["DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE"];
            return especiales[numero - 10] || ("DIECI" + unidades[numero - 10]);
        } else if (numero < 100) {
            const unidad = numero % 10;
            const decena = Math.floor(numero / 10);
            return decenas[decena] + (unidad !== 0 ? (" Y " + unidades[unidad]) : "");
        } else if (numero === 100) {
            return "CIEN";
        } else if (numero > 100 && numero < 1000) {
            const centena = Math.floor(numero / 100);
            const resto = numero % 100;
            return centenas[centena] + (resto !== 0 ? (" " + convertirNumeroEnLetras(resto)) : "");
        }
    }

    // Función principal para convertir el monto en letras
    function convertirMonto(monto) {
        const montoEntero = Math.floor(monto);
        const montoDecimal = Math.round((monto - montoEntero) * 100);

        let montoEnLetras = "";

        if (montoEntero === 1) {
            montoEnLetras = "UN PESO";
        } else if (montoEntero > 1) {
            montoEnLetras = convertirNumeroEnLetras(montoEntero) + " PESOS";
        }

        if (montoDecimal > 0) {
            montoEnLetras += ` CON ${montoDecimal < 10 ? "0" + montoDecimal : montoDecimal}/100`;
        }

        if (montoEntero === 0 && montoDecimal === 0) {
            montoEnLetras = "CERO PESOS"; // Agregar manejo del caso cero
        }

        return montoEnLetras;
    }

    return convertirMonto(monto);
}
// Debería imprimir "SEISCIENTOS NUEVE PESOS"


function calcularFecha30DiasDespues() {
    // Obtiene la fecha actual
    const fechaActual = new Date();

    // Calcula la fecha 30 días después
    const fecha30DiasDespues = new Date(fechaActual);
    fecha30DiasDespues.setDate(fecha30DiasDespues.getDate() + 30);

    // Formatea la fecha en el formato deseado (por ejemplo, "YYYY-MM-DD")
    const anio = fecha30DiasDespues.getFullYear();
    const mes = String(fecha30DiasDespues.getMonth() + 1).padStart(2, '0'); // Suma 1 al mes porque en JavaScript los meses comienzan en 0
    const dia = String(fecha30DiasDespues.getDate()).padStart(2, '0');

    // Devuelve la fecha formateada
    return `${anio}-${mes}-${dia}`;
}

controller.anularFactura = async (req, res) => {
    // Recibir los datos del cliente desde req.body
    const { tabla, subTotalDevolver, masItbisDevolver, descuentoDevolver, totalDevuelto, id_venta, comentario, llevaNotaCredito, id_almacen, estado } = req.body;

    var datosX = []; // aqui van los datos totales de la factura y este es el array a devolver

    var productosX = []; // aqui van los productos

    async function agregarDato(UbicacionTexto, Texto1, Texto2, Monto) {
        datosX.push({ ubicacionTexto: UbicacionTexto, texto1: `${Texto1}`, texto2: `${Texto2}`, "monto": Monto });
    }

    async function agregarProducto(articulo, cant, unidad, precio, itbis, importe) {
        productosX.push({ articulo, cant, unidad, precio, itbis, importe });
        // console.log("Productos agregados ======>" + JSON.stringify(productosX))
    }

    async function agregarArregloProductosADatos() {
        datosX.push({ productos: productosX }); // Agrega el arreglo de productos al objeto datos
        // console.log("Productos totales agregados ======>" + JSON.stringify(productosX))
    }

    if (totalDevuelto > 0) {

    }
    let id_empleado = req.jhobrosoftsession.id_empleado;

    let valores = [estado, id_venta]
    let factura = await buscarFactura(valores);
    // console.log('Sub total ',)
    let subTotal = factura[0].subtotal.toFixed(2);
    let masItbis = factura[0].total_itbis.toFixed(2);
    let descuento = factura[0].total_descuento.toFixed(2);
    let maselservicio = factura[0].monto_servicio.toFixed(2);
    let totalCobrar = factura[0].total_importe.toFixed(2);
    let montoNotaCredito = factura[0].monto_nota.toFixed(2);
    let tarjetaDebito = factura[0].tarjeta_debito.toFixed(2);
    let pagoConBono = factura[0].bono.toFixed(2);
    let cheque = factura[0].cheque.toFixed(2);
    let tarjetaCredito = factura[0].tarjeta_credito.toFixed(2);
    let cuentaPorCobrar = factura[0].cuenta_por_cobrar.toFixed(2);
    let efectivo = factura[0].efectivo.toFixed(2);
    let devolver = factura[0].devolver.toFixed(2);

    let secncf_afectado = factura[0].secncf;
    let comprobante = factura[0].comprobante;
    comprobante = comprobante.toUpperCase();
    let id_cliente = factura[0].id_cliente;
    let nombreCliente = factura[0].cliente;
    let rncCliente = factura[0].rnc;
    let condicionVenta = factura[0].condicion;
    let cajero = factura[0].cajero;
    let caja = factura[0].caja;
    let numeroFacturaOriginal = factura[0].factura;

    // Ahora puedes acceder a los datos recibidos desde el cliente
    console.log('Datos de la tabla:', tabla);
    console.log('subTotalDevolver:', subTotalDevolver);
    console.log('masItbisDevolver:', masItbisDevolver);
    console.log('descuentoDevolver:', descuentoDevolver);
    console.log('totalDevuelto:', totalDevuelto);
    console.log('id_venta:', id_venta);


    //`id_empleado`, `id_cliente`, `subtotal`, `total_itbis`, `total_descuento`, `monto_servicio`, `total_importe`, `monto_en_letra`, `secncf_afectado`, `secncf_nota`, `fecha_vencimiento`, `comentario`, `condicion`, `estatus`, `id_venta`
    // Realiza cualquier procesamiento adicional aquí
    let montoServicio = subTotalDevolver * 0.1;

    const totalDevueltoEnLetras = montoEnLetras(totalDevuelto);
    // console.log(totalDevueltoEnLetras); // Salida: "MIL DOSCIENTOS TREINTA Y CUATRO PESOS CON 56/100"

    let secncf_nota = ""
    let codncf = 4// codigo del comprobante de nota de credito
    if (llevaNotaCredito) {
        // aqui se debe buscar un numero de nota de credito
        let secuencia = await consultaSecuenciaComprobante(codncf);
        // console.log("NCF =====> ", secuencia) //si el codigo esta presente
        if (secuencia) {
            let precioDeCostoTotal = 0;
            // console.log("Secuencia =====> ", secuencia[0].secncf)
            let id_sucursal = req.jhobrosoftsession.sucursal;
            let id_empleado = req.jhobrosoftsession.id_empleado

            await actualizarSecuenciaComprobante(id_sucursal, secuencia[0].secncf, codncf);
            secncf_nota = secuencia[0].secncf;
        }
    }

    // Enviar una respuesta al cliente si es necesario
    // res.send('Datos recibidos con éxito');
    let fecha_vencimiento = calcularFecha30DiasDespues()
    var dataAGuardar = [id_empleado, id_cliente, subTotalDevolver, masItbisDevolver, descuentoDevolver, montoServicio, totalDevuelto, totalDevueltoEnLetras, secncf_afectado, secncf_nota, fecha_vencimiento, comentario, 'Pendiente', 'Disponible', id_venta];

    try {
        let idDevoculcion = await guardarDevolucion(dataAGuardar);
        console.log("La tabla ===> ", tabla)

        let pendiente = 0;
        for (let i = 0; i < tabla.length; i++) {
            const item = tabla[i];
            let values = [item.id_producto, item.unidad];

            let factorDeConversion = await consultaFactorDeConversionUnidadProducto(values);
            console.log('trae el factor de conversion ', values);
            console.log('factor de conversion ', factorDeConversion[0].factor_conversion);
            let productoPrecioCompra = await consultaProductoPrecioCompra(item.id_producto);
            let precio_compra = productoPrecioCompra[0].precio_compra;

            let precioDeCosto = precio_compra * factorDeConversion[0].factor_conversion * item.cantidad_devuelta;
            pendiente += item.cantidad_pendiente - item.cantidad_devuelta;
            values = [
                item.importe,
                item.subtotal,
                item.precio_venta,
                item.descuento,
                item.itbis,
                item.cantidad,
                item.cantidad_devuelta,
                item.unidad,
                precio_compra,
                precioDeCosto,
                idDevoculcion,
                item.id_producto,
                /* Agrega aquí los valores restantes que deseas enviar */
            ];

            if (item.cantidad_devuelta > 0) {
                const resultado = await guardarDetalleDevolucion(values);

                values = [item.cantidad_devuelta, item.id_producto, id_venta];
                await restarCantidadPendienteAlProductoActualDeLaFactura(values);

                values = [item.id_producto, id_almacen];
                console.log('Values para consultar Producto     ', values);
                let producto = await consultaProductoAlmacen(values);

                console.log('Datos del producto     ', producto);
                if (producto != '') {
                    console.log('Leo los datos del producto update =====> ', producto[0].existencia);
                    let existenciaNueva = parseFloat(producto[0].existencia) + parseFloat(item.cantidad_devuelta);
                    values = [id_almacen, existenciaNueva, 'En servicio', id_almacen, item.id_producto];
                    await actualizaProductoAlmacen(values);
                } else {
                    values = [item.cantidad_devuelta, 'En servicio', item.id_producto, id_almacen];
                    console.log('Producto nuevo Insert ', values);
                    await guardaProductoAlmacen(values);
                }
                let precio_venta = parseFloat(item.precio_venta);
                let launidad = await buscarDescripcionUnidad(item.unidad);
                await agregarProducto(item.descripcion, item.cantidad_devuelta, launidad[0].unidad, precio_venta / item.cantidad_devuelta, item.itbis / item.cantidad_devuelta, item.importe / item.cantidad_devuelta);
            }


        }
        console.log("Valor Pendiente ------> ", pendiente)
        if (pendiente == 0) {
            console.log("Pendiente es igual ------> ", pendiente)
            console.log("Se coloca el estado de la factura iguala  ------> ", 'Anulada')
            const datos = ['Anulada', id_venta];
            await cambiarEstadoFactura(datos)
        }
        let leatendio = req.jhobrosoftsession.nombres + " " + req.jhobrosoftsession.apellido;
        let nombre_empresa = req.jhobrosoftsession.nombre_empresa;
        let rnc_empresa = req.jhobrosoftsession.rnc_empresa;
        let nombre_sucursal = req.jhobrosoftsession.nombre_sucursal;
        let provincia_sucursal = req.jhobrosoftsession.provincia_sucursal;
        let direccion_sucursal = req.jhobrosoftsession.direccion_sucursal;
        let telefono_sucursal = req.jhobrosoftsession.telefono_sucursal;
        let email_sucursal = req.jhobrosoftsession.email_sucursal;
        let numeroDeNota = completaConCerosNumeroFactura(idDevoculcion, 11, '0');

        //aqui se imprime la factura
        await agregarDato("centro", "");
        await agregarDato("centroNegrita", nombre_empresa);
        await agregarDato("centro", nombre_sucursal);
        await agregarDato("centro", `RNC: ${rnc_empresa}, Tel: ${telefono_sucursal}`);
        // await agregarDato("centro", provincia_sucursal);
        await agregarDato("centro", direccion_sucursal);
        await agregarDato("centro", `${email_sucursal}`);

        await agregarDato("centro", "");
        await agregarDato("centroNegrita", "AUTORIZADO POR DGII");
        // if (condicionVenta == "CONTADO") {
        //     await agregarDato("centroNegrita", "AUTORIZADO POR DGII");
        // } else {
        //     if (condicionVenta != "presentacion" && condicionVenta != "cajaChica") {
        //         await agregarDato("centroNegrita", "F A C T U R A  A  C R E D I T O");
        //     }
        // }
        await agregarDato("centro", "");
        await agregarDato("izquierda", `FACTURA ORIGINAL: ${numeroFacturaOriginal}`);//"NCF: B0200000001");
        await agregarDato("izquierda", `NCF AFECTADO: ${secncf_afectado}`);//"NCF: B0200000001");
        if (secncf_nota) {
            await agregarDato("izquierda", `NCF DE NOTA: ${secncf_nota}`);//"NCF: B0200000001");
        }

        await agregarDato("extremo", `CAJA: ${caja}`, `NOTA. #: ${numeroDeNota}`);
        //factura[0].fecha
        // Obtener la fecha y hora actual
        // aqui se deberia consultar la devolucion guardada para colocar la fecha exacta
        let fecha = new Date();
        let hora = fecha.getHours(); // Obtiene la hora (formato de 24 horas)
        let minutos = fecha.getMinutes(); // Obtiene los minutos
        let segundos = fecha.getSeconds(); // Obtiene los segundos

        let dia = fecha.getDate(); // Obtiene el día del mes
        let mes = fecha.getMonth() + 1; // Obtiene el mes (los meses comienzan en 0, por lo que se suma 1)
        let año = fecha.getFullYear(); // Obtiene el año

        // Formatear correctamente las variables numéricas a cadenas de texto
        var diaTexto = dia < 10 ? '0' + dia : dia.toString();
        var mesTexto = mes < 10 ? '0' + mes : mes.toString();
        var añoTexto = año.toString();
        var horaTexto = hora < 10 ? '0' + hora : hora.toString();
        var minutosTexto = minutos < 10 ? '0' + minutos : minutos.toString();
        var segundosTexto = segundos < 10 ? '0' + segundos : segundos.toString();

        var fechaActualTexto = `${diaTexto}/${mesTexto}/${añoTexto}`;
        var horaActualTexto = `${horaTexto}:${minutosTexto}:${segundosTexto}`;

        // Pasar la fecha y hora actual a la función await agregarDato
        await agregarDato("extremo", "FECHA: " + fechaActualTexto, "Hora: " + horaActualTexto);

        await agregarDato("lineasGion", "");
        await agregarDato("izquierda", `CAJERO: ${cajero}`);
        await agregarDato("lineasGion", "");
        await agregarDato("izquierda", `CLIENTE: ${nombreCliente}`);
        await agregarDato("izquierda", `RNC: ${rncCliente}`);

        await agregarDato("lineasGion", "");
        await agregarDato("centroNegrita", `NOTA CRÉDITO PARA CRÉDITO FÍSCAL`);
        await agregarDato("lineasGion", "");
        await agregarDato("encabezado", "DESCRIPCIÓN                    ITBIS   IMPORTE");
        await agregarDato("lineasGion", "");
        await agregarArregloProductosADatos() // una vez cargado los productos del detalle de la factura se cargan al arreglo principal
        await agregarDato("lineasIgual", "");

        await agregarDato("agregarTotales", "         SUBTOTAL......$", null, subTotalDevolver);
        await agregarDato("agregarTotales", "         ITBIS.........$", null, masItbisDevolver);
        await agregarDato("agregarTotales", "         DESC..........$", null, descuentoDevolver);
        if (maselservicio != "" && maselservicio != 0) {
            await agregarDato("agregarTotales", "         10% SERV......$", null, maselservicio);
        }
        await agregarDato("agregarTotales", "         MONTO EN NOTA.$", null, totalDevuelto);
        await agregarDato("lineasIgual", "");
        await agregarDato("centroNegrita", `D E V O L U C I O N`);
        await agregarDato("centro", `Ésta nota debe ser usada antes del ${fecha_vencimiento}`);
        await agregarDato("centro", `de lo contrario no será válida.`);
        await agregarDato("lineasGion", "");
        await agregarDato("izquierda", `Le atendió: ${leatendio}`);
        await agregarDato("centro", "");
        await agregarDato("centro", "");
        await agregarDato("centro", "¡¡¡SERVIMOS PARA TI!!!");
        await agregarDato("centro", "");
        await agregarDato("imprimir", "");

        //let values = [id_empleado, id_cliente, subTotal, masItbis, descuento, maselservicio, totalCobrar, secuencia[0].secncf, fechaDeVencimiento, tarjetaDebito, tarjetaCredito, cheque, notaCredito, montoNotaCredito, pagoConBono, efectivo, devolver, cuentaPorCobrar, notaVenta, condicionVenta, 'Procesada'];
        // Convertir los datos a una cadena JSON
        var jsonData = JSON.stringify(datosX);
        console.log(jsonData)
        res.send(jsonData);



        // var jsonData = JSON.stringify(idDevoculcion);
        // console.log(jsonData)
        // res.send(jsonData);


    } catch (error) {
        console.log("Algo anda mal en la venta temproral Imprime y cobra ====>" + error)
        res.send('Algo anda mal en la venta temproral');
    }
}



async function name(params) {
    var datosX = []; // aqui van los datos totales de la factura y este es el array a devolver

    var productosX = []; // aqui van los productos

    async function agregarDato(UbicacionTexto, Texto1, Texto2, Monto) {
        datosX.push({ ubicacionTexto: UbicacionTexto, texto1: `${Texto1}`, texto2: `${Texto2}`, "monto": Monto });
    }

    async function agregarProducto(articulo, cant, unidad, precio, itbis, importe) {
        productosX.push({ articulo, cant, unidad, precio, itbis, importe });
        // console.log("Productos agregados ======>" + JSON.stringify(productosX))
    }

    async function agregarArregloProductosADatos() {
        datosX.push({ productos: productosX }); // Agrega el arreglo de productos al objeto datos
        // console.log("Productos totales agregados ======>" + JSON.stringify(productosX))
    }


    try {
        let factura = await buscarFactura(id_venta);
        // console.log('Sub total ',)
        let subTotal = factura[0].subtotal.toFixed(2);
        let masItbis = factura[0].total_itbis.toFixed(2);
        let descuento = factura[0].total_descuento.toFixed(2);
        let maselservicio = factura[0].monto_servicio.toFixed(2);
        let totalCobrar = factura[0].total_importe.toFixed(2);
        let montoNotaCredito = factura[0].monto_nota.toFixed(2);
        let tarjetaDebito = factura[0].tarjeta_debito.toFixed(2);
        let pagoConBono = factura[0].bono.toFixed(2);
        let cheque = factura[0].cheque.toFixed(2);
        let tarjetaCredito = factura[0].tarjeta_credito.toFixed(2);
        let cuentaPorCobrar = factura[0].cuenta_por_cobrar.toFixed(2);
        let efectivo = factura[0].efectivo.toFixed(2);
        let devolver = factura[0].devolver.toFixed(2);

        let secuencia = factura[0].secncf;
        let comprobante = factura[0].comprobante;
        comprobante = comprobante.toUpperCase();
        let nombreCliente = factura[0].cliente;
        let rncCliente = factura[0].rnc;
        let condicionVenta = factura[0].condicion;
        // console.log("NCF =====> ", secuencia) //si el codigo esta presente
        if (secuencia) {
            // console.log("Secuencia =====> ", secuencia[0].secncf)
            let id_sucursal = req.jhobrosoftsession.sucursal;
            let id_empleado = req.jhobrosoftsession.id_empleado

            let tabla = await buscarDetalleFactura(id_venta)
            // console.log('Datos de la tabla =====> ' + tabla)
            for (let i = 0; i < tabla.length; i++) {
                // let [descripcion, cantidad, id_unidad, itbis, precio_venta, importe] = tabla[i];
                let descripcion = tabla[i].descripcion;
                let cantidad = tabla[i].cantidad;
                let id_unidad = tabla[i].id_unidad;
                let itbis = tabla[i].itbis.toFixed(2);
                let precio_venta = tabla[i].precio_venta.toFixed(2);
                let importe = tabla[i].importe.toFixed(2);

                // Reemplazar la coma por un punto en el valor del precio
                // precio_venta = precio_venta.replace(',', '');

                // Convertir el valor del precio_venta a un número de punto flotante
                precio_venta = parseFloat(precio_venta);
                let launidad = await buscarDescripcionUnidad(id_unidad);
                // console.log("Muestro la unidad ======>" + launidad[0].unidad);
                await agregarProducto(descripcion, cantidad, launidad[0].unidad, precio_venta / cantidad, itbis, importe);

                // values = [descuento, precio, cantidad, unidad, id_producto, id_venta];
                // await guardarProductoVenta(values);

                // values = [id_producto, unidad];
                // let factorDeConversion = await consultaFactorDeConversionUnidadProducto(values);
                // let cantidadAMover = factorDeConversion[0].factor_conversion * cantidad;

                // values = [id_producto, id_almacen];
                // let productoAlmacen = await consultaProductoAlmacen(values);
                // let existenciaNueva = parseFloat(productoAlmacen[0].existencia) - parseFloat(cantidadAMover);

                // values = [existenciaNueva, id_almacen, id_producto];
                // await actualizaProductoAlmacenVenta(values);
            }
            // req.jhobrosoftsession.empresa = user[0].id_negocio;
            //     req.jhobrosoftsession.sucursal = user[0].id_sucursal;
            //     req.jhobrosoftsession.cartera = user[0].id_cartera;
            let cajero = req.jhobrosoftsession.nombres + " " + req.jhobrosoftsession.apellido;
            let nombre_empresa = req.jhobrosoftsession.nombre_empresa;
            let rnc_empresa = req.jhobrosoftsession.rnc_empresa;
            let nombre_sucursal = req.jhobrosoftsession.nombre_sucursal;
            let provincia_sucursal = req.jhobrosoftsession.provincia_sucursal;
            let direccion_sucursal = req.jhobrosoftsession.direccion_sucursal;
            let telefono_sucursal = req.jhobrosoftsession.telefono_sucursal;
            let email_sucursal = req.jhobrosoftsession.email_sucursal;
            let paddedIdVenta = completaConCerosNumeroFactura(id_venta, 11, '0');
            //aqui se imprime la factura
            await agregarDato("centro", "");
            await agregarDato("centroNegrita", nombre_empresa);
            await agregarDato("centro", nombre_sucursal);
            await agregarDato("centro", `RNC: ${rnc_empresa}, Tel: ${telefono_sucursal}`);
            // await agregarDato("centro", provincia_sucursal);
            await agregarDato("centro", direccion_sucursal);
            await agregarDato("centro", `${email_sucursal}`);

            await agregarDato("centro", "");
            if (condicionVenta == "CONTADO") {
                await agregarDato("centroNegrita", "F A C T U R A");
            } else {
                if (condicionVenta != "presentacion" && condicionVenta != "cajaChica") {
                    await agregarDato("centroNegrita", "F A C T U R A  A  C R E D I T O");
                }
            }
            await agregarDato("centro", "");

            await agregarDato("izquierda", `NCF: ${secuencia}`);//"NCF: B0200000001");
            await agregarDato("extremo", "CAJA: 02", `FACT. #: ${paddedIdVenta}`);

            // Obtener la fecha y hora actual
            let fecha = new Date(factura[0].fecha);
            let hora = fecha.getHours(); // Obtiene la hora (formato de 24 horas)
            let minutos = fecha.getMinutes(); // Obtiene los minutos
            let segundos = fecha.getSeconds(); // Obtiene los segundos

            let dia = fecha.getDate(); // Obtiene el día del mes
            let mes = fecha.getMonth() + 1; // Obtiene el mes (los meses comienzan en 0, por lo que se suma 1)
            let año = fecha.getFullYear(); // Obtiene el año

            // Formatear correctamente las variables numéricas a cadenas de texto
            var diaTexto = dia < 10 ? '0' + dia : dia.toString();
            var mesTexto = mes < 10 ? '0' + mes : mes.toString();
            var añoTexto = año.toString();
            var horaTexto = hora < 10 ? '0' + hora : hora.toString();
            var minutosTexto = minutos < 10 ? '0' + minutos : minutos.toString();
            var segundosTexto = segundos < 10 ? '0' + segundos : segundos.toString();

            var fechaActualTexto = `${diaTexto}/${mesTexto}/${añoTexto}`;
            var horaActualTexto = `${horaTexto}:${minutosTexto}:${segundosTexto}`;

            // Pasar la fecha y hora actual a la función await agregarDato
            await agregarDato("extremo", "FECHA: " + fechaActualTexto, "Hora: " + horaActualTexto);

            if (condicionVenta == "CONTADO") {
                await agregarDato("izquierda", `CONDICION: ${condicionVenta}`);
            } else {
                if (condicionVenta != "presentacion" && condicionVenta != "cajaChica") {
                    await agregarDato("izquierda", `CONDICION: A ${condicionVenta} DÍAS`);
                } else if (condicionVenta == "presentacion") {
                    await agregarDato("izquierda", `CONDICION: A PRESENTACIÓN`);
                } else if (condicionVenta == "cajaChica") {
                    await agregarDato("izquierda", `CONDICION: CAJA CHICA`);
                }
                await agregarDato("lineasGion", "");
                await agregarDato("izquierda", `CLIENTE: ${nombreCliente}`);
                await agregarDato("izquierda", `RNC: ${rncCliente}`);
            }

            await agregarDato("lineasGion", "");
            await agregarDato("izquierda", `VENDEDOR: ${cajero}`);
            await agregarDato("lineasGion", "");
            await agregarDato("centroNegrita", `${comprobante}`);
            await agregarDato("lineasGion", "");
            await agregarDato("encabezado", "DESCRIPCIÓN                    ITBIS   IMPORTE");
            await agregarDato("lineasGion", "");
            await agregarArregloProductosADatos() // una vez cargado los productos del detalle de la factura se cargan al arreglo principal
            await agregarDato("lineasIgual", "");

            await agregarDato("agregarTotales", "         SUBTOTAL......$", null, subTotal);
            await agregarDato("agregarTotales", "         ITBIS.........$", null, masItbis);
            await agregarDato("agregarTotales", "         DESC..........$", null, descuento);
            if (maselservicio != "" && maselservicio != 0) {
                await agregarDato("agregarTotales", "         10% SERV......$", null, maselservicio);
            }
            await agregarDato("agregarTotales", "         TOTAL IMPORTE.$", null, totalCobrar);
            await agregarDato("lineasIgual", "");
            await agregarDato("centroNegrita", `FORMA DE PAGO`);
            await agregarDato("lineasGion", "");
            if (tarjetaDebito != "" && tarjetaDebito != 0) {
                await agregarDato("agregarTotales", "    Tarjeta de débito..$", null, tarjetaDebito);
            }
            if (tarjetaCredito != "" && tarjetaCredito != 0) {
                await agregarDato("agregarTotales", "    Tarjeta de crédito.$", null, tarjetaCredito);
            }
            if (cheque != "" && cheque != 0) {
                await agregarDato("agregarTotales", "    Cheque.............$", null, cheque);
            }
            if (montoNotaCredito != "" && montoNotaCredito != 0) {
                await agregarDato("agregarTotales", "    Nota de crédito....$", null, montoNotaCredito);
            }
            if (pagoConBono != "" && pagoConBono != 0) {
                await agregarDato("agregarTotales", "    Pago con bono......$", null, pagoConBono);
            }
            if (efectivo != "" && efectivo != 0) {
                await agregarDato("agregarTotales", "    Efectivo...........$", null, efectivo);
            }
            if (devolver != "" && devolver != 0) {
                await agregarDato("agregarTotales", "    Devolver...........$", null, devolver);
            }
            if (cuentaPorCobrar != "" && cuentaPorCobrar != 0) {
                await agregarDato("agregarTotales", "    Cuenta por cobrar..$", null, cuentaPorCobrar);
            }

            await agregarDato("centro", "");
            await agregarDato("centro", "");
            await agregarDato("centro", "¡¡¡GRACIAS POR SU COMPRA!!!");
            await agregarDato("centro", "-copia-");
            await agregarDato("imprimir", "");

            //let values = [id_empleado, id_cliente, subTotal, masItbis, descuento, maselservicio, totalCobrar, secuencia[0].secncf, fechaDeVencimiento, tarjetaDebito, tarjetaCredito, cheque, notaCredito, montoNotaCredito, pagoConBono, efectivo, devolver, cuentaPorCobrar, notaVenta, condicionVenta, 'Procesada'];
            // Convertir los datos a una cadena JSON
            var jsonData = JSON.stringify(datosX);
            console.log(jsonData)
            res.send(jsonData);
        }


    } catch (error) {
        console.log("Algo anda mal en la venta temproral Imprime y cobra ====>" + error)
        res.send('Algo anda mal en la venta temproral');
    }
}


controller.consultaEmpleadoReporte = async (req, res) => {
    let { sucursal, valor } = req.params;
    try {
        if (valor == "aaaaaaaaaaaa") {
            valor = "";
        }
        let empresa = req.jhobrosoftsession.empresa;

        const empleados = await consultaEmpleadoReporte(empresa, sucursal, valor);
        // console.log(empleados)
        res.send(empleados);
    } catch (error) {

    }
}

controller.consultaCajaReporte = async (req, res) => {
    const { sucursal } = req.params;
    try {

        let empresa = req.jhobrosoftsession.empresa;

        const data = [empresa, sucursal];
        const cajas = await consultaCajaReporte(data);
        res.send(cajas);
    } catch (error) {

    }
}

controller.consultaTurnoReporte = async (req, res) => {
    const { sucursal } = req.params;
    try {

        let empresa = req.jhobrosoftsession.empresa;

        const data = [empresa, sucursal];
        const turnos = await consultaTurnoReporte(data);
        res.send(turnos);
    } catch (error) {

    }
}

controller.filtroReporte = async (req, res) => {

    const { sucursal, fechaInicial, fechaFinal, estadoFactura, condicionVenta, idEmpleado, caja, turno, idUnidadProducto, idProducto, idCliente, rncCliente } = req.body;

    try {
        // console.log('ID empleado =========>',idEmpleado)
        let resultados = [];
        let reporteDetalle = await filtroReporte(sucursal, fechaInicial, fechaFinal, estadoFactura, condicionVenta, idEmpleado, caja, turno, idUnidadProducto, idProducto, idCliente, rncCliente);
        let resultadosTiposDePago = await filtroReporteTiposDePago(sucursal, fechaInicial, fechaFinal, estadoFactura, condicionVenta, idEmpleado, caja, turno, idUnidadProducto, idProducto, idCliente, rncCliente);
        let notaCredito = await consultaNotaDeCreditosNoVencidasALaFecha();
        // console.log("Totales de pago == >",resultadosTiposDePago)
        resultados.push({ reporteDetalle });
        resultados.push({ resultadosTiposDePago });
        resultados.push({ notaCredito });
        res.send(resultados);

    } catch (error) {
        console.log("Algo anda mal en la actualizacion del cliente" + error)
        res.send("No se pudo Asignar el cliente");
    }
}



controller.consultaNotaDeCreditosNoVencidasALaFechaEnVenta = async (req, res) => {
    const { fecha, secncf_afectado, secncf_nota, numeroDeNota } = req.body;
    // console.log('La fecha ',fecha)
    //:secncf_afectado/:secncf_nota/:numeroDeNota
    try {
        const resultado = await consultaNotaDeCreditosNoVencidasALaFechaEnVenta(fecha, secncf_afectado, secncf_nota, parseInt(numeroDeNota));
        // console.log(resultado)
        res.send(resultado);
    } catch (error) {

    }
}



controller.consultaMesa = async (req, res) => {
    // console.log('La fecha ',fecha)
    //:secncf_afectado/:secncf_nota/:numeroDeNota
    try {
        const resultado = await consultaMesa();
        console.log(resultado)
        res.send(resultado);
    } catch (error) {

    }
}

controller.consultaMesaCliente = async (req, res) => {
    const { id_mesa } = req.params;

    try {
        const resultado = await consultaMesaCliente(id_mesa);
        console.log(resultado)
        res.send(resultado);
    } catch (error) {

    }
}




controller.consultaCamarero = async (req, res) => {
    // console.log('La fecha ',fecha)
    //:secncf_afectado/:secncf_nota/:numeroDeNota
    try {
        const resultado = await consultaCamarero();
        console.log(resultado)
        res.send(resultado);
    } catch (error) {

    }
}


controller.clienteConFacturaTemporal = async (req, res) => {
    const { id_cliente } = req.body;
    // console.log('El cliente ================>',id_cliente)
    //:secncf_afectado/:secncf_nota/:numeroDeNota
    try {
        const resultado = await clienteConFacturaTemporal(id_cliente);
        // console.log("Resultados del cliente venta temporal =======>",resultado)
        res.send(resultado);
    } catch (error) {
        console.log("Error es ", error)
    }
}



controller.guardarMovimientoEnCaja = async (req, res) => {
    const { cajaDetalle, tipoMovimiento, monto, detalle, id_supervisor } = req.body;
    try {
        console.log("Dantos movimiento =======> ", req.body)

        let id_empleado = req.jhobrosoftsession.id_empleado;
        // let empresa = req.jhobrosoftsession.empresa;
        // let sucursal = req.jhobrosoftsession.sucursal;
   
        const data = [id_supervisor, tipoMovimiento, monto, detalle, cajaDetalle, id_empleado];
        //INSERT INTO `jr_movimiento_caja`(`id_supervisor`, `tipo_movimiento`, `monto`, `detalle`, `id_caja_detalle`, `id_cajero`) VALUES ( ? )
        const id_cliente = await guardarMovimientoEnCaja(data);
        res.send(`${id_cliente}`);
    } catch (error) {

    }
}

module.exports = controller;
