//设置
$("#team-setting").click(function (e) {
    var ope = $("#nick-name-layout").attr("data-show");
    e.stopPropagation();
    if (ope == 0) {
        $("#p2p_setting_menu_layout").removeClass("hide");
        $("#team_setting_menu_layout").addClass("hide");
    } else if (ope == 1) {
        $("#team_setting_menu_layout").removeClass("hide");
        $("#p2p_setting_menu_layout").addClass("hide");
    }
});

//退群
$("#quit_team").click(function () {
    var gid = $("#team-setting").attr("data-id");
    var data = {"gid": gid};
    sendAjax("post", "/group/exitGroup", data, function () {
        // session();
        var id = "#new_friend_hint" + fid;
        $(id).remove();
        rightChatInit();
    })
});


//修改群名
$("#change_team_name").click(function () {
    $("#edit-team-name-ipt").removeClass("hide");
    var team_name = $("#nick-name").text();
    $("#edit-team-name-ipt").val(team_name);
    $("#nick-name").text("");
    $("#edit-team-name-ipt").focus();

    //失去焦点自动提交修改的名称
    $("#edit-team-name-ipt").blur(function () {
        var gid = $("#team-setting").attr("data-id");
        var new_team_name = $("#edit-team-name-ipt").val();
        var data = {"gid": gid,"gname":new_team_name};
        sendAjax("post", "/group/updateGroupName", data, function (msg) {
            $("#nick-name").text(new_team_name);
            chatHint(msg.msg);
            $("#edit-team-name-ipt").addClass("hide");
            var id="#new_friend_hint"+gid;
            $(id).children(".to-name").text(new_team_name);
        });
    });

});

//修改备注
$("#change_friend_alias").click(function () {
    $("#edit-team-name-ipt").removeClass("hide");
    var team_name = $("#nick-name").text();
    $("#edit-team-name-ipt").val(team_name);
    $("#nick-name").text("");
    $("#edit-team-name-ipt").focus();

    //失去焦点自动提交修改的名称
    $("#edit-team-name-ipt").blur(function () {
        var fid = $("#team-setting").attr("data-id");
        var alias = $("#edit-team-name-ipt").val();
        var data = {"fid": fid,"alias":alias};
        sendAjax("post", "/friend/alias", data, function (msg) {
            $("#nick-name").text(alias);
            $("#edit-team-name-ipt").addClass("hide");
            var id="#new_friend_hint"+fid;
            $(id).children(".to-name").text(alias);
        });
    });

});


//删除好友
$("#delete_friend").click(function () {
    var fid = $("#team-setting").attr("data-id");
    var data = {"fid": fid};
    sendAjax("get", "/friend/del", data, function () {
        // session();
        var id = "#new_friend_hint" + fid;
        $(id).remove();
        rightChatInit();
    })
});


//删除聊天记录
$("#p2p_delete_chat").click(function () {
    delChat();
});

//删除群聊天记录
$("#delete_chat").click(function () {
    delChat();
});

//删除聊天记录
function delChat() {
    var fid = $("#team-setting").attr("data-id");
    var data = {"fid": fid};
    sendAjax("get", "/messages/delMessage", data, function () {
        $("#chat-content").empty();
        var id="#new_friend_hint"+fid;
        $(id).children(".last-msg").text("");
    })
}

