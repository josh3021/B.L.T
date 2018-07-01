const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {
    console.log('config/passport/local-signup 호출됨');

    let paramEmail = req.body.email;

    console.log('username: %s, password: %s, email: %s', username, password, paramEmail);

    
    process.nextTick(() => {
        const database = req.app.get('database');

        database.UserModel.findOne({
            'username': 'username'
        }, (err, user) => {
            if(err) 
                return done(err);
            
            if(user){
                console.log('계정이 이미 존재함');
                return done(null, false, req.flash('signupMessage', '계정이 이미 존재합니다.'));
            }

            else {
                console.log('UserModel: '+database.UserModel);
                user = new database.UserModel({
                    'username': username,
                    'password': password,
                    'email': paramEmail
                });
                user.save(err => {
                    if(err)
                        throw err;
                    console.log('사용자 데이터 데이터베이스에 정상적으로 추가됨');
                    req.session.username = username;
                    return done(null, user);    
                });
            }
        })
    });

});
