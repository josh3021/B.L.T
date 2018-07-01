const mongoose = require('mongoose');
const config = require('../config');

let database = {};

database.init = app => {
    console.log('database.init 호출됨');
    connectDB(app);
}

function connectDB(app){
    console.log('database.connect 호출됨');
    const databaseUrl = config.db_url;

    mongoose.connect(databaseUrl);
    mongoose.Promise = global.Promise;
    database = mongoose.connection;
    database.on('error', console.error.bind(console, 'mongoose connection error'));
    database.on('open', () => {
        console.log('database connected successfully');
        createSchema(app, config);
    });
    database.on('disconnected', connectDB);
}

function createSchema(app, config) {
    app.set('database', database);
    let schemaLen = config.db_schemas.length;
    for(let i=0; i<schemaLen; ++i){
        let curItem = config.db_schemas[i];

        let curSchema = require(curItem.file).createSchema(mongoose);
        let curModel = mongoose.model(curItem.collection, curSchema);

        console.log('curSchema: %s, curModel: %s', curItem.file, curItem.collection);

        database[curItem.schemaName] = curSchema;
        database[curItem.modelName] = curModel;
        console.log('curItem.schemaName: %s ', curItem.schemaName)
        console.log('curItem.modelName: %s ', curItem.modelName)
    }
    app.set('database', database);

    console.log('database 속성이 app 객체에 추가됨');
}

module.exports = database;