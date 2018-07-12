module.exports = app => {
    app.post('/card_setting', (req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        let nfc_card = req.body.card;

        const database = req.app.get('database');

        database.UserModel.findOne({
            username: username
        }, (err, user) => {
            if (err) throw err;

            if (!user) return res.json({
                message: '001'
            });

            let authenticated = user.authenticated(password, user._doc.salt, user._doc.hashed_password);

            if (!authenticated)
                return res.json({
                    message: '002'
                });

            user.card = nfc_card;

            user.save(err => {
                if (err) throw err;
            });
            res.json({
                message: '000'
            });
        });
    });

    app.post('payment', (req, res) => {
        let nfc_card = req.body.card;
        let product = req.body.product;

        const database = req.app.get('database');

        database.UserModel.findOne({
            card: nfc_card
        }, (err, user) => {
            if (err) throw err;

            let balance = user.card - product;
            if (balance < 0)
                return res.json({
                    message: '잔액 부족'
                });

            res.json({
                message: balance
            });
        })
    });
}