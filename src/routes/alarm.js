const nodemailer = require('nodemailer');
const xml2js = require('xml2js');
var parser = new xml2js.Parser({
    explicitArray: false
});

module.exports = app => {
    app.get('/fencedata', (req, res) => {
        console.log(req.query);
        var ne_x = req.query.ne_x;
        var ne_y = req.query.ne_y;
        var sw_x = req.query.sw_x;
        var sw_y = req.query.sw_y;

        req.session.ne_x = ne_x;
        req.session.ne_y = ne_y;
        req.session.sw_x = sw_x;
        req.session.sw_y = sw_y;

        console.log('ne_x: ' + req.session.ne_x + ', ne_y: ' + req.session.ne_y + ', sw_x: ' + req.session.sw_x + ', sw_y: ' + req.session.sw_y);
        console.log(req.session);
        res.send('fence가 설정되었습니다.');
    });

    app.post('/isChildIn', (req, res) => {
        if (!req.session.username === req.body.username)
            res.redirect('/');
        var childX = req.body.childX; //126정도 값
        var childY = req.body.childY; //37정도 값
        var telephone = req.query.telephone;

        console.log('query: ' + req.body.username + ', ' + childX + ', ' + childY + ', ' + req.body.telephone);
        console.log(req.session.ne_x + ', ' + req.session.ne_y + ', ' + req.session.sw_x + ', ' + req.session.sw_y + ', ' + req.session.username);
        if (childX > req.session.ne_x || childY > req.session.ne_y || childX < req.session.sw_x || childY < req.session.sw_y) {
            //알람
            const database = req.app.get('database');
            database.UserModel.findOne({
                'username': req.session.username
            }, (err, user) => {
                if (err) throw err;

                if (!user) {
                    return res.json({
                        message: 'Invalid username'
                    });
                }

                user.danger = true;
                user.save(err => {
                    if (err) throw err;
                    console.log('change UserModel danger: ture');
                });

                var pos = childY + ',' + childX;
                sendEmail(user.email, pos);
            });

            let reportuser = new database.ReportModel({
                'username': req.query.username,
                'telephone': telephone,
                'position.x': childX,
                'position.y': childY,
                'danger': true
            });

            reportuser.save(err => {
                if (err) throw err;
                console.log('saved successfully');
            });

            return res.json({
                message: 'child is outBounds! find UR child Immedietly!'
            });
        }
        res.json({
            message: 'child is inBounds'
        });
    });

    app.get('/userroute', (req, res) => {
        var x = req.query.pos_x;
        var y = req.query.pos_y;

        if (!req.session.child_pos) {
            req.session.child_pos = new Array();
        }

        req.session.child_pos.push(new Object(x, y));
        console.log(req.session.child_pos);
    });

    app.post('/report', (req, res) => {
        let x = req.body.x;
        let y = req.body.y;
        let telephone = req.body.telephone;
        let username = req.body.username;
        const database = req.app.get('database');

        console.log('telephone: ' + telephone + ', x: ' + x + ', y: ' + y + ', username: '+username);


        database.UserModel.findOne({
            'username': username
        }, (err, user) => {
            if(err) throw err;
            user.danger = true;
            console.log('hello')
            let pos = y + ', ' + x + '';
            reportsendEmail(user.email, pos);

            user.save(err => {
                if (err) throw err;
                console.log('신고 접수');
            });
        });

        let reportuser = new database.ReportModel({
            'username': username,
            'telephone': telephone,
            'position.x': x,
            'position.y': y,
            'danger': true
        });
        reportuser.save(err => {
            if (err)
                throw err;
            console.log('successfully saved reported user at ReportModel database');
        });


            res.send('성공');
        });

        
    };

    function sendEmail(email, pos) {
        console.log('pos: ' + pos);
        var api_url = 'https://openapi.naver.com/v1/map/reversegeocode.xml?query=' + encodeURI(pos);
        var client_id = 'EzUf5_07z65lc8sKq2px';
        var client_secret = 'p1aoeu7FQO';
        var request = require('request');
        var options = {
            url: api_url,
            headers: {
                'X-Naver-Client-Id': client_id,
                'X-Naver-Client-Secret': client_secret
            }
        }
        nodemailer.createTestAccount((err, account) => {
            if (err) throw err;

            let transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: "vrms.koi",
                    pass: "#include12"
                }
            });

            let lostDate = new Date().toLocaleString();

            request.get(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    let lostAddr;
                    parser.parseString(body, (err, result) => {
                        console.log('result: ' + JSON.stringify(result.result.items));
                        lostAddr = result.result.items.item.address;
                    });
                    let mailOptions = {
                        from: 'vrms.koi <vrms.koi@gmail.com>',
                        to: email,
                        subject: '아이가 반경에서 벗어났습니다!',
                        html: '<h2>아이가 반경에서 벗어났습니다!</h2><br><p>실종위치: ' + lostAddr + '</p><br><p>실종시간: ' + lostDate + '</p>'
                    }

                    transporter.sendMail(mailOptions, (err, res) => {
                        if (err) throw err;
                        transporter.close();
                    });
                } else {
                    let mailOptions = {
                        from: 'vrms.koi <vrms.koi@gmail.com>',
                        to: email,
                        subject: '아이가 반경에서 벗어났습니다!',
                        html: '<h2>아이가 반경에서 벗어났습니다!</h2><br><p>확인할 수 없는 장소입니다.</p>'
                    }

                    transporter.sendMail(mailOptions, (err, res) => {
                        if (err) throw err;
                        transporter.close();
                    });
                }
            });
        });
    };


    function reportsendEmail(email, pos) {
        console.log('pos: ' + pos);
        var api_url = 'https://openapi.naver.com/v1/map/reversegeocode.xml?query=' + encodeURI(pos);
        var client_id = 'EzUf5_07z65lc8sKq2px';
        var client_secret = 'p1aoeu7FQO';
        var request = require('request');
        var options = {
            url: api_url,
            headers: {
                'X-Naver-Client-Id': client_id,
                'X-Naver-Client-Secret': client_secret
            }
        }
        nodemailer.createTestAccount((err, account) => {
            if (err) throw err;

            let transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: "vrms.koi",
                    pass: "#include12"
                }
            });

            let lostDate = new Date().toLocaleString();

            request.get(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    let lostAddr;
                    parser.parseString(body, (err, result) => {
                        console.log('result: ' + JSON.stringify(result.result.items));
                        lostAddr = result.result.items.item.address;
                    });
                    let mailOptions = {
                        from: 'vrms.koi <vrms.koi@gmail.com>',
                        to: email,
                        subject: '아이가 디바이스를 눌렀습니다!',
                        html: '<h2>아이가 디바이스를 눌렀습니다!</h2><br><p>실종위치: ' + lostAddr + '</p><br><p>실종시간: ' + lostDate + '</p>'
                    }

                    transporter.sendMail(mailOptions, (err, res) => {
                        if (err) throw err;
                        transporter.close();
                    });
                } else {
                    let mailOptions = {
                        from: 'vrms.koi <vrms.koi@gmail.com>',
                        to: email,
                        subject: '아이가 반경에서 벗어났습니다!',
                        html: '<h2>아이가 반경에서 벗어났습니다!</h2><br><p>확인할 수 없는 장소입니다.</p>'
                    }

                    transporter.sendMail(mailOptions, (err, res) => {
                        if (err) throw err;
                        transporter.close();
                    });
                }
            });
        });
    };
