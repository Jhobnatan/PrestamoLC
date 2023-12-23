const { list, ncf_list_filtro, save,edit_ncf, secuencia_list_filtro,update,saveSecuencia, cantidadDeSecuenciaDisponible, secuenciaInicial } = require('../services/ncfService');
const { paginacion } = require("../config");
const controller = {};

controller.list= async (req, res) =>{
    // const empresas = await list();
    // const categoria = await categoria_empresa();
    res.render('ncf',{
        paginacion,
        accesos: req.jhobrosoftsession.accesos
    });
}

controller.ncf_list_filtro = async (req, res) =>{
    let { valor, inicio } =req.params;
  
    if(valor =="aaaaaaaaaaaa"){
        valor ="";
    }
        let nunreg = paginacion;//10;
        let nuevoinicio = (inicio - 1) * nunreg
  
      const ncfs = await ncf_list_filtro(valor, nuevoinicio, nunreg);
        let registros = await ncf_list_filtro(valor);
    ncfs.push({ registros });
    res.send(ncfs);
  }

controller.save_or_update = async (req,res) =>{
    const {id,descripcion,tipo_ncf,parte_fija,estado} = req.body;
    let values = [descripcion,tipo_ncf,parte_fija,estado];
    if(id =='Nuevo'){
        await save(values);
        res.send('save_ncf');
    }else{
        values = [descripcion,tipo_ncf,parte_fija,estado,id];
        await update(values);
        res.send('update_ncf');
    }  
}

controller.edit = async (req,res)=>{
    const { id } =req.params;
    // const data = req.body;

    const ncf = await edit_ncf(id);
    res.send(ncf[0])
}
controller.secuenciaList = async (req, res) =>{
    let { codigoNCF, estadoSecuencia, valor, inicio } =req.params;
    // console.log(codigoNCF, estadoSecuencia, valor, inicio)
    if(valor =="aaaaaaaaaaaa"){
        valor ="";
    }
        let nunreg = paginacion;//10;
        let nuevoinicio = (inicio - 1) * nunreg
  
      const secuencias = await secuencia_list_filtro(codigoNCF, estadoSecuencia, valor, nuevoinicio, nunreg);
        let registros = await secuencia_list_filtro(codigoNCF, estadoSecuencia, valor);
        // console.log(secuencias)
    secuencias.push({ registros });
    res.send(secuencias);
  }

  controller.cantidadDeSecuenciaDisponible = async (req, res) =>{
    let { codigoNCF } =req.params;
  
      const secuencias = await cantidadDeSecuenciaDisponible(codigoNCF);

    res.send(secuencias);
  }

  controller.secuenciaInicial = async (req, res) =>{
    let { codigoNCF } =req.params;
  
      const secuencias = await secuenciaInicial(codigoNCF);

    res.send(secuencias);
  }

  
controller.saveSecuencia = async (req,res) =>{
    let id_sucursal =1;
    const {desde,hasta,codigoNCF,vigencia_desde,vigencia_hasta,estado} = req.body;
    //`id_sucursal`, `vigencia_desde`, `vigencia_hasta`, `fecha_uso`, `secncf`, `estncf`, `codncf`
    let ncf = await edit_ncf(codigoNCF)
     
    // console.log(desde,hasta,codigoNCF,vigencia_desde,vigencia_hasta,estado)
    let secuencia;
    let values = [];
    for (let i = desde; i <= hasta; i++) {
        secuencia = i.toString().padStart(8, "0");
        secuencia = ncf[0].tipncf + ncf[0].parfij+secuencia;
        // console.log(codigoNCF, vigencia_desde, vigencia_hasta, secuencia, estado);
        values = [id_sucursal,vigencia_desde, vigencia_hasta, secuencia, estado, codigoNCF];
        await saveSecuencia(values);

    }
    // let values = [descripcion,tipo_ncf,parte_fija,estado];
    res.send('datos')
    // if(id =='Nuevo'){
    //     await saveSecuencia(values);
    //     res.send('save_ncf');
    // }else{
    //     // values = [descripcion,tipo_ncf,parte_fija,estado,id];
    //     // await update(values);
    //     res.send('update_ncf');
    // }  
}

controller.update = async (req,res)=>{
    const { id } =req.params;
    const { nombre_empresa } = req.body;
    const { razon_social } = req.body;
    const { telefono } = req.body;
    const { rnc } = req.body;
    const { categoria } = req.body;

    const values = [nombre_empresa, razon_social,rnc ,telefono, categoria, id];
    const empresa = await update(values);
    res.redirect('/empresa');

}

controller.delete = (req,res) =>{
    
    
}

module.exports = controller;
