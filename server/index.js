var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
   res.sendfile('server/index.html');
});
let clients = [];
let requestedUser = '';
//Whenever someone connects this gets executed
io.on('connection', function(socket) {
  console.log('A user connected');
  clients.push(socket.id);
  console.log('List of Connected Users :', clients);
  // setTimeout(function(){
  //   console.log(clients);
  //   if(clients.length > 1 && io.sockets.connected[clients[0]]) {
  //     io.sockets.connected[clients[0]].emit("greeting", "Howdy, User 1!");
  //   }
  //   if(clients.length > 1 && io.sockets.connected[clients[1]]) {
  //     io.sockets.connected[clients[1]].emit("greeting", "Howdy, User 2!");
  //   }
  // }, 5000);

  socket.on('computePrime', function(packet) {
    // console.log(packet);
    const range = packet.data.end - packet.data.start;
    const mod = range % clients.length;
    const manageableRange = range - mod;
    const microRangeSpan = manageableRange / clients.length;
    let start = packet.data.start;
    const table = clients.map((client) => {
      const crudeData = {};
      crudeData.id = client;
      const end = start + microRangeSpan;
      crudeData.range= {
          'start': start,
          'end': end,
        };
        start = end;
      return crudeData;
    });
    const requestTable = {
      requester: packet.id,
      table: table,
    }
    console.log('Request Table', requestTable.table);
  });

  socket.on('disconnect', function () {
    console.log('A user disconnected', socket.id);
    const index = clients.indexOf(socket.id);
    clients.splice(index, 1);
    if(index > -1)
    console.log('New List of Connected Users :', clients);
  });
});

http.listen(9000, function() {
   console.log('listening on *:9000');
});
