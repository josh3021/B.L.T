const SHA256 = require('crypto-js/sha256');
const crypto = require('crypto');
const ursa = require('ursa');

module.exports = (app, fs) => {
    app.get('/getpoint', (req, res) => {
        res.render('getpoint.ejs');
    });

    app.post('/getpoint', (req, res) => {
        let receiver = req.body.receiver;

        let victim = req.session.username;
	    console.log('receiver: '+receiver+', victim: '+victim);
        const database = req.app.get('database');
        database.UserModel.findOne({
            'username': receiver
        }, (err, user) => {
            if (err) throw err;

            let vrmsCoin = new Blockchain();
            
	        if(receiver === victim)
		        return res.redirect('/profile');

            if(!vrmsCoin.isChainValid())
                return res.redirect('/profile');

            vrmsCoin.addBlock(new Block(vrmsCoin.getLatestBlock().index+1, new Date().getTime(), victim, user.username, "100"));

            user.point += 100;
            user.save((err) => {
                if(err)
                    console.log('unexpected error occured');

                console.log('block saved!: '+JSON.stringify(vrmsCoin, null, 4));
            })
            res.redirect('/profile');           
        });
    });

    app.get('/walkpoint', (req, res) => {
        let username = req.query.username;
        let password = req.query.password;

        const database = req.app.get('database');
        database.UserModel.findOne({
            'username': username
        }, (err, user) => {
            if (err) throw err;

            if(!user){
                return res.send('user undefined');
            }

            let authenticated = user.authenticated(password, user._doc.salt, user._doc.hashed_password);
            if(!authenticated) {
                return res.json({error: 'auth fail'});
            }

            let vrmsCoin = new Blockchain();

            if(!vrmsCoin.isChainValid()){
                return res.send('error: chain not valid');
            }

            randomString().then(resolvedData => {
                //return res.send('nonce:' +resolvedData);
                return res.redirect('/mine?resolvedData='+resolvedData);
            }) 

            //vrmsCoin.addBlock(new Block(vrmsCoin.getLatestBlock().index+1, new Date().getTime(), 'server', user.username, "100"));
            //console.log('vrmsCoin: '+JSON.stringify(vrmsCoin));
            //return res.send('success: '+JSON.stringify(vrmsCoin));
        });


    });

    app.get('/sync', (req, res) => {
        var username = req.query.username;
        var device = req.query.device;
        var location_x = req.query.x;
        var location_y = req.query.y;
        //var token = req.query.token;
        //console.log('token: '+token);
        //var key;
        //key = ursa.createPrivateKey(fs.readFileSync('./cert/key.pem'));

        //console.log('key: '+key);

        //token = key.decrypt(token, 'base64', 'utf8');

        //console.log('token: '+token);

        const database = req.app.get('database');
        database.UserModel.findOne({
            username: username
        }, (err, user) => {
            if (err) throw err;


            var chainFile = JSON.stringify(fs.readFileSync('./src/public/secureChain.json', 'utf8'));
            console.log('chainFile: '+chainFile);
            if(!chainFile) {
                var secureChain = new Blockchain();

                writeNewBlock(chainFile, secureChain);
            }

            res.send('success');
            
        })
    })

    app.get('/encrypt', (req, res) => {
        var crt = ursa.createPublicKey(fs.readFileSync('./rsa/my-server.pub'));
        var plainText = 'juwon choi';

        console.log('Encrypt with Public');
        var msg = crt.encrypt(plainText, 'utf8', 'base64', ursa.RSA_PKCS1_PADDING);
        console.log('encrypted: ', msg, '\n');

        res.redirect('/decrypt?response='+msg);
    });

    app.get('/decrypt', (req, res) => {
        var encmsg = req.query.response;
        var key = ursa.createPrivateKey(fs.readFileSync('./rsa/my-server.key.pem'));

        console.log('Decrypt with Private');
        var msg = key.decrypt(encmsg, 'base64', 'utf8', ursa.RSA_NO_PADDING);
        res.send('decrypted: '+msg.toString());
    });


}

function writeNewBlock(chainFile, secureChain) {
    if(!secureChain.isChainValid())
        return res.json({message: 'something wrong in secureChain!'});

            //var authenticated = user.authenticated(password, user._doc.salt, user._doc.hashed_password); 
    if(!user.username === username || !user.device === device) {
        return res.json({error: 'unvalid'})
    }
            //if(!user.username === token.username || !authenticated || !user.device === token.device) {
            //    return res.json({error: 'unvalid'})
            //}
            
    secureChain.addBlock(new Block(secureChain.getLatestBlock().index+1, new Date().getTime(), location_x, location_y));
    fs.open()
    console.log('secureChain: '+secureChain);
    res.json({secureChain: secureChain});
}



function randomString() {
    return new Promise((resolve, reject) => {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = 15;
        var randomstring = '';
        for (var i=0; i<string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
        }
        resolve(randomstring);
    })
}

class Block {
    constructor(index, timestamp, location_x, location_y, previousHash = '') {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.location_x = location_x;
        this.location_y = location_y;
        this.nonce = 0;

        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + this.location_x + this.location_y + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("BLOCK MINED: " + this.hash);
    }
}


class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock() {
        return new Block(0, new Date().getTime(), null, "0", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}
