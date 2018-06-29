const nodemailer = require('nodemailer');

module.exports = (app) => {

    app.get('/network', (req, res) => {
        var x = req.query.x;
        var y = req.query.y;
        var telephone = req.query.telephone;
	var username = req.query.username;
        var database = req.app.get('database');

        console.log('telephone: '+telephone+', x: '+x+', y: '+y);

        var reportuser = new database.ReportModel({
            'telephone': telephone,
            'position.x': x,
            'position.y': y,
            'danger': true
        });
        reportuser.save(err => {
            if(err)
                throw err;
            console.log('successfully saved reported user at ReportModel database');
        });

	database.UserModel.findOne({
		'username': username
	}, (err, user) => {
		user.danger = true;
		user.save(err => {
			if(err) throw err;
		console.log('신고 접수');
	});
        
        res.send('성공');
    });
    });

    app.post('/profile/safe', (req, res) => {
   	let database = req.app.get('database');
	database.ReportModel.findOne({
		'username': req.session.username
	}, (err, user) => {
		user.danger = false;
		user.save(err => {
			if(err) throw err;
			console.log('안전합니다!');
		});
	res.redirect('/profile');
	});
    });
    
    app.get('/statics/user', (req, res) => {
        var database = req.app.get('database');
        database.ReportModel.find({}, function(err, user) {
            if(err)
                throw err;

            if(user) {
                var UserDan = new Array();
                var UserRep = new Array();
                for(i in user) {
                    UserDan.push(user[i].danger);
                    UserRep.push(user[i].report_at);
                }
                res.send({ UserDan: UserDan, UserRep: UserRep });
            }
        });
    });

    app.get('/emailAuthen', (req, res) => {
        res.render('emailAuth.ejs', {
	message: req.flash('')
	});
    })

    app.post('/getEmail', (req, res) => {
        var paramEmail = req.body.email;

        nodemailer.createTestAccount((err, account) => {
            if(err)
                throw err;
    
            let transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: "vrms.koi",
                    pass: "#include12"
                }
            });
    
            let randomID = makeid();
    
            console.log('randomID: '+randomID);
    
            let mailOptions = {
                from: 'vrms.koi <vrms.koi@gmail.com>',
                to: paramEmail,
                subject: 'Nodemailer 테스트',
                html: '<h2>이메일 인증 링크</h2><div><p>밑의 문자열을 입력해 주세요</p><form action="http://45.119.146.229/emailAuth" method="POST"><input type="email" name="email" value="'+paramEmail+'" readonly /><input type="text" name="randomID" value="'+randomID+'"readonly  /><input type="text" name="token" placeholder="문자열 입력" /><input type="submit" value="이메일 인증"></form></div>'
            }
    transporter.sendMail(mailOptions, function(error, response){
    
                if (error){
                    console.log(error);
                } else {
                    res.send('인증 번호를 이메일로 보냈습니다! 이메일 링크를 확인해 주세요');
                }
                transporter.close();
            });
        })
    

        function makeid() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
            for( var i=0; i < 5; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));
    
            return text;
        }
    });

	app.post('/emailAuth', (req, res) => {
        var token = req.body.token;
        var randomID = req.body.randomID;
        var paramEmail = req.body.email;

        if(token === randomID) {
            console.log('인증 성공');
            res.redirect('/signup?email='+paramEmail);
        }
        else {
	    req.flash('EmailAuthFail', '인증에 실패하였습니다. 회원가입 절차를 다시 진행해주세요.');
            console.log('인증 실패. 회원가입 절차를 다시 진행해 주세요');
            res.render('emailAuth.ejs', { message: req.flash('EmailAuthFail') });
        }
    });
};
