
const { suplidor_list, save_suplidor, update_suplidor, buscar_suplidor } = require('../services/suplidorService');
const { paginacion } = require("../config");

const controller = {};

controller.suplidor_list= async (req, res) =>{
    
    // let tipo_suplidor = await list_tipo_suplidor();
// console.log("lista de suplidores")
  res.render('suplidor',{
      paginacion,
      accesos: req.jhobrosoftsession.accesos
  });
}

controller.suplidor_list_filtro = async (req, res) =>{
  let { valor } =req.params;
  let { inicio } =req.params;

  if(valor =="aaaaaaaaaaaa"){
      valor ="";
  }
      let nunreg = paginacion;//10;
      let nuevoinicio = (inicio - 1) * nunreg

    const suplidores = await suplidor_list(valor, nuevoinicio, nunreg);
      let registros = await suplidor_list(valor);
  suplidores.push({ registros });
  res.send(suplidores);
}


controller.suplidor_save_or_update = async (req, res) =>{
  let { id, empresa_sup, direccion_sup, rnc_sup, representante, flota, telefono, extension } =req.params;
 
  let values = [];
  let resoult = "";
  if(id==0){
      values = [empresa_sup, direccion_sup, rnc_sup, representante, flota, telefono, extension];
      
      resoult = await save_suplidor(values);
      res.send(resoult);
  }else{
      values = [empresa_sup, direccion_sup, rnc_sup, representante, flota, telefono, extension,id];
      resoult = await update_suplidor(values);
      res.send(resoult);
  }      
    
}

controller.buscar_suplidor = async (req, res) =>{
  let { id } =req.params;
  let suplidor = await buscar_suplidor(id);
 
  res.send(suplidor[0]);
}



module.exports = controller;
