const mongoose = require('./libs/mongoose');
// var User = require('./models/user').User;
var async = require("async");
// 1.drop db
// 2. create & save 3 users
// 3. close connection

//щоб запустити ці ф-ї одна за іншою використ. async.series яка визиває ф-ї одна за ін
async.series([
    open,
    dropDatabase,
    requireModels,
    createUsers,
    close
], function (err, results) {
    console.log(arguments);
    if (err) close();
});

function open(cb) {
    mongoose.connection.on('open', cb);
}

function dropDatabase(cb) {
    var db = mongoose.connection.db;
    db.dropDatabase(cb);
}

//щоб коректно прцювали індекси відпрацьовувала унікальність username
// коли всі індекси будуть створенні, визоветься cb i аж тоді потім передасться керування в наступну ф-ю createUsers
function requireModels(cb) {
    require('./models/user');
    async.each(Object.keys(mongoose.models), function (modelName, cb) {
        mongoose.models[modelName].ensureIndexes(cb)
    }, cb);
}

function createUsers(cb) {
    let users = [
        {username: "Vasia", password: '123456'},
        {username: "Petia", password: '123456'},
        {username: "admin", password: '123456'}
    ];
    async.each(users, function (userData, cb) {
        let user = new mongoose.models.User(userData);
        user.save(cb); //ot cb(err) or (null)
    }, cb);
    //ассинхроно паралельно
    /*async.parallel([
        function (cb) {
            var vasia = new User({username: "Vasia", password: '123456'});
            vasia.save(function (err) {
                cb(err, vasia);
            });
        },
        function (cb) {
            var petia= new User({username: "Petia", password: '123456'});
            petia.save(function (err) {
                cb(err, petia);
            });
        },
        function (cb) {
            var admin= new User({username: "admin", password: '123456'});
            admin.save(function (err) {
                cb(err, admin);
            });
        }
    ], cb);*/
}

function close(cb) {
    mongoose.disconnect(cb);
}



// ==================================================================================

// console.log(mongoose.connection.readyState); // перевіряємо чи ми підключенні
// mongoose.connection.on('open', function () {
//     var db = mongoose.connection.db;
//     db.dropDatabase(function (err) {
//         if (err) throw err;
//
//         //lets create 3 users &  ave thees 3 users
//         async.parallel([
//             function (cb) {
//                 var vasia = new User({username: "Vasia", password: '123456'});
//                 vasia.save(function (err) {
//                     cb(err, vasia);
//                 });
//             },
//             function (cb) {
//                 var petia= new User({username: "Petia", password: '123456'});
//                 petia.save(function (err) {
//                     cb(err, petia);
//                 });
//             },
//             function (cb) {
//                 var admin= new User({username: "admin", password: '123456'});
//                 admin.save(function (err) {
//                     cb(err, admin);
//                 });
//             }
//         ], function (err, result) {
//             console.log(arguments);
//             mongoose.disconnect();
//         });
//         console.log('OK');
//     });
// });


// =======================================================================
/*User.findOne({username: 'Tester'}, function (err, doc) {
    console.log(doc)
});*/
/*var user = new User({
    username: "Tester",
    password: '123456'
});
user.save(function (err, user, affected) {
    if (err) throw err;
    console.log(arguments)
});*/

// =======================================================================

/*const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chat', {useNewUrlParser: true});

var schema = mongoose.Schema({
   name: String
});
schema.methods.meow = function () {
    console.log(this.get('name'));
};

const Cat = mongoose.model('Cat', schema);

const kitty = new Cat({ name: 'ilonka13' });
kitty.save().then(() => kitty.meow());*/

// =======================================================================

// const MongoClient = require('mongodb').MongoClient;

// const assert = require('assert');
//
// // Connection URL
// const url = 'mongodb://localhost:27017';
//
// // Database Name
// const dbName = 'chat';
//
// // Use connect method to connect to the server
// MongoClient.connect(url, { useNewUrlParser: true },function(err, client) {
//     assert.equal(null, err);
//     console.log("Connected successfully to server");
//
//     const db = client.db(dbName);
//
//     const collection = db.collection('documents');
//     // Delete document where a is 3
//     collection.find({ a : 1 }).toArray(function (err, res) {
//         console.dir(res);
//         client.close();
//     });
//
//     /*removeDocument(db, function() {
//         client.close();
//     });*/
//     /*findDocuments(db, function() {
//         client.close();
//     });*/
//     /*insertDocuments(db, function() {
//         client.close();
//     });*/
// });
//
// const insertDocuments = function(db, callback) {
//     // Get the documents collection
//     const collection = db.collection('documents');
//     // Insert some documents
//     collection.insertMany([
//         {a : 1}, {a : 2}, {a : 3}
//     ], function(err, result) {
//         assert.equal(err, null);
//         assert.equal(3, result.result.n);
//         assert.equal(3, result.ops.length);
//         console.log("Inserted 3 documents into the collection");
//         callback(result);
//     });
// };
//
// const findDocuments = function(db, callback) {
//     // Get the documents collection
//     const collection = db.collection('documents');
//     // Find some documents
//     collection.find({}).toArray(function(err, docs) {
//         assert.equal(err, null);
//         console.log("Found the following records");
//         console.log(docs)
//         callback(docs);
//     });
// };
//
// const removeDocument = function(db, callback) {
//     // Get the documents collection
//     const collection = db.collection('documents');
//     // Delete document where a is 3
//     collection.deleteOne({ a : 2 }, function(err, result) {
//         assert.equal(err, null);
//         assert.equal(1, result.result.n);
//         console.log("Removed the document with the field a equal to 3");
//         callback(result);
//     });
// };
//
// const findDocument = function(db, callback) {
//     // Get the documents collection
//     const collection = db.collection('documents');
//     // Delete document where a is 3
//     collection.find({ a : 1 }, function(err, result) {
//         console.dir(result.result);
//         callback(result);
//     });
// };
