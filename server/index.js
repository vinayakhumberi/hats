var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('lodash');

app.get('/', function(req, res) {
   res.sendfile('server/index.html');
});
let clients = [];
let requestedTable = {};
//Whenever someone connects this gets executed
io.on('connection', function(socket) {
  console.log('A user connected');
  socket.join("room-1");
  clients.push(socket.id);

  console.log('List of Connected Users :', clients);

  socket.on('computedResult',function(data) {
    io.sockets.connected[data.requester].emit('result', data.result);
  });
  socket.on('computePrime', function(packet) {
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
    const mappedTable = _.keyBy(table, function(o) {
      return o.id;
    });
    requestedTable[packet.id] = {};
    requestedTable[packet.id].result=[];
    requestedTable[packet.id] = {
      requester: packet.id,
      table: mappedTable,
    }
    console.log('Request Table', requestedTable[packet.id]);
    io.sockets.in("room-1").emit('findPrime', requestedTable[packet.id]);
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
