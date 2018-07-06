module.exports = (app) => {
    
    app.get('/profile', (req, res) => {
        if(!req.session.username)
            return res.redirect('/');
        let database = req.app.get('database');
	    database.UserModel.findOne({
	        'username': req.session.username
	    }, (err, user) => {
		    if(err)
			    throw err;
		
		    console.log('user: '+user);
			
            res.render('profile.ejs', {username:user.username, danger: user.danger, point: user.point, email: user.email, device: user.device});
	    });
    });

    app.post('/profile/updatePassword', (req, res) => {
        if(!req.session.username)
            return res.redirect('/');
        const database = req.app.get('database');

        let newPassword = req.body.newPassword;
        let confirmPassword = req.body.confirmPassword;

        console.log('new: '+newPassword+', confirm: '+confirmPassword);
        let userInfo = req.user;
        database.UserModel.findOne({
            'username': userInfo.username
        }, (err, user) => {
            if(err)
                return console.error(err);
            
            else if(newPassword !== confirmPassword) {
                return console.log('비밀번호가 일치하지 않습니다.');
            }

            else {
                let encrypt = user.encryptPassword(newPassword, user._doc.salt);
                user.hashed_password = encrypt;
                user.save(err => {
                    if(err) throw err;
                    console.log('updated successfully');
                });
            }
            return res.redirect('/');
        });
    });
    app.get('/profile/safe', (req, res) => {
        let database = req.app.get('database');
        database.UserModel.findOne({
            'username': req.session.username
        }, (err, user) => {
            if(err) throw err;
            if(user.username !== req.session.username)
                res.redirect('/')
            user.danger = false;
            user.save(err => {
                if(err) throw err;
                console.log('안전합니다!');
            });
        res.redirect('/profile');
    });
    });
}


