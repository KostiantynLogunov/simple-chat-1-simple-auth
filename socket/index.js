var log = require('../libs/log')(module);


module.exports = function (server) {

    var io = require('socket.io')(server);

    io.set('origins', 'localhost:*');
    io.set('logger', log);

    io.on('connection', function (socket) {
        console.log('a user connected');
        socket.on('disconnect', function () {
            console.log('user disconnected');
        });


        // console.log(socket.handshake); //зберігається заголовки з кукою !!!!!!!!!!!!!!!!!!!!!!!


        socket.on('chat message', function (msg, cb) {
            console.log('message: ' + msg);
            socket.broadcast.emit('chat message', msg);
            cb("123");
        });
    });
};