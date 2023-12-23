const { list,edit,update,accesos, borrar, insert_accesos,save } = require('../services/grupo_accesoService');

const controller = {};

controller.list= async (req, res) =>{
    let empresa = req.jhobrosoftsession.empresa;
    const grupo_acceso = await list(empresa);
    // console.log(grupo_acceso)
    res.render('grupo_acceso',{
        data: grupo_acceso,
        accesos: req.jhobrosoftsession.accesos
    });
}

controller.save = async (req,res) =>{
    const {descripcion} = req.body;
    if(descripcion !=''){
        let empresa = req.jhobrosoftsession.empresa;
        let values = [descripcion,empresa]
        await save(values);
        res.redirect('/grupo_acceso');
    }else{
        res.redirect('/grupo_acceso');
    }  
}

controller.edit = async (req,res)=>{
    const { id } =req.params;
    const data = req.body;

    const grupo_acceso = await edit(id);

    res.render('grupo_acceso_edit', {
        data: grupo_acceso[0],
        accesos: req.jhobrosoftsession.accesos
    });
}

controller.update = async (req,res)=>{
    const { id } =req.params;
    const {nombre_grupo} = req.body;
    // console.log(nombre_grupo);
    // console.log(id);
    const values = [nombre_grupo, id];

    const grupo_acceso = await update(values);

    res.redirect('/grupo_acceso');
}

controller.accesos = async (req,res)=>{
    const { id } =req.params;
    // const data = req.body;

    const acceso = await accesos(id);
    // console.log(acceso)

    res.render('accesos_list', {
        gacc: acceso[1],
        acc: acceso[0],
        gru: acceso[2].descripcion,
        id_acc: id,
        ar: acceso[3],
        accesos: req.jhobrosoftsession.accesos
    });
    
    
    ///res.send('funciona editar')

}

controller.accesos_save = async (req,res) =>{
    //console.log(req)
    const { id } =req.params;
    const data = req.body;
    const datos = Object.keys(req.body)
    // console.log(datos);
    await borrar(id);
    // const acceso = await accesos(id);
    for (i = 0; i < datos.length; i++) {
        let values = [datos[i],id];
        const acceso = await insert_accesos(values);
      }     
      res.redirect('/grupo_acceso');
}

controller.delete = (req,res) =>{

        res.redirect('/empresa');

}

module.exports = controller;
