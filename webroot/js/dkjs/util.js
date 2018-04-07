var PARAM_ERROR = "0400";// 参数错误
var FAIL = "0414";// 操作失败
var SERVER_FAIL = "0500";// 服务器错误
var SUCCESS = "0200"; // 操作成功
var REQUEST_EXIST = "1501"; // 请求保存的数据已存在
var PWD_ERROR = "1406";//密码错误
var REQUEST_NOT_EXIST = "1502"; // 请求数据不存在
var AUTH_ERROR = "0555"; // token 失效
function sendAjax(type, url, data, successCall) {
    console.log("发送消息");
    console.log(data);
    $.ajax({
        type: type,
        url: url,
        dataType: "json",
        headers: {
            'token': readCookie("token")
        },
        data: data,
        success: function (msg) {
            console.log("响应消息");
            console.log(msg);
            if (msg.msgId == PARAM_ERROR || msg.msgId == FAIL || msg.msgId == SERVER_FAIL) {
                alert(msg.msgId);
            } else if (msg.msgId == AUTH_ERROR) {
                window.location.href = "login.html";
            } else {
                successCall(msg);
            }
        }
    });
}

function sendAjaxNotData(type, url, successCall) {
    console.log("发送消息");
    $.ajax({
        type: type,
        url: url,
        dataType: "json",
        headers: {
            "token": readCookie("token")
        },
        success: function (msg) {
            console.log("响应消息");
            console.log(msg);
            if (msg.msgId == PARAM_ERROR || msg.msgId == FAIL || msg.msgId == SERVER_FAIL) {
                alert(msg.msgId);
            } else if (msg.msgId == AUTH_ERROR) {
                window.location.href = "login.html";
            } else {
                successCall(msg);
            }
        }
    });
}


//写cookies
function setCookie(name, value) {
    var days = 1;
    var exp = new Date();
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function readCookie(name) {
    var arrCookie = document.cookie.split(";");
    for (var i = 0; i < arrCookie.length; i++) {

        var c = arrCookie[i].split("=");
        if (c[0].trim() == name.trim()) {
            return c[1];

        }
    }
    return "";

}

//删除cookies
function delCookie(name) {
    var cval = readCookie(name);
    if (cval != null) {
        document.cookie = name + "=" + cval + ";expires=" + (new Date(0)).toGMTString();
    }
}

//提示框
function hint(content) {
    $("#usual-alert-tab-hint").text(content);
    $("#usual-alert-tab").show();
}

//切换打开和隐藏
function menuToggle($obj) {
    if ($obj.css("display") == "none") {
        $obj.css("display", "block");
    } else {
        $obj.css("display", "none");
    }

}