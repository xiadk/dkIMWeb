var ws = new WebSocket("ws://localhost:8001");
var CONNECTING = 0;//正在连接
var OPEN = 1;//表示连接成功，可以通信了
var CLOSING = 2;//表示连接正在关闭
var CLOSED = 3;//表示连接已经关闭，或者打开连接失败

/*type类型*/
var TYPE_TEXT = 0;//文本消息请求
var TYPE_PHOTO = 1;//图片消息请求
var TYPE_ADD_FRIEND = 2;//添加好友请求

/*ope类型*/
var OPE_PERSONAL = 0;//个人消息
var OPE_GROUP = 1;//群消息

function wsSend(message) {
    switch (ws.readyState) {
  case CONNECTING:
    // do something
    break;
  case OPEN:
    ws.send(JSON.stringify(message));
    break;
  case CLOSING:
    // do something
    break;
  case CLOSED:
    // do something
    break;
  default:
    // this never happens
    break;
}
}
Socket.onopen = function (event) {
    //发送注册信息
}
Socket.onclose = function (event) {
    console.log('close'+event.code);
}

Socket.onmessage = function (event) {
    console.log(event.data.valueOf())
}
/*function c() {
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
}*/

//消息格式
function form(token, ope, fid, type, body) {
    this.token = token;
    this.ope = ope;
    this.fid = fid;
    this.type = type;
    this.body = body;
}
