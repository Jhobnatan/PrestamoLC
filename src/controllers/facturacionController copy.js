const { list, consultaPedidoActual, consultaProductoCodigo, consultaUnidadProductoID, consultaProductoIdAlmacenCantidad, guardarProductoVentaTemporal, consultaVentaTemporal, editarCantidadProductoCliente, editarUnidadProductoCliente, guardarClienteBasico, cambiarCliente, eliminarProductoAlCliente, edit, update, categoria_empresa, consultaSecuenciaComprobante, actualizarSecuenciaComprobante, guardarVentaProcesada, eliminarVentaTemporal, guardarProductoVenta, actualizaProductoAlmacenVenta, buscarDescripcionUnidad, producto_list, facturaList, buscarFactura, buscarDetalleFactura, verificaCajaAbierta, desgloseEnCaja, facturacionTotalEnCaja } = require('../services/facturacionService');
const { orden_list, save_producto, update_producto, buscar_producto, buscarCodigoProducto, guardarSuplidorPedidoTemporal, suplidorPedidoTemporal, eliminarProductoDelPedido, guardarOrden, guardarOrdenDetalle, actualizaNumeroDeOrden, buscarPedidoSuplidor, pedidoIngreso, guardarIngreso, updateIngresoProducto, guardarDetalleIngreso, detalleIngrsoList, updateDetalleIngresoProducto, consultaProductoAlmacen, consultaFactorDeConversionUnidadProducto, guardaProductoAlmacen, actualizaProductoAlmacen, setIngresoEstadoProduccion, setCantidadProcesadaPedido, setCompletadoPedidoHeader, eliminar_componente, pedido_list, componenteListProductos, inserta_componente, lasmarcas, lascategorias, lasclases, losestados } = require('../services/ordenService');

const { saveDesgloseDeCaja, cierreDeCajaUpdate, verDetalleCajaParaImprimir,verDesgloseFinal } = require('../services/cajaService');
const controller = {};

const { paginacion } = require("../config");

const PDFDocument = require('pdfkit');
const fs = require('fs');
const crypto = require('crypto');

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
            // data: empresas,
            caja: caja_abierta[0],
            id_empleado: id_empleado,
            accesos: req.jhobrosoftsession.accesos
        });
    } else {
        res.redirect('/caja');
    }
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

    const detalleCuadre = await verDetalleCajaParaImprimir(id_caja_detalle);//
    //SELECT id_caja_detalle, cd.id_caja, cd.id_turno, cd.id_cajero, (SELECT  CONCAT( nombres," ", apellidos) FROM jr_empleado WHERE id_empleado =cd.id_cajero) AS cajero, cd.id_supervisor, cd.id_empresa, cd.id_sucursal, cd.id_almacen, cd.estado, cd.fecha_apertura, cd.fecha_cierre, cd.monto_inicial, cd.monto_final, cd.diferencia, cd.observaciones, cd.desglose, c.nombre, c.descripcion FROM jr_caja_detalle cd, jr_caja c WHERE c.id_caja = cd.id_caja AND cd.id_caja_detalle = ?
    const detalleFacturacion = await facturacionTotalEnCaja(id_caja_detalle);

    let values = [id_caja_detalle,'desglose_final']
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
      await agregarDato("agregarTotales", `          2000 X ${completarConCeros(valor2000, 3)}  =`,null, (valor2000 * 2000));
    }
    if (valor1000 !== 0) {
      await agregarDato("agregarTotales", `          1000 X ${completarConCeros(valor1000, 3)}  =`,null,(valor1000 * 1000));
    }
    if (valor500 !== 0) {
      await agregarDato("agregarTotales", `           500 X ${completarConCeros(valor500, 3)}  =`,null,(valor500 * 500));
    }
    if (valor200 !== 0) {
      await agregarDato("agregarTotales", `           200 X ${completarConCeros(valor200, 3)}  =`,null,(valor200 * 200));
    }
    if (valor100 !== 0) {
      await agregarDato("agregarTotales", `           100 X ${completarConCeros(valor100, 3)}  =`,null,(valor100 * 100));
    }
    if (valor50 !== 0) {
      await agregarDato("agregarTotales", `            50 X ${completarConCeros(valor50, 3)}  =`,null,(valor50 * 50));
    }
    if (valor25 !== 0) {
      await agregarDato("agregarTotales", `            25 X ${completarConCeros(valor25, 3)}  =`,null,(valor25 * 25));
    }
    if (valor10 !== 0) {
      await agregarDato("agregarTotales", `            10 X ${completarConCeros(valor10, 3)}  =`,null,(valor10 * 10));
    }
    if (valor5 !== 0) {
      await agregarDato("agregarTotales", `             5 X ${completarConCeros(valor5, 3)}  =`,null,(valor5 * 5));
    }
    if (valor1 !== 0) {
      await agregarDato("agregarTotales", `             1 X ${completarConCeros(valor1, 3)}  =`,null,(valor1 * 1));
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
    let { codigo, almacen, cantidad, id_cliente, suma } = req.params;

    console.log('son datos a buscar')
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
        let cantidadAConsultar = (lacantidad + cantidad) * factor_conversion;




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
            let result = await guardarProductoVentaTemporal(id_empleado, id_cliente, cantidad, id_unidad, id_producto, suma, existencia)
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
    const { id_empleado, id_cliente } = req.params;
    // const data = req.body;
    try {
        const producto = await consultaVentaTemporal(id_empleado, id_cliente);
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

controller.eliminarProductoAlCliente = async (req, res) => {
    const { id_producto, id_cliente, id_unidad } = req.body;
    // const data = req.body;
    try {
        const producto = await eliminarProductoAlCliente(id_producto, id_cliente, id_unidad);
        ////////////////////////////////////////////////////////////////////////

        ///////////////////////////////////////////////////////////////////////
        if (producto.length > 0) {
            console.log(producto)
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
    let { id_producto, id_unidad, cantidad, id_empleado, id_cliente, almacen } = req.params;

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

            await editarCantidadProductoCliente(id_producto, id_unidad, cantidad, id_empleado, id_cliente);
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
var datosX = []; // aqui van los datos totales de la factura y este es el array a devolver

var productosX = []; // aqui van los productos


async function agregarDato(UbicacionTexto, Texto1, Texto2, Monto) {
    datosX.push({ ubicacionTexto: UbicacionTexto, texto1: `${Texto1}`, texto2: `${Texto2}`, "monto": Monto });
}

async function agregarProducto(articulo, cant, unidad, precio, itbis, importe) {
    productosX.push({ articulo, cant, unidad, precio, itbis, importe });
    console.log("Productos agregados ======>" + JSON.stringify(productosX))
}

async function agregarArregloProductosADatos() {
    datosX.push({ productos: productosX }); // Agrega el arreglo de productos al objeto datos
    console.log("Productos totales agregados ======>" + JSON.stringify(productosX))
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
        id_caja_detalle,
        id_caja,
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
            // console.log("Secuencia =====> ", secuencia[0].secncf)
            let id_sucursal = req.jhobrosoftsession.sucursal;
            let id_empleado = req.jhobrosoftsession.id_empleado

            await actualizarSecuenciaComprobante(id_sucursal, secuencia[0].secncf, codncf);
            let values = [id_caja, id_caja_detalle, id_turno, id_supervisor, id_empresa, id_sucursal, id_empleado, id_cliente, subTotal, masItbis, descuento, maselservicio, totalCobrar, secuencia[0].secncf, comprobante, fechaDeVencimiento, tarjetaDebito, tarjetaCredito, cheque, notaCredito, montoNotaCredito, pagoConBono, efectivo, devolver, cuentaPorCobrar, notaVenta, condicionVenta, 'Procesada'];
            // console.log(values)
            let id_venta = await guardarVentaProcesada(values);
            await eliminarVentaTemporal(id_cliente);


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
                let [id_producto, codigo, descripcion, cantidad, unidad, descuento, itbis, precio, importe] = JSON.parse(tabla[i]);

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
                // console.log("Muestro la unidad ======>"+ launidad[0].unidad);
                await agregarProducto(descripcion, cantidad, launidad[0].unidad, precio / cantidad, itbis, importe);

                values = [descuento, precio, cantidad, unidad, itbis, importe, id_producto, id_venta];
                await guardarProductoVenta(values);

                values = [id_producto, unidad];
                let factorDeConversion = await consultaFactorDeConversionUnidadProducto(values);
                let cantidadAMover = factorDeConversion[0].factor_conversion * cantidad;

                values = [id_producto, id_almacen];
                let productoAlmacen = await consultaProductoAlmacen(values);
                let existenciaNueva = parseFloat(productoAlmacen[0].existencia) - parseFloat(cantidadAMover);

                values = [existenciaNueva, id_almacen, id_producto];
                await actualizaProductoAlmacenVenta(values);
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

            await agregarDato("izquierda", `NCF: ${secuencia[0].secncf}`);//"NCF: B0200000001");
            await agregarDato("extremo", "CAJA: 02", `FACT. #: ${paddedIdVenta}`);

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
            console.log(jsonData)
            res.send(jsonData);
        } else {
            res.send('No queda de esta Secuencia');
        }


    } catch (error) {
        console.log("Algo anda mal en la venta temproral Imprime y cobra ====>" + error)
        res.send('Algo anda mal en la venta temproral');
    }
}

controller.guardarClienteBasico = async (req, res) => {
    const { nombres, apellidos, cedula, rnc, celular, correo } = req.body;
    try {
        // req.jhobrosoftsession.empresa = user[0].id_negocio;
        //         req.jhobrosoftsession.sucursal = user[0].id_sucursal;
        //         req.jhobrosoftsession.cartera = user[0].id_cartera;

        let registradopor = req.jhobrosoftsession.id_empleado
        let empresa = req.jhobrosoftsession.empresa;
        let sucursal = req.jhobrosoftsession.sucursal;
        let cartera = 1;
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
    let { id_cliente, id_cliente_nuevo } = req.body;

    try {
        let detalles = await cambiarCliente(id_cliente_nuevo, id_cliente);
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
    let { fecha_inicial, fecha_final, valor, inicio } = req.params;
    let values = [fecha_inicial, fecha_final, valor, inicio]
    // console.log("valor de busqueda =======> "+ values)
    if (valor == "aaaaaaaaaaaa") {
        valor = "";
    }
    let nunreg = paginacion;//10;
    let nuevoinicio = (inicio - 1) * nunreg

    const productoes = await facturaList(fecha_inicial, fecha_final, valor, nuevoinicio, nunreg);
    // console.log("las facturas =======> "+ JSON.stringify(productoes))
    let registros = await facturaList(fecha_inicial, fecha_final, valor);

    productoes.push({ registros });
    res.send(productoes);
}

controller.reimprimirFactura = async (req, res) => {
    // Recibir los datos del cliente desde req.body
    let { id_venta } = req.params;

    var datosX = []; // aqui van los datos totales de la factura y este es el array a devolver

    var productosX = []; // aqui van los productos

    async function agregarDato(UbicacionTexto, Texto1, Texto2, Monto) {
        datosX.push({ ubicacionTexto: UbicacionTexto, texto1: `${Texto1}`, texto2: `${Texto2}`, "monto": Monto });
    }

    async function agregarProducto(articulo, cant, unidad, precio, itbis, importe) {
        productosX.push({ articulo, cant, unidad, precio, itbis, importe });
        console.log("Productos agregados ======>" + JSON.stringify(productosX))
    }

    async function agregarArregloProductosADatos() {
        datosX.push({ productos: productosX }); // Agrega el arreglo de productos al objeto datos
        console.log("Productos totales agregados ======>" + JSON.stringify(productosX))
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

controller.verFacturaConDetalle = async (req, res) => {
    // Recibir los datos del cliente desde req.body
    let { id_venta } = req.body;
    var datosX = [];

    try {
        let factura = await buscarFactura(id_venta);
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

module.exports = controller;
