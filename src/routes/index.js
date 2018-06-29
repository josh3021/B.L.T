module.exports = app => {

    app.get('/', (req, res) => {
        console.log('/ 패스 요청됨.');
        if(req.user) 
            res.render('index.ejs', {user: req.user});
        else
            res.render('login.ejs');
    });
    
};
