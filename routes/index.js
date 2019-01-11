var checkAuth = require('../middleware/checkAuth');

module.exports = function (app) {
    app.get('/', require('./frontpage').get);
    app.get('/login', require('./login').get);
    app.post('/login', require('./login').post);
    app.post('/logout', require('./logout').post);

    app.get('/chat', checkAuth, require('./chat').get);

};


// ================================================================================
// var User = require('../models/user').User;
// var HttpError = require('../error');
// var ObjectID = require('mongodb').ObjectID;
//
// module.exports = function(app) {
//
//     app.get('/', function (req, res, next) {
//         res.render('index');
//     });
//
//     app.get('/users', function (req, res, next) {
//         User.find({}, function (err,users) {
//             if (err) return next(err);
//             res.json(users);
//         })
//     });
//
//     app.get('/user/:id', function (req, res, next) {
//         try {
//             var id = new ObjectID(req.params.id);
//         } catch (e) {
//             next(404);
//             return;
//         }
//         User.findById(id, function(err, user) { // ObjectID
//             if (err || !user || user == undefined) return next(404);
//             res.json(user);
//         });
//     });
// };


// ================================================================================
/*
var express = require('express');
var router = express.Router();

/!* GET home page. *!/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
*/
