const { list, save,edit,update,emp } = require('../services/ejecutivoService');

const controller = {};


controller.list= async (req, res) =>{
    const data = await list()
    res.render('ejecutivo',{
        emp: data[0],
        data: data[1],
        accesos: req.jhobrosoftsession.accesos
    });
}

controller.save = async (req,res) =>{
    const data = req.body;
    const { nombre, telefono, flota, correo, empresa } =req.body;


    const values = [nombre, telefono, flota, correo, empresa, 'Activo'];
    // console.log(values)
    if(data !=''){
        await save(values);
        res.redirect('/ejecutivo');
    }else{
        res.redirect('/ejecutivo');
    }  
}

controller.edit = async (req,res)=>{
    const { id } =req.params;
    const data = req.body;

    const ejecutivo = await edit(id);
    // console.log(ejecutivo)
    const empre = await emp();
    // console.log(empre)
    res.render('ejecutivo_edit', {
        data: ejecutivo[0],
        emp: empre,
        accesos: req.jhobrosoftsession.accesos
    });
}

controller.update = async (req,res)=>{
    const { id } =req.params;
    const { nombre, telefono, flota, correo, empresa, estado } =req.body;
    
    const values = [nombre, telefono, flota, correo, empresa,estado, id];
    const ejecutivo = await update(values);
    res.redirect('/ejecutivo');

}

controller.delete = (req,res) =>{
    
    
}

module.exports = controller;
