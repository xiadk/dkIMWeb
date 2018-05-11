var ws;
//好友添加请求集合
var add_messages = new Array();
$(function () {
//获取用户数据，初始化页面
    sendAjaxNotData("get", "/user", function (msg) {
        $("#avatar_img").attr("src", msg.photo);
        $("#nickname-layout-span").text(msg.name);
        $("#nickname-layout-span").attr("data-id",msg.uid);
    });
    session();

    ws = new WebSocket("ws://localhost:8001");
    wsocket(ws);

    ['张三','李四','王五'].sort((a, b) => a.localeCompare(b, 'zh-Hans-CN', {sensitivity: 'accent'}))

})

//用户菜单显示
$("#menu").click(function (e) {
    e.stopPropagation();
    $("#menu_list").removeClass("hide");
});

//联系人
$("#session").click(function () {
    session();
})

//退出
$("#login_out").click(function () {
    sendAjaxNotData("get", "/login_out", function (msg) {
        if (msg.msgId == SUCCESS) {
            window.location.href = "login.html";
            delCookie("token");
        }
    })
});


$(".tab").click(function (event) {
    $(".tab").removeClass("cur");
    $(".tab-view-container").addClass("hide");
    $(".chat--layout").addClass("hide");
    $(this).addClass("cur");
    var data_id_val = $(this).attr("data-id");
    $.each($(".tab-view-container"), function (i, n) {
        var childVal = $(n).children().attr("data-id");
        if (data_id_val == childVal) {
            $(n).removeClass("hide");
        }
    });
    $.each($(".chat--layout"), function (i, n) {
        var chat_id = $(n).attr("data-id");
        if (data_id_val == chat_id) {
            $(n).removeClass("hide");
        }
    });
});

//获取联系人及未读消息
function session() {
    $("#session-list").empty();
    $("#session-list").append("<div class='session-item' data-scene='p2p'  data-id='-1' data-unread='0' id='new_friend_hint'><div class=\"team-avatar\">友</div> <span class='unread hide'>0</span> <div class='to-name'>好友信息</div> <div class='last-msg'>有新朋友</div> </div>");
    sendAjaxNotData("get", "/friend/getcontacts", function (msg) {
        var contacts = msg.contacts;
        for (var i = 0, j = contacts.length; i < j; i++) {
            var photo = contacts[i].photo;
            var alias = contacts[i].alias;
            var new_content = contacts[i].new_content;
            if(contacts[i].type==TYPE_PHOTO) {
                new_content=getContactImg(new_content);
            } else if (new_content.length > 7){
                new_content = new_content.substr(0, 7) + "......";
            }

            var fid = contacts[i].fid;
            var ope = contacts[i].ope;
            var unread = contacts[i].unread;
            var html = " <div class='session-item' data-ope='" + ope + "'  data-id='" + fid + "' data-unread='0' id='new_friend_hint" + fid + "'> ";
            if(photo!="") {
                html+="<div class='session-avatar-container'>" +
                "<img src='" + photo + "' alt='' class='session-avatar vertical-middle'>" +
                "</div> ";
            } else {
                html+="<div class=\"team-avatar\">"+alias.substring(0,1)+"</div>";
            }
                html+="<span class='unread hide'>" + unread + "</span> " +
                "<div class='to-name'>" + alias + "</div> " +
                "<div class='last-msg'>" + new_content + "</div> " +
                "</div>";

            $("#session-list").append(html);
            if (unread > 0) {
                var id = "#new_friend_hint" + fid;
                $(id).find("span").removeClass("hide");
            }
        }
        $(".session-item").click(function () {
            closeTeamLayout();
            var fid = $(this).attr("data-id");
            var oldFid = $("#team-setting").attr("data-id");
            //排除点击自己和新好友申请
            if (fid != -1 && fid != oldFid) {
                var fid = $(this).attr("data-id");
                var alias = $(this).find(".to-name").text();
                var ope = $(this).attr("data-ope");
                StartChatInit(fid,alias,parseInt(ope));
                comment(fid, alias);
            }
        });

        //获取好友添加申请消息未读个数
        sendAjaxNotData("get", "/messages/friendMsg", function (msg) {
            add_messages = msg.addFriendMsg;
            $("#new_friend_hint").find("span").text(add_messages.length);
            if (add_messages.length > 0) {
                $("#new_friend_hint").find("span").removeClass("hide");
            }
        })
        //获取好友添加申请消息
        $("#new_friend_hint").click(function () {
            var new_friend_hint_span = $("#new_friend_hint").find("span");
            var messages_length = add_messages.length;
            if (messages_length <= 0) {
                alert("暂无新朋友信息");
            } else {
                friendApply(add_messages[messages_length - 1]);
                messages_length--;
                if (messages_length == 0) {
                    new_friend_hint_span.addClass("hide");
                }
                new_friend_hint_span.text(messages_length);
            }
        })


    });
}

//点击任意处消失
$(document).click(function(){
       $("#team_setting_menu_layout").addClass("hide");
       $("#p2p_setting_menu_layout").addClass("hide");
       $("#menu_list").addClass("hide");
       $("#emojiTag").children(".m-emoji-wrapper").css("display","none");
});


//最右侧页面初始化
function rightChatInit() {
    $("#team-setting").addClass("hide");
    $("#nick-name").text("未选择聊天对象");
    $("#team-setting").attr("data-id","-2");
    $("#chat-content").empty();
}

//联系人最新消息图片样式
function getContactImg(src) {
    return "<img src="+src+" style=\"width: 20px; height: 20px;top: -15px; right:25px;position: relative\">";
}



