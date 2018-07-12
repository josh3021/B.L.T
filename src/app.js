const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const expressErrorHandler = require('express-error-handler');
const passport = require('passport');
const flash = require('connect-flash');
const engine = require('ejs-locals');

const app = express();
const config = require('./config');

const http = require('http');
const https = require('https');
const fs = require('fs');

let options = {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem')
}

const createServer = require('auto-sni');

/*var server = createServer({
    email: 'joseonghwan3021@gmail.com', // Emailed when certificates expire.
    agreeTos: true, // Required for letsencrypt.
    debug: true, // Add console messages and uses staging LetsEncrypt server. (Disable in production)
    domains: ["vrms.tech"], // List of accepted domain names. (You can use nested arrays to register bundles with LE).
    dir: "~/certbot/etc", // Directory for storing certificates. Defaults to "~/letsencrypt/etc" if not present.
    ports: {
        http: 80, // Optionally override the default http port.
        https: 443 // // Optionally override the default https port.
    }
}, app);*/

app.engine('ejs', engine);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
    secret: 'my key',
    resave: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const database = require('./database/database');
database.init(app);

const configPassport = require('./passport/passport');
const indexRouter = require('./routes/index');
const passportRouter = require('./routes/passport_router');
const profileRouter = require('./routes/profile');
const mainRouter = require('./routes/main');
const authRouter = require('./routes/auth');
const reportTestRouter = require('./routes/reportTest');
const pointRouter = require('./routes/point');
const staticsRouter = require('./routes/statics');
const alarmRouter = require('./routes/alarm');
const paymentRouter = require('./routes/payment');


configPassport(app, passport);
indexRouter(app);
passportRouter(app, passport);
profileRouter(app);
authRouter(app);
reportTestRouter(app);
pointRouter(app, fs);
staticsRouter(app);
mainRouter(app);
alarmRouter(app);
paymentRouter(app);


const errorHandler = expressErrorHandler({
    static: {
        '404': './src/public/html/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.createServer(app).listen(config.server_dev, () => {
    console.log('listening on dev port: ' + config.server_dev)
})

http.createServer(app).listen(config.server_http, function(){  
    console.log("Http server listening on port " + config.server_http);
});

https.createServer(options, app).listen(config.server_https, function(){  
    console.log("Https server listening on port " + config.server_https);
});

/*http.listen(config.server_http, () => {
    console.log('listening on %s port', config.server_port);
});*/

/*server.once("listening", () => {
	console.log("we are ready to go");
});*/
