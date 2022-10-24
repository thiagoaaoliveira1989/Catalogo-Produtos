const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/categories/new', adminAuth, (req, res)=>{
    const title = 'Cadastrar Categoria';
    res.render('admin/categories/new',{
        title: title
    });
})

router.post('/categories/save', adminAuth, (req, res)=>{
    const title = req.body.title;

    if(title != undefined){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(()=>{
            res.redirect("/admin/categories");
        })
    }else{
        res.redirect('/admin/categories/new');
    }
})

router.get('/admin/categories', adminAuth, (req, res)=>{
    
        const title = 'Categorias Cadastradas';
    Category.findAll({ raw: true, order:[
     ['id', 'DESC'] // ASC= CRESCENTE / DESC= DECRECENTE ordenando a listagem por ordem decrescente
    ] }).then(categories => {
    
         res.render("admin/categories/index",{
             title: title,        
             categories: categories
         })

    })
})

router.post("/categories/delete", adminAuth, (req, res)=>{
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories");
            });
        }else{ // nao for um numero
            res.redirect("/admin/categories");
        }
    }else{ // for null
        res.redirect("/admin/categories");
    }
})


router.get("/admin/categories/edit/:id", adminAuth, (req, res)=>{
    const id = req.params.id;
    const title = 'Edit Categories';
    Category.findByPk(id).then((categories)=>{
        if(categories != undefined){
            
            res.render("admin/categories/edit",{
                title: title,
                categories: categories
            })

        }else{
            res.redirect("/admin/categories");
        }
    }).catch((erro)=>{
        res.redirect("/admin/categories");
    })
});


router.post("/admin/update", adminAuth, (req, res)=>{
    const id = req.body.id;
    const title = req.body.title;

    Category.update({
        title: title,
        slug: slugify(title)
    }, 
    {
        
        where: {
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/categories");
    })

})

module.exports = router;