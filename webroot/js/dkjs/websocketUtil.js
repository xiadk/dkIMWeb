var CONNECTING = 0;//正在连接
var OPEN = 1;//表示连接成功，可以通信了
var CLOSING = 2;//表示连接正在关闭
var CLOSED = 3;//表示连接已经关闭，或者打开连接失败

/*type类型*/
var TYPE_TEXT = 0;//文本消息请求
var TYPE_PHOTO = 1;//图片消息请求
var TYPE_ADD_FRIEND = 2;//添加好友请求
var TYPE_GROUP_HINT = 3;//群消息提示

/*ope类型*/
var OPE_PERSONAL = 0;//个人消息
var OPE_GROUP = 1;//群消息


var text_messages = new Array();

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

function wsocket(ws) {
    ws.onopen = function (event) {
        var message = new form(readCookie("token"));
        wsSend(message);
    }
    ws.onclose = function (event) {
        console.log('close' + event.code);
    }

    ws.onmessage = function (event) {
        console.log(event.data.valueOf());
        var res = jQuery.parseJSON(event.data.valueOf());
        if (res.msgId == AUTH_ERROR) {
            window.location.href = "login.html";
        } else if (res.msgId != "0200") {
            hint(res.message);
        } else {
            var body = res.body;
            for (var i = 0, j = body.length; i < j; i++) {
                var message = body[i];
                var type = message.type;
                switch (type) {
                    case 1:
                    //普通文本消息
                    case 0:
                        var fid = $("#team-setting").attr("data-id");
                        var id = "#new_friend_hint" + message.uid;
                        var content = message.body;
                        if (type == TYPE_PHOTO) {
                            $(id).find(".last-msg").html(getContactImg(content));
                        } else {
                            if (message.body.length > 7) {
                                content = message.body.substr(0, 7) + "......";
                            }
                            $(id).find(".last-msg").text(content);
                        }
                        if (fid == message.uid) {
                            //正在聊天中
                            var contentHtml = chat_content_append(message.body, 2, message.photo);
                            if (type == TYPE_PHOTO) {
                                contentHtml = chat_content_append(messag.body, 2, message.photo, 1);
                            }
                            $("#chat-content").append(contentHtml);

                            //信息更新为已读状态
                            var data = {mid: message.mid};
                            sendAjax("post", "/messages/read", data, function (msg) {
                            });
                        } else {
                            //未聊天
                            var new_friend_hint_span = $(id).find("span");
                            var messages_length = parseInt(new_friend_hint_span.text()) + 1;
                            new_friend_hint_span.text(messages_length);
                            new_friend_hint_span.removeClass("hide");
                        }

                        break;
                    case 2:
                        // 个人加好友请求
                        if (message.ope == OPE_PERSONAL) {
                            var new_friend_hint_span = $("#new_friend_hint").find("span");
                            var messages_length = parseInt(new_friend_hint_span.text()) + 1;
                            new_friend_hint_span.text(messages_length);
                            new_friend_hint_span.removeClass("hide");
                            add_messages[messages_length - 1] = message;
                        }
                        break;
                    case 3:
                        var fid = $("#team-setting").attr("data-id");
                        var id = "#new_friend_hint" + message.uid;
                        var content = message.body;
                        if (fid == message.uid) {
                            //正在聊天中
                            $("#chat-content").append(chatHint(content));

                            //信息更新为已读状态
                            var data = {mid: message.mid};
                            sendAjax("post", "/messages/read", data, function (msg) {
                            });
                        } else {
                            //未聊天
                            var new_friend_hint_span = $(id).find("span");
                            var messages_length = parseInt(new_friend_hint_span.text()) + 1;
                            new_friend_hint_span.text(messages_length);
                            new_friend_hint_span.removeClass("hide");
                        }
                        break;
                    default:
                        // this never happens
                        break;
                }
            }
        }
    }
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
