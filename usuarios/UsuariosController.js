const express = require('express');
const router = express.Router();
const Usuarios = require("./Usuarios");
const bcrypt = require("bcryptjs"); // criptogafar senha
const adminAuth = require('../middlewares/adminAuth');

/* GET login page. */
router.get('/admin/users/login', (req, res, next) => {
    const session = req.session.users;



    res.render('admin/users/login', { title: 'Login Page', message: "error", adminAuth: session });
});

// Authenticate
router.post('/authenticate', (req,res)=>{
    const nome = req.body.nome;
    const email = req.body.email;
    const password = req.body.password;

    Usuarios.findOne({
        where:{
            email: email
        }
    }).then(users=>{

        if(users != undefined){
           const correct = bcrypt.compareSync(password, users.password);
          
           if(correct){
            req.session.users = {
                id: users.id,
                nome: users.nome,
                email: users.email
            }
            res.render('admin/users/profile',{
                title: "Usuario Logado",
                users: req.session.users
            })

           }
          
        }else{
            res.redirect('/admin/users/login');
        }

     
    })
})

/* GET Signup */
router.get('/admin/users/cadastro', adminAuth, function (req, res) {
    res.render('admin/users/cadastro', {
        title: 'Signup Page',
        message: "Cadastro"
    });
});


router.post('/admin/users/cadastro', function (req, res) {
    const nome = req.body.nome;
    const email = req.body.email;
    const password= req.body.password;
    
    Usuarios.findOne({
        where:{
            email: email
        }
    }).then(user =>{
        if(user == undefined){

            if(email != undefined){
                Usuarios.create({
                    nome: nome,
                    email: email,
                    password: hast
        
                }).then(()=>{
                    res.redirect("/admin/users/login");
                })
            }else{
                res.redirect("/admin/users/cadastro");
            }

        }else{
            res.redirect('/admin/users/cadastro')
        }
    })


    const salt = bcrypt.genSaltSync(10);
    const hast = bcrypt.hashSync(password, salt);

   
    
});

/* GET login page. */

/* GET Profile page. */
router.get('/admin/user/profile', function (req, res) {
    const session = req.session.users;

if(session != undefined){
    res.render('admin/users/profile',{
        users: session,
        title: session.email
    })
}
    
    
});

router.get('/logout', (req, res)=>{
    req.session.users = undefined;
    res.redirect('/');
})


module.exports = router;