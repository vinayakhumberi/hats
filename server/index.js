var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
   res.sendfile('server/index.html');
});

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
  console.log('A user connected');
  socket.emit('getPrime', { start: 0, end: 100});
  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
});

http.listen(9000, function() {
   console.log('listening on *:9000');
});
