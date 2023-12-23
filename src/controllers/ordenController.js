
const { orden_list, save_producto, update_producto, buscar_producto, buscarCodigoProducto, guardarSuplidorPedidoTemporal, suplidorPedidoTemporal, eliminarProductoDelPedido, guardarOrden, guardarOrdenDetalle, actualizaNumeroDeOrden, buscarPedidoSuplidor, pedidoIngreso, guardarIngreso, updateIngresoProducto, guardarDetalleIngreso, detalleIngrsoList, updateDetalleIngresoProducto, consultaProductoAlmacen, consultaFactorDeConversionUnidadProducto, guardaProductoAlmacen, actualizaProductoAlmacen, setIngresoEstadoProduccion, setCantidadProcesadaPedido, setCompletadoPedidoHeader, eliminar_componente, pedido_list, actualizaPrecioDeCompraProducto, componenteListProductos, inserta_componente, lasmarcas, lascategorias, lasclases, losestados, buscarPedido } = require('../services/ordenService');
const { paginacion } = require("../config");

const controller = {};

controller.producto_list = async (req, res) => {

  let estado = await losestados();
  let categoria = await lascategorias();
  let marca = await lasmarcas();
  let clase = await lasclases();
  // console.log("lista de productoes")
  res.render('orden', {
    paginacion,
    est: estado,
    clase: clase,
    marca: marca,
    categoria: categoria,
    accesos: req.jhobrosoftsession.accesos
  });
}

controller.orden_list_filtro = async (req, res) => {
  let { valor, inicio, estado } = req.params;

  if (valor == "aaaaaaaaaaaa") {
    valor = "";
  }
  let nunreg = paginacion;//10;
  let nuevoinicio = (inicio - 1) * nunreg

  const productoes = await orden_list(estado, valor, nuevoinicio, nunreg);
  let registros = await orden_list(estado, valor);
  productoes.push({ registros });
  res.send(productoes);
}


controller.producto_save_or_update = async (req, res) => {
  let { id, codigo, descripcion, referencia, factor_conversion, existencia, precio_compra, precio_detalle, precio_al_por_mayor, precio_especial, con_itbis, itbis, con_descuento, descuento, margen_ganancia, cantidad_minima, cantidad_maxima, ubicacion, id_estado, idmarca, idcategoria, id_clase } = req.params;

  let values = [];
  let resoult = "";
  if (id == 0) {
    //`codigo`, `codigo_barra`, `descripcion`, `referencia`, `factor_conversion`, `existencia`, `precio_compra`, `precio_venta`, `itbis`, `descuento`, `margen_ganancia`, `cantidad_minima`, `cantidad_maxima`, `ubicacion`, `id_estado`, `idmarca`, `idcategoria`
    values = [codigo, descripcion, referencia, factor_conversion, existencia, precio_compra, precio_detalle, precio_al_por_mayor, precio_especial, con_itbis, itbis, con_descuento, descuento, margen_ganancia, cantidad_minima, cantidad_maxima, ubicacion, id_estado, idmarca, idcategoria, id_clase];
    // console.log('a guardar producto')
    resoult = await save_producto(values);
    res.send(resoult);
  } else {
    values = [codigo, descripcion, referencia, factor_conversion, existencia, precio_compra, precio_detalle, precio_al_por_mayor, precio_especial, con_itbis, itbis, con_descuento, descuento, margen_ganancia, cantidad_minima, cantidad_maxima, ubicacion, id_estado, idmarca, idcategoria, id_clase, id];
    resoult = await update_producto(values);
    res.send(resoult);
  }

}

controller.buscar_producto = async (req, res) => {
  let { id } = req.params;
  let producto = await buscar_producto(id);

  res.send(producto[0]);
}

controller.suplidorPedidoTemporal = async (req, res) => {
  let { id_suplidor } = req.params;
  let productos = await suplidorPedidoTemporal(id_suplidor);
  //  console.log(productos)
  res.send(productos);
}

controller.buscarCodigoProducto = async (req, res) => {
  let { codigo, cantidad, id_suplidor } = req.params;

  let producto = await buscarCodigoProducto(codigo);

  await guardarSuplidorPedidoTemporal(cantidad, producto[0].id_producto, id_suplidor);

  res.send("Listo");
}

controller.eliminarProductoDelPedido = async (req, res) => {
  let { id_producto, id_suplidor } = req.params;
  let values = [id_producto, id_suplidor];
  try {
    await eliminarProductoDelPedido(values);

    res.send("Producto eliminado de la lista de éste suplidor");
  } catch (error) {
    console.log("Error al eliminar producto del suplidor ", error)
    res.send("Error al eliminar producto éste suplidor");
  }

}

controller.guardarOrden = async (req, res) => {
  let { fecha, condicion, estado, nota, suplidor, no_orden, datos } = req.params;

  try {
    let id_empleado_pide = req.jhobrosoftsession.id_empleado;
    let productos = JSON.parse(datos);
    // console.log('la orden  ======>'+no_orden)
    console.log(JSON.parse(datos))
    // await eliminar_componente(values);
    let values = [fecha, id_empleado_pide, condicion, nota, estado, no_orden, suplidor];
    let idOrdenInsertada = await guardarOrden(values);

    for (let i = 0; i < productos.length; i++) {
      const fila = productos[i];
      const cantidad = fila.cantidad;
      const unidad = fila.id_unidad;
      const id_producto = fila.id_producto;
      values = [cantidad, unidad, id_producto, idOrdenInsertada];

      await guardarOrdenDetalle(values)
      values = [id_producto, suplidor];
      await eliminarProductoDelPedido(values);
    }
    values = [no_orden, suplidor];
    actualizaNumeroDeOrden(values)

    res.send("Orden procesada correctamente");
  } catch (error) {
    console.log(error)
    res.send("Error al guardar orden");
  }
}

controller.buscarPedidoSuplidor = async (req, res) => {
  let { id_suplidor, id_pedido } = req.params;

  let values = [id_suplidor, id_pedido];
  // console.log(values)
  try {
    let pedido = await pedidoIngreso(id_pedido)

    if (pedido != "") {
      // console.log("Muestro el pedido viejo ===> ", pedido)
      res.send(pedido[0])
    } else {
      let id_empleado_ingresa = req.jhobrosoftsession.id_empleado;
      let total_itbis = 0;
      let total_descuento = 0;
      let importe_ingreso = 0;
      let total_pagado = 0;
      let monto_pendiente = 0;
      let comprobante = "";
      let condicion = 0;
      let estado_ingreso = 0
      let path_factura_suplidor = "";
      let numero_factura = "";
      let nota = ""
      let id_sucursal = req.jhobrosoftsession.id_sucursal;
      //``
      values = [id_empleado_ingresa, total_itbis, total_descuento, importe_ingreso, total_pagado, monto_pendiente, comprobante, condicion, estado_ingreso, path_factura_suplidor, id_pedido, numero_factura, nota, id_sucursal];
      let id_ingreso = await guardarIngreso(values);
      // console.log('el id ingreso es: '+ id_ingreso)
      let productos = await pedido_list(id_pedido);
      // values = [];

      for (let i = 0; i < productos.length; i++) {

        values = [0, productos[i].cantidad, productos[i].id_unidad, 0, 0, 0, 0, '00/00/0000', '00/00/0000', 0, 0, id_ingreso, productos[i].id_producto, '']
        //`id_almacen`, `cantidad_recibida`, `cantidad_pendiente`, `preciocompra`, `itbis`, `fechaproduccion`, `fechavencimiento`, `descuento`, `importe`, `id_ingreso`, `id_producto`
        await guardarDetalleIngreso(values);
      }
      let nuevo_pedido = await pedidoIngreso(id_pedido)
      // console.log("Muestro el pedido Nuevo ===> ", nuevo_pedido)//
      res.send(nuevo_pedido)

    }

    // console.log(producto[0])
    // res.send(producto[0]);
  } catch (error) {
    console.log('Muestro el error X =====> ' + error)
    res.send('Error al leer el pedido');
  }
}

controller.updateIngresoProducto = async (req, res) => {
  // let { id_suplidor, id_pedido } = req.params;
  let {
    total_itbis,
    total_descuento,
    importe_ingreso,
    total_pagado,
    monto_pendiente,
    comprobante,
    condicion,
    estado_ingreso,
    path_factura_suplidor,
    id_pedido,
    numero_factura,
    nota,
    id_ingreso
  } = req.body;
  // console.log(console.log(total_pagado))
  try {

    let id_empleado_ingresa = req.jhobrosoftsession.id_empleado;

    let values = [id_empleado_ingresa, total_itbis, total_descuento, importe_ingreso, total_pagado, monto_pendiente, comprobante, condicion, estado_ingreso, path_factura_suplidor, id_pedido, numero_factura, nota, id_ingreso];
    let dataIngreso = await updateIngresoProducto(values);

    res.send(dataIngreso)

  } catch (error) {
    console.log('Muestro el error Y =====> ' + error)
    res.send('Error al actualizar ingreso');
  }
}

controller.detalleIngrsoList = async (req, res) => {
  let { id_ingreso } = req.params;

  let productos = await detalleIngrsoList(id_ingreso);
  console.log("Datos del pedido pro  ", productos)
  let lista;
  if (productos == '') {
    lista = "Este ingreso no contiene detalle";
    res.send(productos);
  } else {
    // lista = await componenteListProductos(id_productos,id)
    // console.log('Ver kusta ',lista)
    res.send(productos);
  }

}



controller.updateDetalleIngresoProducto = async (req, res) => {
  // let { row } =req.params;
  let { id_almacen, pedido, cantidad, pendiente, precioCompra, itbis, fechaproduccion, fechavencimiento, descuento, importe, ubicacion_fisica, id_ingreso, id_producto } = req.body;;

  try {
    let values = [id_almacen, pedido, cantidad, pendiente, precioCompra, itbis, fechaproduccion, fechavencimiento, descuento, importe, ubicacion_fisica, id_ingreso, id_producto];
    let resoult = await updateDetalleIngresoProducto(values);
    // console.log(resoult)
    res.send(resoult);
  } catch (error) {
    console.log("Error al actualizar detalle ingreso =====> " + error)
    res.send("Error al actualizar detalle ingreso");
  }
}


controller.updateIngreso = async (req, res) => {
  let { row } = req.params;
  let { id_almacen, cantidad, cantidad_recibida, cantidad_pendiente, preciocompra, itbis, fechaproduccion, fechavencimiento, descuento, importe, id_ingreso, id_producto, ubicacion_fisica } = row;
  //
  try {
    let values = [id_almacen, cantidad, cantidad_recibida, cantidad_pendiente, preciocompra, itbis, fechaproduccion, fechavencimiento, descuento, importe, ubicacion_fisica, id_ingreso, id_producto];
    let resoult = await updateDetalleIngresoProducto(values);
    res.send(resoult);
  } catch (error) {
    console.log("Error al actualizar detalle ingreso =====> " + error)
    res.send("Error al actualizar detalle ingreso");
  }
}

controller.pasaIngresoA_Produccion = async (req, res) => {

  let { id_almacen, id_ingreso, id_pedido } = req.body;

  try {
    let values = [id_almacen, id_ingreso, id_pedido];
    // console.log(values)
    let pedido = await pedidoIngreso(id_pedido)

    let productos = await detalleIngrsoList(id_ingreso);// TRAE LOS PRODUCTOS QUE HAY POR INGRESAR
    let cantidad_procesada = 0;
    let hayProductoPendiente = 0;

    for (let i = 0; i < productos.length; i++) {
      let id_producto = productos[i].id_producto;
      let precioDeCompra = productos[i].preciocompra;
      let id_almacen = productos[i].id_almacen;
      let cantidad = productos[i].cantidad;
      let id_unidad = productos[i].id_unidad;
      let cantidad_recibida = productos[i].cantidad_recibida;
      let id_ingreso = productos[i].id_ingreso;
      let ubicacion_fisica = productos[i].ubicacion_fisica;

      //estos dos son para actualizar el ingreso junto con el id_producto, y el id_ingreso
      let cantidad_pendiente = productos[i].cantidad_pendiente;
      cantidad_procesada = cantidad_recibida

      if (cantidad_pendiente != 0) {// SI LA CANTIDAD PENDIENTE ES DISTINTA DE CERO INDICA QUE AL MENOS UN PRODUCTO QUEDA PENDIENTE DE ESE PEDIDO
        hayProductoPendiente = 1;
      }

      // Hacer algo con los valores de cada producto
      values = [id_producto, id_almacen];
      let producto = await consultaProductoAlmacen(values);
      let cantidadAGuardar = 0;
      if (producto.length > 0) { //VERIFICO SI EL PRODUCTO EXISTE EN PRODUCTO_ALMACEN
        // console.log(`Actualizo los datos del producto XY ${producto}`)
        values = [id_producto, id_unidad]//
        // console.log('Muestro los values para actualizar ===',values)
        let factorDeConversion = await consultaFactorDeConversionUnidadProducto(values);
        // console.log('Muestro el factor de Conversion ===',factorDeConversion[0].factor_conversion)
        cantidadAGuardar = factorDeConversion[0].factor_conversion * cantidad_recibida;

        let cantidadActualizada = parseFloat(cantidadAGuardar) + parseFloat(producto[0].existencia); //actualiza la cantidad en existencia que tiene ese almacen
        // ACTUALIZO EL PRODUCTO EL PRODUCTO_ALMACEN
        values = [id_almacen, cantidadActualizada, ubicacion_fisica, id_almacen, id_producto];
        // console.log(`Actualizo los datos del producto X ${JSON.stringify(producto)}`)
        await actualizaProductoAlmacen(values)
        // console.log(`Actualizo los datos del producto X ${producto}`)
      } else {
        // Aqui debo consultar la cantidad equivalente oseas la cantidad_recibida por el factor de conversion
        values = [id_producto, id_unidad]//
        let factorDeConversion = await consultaFactorDeConversionUnidadProducto(values);
        // console.log('Muestro el factor de Conversion ===',factorDeConversion[0].factor_conversion)
        cantidadAGuardar = factorDeConversion[0].factor_conversion * cantidad_recibida;
        // SI EL PRODUCTO NO EXISTE EN PRODUCTO_ALMACEN LO INSERTO
        values = [cantidadAGuardar, ubicacion_fisica, id_producto, id_almacen];
        // console.log('Muestro los values que van a almacen ===',values)
        await guardaProductoAlmacen(values);
        // console.log(`inserto los datos del producto ${producto}`)
      }
      //////ACTUALIZO LA TABLA PEDIDO
      values = [cantidad_pendiente, cantidad_procesada, id_producto, id_pedido];
      // console.log(`Actualizo la tabla pedido ${JSON.stringify(values)}`)

      // esta linea actualiza la cantidad procesada y la cantidad del pedido
      await setCantidadProcesadaPedido(values)

      //actualizo 
      values = [(precioDeCompra * cantidad_recibida / cantidadAGuardar), id_producto]; // se divide el precio de compra entre el factor de conversion para determinar el precio
      // console.log("precio_compra =====> ",precioDeCompra)
      // console.log("CANTIDAD A GUARDAR =====> ",cantidadAGuardar)
      // console.log("CANTIDAD RECIBIDA =====> ",cantidad_recibida)
      // console.log("valores para actualizar el precio de compra =====> ",values)
      await actualizaPrecioDeCompraProducto(values);
    }

    // esta linea se ejecutara cuando el pedido este completado
    if (hayProductoPendiente == 0) {
      await setCompletadoPedidoHeader(id_pedido)
    }
    await setIngresoEstadoProduccion(id_ingreso);
    res.send("Datos procesados")
    // AQUI SE GUARDARIAN LOS DATOS DE LA CUENTA POR PAGAR CXC

  } catch (error) {
    console.log("Error al actualizar detalle ingreso Produccion=====> " + error)
    res.send("Error al actualizar detalle ingreso");
  }
}


controller.guardar_componente = async (req, res) => {
  let { producto, componente, cantidad } = req.params;
  try {
    let values = [producto, componente];
    await eliminar_componente(values);
    values = [producto, componente, cantidad];
    await inserta_componente(values);

    res.send("Datos insertados correctamente");
  } catch (error) {
    console.log(error)
    res.send("Error al guardar componente");
  }
}

controller.elimina_componente = async (req, res) => {
  let { producto, componente } = req.params;
  let values = [producto, componente];
  await eliminar_componente(values);

  res.send("Datos eliminados correctamente");
}


controller.imprimirOrdenPedido = async (req, res) => {
  let { id_pedido } = req.params;

  // let values = [id_suplidor, id_pedido];-
  // console.log(values)
  var datosX = []; // aqui van los datos totales de la factura y este es el array a devolver



  async function agregarDato(UbicacionTexto, Texto1, Texto2, Monto) {
    datosX.push({ ubicacionTexto: UbicacionTexto, texto1: `${Texto1}`, texto2: `${Texto2}`, "monto": Monto });
  }

  try {
    let pedido = await buscarPedido(id_pedido)
    // console.log("Muestro el pedido viejo ===> ", pedido[0])
    if (pedido != "") {
      let cajero = req.jhobrosoftsession.nombres + " " + req.jhobrosoftsession.apellido;
      let nombre_empresa = req.jhobrosoftsession.nombre_empresa;
      let rnc_empresa = req.jhobrosoftsession.rnc_empresa;
      let nombre_sucursal = req.jhobrosoftsession.nombre_sucursal;
      let provincia_sucursal = req.jhobrosoftsession.provincia_sucursal;
      let direccion_sucursal = req.jhobrosoftsession.direccion_sucursal;
      let telefono_sucursal = req.jhobrosoftsession.telefono_sucursal;
      let email_sucursal = req.jhobrosoftsession.email_sucursal;
      // let paddedIdVenta = completaConCerosNumeroFactura(id_pedido, 11, '0');n          
      //aqui se imprime la factura
      await agregarDato("centro", "");
      await agregarDato("centroNegrita", nombre_empresa);
      await agregarDato("centro", nombre_sucursal);
      await agregarDato("centro", `RNC: ${rnc_empresa}, Tel: ${telefono_sucursal}`);
      // await agregarDato("centro", provincia_sucursal);
      await agregarDato("centro", direccion_sucursal);
      await agregarDato("centro", `${email_sucursal}`);

      await agregarDato("centro", "");
      await agregarDato("centroNegrita", "ORDEN DE COMPRA");

      await agregarDato("centro", "");



      // Obtener la fecha y hora actual
      let fecha = new Date(pedido[0].fecha_pedido);
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
      await agregarDato("extremo", "FECHA: " + fechaActualTexto, "HORA: " + horaActualTexto);
      await agregarDato("derecha", `ORDEN NO.: ${pedido[0].numero_de_orden}`);
      await agregarDato("izquierda", `FECHA REQUERIDA: ${pedido[0].fecha_requerida}`);
      await agregarDato("izquierda", `EMPRESA: ${pedido[0].empresa_sup}`);
      await agregarDato("izquierda", `RNC: ${pedido[0].rnc_sup}`);

      await agregarDato("izquierda", `TELÉFONO: ${pedido[0].telefono} EXT'-'${pedido[0].extension}`);
      await agregarDato("izquierda", `REPRESENTANTE: ${pedido[0].representante}`);
      await agregarDato("izquierda", `FLOTA: ${pedido[0].flota}`);

      await agregarDato("centro", "");
      await agregarDato("centroNegrita", "DETALLE");
      await agregarDato("centro", "");
            await agregarDato("encabezado", "CANT. UNIDAD         PRODUCTO");
            await agregarDato("lineasGion", "");

      let productos = await pedido_list(id_pedido);
      // values = [];
      // console.log("Muestro el detalle ===> ", productos)
      for (let i = 0; i < productos.length; i++) {
        // console.log('Producto ' + i, productos[i])
        await agregarDato("agregarCantidadUnidadDescripcion", ` ${productos[i].descripcion}`, `${productos[i].unidad}`, ` ${productos[i].cantidad}`);
        // values = [0, productos[i].cantidad, productos[i].id_unidad, 0, 0, 0, 0, '00/00/0000', '00/00/0000', 0, 0, id_ingreso, productos[i].id_producto, '']
      }
      await agregarDato("lineasGion", "");
       
      let nota = pedido[0].nota;
      console.log("Muestro el detalle NOTA ===> ", nota)
      
      if (nota != "") {
        await agregarDato("izquierda", "Nota:");

        await agregarDato("izquierda", nota);
      }

      // await agregarDato("imagen", "");

      await agregarDato("imprimir", "");

      var jsonData = JSON.stringify(datosX);
      console.log(jsonData)
      res.send(jsonData);
      // pedido[0]
      // res.send()
    }

    // console.log(producto[0])
    // res.send(producto[0]);
  } catch (error) {
    console.log('Muestro el error X =====> ' + error)
    res.send('Error al leer el pedido');
  }
}



controller.enviarCorreoOrdenPedido = async (req, res) => {
  let { id_pedido } = req.params;

  // let values = [id_suplidor, id_pedido];-
  // console.log(values)
  var datosX = []; // aqui van los datos totales de la factura y este es el array a devolver



  async function agregarDato(UbicacionTexto, Texto1, Texto2, Monto) {
    datosX.push({ ubicacionTexto: UbicacionTexto, texto1: `${Texto1}`, texto2: `${Texto2}`, "monto": Monto });
  }

  try {
    let pedido = await buscarPedido(id_pedido)
    // console.log("Muestro el pedido viejo ===> ", pedido[0])
    if (pedido != "") {
      let cajero = req.jhobrosoftsession.nombres + " " + req.jhobrosoftsession.apellido;
      let nombre_empresa = req.jhobrosoftsession.nombre_empresa;
      let rnc_empresa = req.jhobrosoftsession.rnc_empresa;
      let nombre_sucursal = req.jhobrosoftsession.nombre_sucursal;
      let provincia_sucursal = req.jhobrosoftsession.provincia_sucursal;
      let direccion_sucursal = req.jhobrosoftsession.direccion_sucursal;
      let telefono_sucursal = req.jhobrosoftsession.telefono_sucursal;
      let email_sucursal = req.jhobrosoftsession.email_sucursal;
      // let paddedIdVenta = completaConCerosNumeroFactura(id_pedido, 11, '0');n
      //aqui se imprime la factura
      await agregarDato("centro", "");
      await agregarDato("centroNegrita", nombre_empresa);
      await agregarDato("centro", nombre_sucursal);
      await agregarDato("centro", `RNC: ${rnc_empresa}, Tel: ${telefono_sucursal}`);
      // await agregarDato("centro", provincia_sucursal);
      await agregarDato("centro", direccion_sucursal);
      await agregarDato("centro", `${email_sucursal}`);

      await agregarDato("centro", "");
      await agregarDato("centroNegrita", "ORDEN DE COMPRA");

      await agregarDato("centro", "");


      // Obtener la fecha y hora actual
      let fecha = new Date(pedido[0].fecha_pedido);
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
      await agregarDato("izquierda", `Orden No.: ${pedido[0].numero_de_orden}`);

      await agregarDato("izquierda", `Empresa: ${pedido[0].empresa_sup}`);
      await agregarDato("izquierda", `RNC: ${pedido[0].rnc_sup}`);
      await agregarDato("extremo", `Teléfono: ${pedido[0].telefono}`, `Ext. #: ${pedido[0].extension}`);
      await agregarDato("izquierda", `Representante: ${pedido[0].representante}`);
      await agregarDato("izquierda", `Flota: ${pedido[0].flota}`);

      await agregarDato("centro", "");
      await agregarDato("lineasGion", "");
      await agregarDato("centroNegrita", "DETALLE");
      await agregarDato("lineasGion", "");

      let productos = await pedido_list(id_pedido);
      // values = [];
      // console.log("Muestro el detalle ===> ", productos)
      for (let i = 0; i < productos.length; i++) {
        // console.log('Producto ' + i, productos[i])
        await agregarDato("extremoLista", ` ${productos[i].descripcion}`, `${productos[i].unidad}`, ` ${productos[i].cantidad}`);
        // values = [0, productos[i].cantidad, productos[i].id_unidad, 0, 0, 0, 0, '00/00/0000', '00/00/0000', 0, 0, id_ingreso, productos[i].id_producto, '']

      }
      await agregarDato("lineasGion", "");
     


      await agregarDato("imprimir", "");

      var jsonData = JSON.stringify(datosX);
      console.log(jsonData)
      res.send(jsonData);
      // pedido[0]
      // res.send()
    }
    send_mail(lista_crear_sucursal.email_institucional, `Nueva sucursal creada por ${req.awsession.nombres + ' ' + req.awsession.apellido}`, `Negocio: <strong>${razon_social}</strong>`, `<br><br><strong><strong> ${req.awsession.nombres + ' ' + req.awsession.apellido}</strong> acaba de crear la sucursal: <strong>${nombre_sucursal}</strong> del negocio: <strong>${razon_social}</strong>.</strong> `,);
    // console.log(producto[0])
    // res.send(producto[0]);
  } catch (error) {
    console.log('Muestro el error X =====> ' + error)
    res.send('Error al leer el pedido');
  }
}



module.exports = controller;
