module.exports = app => {
    const request = require('request');
    const xml2js = require('xml2js');
    const sseExpress = require('sse-express');
    var parser = new xml2js.Parser({
        explicitArray: false
    });
    var client_id = 'Your_Naver_Client_id';
    var client_secret = 'Your_Naver_Client_secret';

    app.get('/main', (req, res) => {
        if (!req.session.username) {
            return res.redirect('/');
        }
        res.render('mainMap', {
            username: req.user.username
        });
    });


    app.get('/updates', sseExpress, (req, res) => {

        var database = req.app.get('database');
        var x, y, date = [];
        database.ReportModel.find({
            'danger': true
        }, (err, user) => {
            if (err)
                throw err;

            if (user) {
                for (let i in user) {
                    x.push(user[i].position.x);
                    y.push(user[i].position.y);
                    date.push(user[i].report_at);
                }
            }

            res.sse('connected', {
                x: x,
                y: y,
                date: date
            });
        });
    });

    app.post('/search/local', (req, res) => {
        console.log(req.body.address);
        var api_url = 'https://openapi.naver.com/v1/search/local.xml?query=' + encodeURI(req.body.address);
        var options = {
            url: api_url,
            headers: {
                'X-Naver-Client-Id': client_id,
                'X-Naver-Client-Secret': client_secret
            }
        };
        request.get(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // var responseData = {'result' : body};
                // res.json(responseData);
                parser.parseString(body, function (err, result) {
                    var titles, telephones, roadAddresss, mapxs, mapys = [];
                    for (var i in result.rss.channel.item) {
                        titles.push(result.rss.channel.item[i].title);
                        telephones.push(result.rss.channel.item[i].telephone);
                        roadAddresss.push(result.rss.channel.item[i].roadAddress);
                        mapxs.push(result.rss.channel.item[i].mapx);
                        mapys.push(result.rss.channel.item[i].mapy);
                    }
                    res.send({
                        titles: titles,
                        telephones: telephones,
                        roadAddresss: roadAddresss,
                        mapxs: mapxs,
                        mapys: mapys
                    });
                });
            } else {
                res.status(response.statusCode).end();
                console.dir('error = ' + response.statusCode);
            }
        });
    });

}
