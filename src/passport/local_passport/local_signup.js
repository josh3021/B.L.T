var LocalStrategy = require('passport-local').Strategy;
var nodemailer = require('nodemailer');

module.exports = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {
    console.log('config/passport/local-signup 호출됨');

    var paramEmail = req.body.email;

    console.log('username: %s, password: %s, email: %s', username, password, paramEmail);

    
    nodemailer.createTestAccount((err, account) => {
        if(err)
            throw err;

        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: "joseonghwan3021",
                pass: "whtjdghks0403"
            }
        });

        let randomID = makeid();

        console.log('randomID: '+randomID);

        let mailOptions = {
            from: 'BLT <joseonghwan3021@gmail.com>',
            to: 'yaostar@naver.com',
            subject: 'Nodemailer 테스트',
            html: '<h2>이메일 인증 링크</h2><div><p>밑의 문자열을 입력해 주세요</p><form action="http://45.119.146.229/emailAuth" method="POST"><label name="randomID">'+randomID+'</label><input type="text" name="token" placeholder="문자열 입력" /><input type="submit" value="이메일 인증"></form></div>'
        }

        transporter.sendMail(mailOptions, function(error, response){

            if (error){
                console.log(error);
            } else {
            }
            transporter.close();
        });
    })

    process.nextTick(() => {
        var database = req.app.get('database');

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

    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    
});