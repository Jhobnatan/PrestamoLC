const express = require('express');
//const controller = require('../controllers/customerController');
const router = express.Router();
const facturacionController = require('../controllers/facturacionController');

router.get('/', facturacionController.list);

router.get('/filtro/:valor/:inicio', facturacionController.producto_list_filtro);
router.get('/consultaProductoCodigoAlmacenCantidad/:codigo/:almacen/:cantidad/:id_unidad/:id_cliente/:suma/:caja/:mesa/:id_camarero/:numero_pedido',facturacionController.consultaProductoCodigoAlmacenCantidad);

router.get('/buscarCodigoUnidadProducto/:id_unidad/:id_producto',facturacionController.buscarCodigoUnidadProducto);

router.get('/editarCantidadProductoCliente/:id_producto/:id_unidad/:cantidad/:id_empleado/:id_cliente/:almacen/:caja/:mesa/:numero_pedido',facturacionController.editarCantidadProductoCliente);
router.get('/editarUnidadProductoCliente/:id_producto/:id_unidad/:id_cliente',facturacionController.editarUnidadProductoCliente);

router.post('/buscarVentaTemporal',facturacionController.consultaVentaTemporal);

router.post('/clienteConFacturaTemporal',facturacionController.clienteConFacturaTemporal);
router.get('/consultaMesa', facturacionController.consultaMesa);
router.get('/consultaMesaCliente/:id_mesa', facturacionController.consultaMesaCliente);
router.get('/consultaCamarero', facturacionController.consultaCamarero);

router.post('/imprimeCobra',facturacionController.imprimeCobra);

router.post('/fracionarFactura',facturacionController.fracionarFactura);

router.get('/facturas/:fecha_inicial/:fecha_final/:estado/:valor/:inicio', facturacionController.facturas);
router.post('/reimprimirFactura/:id_venta/:estado', facturacionController.reimprimirFactura);
router.post('/verFacturaConDetalle',facturacionController.verFacturaConDetalle); 
router.post('/anularFactura',facturacionController.anularFactura); 

router.get('/desgloseEnCaja/:idDetalleCaja', facturacionController.desgloseEnCaja);
router.post('/cerrarCaja',facturacionController.cerrarCaja); 

router.get('/facturacionTotalEnCaja/:idDetalleCaja', facturacionController.facturacionTotalEnCaja);

router.post('/eliminarProductoAlCliente',facturacionController.eliminarProductoAlCliente);

router.post('/guardarClienteBasico',facturacionController.guardarClienteBasico);

router.post('/cambiarCliente',facturacionController.cambiarCliente);

router.get('/update/:id',facturacionController.edit);
router.post('/update/:id',facturacionController.update);

router.get('/delete/:id',facturacionController.delete);

router.get('/chat', facturacionController.chat);

router.get('/reporte', facturacionController.reporte);


router.get('/consultaEmpleadoReporte/:sucursal/:valor', facturacionController.consultaEmpleadoReporte);
router.get('/consultaCajaReporte/:sucursal', facturacionController.consultaCajaReporte);
router.get('/consultaTurnoReporte/:sucursal', facturacionController.consultaTurnoReporte);

router.post('/filtroReporte',facturacionController.filtroReporte);
router.post('/consultaNotaDeCreditosNoVencidasALaFechaEnVenta',facturacionController.consultaNotaDeCreditosNoVencidasALaFechaEnVenta);

router.post('/guardarMovimientoEnCaja',facturacionController.guardarMovimientoEnCaja);

module.exports = router;