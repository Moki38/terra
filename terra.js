// init prerequisites
var Driver = require('i2c-sensor-am2315');
var sensor = new Driver;
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var shell = require("shelljs");
var rrd = require('rrd');
RRD = require('rrd').RRD

var hum_file = '/root/terra/rrd/humidity.rrd';
var temp_file = '/root/terra/rrd/temperature.rrd';

hum_rrd = new RRD('/root/terra/rrd/humidity.rrd')
temp_rrd = new RRD('/root/terra/rrd/temperature.rrd')

//
// Setup terradata struct, for storing terradata
//
var terradata = {};
terradata.humidity = 0;
terradata.temperature = 0;

//
// Setup HTTP server
//
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendfile('index.html')
})

app.get('/graph.html', function(req, res) {
    res.sendfile('graph.html')
})

//
// Socket.io to HTML5 webclient
//
io.on('connection', function (socket) {
    io.emit('connect');
});

//
// when the user disconnects.. perform this
//
io.on('disconnect', function () {
});


var update_terradata = function(terradata) {
// read the sensor
     sensor.read(function(err, data) {
	if (err) {
		console.error(err);
	} else {
                terradata.humidity = data.humidity;
                terradata.temperature = sensor.convertKelvinToCelsius(data).temperature;
            hum_rrd.update (new Date, [terradata.humidity], function(err) {
                if (err) console.log("Error:", err);
            });
            temp_rrd.update (new Date, [terradata.temperature], function(err) {
                if (err) console.log("Error:", err);
            });
	}

     })
};

var update_rrd = function(terradata) {
    var command;
    var child;
    command = '/root/terra/rrd/update_rrd.sh humidity '+terradata.humidity;
    child = shell.exec(command, {async:true, silent:true});
    command = '/root/terra/rrd/update_rrd.sh temperature '+terradata.temperature;
    child = shell.exec(command, {async:true, silent:true});
}

var rrdinterval = setInterval(function () {
    var rrdchild = shell.exec('/root/terra/rrd/graph_rrd.sh', {async:true, silent:true});
  }, 60000);

//
// Send rovdata to HTML5 client, every 1s
//
var interval = setInterval(function () {
//    update_rrd(terradata);
    update_terradata(terradata);
    io.emit("terradata", terradata);
}, 5000);

server.listen(80, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Terra started, listening at http://%s:%s", host, port);
})

