const SHA256 = require('crypto-js/sha256');

module.exports = app => {
    app.get('/getpoint', (req, res) => {
        res.render('getpoint.ejs');
    });

    app.post('/getpoint', (req, res) => {
        let receiver = req.body.receiver;

        let victim = req.session.username;
        const database = req.app.get('database');
        database.UserModel.findOne({
            'username': receiver
        }, (err, user) => {
            if (err) throw err;

            let vrmsCoin = new Blockchain();
            
            if(!vrmsCoin.isChainValid())
                return res.redirect('/profile');

            vrmsCoin.addBlock(new Block(vrmsCoin.getLatestBlock().index+1, new Date().getTime(), victim, user.username, "100"));

            user.point += 100;
            user.save((err) => {
                if(err)
                    console.log('unexpected error occured');

                console.log('block saved!: '+JSON.stringify(vrmsCoin, null, 4));
            })
            
        });
    });
}

class Block {
    constructor(index, timestamp, victim, receiver, point, previousHash = '') {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.victim = victim;
        this.receiver = receiver;
        this.point = point;

        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.timestamp + this.victim + this.receiver + this.previousHash + this.point).toString();
    }
}


class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, new Date().getTime(), "0", "0", "0", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
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