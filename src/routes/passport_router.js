
    
module.exports = (app, passport) => {
    console.log('user_passport 호출됨');
    

    // login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    // 회원가임 폼
    app.get('/signup', (req, res) => {
        var email = req.query.email;
        console.log('/signup 패스 요청됨');
        res.render('signup.ejs', {
            email: email,
            message: req.flash('signupMessage')
        });
    });

    // 회원가임 proc
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    // 로그아웃
    app.get('/logout', (req, res) => {
        console.log('/logout 패스 요청됨.');
        req.logout();
        req.session.destroy();
        res.redirect('/');
    });

    
};
    
