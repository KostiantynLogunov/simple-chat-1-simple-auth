var express = require('express');
var config = require('./config');
var log = require('./libs/log')(module);
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var engine = require('ejs-mate');
var HttpError = require('./error').HttpError;
var errorhandler = require('errorhandler');
var session = require('express-session');


var app = express();
// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var sessionStore = require('./libs/sessionStore');
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));/// parse body
app.use(cookieParser());// parse cookie. req.cookies
app.use(session({
    secret: config.get('session:secret'),
    key: config.get('session:key'),
    cookie: config.get('session:cookie'),
    saveUninitialized: false,
    resave: false,
    store: sessionStore
    // store: mongoose_store
}));// коли юзер заходить вперше то йому ставиться кука connect.sid, її значання випадково генерує букви цифри a65sd6565f6sdf.sha256
app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));
/*app.use(function (req, res, next) {
    req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
    // res.status(status).send(body);
    res.send("Visits: " + req.session.numberOfVisits);
});*/
// app.use(bodyParser.urlencoded());
// app.use(bodyParser.json());
// app.use(app.router);  //'app.router' is deprecated!

//midlleware для обробки помилки який містить метод  sendHttpError
app.use(require('./middleware/sendHttpError'));
require('./routes')(app);

app.use(express.static(path.join(__dirname, 'public')));


app.use(function(err, req, res, next) {
    if (typeof err == 'number') { // next(404);
        if (req.xhr) {
            res.json(err);
        } else {
            res.render("error", {error: err});
        }
    }

    if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        if (app.get('env') == 'development') {
            errorhandler()(err, req, res, next);﻿
        } else {
            log.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
});




//Middleware
/*app.use(function (req, res, next) {
    if (req.url == '/') {
        res.end("Hello");
    } else {
        next();
    }
});
app.use(function (req, res, next) {
    if (req.url == '/error') {
        // res.send(401);
        next(new Error("wops, denided"));
    } else {
        next();
    }
});

app.use(function (req, res) {
    res.status(404).send("not found");
});

app.use(function (err, req, res, next) { //length
    //NODE_ENV = 'production'
    if( app.get('env') == 'development'){
    var errorhandler = errorHandler();
    errorhandler(err, req, res, next);
    }else{
        res.status(err.status || 500);
        res.render('error');
    }
});*/
// ==============================================================

/*
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/
// ==========================================================================

var server = app.listen(config.get('port'), function () {
    // log.info("Server started on port: ", app.get('port'));
    console.log("Server started on port: ", config.get('port'));
});
/*app.listen(app.get('port'), function () {
    log.info("Server started on port: ", app.get('port'));
    // console.log("Server started on port: ", config.get('port'));
});*/
// module.exports = app;
require('./socket')(server);