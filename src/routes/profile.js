module.exports = (app) => {
    
    app.get('/profile', (req, res) => {
        if(!req.session.username)
            return res.redirect('/login');
        let database = req.app.get('database');
	    let danger = false;
	    database.UserModel.findOne({
		    'username': req.session.username
	    }, (err, user) => {
		    if(err)
			    throw err;
		
		    console.log('user: '+user);
		    if(user.danger === true) 
			    danger = true;
			
	    });
        let username = req.session.username;
        res.render('profile.ejs', {username:username, danger: danger});
    });

    app.post('/profile/addDevice', (req, res) => {
        let deviceNum = req.body.deviceNum;

        process.nextTick(() => {
            const database = req.app.get('database');

            console.log(req.session.username);

            database.UserModel.findOne({
                'username': req.session.username
            }, (err, user) => {
                if(err) 
                    return console.log(err);
    
                else {
                    user.device = deviceNum;
                }

                user.save(function(err){
                    if(err) res.status(500).json({error: 'failed to update'});
                    console.log('updated successfully')
                });
        
            });
            res.redirect('/profile');
        });
    });

    app.post('/profile/updatePassword', (req, res) => {
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
}
