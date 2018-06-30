const SHA256 = require("crypto-js/sha256");
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

let vrmsCoin = new Blockchain();
vrmsCoin.addBlock(new Block(vrmsCoin.getLatestBlock().index+1, new Date().getTime(), "a", "b", "100"));
vrmsCoin.addBlock(new Block(vrmsCoin.getLatestBlock().index+1, new Date().getTime(), "b", "c", "90"));

console.log(vrmsCoin.getLatestBlock());


// console.log('Blockchain valid? ' + vrmsCoin.isChainValid());

//console.log('Changing a block...');
//vrmsCoin.chain[1].data = { amount: 100 };
// vrmsCoin.chain[1].hash = vrmsCoin.chain[1].calculateHash();

//console.log("Blockchain valid? " + vrmsCoin.isChainValid());

//console.log(JSON.stringify(vrmsCoin, null, 4));