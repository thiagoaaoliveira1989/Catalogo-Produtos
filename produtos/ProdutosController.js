const express = require('express');
const router = express.Router();
const Produtos = require('./Produtos');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');
const Category = require('../categories/Category');
const fileUpload = require('express-fileupload');

router.get('/admin/produtos/new', adminAuth, (req, res)=>{
 
    Category.findAll().then(categories =>{
        res.render('admin/produtos/new',{
            title: 'Cadastro de Produtos',
            categories: categories
        })
    })

})


  router.use(fileUpload());
router.post('/admin/produtos/save', (req, res)=>{
    let sampleFile;
    let uploadPath;
   
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded');
    }
    //pegando dados do input de image
    
  
    sampleFile = req.files.sampleFile;
    numeroale= Math.floor(Math.random() * 10 + 1)
    const nomeDaImagem = "foto"+ numeroale + sampleFile.name ;
    const path = require('path');
    uploadPath = path.join(__dirname, '..', '/public/img/', nomeDaImagem);
    const caminhoDaImagem = path.join(__dirname, '..', '/public/img/');

    //dados do form
    const codigo = req.body.codigo;
    const title = req.body.title;
    const preco = req.body.preco;
    const estoque = req.body.estoque;
    const categoryId= req.body.category;

    Produtos.create({
        image: nomeDaImagem,
        codigo: codigo,
        title: title,
        slug: slugify(title),
        preco: preco,
        estoque: estoque,
        categoryId: categoryId
    }).then(()=>{
        res.redirect("/admin/produtos");
    })


    //Usar o mv() colocar o arquivo no servidor
    sampleFile.mv(uploadPath, function(err) {
        if(err) return res.status(400).send(err);

        
     });

   
    });

  
    router.post('/admin/produtos/update', (req, res)=>{
       
        //dados do form
        const id = req.body.id;
        const image = req.body.image;
        const codigo = req.body.codigo;
        const title = req.body.title;
        const preco = req.body.preco;
        const estoque = req.body.estoque;
        const categoryId= req.body.category;
    
        Produtos.update({
            image: image,
            codigo: codigo,
            title: title,
            slug: slugify(title),
            preco: preco,
            estoque: estoque,
            categoryId: categoryId
        },
        {
            where: {
                id:id
            }
        }).then(()=>{
            res.redirect("/admin/produtos");
        })
    
    
       
        });


    router.get('/admin/produtos', adminAuth, (req, res)=>{
        const path = require('path');
        const caminhoDaImagem = path.join(__dirname, '..', '/public/img/');

            Produtos.findAll({ 
                include: {model: Category}, //buscar dados pelo relacionamento entre as tabelas
               /*  raw: true, 
                order:[
                ['id', 'DESC'] // ASC= CRESCENTE / DESC= DECRECENTE ordenando a listagem por ordem decrescente */
                }).then(produtos=>{
                res.render('admin/produtos/index',{
                    title: 'Produtos',
                    produtos :produtos,
                    caminhoDaImagem: caminhoDaImagem
                })
                       
            })
    });



    router.post("/produtos/delete", adminAuth, (req, res)=>{
        var id = req.body.id;
        if(id != undefined){
            if(!isNaN(id)){
                Produtos.destroy({
                    where: {
                        id: id
                    }
                }).then(() => {
                    res.redirect("/admin/produtos");
                });
            }else{ // nao for um numero
                res.redirect("/admin/produtos");
            }
        }else{ // for null
            res.redirect("/admin/produtos");
        }
    });


    router.get('/admin/produto/edit/:id', (req, res)=>{
        const id = req.params.id;

        Produtos.findAll({
          
            where: {
                id:id
            }
        }).then((produtos)=>{

                if(produtos != undefined){
                    Category.findAll().then(categories =>{
                        res.render("admin/produtos/edit",{
                            title: "Editar Produto" + produtos.title,
                            categories: categories,
                            produtos: produtos
                        })
                    })
                              
                }else{
                    res.redirect("/admin/categories");
                }
            }).catch((erro)=>{
                res.redirect("/admin/categories");
            })
              
    })
    
    router.get("/produtos/page/:num", (req, res)=>{
        var page = req.params.num;
        var offset = 0;
    
        if(isNaN(page) || (page == 0)){
            offset = 1;
        }else{
            offset = (parseInt(page) - 1)* 4;
        }
             
        //findAndCountAll -> retorna todos os artigos e a quantidade
        Produtos.findAndCountAll({
            order: [
                ['id', 'DESC']
            ],
            limit: 4, //limitar 4 registro por pagina
            offset: offset
        }).then(produtos=>{
            var next;
            if(offset + 4 >= produtos.count){
                next = false;
            }else{
                next = true;
            }
            const result = {
                page: parseInt(page),
                next:next,
                produtos: produtos
            }
            Category.findAll().then(categories=>{
                const horas = new Date();
                const diaAtual= horas.getDate();
    
                res.render("admin/produtos/page",{
                    result: result,
                    categories: categories,
                    produtos: produtos,
                    title: "page " + page,
                    diaAtual: diaAtual
                })
            })
        })
    
    })


router.post('/produtos/carrinho', (req, res)=>{
   const foto = req.body('foto');
   const title = req.body('title');
   const preco = req.body('preco');

   console.log(preco);

    var  produtos = [];
    produtos = produtos + produtos[{foto, title, preco}]
    res.json(produtos);
})
    


module.exports = router;