const express = require('express');
const app = express();
const PORT = 3000;
const URL = "http://localhost:";
const bodyParser = require('body-parser');
const conn = require('./database/database');

const categoriesController = require('./categories/CategoriesController');
const produtosController = require('./produtos/ProdutosController');
const usuariosController = require('./usuarios/UsuariosController');

const Usuarios = require('./usuarios/Usuarios'); 
const Produtos = require('./produtos/Produtos');
const Category = require('./categories/Category');


//image
const fileUpload = require('express-fileupload');



const session = require('express-session');
/* const router = require('./categories/CategoriesController'); */

//view engine
app.set('view engine', 'ejs');


//config session

app.use(session({
    secret: "encryptePasseUser",
    cookie: {
        maxAge:  24 * 60 * 60 * 1000
    }
}))

//Static
app.use(express.static('public'));

//body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//conection
conn
    .authenticate()
    .then(()=>{
        console.log("Database Successfully Connected")
    }).catch((error)=>{
    console.log(error);
})



app.use('/', categoriesController);
app.use('/', produtosController);
app.use('/', usuariosController);

app.get('/', (req, res)=>{
    const title = 'Catalogo de Produtos';
    const horas = new Date();
const diaAtual= horas.getDate();
const session = req.session.users;

Produtos.findAll({
    order: [
        ['id', 'DESC']
    ],
    limit: 10
}).then(produtos=>{

    function carrinho(id){
        console.log(id)
    }

    Category.findAll().then(categories=>{
        res.render('index',{
            title: title,
            produtos: produtos,
            categories: categories,
            diaAtual: diaAtual,
            adminAuth: session,
            carrinho
            
        });
    })
    
})


})

app.get("/:slug", (req, res)=>{
const slug = req.params.slug;
const horas = new Date();
const diaAtual= horas.getDate();

Produtos.findOne({
    where: {
        slug: slug
    }
}).then(produtos=>{
    if(produtos != undefined){
        const title = "Artigo";
        

        res.render("produtos",{
            title:title,
            produtos:produtos,
            diaAtual: diaAtual
        });
    }else{
        res.redirect("/");
    }
}).catch(error=>{
    res.redirect("/")
})
})

app.get("/category/:slug", (req, res)=>{
const slug = req.params.slug;
const horas = new Date();
const diaAtual= horas.getDate();

Category.findOne({
    where: {
        slug: slug
    },
    include: [{model: Produtos}]
}).then(category =>{
    if(category != undefined){
        
        Category.findAll().then(categories=>{
                 res.render("index",{
                    title: categories.title,
                    produtos: category.produtos,
                    categories: categories,
                    diaAtual: diaAtual,
                 })
        })
        
        
    }else{
        res.redirect("/")
    }
}).catch(error=>{
    res.redirect("/")
})
})

app.listen(PORT, ()=>{
    console.log("Click on the link to open the SERVER ->>> " + URL + PORT);
})