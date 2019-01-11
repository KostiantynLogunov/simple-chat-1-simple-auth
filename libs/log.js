var winston = require('winston');
var ENV = 'development';
// var ENV = process.env.NODE_ENV;

function getLogger(module) {
    //бере два останій імені з шляху до файла
    var path = module.filename.split('/').splice(-2).join('/');

    // return new winston.Logger({
    return winston.createLogger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: (ENV == 'development') ? 'debug' : 'error',
                label: path
            })
        ]
    });
}

module.exports = getLogger;