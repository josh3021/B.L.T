module.exports = (app, fs) => {
    app.get('/getpoint', (req, res) => {
        res.render('getpoint.ejs');
    });

    app.post('/getpoint', (req, res) => {
        let receiver = req.body.receiver;

        let victim = req.session.username;
        console.log('receiver: ' + receiver + ', victim: ' + victim);
        const database = req.app.get('database');
        database.UserModel.findOne({
            'username': receiver
        }, (err, user) => {
            if (err) throw err;

            let vrmsCoin = new Blockchain();

            if (receiver === victim)
                return res.redirect('/profile');

            if (!vrmsCoin.isChainValid())
                return res.redirect('/profile');

            vrmsCoin.addBlock(new Block(vrmsCoin.getLatestBlock().index + 1, new Date().getTime(), victim, user.username, "100"));

            user.point += 100;
            user.save((err) => {
                if (err)
                    console.log('unexpected error occured');

                console.log('block saved!: ' + JSON.stringify(vrmsCoin, null, 4));
            })
            res.redirect('/profile');
        });
    });

    app.post('/walkpoint', (req, res) => {
        let username = req.body.username;
        let password = req.body.password;

        const database = req.app.get('database');
        database.UserModel.findOne({
            'username': username
        }, (err, user) => {
            if (err) throw err;

            if (!user) {
                return res.send('user undefined');
            }

            let authenticated = user.authenticated(password, user._doc.salt, user._doc.hashed_password);
            if (!authenticated) {
                return res.json({
                    error: 'auth fail'
                });
            }

            user.point += 5;
            user.save(err => {
                if (err) throw err;
            });

            res.json({
                message: point
            });
        });


    });


}