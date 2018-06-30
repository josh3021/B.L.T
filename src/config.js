module.exports = {
    server_port: 8080,
    db_url: 'mongodb://localhost:27017/users',
    db_schemas: [
        {
            file: './user_schema',
            collection: 'user',
            schemaName: 'UserSchema',
            modelName: 'UserModel'
        },
        {
            file: './report_schema',
            collection: 'reports',
            schemaName: 'ReportSchema',
            modelName: 'ReportModel'
        }
    ],
    route_info: [
    ]
};
