var CONNECTING = 0;//正在连接
var OPEN = 1;//表示连接成功，可以通信了
var CLOSING = 2;//表示连接正在关闭
var CLOSED = 3;//表示连接已经关闭，或者打开连接失败

/*type类型*/
var TYPE_TEXT = 0;//文本消息请求
var TYPE_PHOTO = 1;//图片消息请求
var TYPE_ADD_FRIEND = 2;//添加好友请求
var TYPE_GROUP_HINT = 3;//群消息提示
var TYPE_FILE = 4;//文件信息

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
        // console.log(event.data.valueOf());
        var res = jQuery.parseJSON(event.data.valueOf());
        if (res.msgId == AUTH_ERROR) {
            window.location.href = "login.html";
        } else if (res.msgId != "0200" && res.msgId !="0201") {
            hint(res.message);
        } else if(res.msgId == "0200"){
            var body = res.body;
            //提示音
            if($("#close_sound").attr("data-of") == "on") {
                document.getElementById("controls").play();
            }
            for (var i = 0, j = body.length; i < j; i++) {
                var message = body[i];
                var type = message.type;
                switch (type) {
                    case 4://文件信息
                    case 1://图片信息
                    case 0://普通文本消息
                        var fid = $("#team-setting").attr("data-id");
                        var id = "#new_friend_hint" + message.uid;
                        var content = message.body;
                        if (type == TYPE_PHOTO || type == TYPE_FILE) {
                            $(id).find(".last-msg").text("");
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
                                //图片
                                contentHtml = chat_content_append(message.body, 2, message.photo, 1);
                            } else if(type == TYPE_FILE){
                                //文件
                                var contentHtml = chat_content_append(message.body, 2, message.photo, 4);
                            }
                            $("#chat-content").append(contentHtml);
                            //滚动条置底
                            $("#chat-content")[0].scrollTop = $("#chat-content")[0].scrollHeight;

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
                    case 3://群提示信息
                        var fid = $("#team-setting").attr("data-id");
                        var id = "#new_friend_hint" + message.uid;
                        var content = message.body;
                        if (fid == message.uid) {
                            //正在聊天中
                            $("#chat-content").append(chatHint(content));
                            //滚动条置底
                            $("#chat-content")[0].scrollTop = $("#chat-content")[0].scrollHeight;

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
                        break
                    default:
                        // this never happens
                        break;
                }
            }
        }
    }
}

//消息格式
function form(token, ope, fid, type, body) {
    this.token = token;
    this.ope = ope;
    this.fid = fid;
    this.type = type;
    this.body = body;
}
