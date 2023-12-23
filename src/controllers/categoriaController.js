
const { categoria_list, save_categoria, update_categoria, buscar_categoria } = require('../services/categoriaService');
const { paginacion } = require("../config");

const controller = {};

controller.categoria_list= async (req, res) =>{
    
    // let tipo_categoria = await list_tipo_categoria();

  res.render('categorias',{
      paginacion,
      accesos: req.jhobrosoftsession.accesos
  });
}

controller.categoria_list_filtro = async (req, res) =>{
  let { valor } =req.params;
  let { inicio } =req.params;

  if(valor =="aaaaaaaaaaaa"){
      valor ="";
  }
      let nunreg = paginacion;//10;
      let nuevoinicio = (inicio - 1) * nunreg

    const categoriaes = await categoria_list(valor, nuevoinicio, nunreg);
      let registros = await categoria_list(valor);
  categoriaes.push({ registros });
  res.send(categoriaes);
}


controller.categoria_save_or_update = async (req, res) =>{
  let { id, nombre, descripcion } =req.params;
 
  let values = [];
  let resoult = "";
  if(id==0){
      values = [nombre, descripcion];
      
      resoult = await save_categoria(values);
      res.send(resoult);
  }else{
      values = [nombre, descripcion,id];
      resoult = await update_categoria(values);
      res.send(resoult);
  }      
    
}

controller.buscar_categoria = async (req, res) =>{
  let { id } =req.params;
  let categoria = await buscar_categoria(id);
 
  res.send(categoria[0]);
}



module.exports = controller;
