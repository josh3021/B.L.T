const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const expressErrorHandler = require('express-error-handler');
const ejs = require('ejs');
const passport = require('passport');
const flash = require('flash');
const engine = require('ejs-locals');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/uploads/'); // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req, file, cb) {
        var date = new Date();
        cb(null, req.session.username+path.extname(file.originalname)); // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
});
var upload = multer({ storage: storage });

const app = express();
const router = express.Router();
const config = require('./config');

const http = require('http').Server(app);

const os = require('os');

app.engine('ejs', engine);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'react')));
app.use(expressSession({
    secret: 'my key',
    resave: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static('dist'));

const database = require('./database/database');
database.init(app);

const configPassport = require('./passport/passport');
const indexRouter = require('./routes/index');
const passportRouter = require('./routes/passport_router');
const profileRouter = require('./routes/profile');
const mainRouter = require('./routes/main');
const networkRouter = require('./routes/network');
const reportTestRouter = require('./routes/reportTest');


configPassport(app, passport);
indexRouter(app);
passportRouter(app, passport);
profileRouter(app, upload);
networkRouter(app);
reportTestRouter(app);

mainRouter(app);


const errorHandler = expressErrorHandler({
    static: {
        '404': './src/public/html/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.listen(config.server_port, () => {
    console.log('listening on %s port', config.server_port);
});