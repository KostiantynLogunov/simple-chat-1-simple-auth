var mongoose = require('mongoose');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);

var mongoose_store = new MongoStore({mongooseConnection: mongoose.connection});

module.exports = mongoose_store;