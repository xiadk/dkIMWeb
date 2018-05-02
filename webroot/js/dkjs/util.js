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
                alert(msg.message);
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
                alert(msg.message);
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

function addScrollbr($layout) {
    var htl = "<div class=\"ps__scrollbar-x-rail\" style=\"left: 0px; bottom: -3400px;\">" +
        "<div class=\"ps__scrollbar-x\" tabindex=\"0\" style=\"left: 0px; width: 0px;\"></div>" +
        "</div>" +
        "<div class=\"ps__scrollbar-y-rail\" style=\"top: 3400px; right: 0px; height: 360px;\">" +
        "<div class=\"ps__scrollbar-y\" tabindex=\"0\" style=\"top: 326px; height: 34px;\"></div>" +
        "</div>";
    $layout.append(htl);
}

//替换class
function classToggle($obj,oldClass,newClass) {

    $obj.removeClass(oldClass);
    $obj.addClass(newClass);
}

//聊天提示
function chatHint(content) {
    var html="<p class=\"u-notice tc item\" data-time=\"1524147029530\" data-id=\"0106d7d1-320a-4892-ba67-b278c3845dd3\" data-idserver=\"29321917085253634\">" +
        "<span class=\"radius5px\">"+content+"</span>" +
        "</p>";
    $("#chat-content").append(html);
}
