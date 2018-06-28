const crypto = require('crypto');

var Schema = {};

Schema.createSchema = mongoose => {
    var UserSchema = mongoose.Schema({
        username: {
            type: String,
            required: true,
            unique: true,
            'default': ''
        },
        hashed_password: {
            type: String,
            required: true,
            unique: true, 
            'default': ''
        },
        salt: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            'default': ''
        },
        admin: {
            type: Boolean,
            required: true,
            'default': false
        },
        device: {
            type: String,
            'default': ''
        },
        danger: {
            type: Boolean,
            required: true,
            'default': false
        },
        created_at: {
            type: Date,
            unique: false,
            'default': Date.now
        },
        updated_at: {
            type: Date,
            unique: false,
            'default': Date.now
        }
    });

    UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
        console.log('virtual password 호출됨 : ' + this.hashed_password);
    })
    .get(() => {
        return this._password;
    });

    UserSchema.method('encryptPassword', function(plainText, inSalt) {
        if (inSalt) {
            return crypto.createHmac('sha256', inSalt).update(plainText).digest('hex');
        } else {
            return crypto.createHmac('sha256', this.salt).update(plainText).digest('hex');
        }
    });

    UserSchema.method('makeSalt', function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    });

    UserSchema.method('authenticated', function(plainText, inSalt, hashed_password) {
        if (inSalt) {
            console.log('authenticating...: plainText: [%s], inSalt: [%s] --> hashed_password: [%s]', plainText, inSalt, hashed_password);
            return this.encryptPassword(plainText, inSalt) == hashed_password;
        }
        else {
            console.log('authenticating...: plainText: [%s] --> hashed_password: [%s]', plainText, hashed_password);
            return this.encryptPassword(plainText) == hashed_password;
        }
    });

    UserSchema.path('username').validate(username => {
        return username.length;
    }, 'Data of [username] coloumn is NULL');

    UserSchema.path('email').validate(email => {
        return email.length;
    }, 'Data of [email] column is NULL');

    UserSchema.static('findByUsername', (username ,callback) => {
        return this.find({
            'username': username
        }, callback);
    });

    UserSchema.static('findByEmail', (email ,callback) => {
        return this.find({
            'email': email
        }, callback);
    });

    UserSchema.static('findByDevice', (device ,callback) => {
        return this.find({
            'device': device
        }, callback);
    });


    console.log('UserSchema 정의함');

    return UserSchema;
}

module.exports = Schema;