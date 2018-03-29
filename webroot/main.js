var Socket = new WebSocket("ws://localhost:8001");
Socket.onopen = function (event) {
    //发送注册信息
}
Socket.onclose = function (event) {
    console.log('close'+event.code);
}

Socket.onmessage = function (event) {
    console.log(event.data.valueOf())
}
function c() {
    var commit = $("#commit").val();
    if (Socket.readyState == 1) {
        var message = new form(1, 0, 2, 1, commit);
        Socket.send(JSON.stringify(message));
    }

    Socket.onmessage = function (event) {
        console.log('send后面的'+event.data.valueOf())
        $("#commit2").val(event.data.valueOf());
    }
}

function e() {
    Socket.close();
}

function d() {
    var commit = $("#commit2").val();
    var Socket = new WebSocket("ws://localhost:8001");
    Socket.onopen = function () {
        if (Socket.readyState == 1) {
            var message = new form(1, 0, 2, 1, commit);
            Socket.send(JSON.stringify(message));
        }
    }
    Socket.close();
    Socket.onmessage = function (event) {
        $("#commit2").val(event.data.valueOf());
    }
}

function form(uid, ope, fid, type, body) {
    this.token = uid;
    this.ope = ope;
    this.fid = fid;
    this.type = type;
    this.body = body;
}
