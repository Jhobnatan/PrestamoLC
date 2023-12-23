const { list, save,edit,update,list_empersas } = require('../services/departamentoService');

const controller = {};

controller.list= async (req, res) =>{
    const departamentos = await list()
    const empresas = await list_empersas()
    // console.log(departamentos)
    res.render('departamentos',{
        // data: departamentos,
        empresa: empresas,
        accesos: req.jhobrosoftsession.accesos
    });
}

controller.save = async (req,res) =>{
    const data = req.body;
    const { descripcion, centro, empresa } = req.body;

    const values = [descripcion, centro, empresa];
    //console.log(data);
    // console.log('mis datos son'+values+"y mas nada");
    console.log('mis datos son '+descripcion+" y mas nada");
    console.log('mis datos son '+centro+" y mas nada");
    console.log('mis datos son '+empresa+" y mas nada");

        await save(values)
        res.redirect('/departamento');        
    
}

controller.edit = async (req,res)=>{
    const { id } =req.params;
    const data = req.body;
    const departamento = await edit(id)
    console.log(departamento)
    const empresas = await list_empersas()
    res.render('departamento_edit', {
        data: departamento[0],
        empresa: empresas[0],
        accesos: req.jhobrosoftsession.accesos
    });
    ///res.send('funciona editar')

}

controller.update = async (req,res)=>{
    const { id } =req.params;
    // console.log(req.body)
    const { descripcion, centro } = req.body;

    const values = [descripcion, centro, id];
    // console.log(values)
    const emp = await update(values);

    res.redirect('/departamento')
}

controller.delete = (req,res) =>{
    const { id } =req.params;
    req.getConnection((err,conn)=>{
        conn.query('DELETE FROM `jr_departamento` WHERE `id_departamento` = ?',[id]);
        res.redirect('/departamento');
    })

}

module.exports = controller;
