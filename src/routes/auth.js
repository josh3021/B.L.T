const nodemailer = require('nodemailer');
const response = require('response');

module.exports = (app) => {


    app.get('/emailAuth', (req, res) => {
        res.render('emailAuth.ejs', {
            message: req.flash('')
        });
    })

    app.post('/getEmail', (req, res) => {
        let paramEmail = req.body.email;

        nodemailer.createTestAccount((err, account) => {
            if (err)
                throw err;

            let transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: "vrms.koi",
                    pass: "#include12"
                }
            });

            let randomID = makeid();

            console.log('randomID: ' + randomID);

            let mailOptions = {
                from: 'vrms.koi <vrms.koi@gmail.com>',
                to: paramEmail,
                subject: 'VRMS 이메일 인증 링크',
                html: '<h2>이메일 인증 링크</h2><div><form action="https://45.119.146.229/emailAuth" method="POST"><input type="email" name="email" value="' + paramEmail + '" readonly /><br /><br /><h4>밑의 문자열을 입력해 주세요</h4><input type="text" name="randomID" value="' + randomID + '"readonly  /><br><input type="text" name="token" placeholder="문자열 입력" /><input type="submit" value="이메일 인증"></form></div>'
            }

            transporter.sendMail(mailOptions, function (error, response) {

                if (error) {
                    console.log(error);
                } else {
                    res.send('인증 번호를 이메일로 보냈습니다! 이메일 링크를 확인해 주세요');
                }
                transporter.close();
            });
        });
    });

    app.post('/emailAuth', (req, res) => {
        let token = req.body.token;
        let randomID = req.body.randomID;
        let paramEmail = req.body.email;

        if (token === randomID) {
            console.log('인증 성공');
            res.redirect('/signup?email=' + paramEmail);
        } else {
            req.flash('EmailAuthFail', '인증에 실패하였습니다. 회원가입 절차를 다시 진행해주세요.');
            console.log('인증 실패. 회원가입 절차를 다시 진행해 주세요');
            res.render('emailAuth.ejs', {
                message: req.flash('EmailAuthFail')
            });
        }
    });

    app.get('/render_to_firm', (req, res) => {
        let paramUsername = req.query.username;
        let paramPassword = req.query.password;

        const database = req.app.get('database');
        database.UserModel.findOne({
            username: paramUsername
        }, (err, user) => {
            if (err) throw err;

            let authenticated = user.authenticated(paramPassword, user._doc.salt, user._doc.hashed_password);

            if (!authenticated) {
                return res.send('fail');
            }

            res.send('ok, username: ' + user._doc.username + ', email: ' + user._doc.email + ', point: ' + user._doc.point)
        });
    });

    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

};