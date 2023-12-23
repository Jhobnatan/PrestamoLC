const { list, save,edit,update,categoria_empresa } = require('../services/empresaService');

const controller = {};


controller.list= async (req, res) =>{
    const empresas = await list();
    const categoria = await categoria_empresa();
    res.render('empresas',{
        data: empresas,
        cat: categoria,
        accesos: req.jhobrosoftsession.accesos
    });
}

controller.save = async (req,res) =>{
    const data = req.body;
    if(data !=''){
        await save(data);
        res.redirect('/empresa');
    }else{
        res.redirect('/empresa');
    }  
}

controller.edit = async (req,res)=>{
    const { id } =req.params;
    const data = req.body;

    const empresa = await edit(id);
    const categoria = await categoria_empresa();
    res.render('empresa_edit', {
        data: empresa[0],
        cat: categoria,
        accesos: req.jhobrosoftsession.accesos
    });
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
