function adminAuth(req, res, next){
    if(req.session.users != undefined){
        next();
    }else{
        res.redirect('/admin/users/login');
    }
}

module.exports = adminAuth;