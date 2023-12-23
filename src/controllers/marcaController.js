
const { marca_list, save_marca, update_marca, buscar_marca } = require('../services/marcaService');
const { paginacion } = require("../config");

const controller = {};

controller.marca_list= async (req, res) =>{
    
    // let tipo_marca = await list_tipo_marca();

  res.render('marcas',{
      paginacion,
      accesos: req.jhobrosoftsession.accesos
  });
}

controller.marca_list_filtro = async (req, res) =>{
  let { valor } =req.params;
  let { inicio } =req.params;

  if(valor =="aaaaaaaaaaaa"){
      valor ="";
  }
      let nunreg = paginacion;//10;
      let nuevoinicio = (inicio - 1) * nunreg

    const marcaes = await marca_list(valor, nuevoinicio, nunreg);
      let registros = await marca_list(valor);
  marcaes.push({ registros });
  res.send(marcaes);
}


controller.marca_save_or_update = async (req, res) =>{
  let { id, nombre, descripcion } =req.params;
 
  let values = [];
  let resoult = "";
  if(id==0){
      values = [nombre, descripcion];
      
      resoult = await save_marca(values);
      res.send(resoult);
  }else{
      values = [nombre, descripcion,id];
      resoult = await update_marca(values);
      res.send(resoult);
  }      
    
}

controller.buscar_marca = async (req, res) =>{
  let { id } =req.params;
  let marca = await buscar_marca(id);
 
  res.send(marca[0]);
}



module.exports = controller;
