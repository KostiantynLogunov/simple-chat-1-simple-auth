const User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;
const async = require('async');

exports.get = function (req, res) {
    res.render('login');
};

exports.post = function (req, res, next) {
    //дані які передав юзер
    var username = req.body.username;
    var password = req.body.password;
// 3 step, логіку перенесли в модель
    User.authorize(username, password, function (err, user) {
       if (err) {
           if (err instanceof AuthError){
               return next(new HttpError(403, err.message));
           } else {
               return next(err);
           }
       }

       req.session.user = user._id;
       res.send({});
    });
    //Далі для авторизації провіряємо чи є такий юзер
    //1. Отримати юзера з таким логін+пароль з БД
    //2. перевірям чи отримали ми такого юзера
    //      якщо ТАК-порівняти пароль визовом user.checkPassword
    //      якщо НІ - створити нового юзера
    //3. Авторизація успішна?
    //      якщо ТАК - зберегти _id юзера в сесію: session.user = user._id і відповісти 200
    //      кщо НІ - повернути помилку 403

// ==================================================================================================
// 2 step: це той самсий перший крок але виконаний через async.waterfall
    /*async.waterfall([
        function (cb) {
            User.findOne({username: username}, cb);
        },
        function (user, cb) {
            if (user) {
                if (user.checkPassword(password)) {
                    cb(null, user);
                } else {
                    next(403);
                }
            } else {
                var user = new User({
                    username: username,
                    password: password
                });
                user.save(function (err) {
                    if (err) return next(err);
                    //...200 OK  success auth
                    cb(null, user);
                })
            }
        }
    ], function (err, user) {
            if (err) return next(err);
            req.session.user = user._id;
            res.send({});
    });*/
// ==============================================================================================
//те саме без async но з callbacks
// 1 step
    /*User.findOne({username: username}, function (err, user) {
        if (err) return next(err);
        if (user) {
            if (user.checkPassword(password)) {
                // 200 ok
            } else {
                //... 403 forbiden
            }
        }
        //якщо юзер не знайдений теж можна дати 403 але в даному випадку ми його реєструємо як нового
        else {
            var user = new User({
                username: username,
                password: password
            });
            user.save(function (err) {
                if (err) return next(err);
                //...200 OK  success auth
            })
        }
    })*/
};