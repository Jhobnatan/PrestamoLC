
const { clase_list, save_clase, update_clase, buscar_clase } = require('../services/claseService');
const { paginacion } = require("../config");

const controller = {};

controller.clase_list= async (req, res) =>{
    
    // let tipo_clase = await list_tipo_clase();

  res.render('clase',{
      paginacion,
      accesos: req.jhobrosoftsession.accesos
  });
}

controller.clase_list_filtro = async (req, res) =>{
  let { valor } =req.params;
  let { inicio } =req.params;

  if(valor =="aaaaaaaaaaaa"){
      valor ="";
  }
      let nunreg = paginacion;//10;
      let nuevoinicio = (inicio - 1) * nunreg

    const clasees = await clase_list(valor, nuevoinicio, nunreg);
      let registros = await clase_list(valor);
  clasees.push({ registros });
  res.send(clasees);
}


controller.clase_save_or_update = async (req, res) =>{
  let { id, nombre, descripcion } =req.params;
 
  let values = [];
  let resoult = "";
  if(id==0){
      values = [nombre, descripcion];
      
      resoult = await save_clase(values);
      res.send(resoult);
  }else{
      values = [nombre, descripcion,id];
      resoult = await update_clase(values);
      res.send(resoult);
  }      
    
}

controller.buscar_clase = async (req, res) =>{
  let { id } =req.params;
  let clase = await buscar_clase(id);
 
  res.send(clase[0]);
}



module.exports = controller;
