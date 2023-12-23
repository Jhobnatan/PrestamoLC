const controller = {};

controller.list= (req, res) =>{
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM customer', (erro, customers) =>{
            if(err){
                res.json(err);
            }
            console.log(customers);
            res.render('customers',{
                data: customers
            });
        });
    })
}

controller.save = (req,res) =>{
    //console.log(req)
    const data = req.body;
    //console.log(data);
    //console.log('mis datos son'+data.name+"y mas nada");
    if(data.name !=''){
        req.getConnection((err, conn) =>{
            conn.query('INSERT INTO customer set ?',[data], (err, customer) =>{
                console.log(customer);
                res.redirect('/');
                //res.send("funciona el insert")
            });
        })
    }else{
        res.redirect('/');
    }
    
    
}

controller.edit = (req,res)=>{
    const { id } =req.params;
    const data = req.body;
    req.getConnection((err,conn)=>{
        conn.query('SELECT * FROM customer WHERE id =?',[id], (err, customer) =>{
            res.render('customer_edit', {
                data: customer[0]
            });
        });
    })
    ///res.send('funciona editar')

}

controller.update = (req,res)=>{
    const { id } =req.params;
    const newCustomer = req.body;
    req.getConnection((err, conn) =>{
        conn.query('UPDATE customer set ? WHERE id =?', [newCustomer, id],(err, rows)=>{
            res.redirect('/');
        })
    })
}

controller.delete = (req,res) =>{
    const { id } =req.params;
    req.getConnection((err,conn)=>{
        conn.query('DELETE FROM customer WHERE id = ?',[id])
        res.redirect('/');
    })

    console.log(req.params);
    res.send("funciona")
}

module.exports = controller;
