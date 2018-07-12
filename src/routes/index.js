module.exports = app => {

    app.get('/', (req, res) => {
        console.log('/ 패스 요청됨.');
        res.render('index.ejs', {
            user: req.session.username
        });
    });

};