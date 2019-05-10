var canvas = document.getElementById('myCanvas');
var canvasContext = canvas.getContext("2d");
var x = 20;
var y = 285;
var w = 40;
var h = 40;
var step = 3;
var accountId = 10006;

var myAudio = document.createElement("audio");
myAudio.src = './audio/smb_kick.ogg';
document.body.appendChild(myAudio);

var img = new Image();
img.src = './Animations/SmallMario/Standing/000.png';

document.onkeypress = function (e) {
    var oldX = x;
    var oldY = y;
    switch (e.code) {
        case 'KeyA':
            img.src = './Animations/SmallMario/Walking/000.png';
            x = x - step;
            break;
        case 'KeyD':
            img.src = './Animations/SmallMario/Walking/000.png';
            myAudio.play();
            x = x + step;
            break;
        case 'Space':
            img.src = './Animations/SmallMario/Jumping/000.png';
            y = y - 5*step;
            break;
    }
    var data = {
        'accountId': accountId,
        'x': x,
        'y': y,
        'w': w,
        'h': h,
        'imgUrl': img.src
    };
    socket.emit('clientMessage', data);
}

var socket = io.connect('http://10.22.185.116:8088', {'transports': ['websocket']});

socket.on('connect', function () {
    var data = {
        'accountId': accountId,
        'x': x,
        'y': y,
        'w': w,
        'h': h,
        'imgUrl': img.src
    };
    mapTank.set(data.accountId, data);
    socket.emit('clientMessage', data);
});

socket.on('disconnect', function () {
    console.log('Disconnected!');
});

var mapTank = new Map();

socket.on('serverResponse', function (data) {
    data = JSON.parse(data);
    for (var i = 0; i < data.length; i++) {
        if (mapTank.has(data[i].accountId)) {
            var oldTank = mapTank.get(data[i].accountId);
            canvasContext.clearRect(oldTank.x, oldTank.y, oldTank.w, oldTank.h);
            var img = new Image();
            img.src = data[i].imgUrl;
            canvasContext.drawImage(img, data[i].x, data[i].y, data[i].w, data[i].h);
        } else {
            var img = new Image();
            img.src = data[i].imgUrl;
            canvasContext.drawImage(img, data[i].x, data[i].y, data[i].w, data[i].h);
        }

        // update cho màn hình cũ.
        if(data[i].accountId == accountId){
            x = data[i].x;
            y = data[i].y;
            img.src = data[i].imgUrl;
            w = data[i].w;
            h = data[i].h;
        }
        mapTank.set(data[i].accountId, data[i]);
    }
});


