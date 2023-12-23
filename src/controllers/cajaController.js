
const { caja_list, save_caja, update_caja, buscar_caja, saveAsignacionDeCaja, saveDesgloseDeCaja, verDetalleCaja,verDesglose } = require('../services/cajaService');
const { paginacion } = require("../config");

const controller = {};

controller.caja_list= async (req, res) =>{
    
    // let tipo_caja = await list_tipo_caja();
    let cajero = req.jhobrosoftsession.nombres + " " + req.jhobrosoftsession.apellido;
    let id_cajero = req.jhobrosoftsession.id_empleado;
    let nombre_empresa = req.jhobrosoftsession.nombre_empresa;
    let id_empresa = req.jhobrosoftsession.empresa;
              let nombre_sucursal = req.jhobrosoftsession.nombre_sucursal;
              let id_sucursal = req.jhobrosoftsession.sucursal;

  res.render('caja',{
    cajero,
    id_cajero,
    nombre_empresa,
    id_empresa,
    nombre_sucursal,
    id_sucursal,
      paginacion,
      accesos: req.jhobrosoftsession.accesos
  });
}

controller.caja_list_filtro = async (req, res) =>{
  let { valor } =req.params;
  let { inicio } =req.params;

  if(valor =="aaaaaaaaaaaa"){
      valor ="";
  }
  let estado = 'abierta';
      let nunreg = paginacion;//10;
      let nuevoinicio = (inicio - 1) * nunreg

    const cajaes = await caja_list(estado,valor, nuevoinicio, nunreg);
      let registros = await caja_list(estado,valor);
  cajaes.push({ registros });
  res.send(cajaes);
}


controller.caja_save_or_update = async (req, res) =>{
  let { id, nombre, descripcion } =req.params;
 
  let values = [];
  let resoult = "";
  if(id==0){
      values = [nombre, descripcion];
      
      resoult = await save_caja(values);
      res.send(resoult);
  }else{
      values = [nombre, descripcion,id];
      resoult = await update_caja(values);
      res.send(resoult);
  }      
    
}


controller.editar_caja = async (req, res) =>{
  let { id } =req.params;
  let caja = await buscar_caja(id);
    res.send(caja[0]); 
}

controller.buscar_caja = async (req, res) =>{
  let { id } =req.params;
  let detalleCaja = await verDetalleCaja(id)
  if(detalleCaja !=""){
    // console.log("Detalles de la caja =====> ", detalleCaja[0])
    let desglose = await verDesglose(detalleCaja[0].id_caja_detalle);
      // console.log("Desglose de la caja =====> ", desglose)
      detalleCaja.push(desglose) ;
      
      res.send(detalleCaja);
    // if(detalleCaja[0].desglose == 1){
      
    // }else{
    //   res.send(detalleCaja);
    // }
  } else{
    let caja = await buscar_caja(id);
    res.send(caja[0]);
  }  
}


controller.asignarCaja = async (req, res) =>{
  let { id_caja,almacen, id_supervisor, turno, monto_inicial, desglose_dinero, "2000": dosmil, "1000": mil, "500": quinientos, "200": doscientos,"100": cien,"50": cincuenta, "25": veinticinco, "10": diez, "5": cinco, "1": uno, decimales } = req.body;

    let id_cajero = req.jhobrosoftsession.id_empleado;
    let id_empresa = req.jhobrosoftsession.empresa;
    let id_sucursal = req.jhobrosoftsession.sucursal;

    monto_inicial = monto_inicial.replace(',', '');
                monto_inicial = parseFloat(monto_inicial);
                monto_inicial = monto_inicial.toFixed(2);

    let desglose = 0;
    if(desglose_dinero == 'on'){
      desglose = 1;
    }

  let values = [id_caja, turno, id_cajero,id_supervisor,id_empresa,id_sucursal, almacen,'abierta',null,monto_inicial,null,null,null,desglose];
//`id_caja`, `id_turno`, `id_cajero`, `id_supervisor`, `id_empresa`, `id_sucursal`, `estado`, ``, `fecha_cierre`, `monto_inicial`, `monto_final`, `observaciones`, `desglose`
  let idDetalleCaja = await saveAsignacionDeCaja(values);
// console.log("Asignar Caja ======> ", values)
  //`id_caja`, `id_caja_detalle`, `id_venta`, `2000`, `1000`, `500`, `200`, `100`, `50`, `25`, `10`, `5`, `1`, `decimales`, `descripcion`
  values = [id_caja,idDetalleCaja,0,dosmil,mil,quinientos,doscientos,cien,cincuenta,veinticinco,diez,cinco,uno,decimales,'desglose_inicial'];
  await saveDesgloseDeCaja(values);
  // console.log("Asignar desglose ======> ", values)
  res.redirect('/facturacion');
}



module.exports = controller;
