var socket = io.connect();

$(window).resize(function(){location.reload();});

var terra_canvas = document.getElementById('TerraCanvas');
var terra_context = terra_canvas.getContext('2d');

terra_canvas.width = window.innerWidth;
terra_canvas.height = window.innerHeight;

var constatus = "Not connected";
var connected = false;

var d = new Date();
var timeout_now = d.getTime();

var terradata = {};
var hum = 0;
var temp = 0;

function update(terradata) {
    hum = terradata.humidity;
    temp = terradata.temperature;
}

function display(terradata) {
    var today=new Date();
    terra_context.clearRect(0, 0, terra_canvas.width, terra_canvas.height);
    terra_context.font = '14pt Verdana';
    terra_context.lineWidth = 1;
    terra_context.fillStyle = "#aaaa55";
    terra_context.fillText( today.toLocaleDateString()+" "+today.toLocaleTimeString(), 10, 20);

    terra_context.beginPath();
    terra_context.fillStyle = "#aaaa55";
    terra_context.fillText( "Temperature", (terra_canvas.width/4)*2, 20);
    terra_context.fillText( ": "+temp+"°C", (terra_canvas.width/4)*2+120, 20);
    
    terra_context.fillText( "Humidity", (terra_canvas.width/4)*3, 20);
    terra_context.fillText( ": "+hum+"%", (terra_canvas.width/4)*3+90, 20);
    terra_context.fill();
}

function mainloop() {
  display(terradata);
}

function init() {
  setInterval(mainloop, 20);
}

socket.on("connect", function () {
  constatus = 'Connected';
});

socket.on("disconnect", function () {
  constatus = 'Disonnected';
});

socket.on("terradata", function(terradata) {
  update(terradata);
})

init();

