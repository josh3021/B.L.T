var browserify = require('browserify'),
reactify = require('reactify'),
React = require('react');

module.exports = (app) => {

    app.get('/network', (req, res) => {
        var x = req.query.x;
        var y = req.query.y;
        var telephone = req.query.telephone;
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
        
        res.send('성공');
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

    app.post('/emailAuth', (req, res) => {
        var token = req.body.token;
        var randomID = req.body.randomID;

        if(token === randomID) {
            console.log('인증 성공');
            res.redirect('/');
        }
        else {
            console.log('인증 실패. 회원가입 절차를 다시 진행해 주세요');
            res.redirect('/');
        }
    });
};