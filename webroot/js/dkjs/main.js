//获取用户数据，初始化页面
sendAjaxNotData("get", "/user", function (msg) {
    $("#avatar_img").attr("src", msg.photo);
    $("#nickname-layout-span").text(msg.name);


});
$(function () {
    //用户菜单显示
    $("#menu").click(function () {
        menuToggle($("#menu_list"));
    });
    addFriend();
    delFriend();
    change_friend_alias();//修改备注
    //获取通讯录好友
    $("#address-book").click(function () {
        address_book();
    });

    //退出
    $("#login_out").click(function () {
        sendAjaxNotData("get", "/login_out", function (msg) {
            if (msg.msgId == SUCCESS) {
                window.location.href = "login.html";
                delCookie("token");
            }
        })
    });

    //消息列表-点击好友消息
    $("#new_friend_hint").click(function () {
        var new_friend_hint_span = $("#new_friend_hint").find("span");
        var messages_length = new_friend_hint_span.text();
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





})

//添加好友
function addFriend() {
    //显示添加好友输入框
    $("#add_friend").click(function () {
        $("#search-person-tab").show();
        menuToggle($("#menu_list"));
    });
    $("#sp-close").click(function () {
        $("#search-person-tab").hide();
    });
    $("#apply-submit").click(function () {
        $("#usual-alert-tab").hide();
    });
    $("#tel-for-search").focus(function () {
        $("#search-person-tab").find("p").hide();
    });
    $("#sp-submit").click(function () {
        var data = {"condition": $("#tel-for-search").val()};
        sendAjax("get", "/friend", data, function (msg) {
            if (msg.msgId == "1502") {
                $("#search-person-tab").find("p").show();
            } else {
                $("#search-person-tab").hide();
                $("#afv-close").show();
                $("#search-result-list-tab").show();
                var friends = msg.friends;
                getFriend(friends);
            }
        });
    });
    $("#afv-close").click(function () {
        $("#apply-friend-verify-tab").hide();
    });
    $("#srl-close").click(function () {
        $("#search-result-list-tab").hide();
    });
    //发送好友请求
    $("#afv-submit").click(function () {
        var fid = $("#afv-submit").attr("data-account");
        var token = readCookie("token");
        var message = new form(token, OPE_PERSONAL, fid, TYPE_ADD_FRIEND, "");
        wsSend(message);
        $("#apply-friend-verify-tab").hide();
        hint("好友申请已发送!");
    });
    $("#ua-submit").hide();
    $("#success-submit").click(function () {
        $("#success-alert-tab").hide();
    });
}

//获取添加好友列表
function getFriend($friends) {
    for (var i = 0; i < $friends.length; i++) {
        var imgUrl = $friends[i].photo;
        var name = $friends[i].name;
        var phone = $friends[i].phone;
        var id = $friends[i].uid;
        $("#search-result-container").empty();
        $("#search-result-container").append("<div class='srl-item clear' data-account='" + id + "'><div class='srl-item-avatar'><img src='" + imgUrl + "' alt='" + name + "'></div><div class='srl-item-text-container'><div class='srl-item-nickname'>" + name + "</div><div class='srl-item-mtnum'>" + phone + "</div></div><div class='srl-item-add-btn'></div></div>")

    }
    $(".srl-item-add-btn").click(function () {
        $("#search-result-list-tab").hide();
        var photo = $(this).parent().children(".srl-item-avatar").children("img").attr("src");
        var name = $(this).parent().children(".srl-item-avatar").children("img").attr("alt");
        $("#apply-friend-verify-tab").find("img").attr("src", photo);
        $("#tb-name-user-name").html(name);
        var fid = $(this).parent().attr("data-account");
        $("#afv-submit").attr("data-account", fid);
        $("#apply-friend-verify-tab").show();
    });
}

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

//获取通讯录好友
function address_book() {
    sendAjaxNotData("get", "/friend/findFriends", function (msg) {
        var friedns = msg.friends;
        $("#friend-layout").empty();
        for (var i = 0, j = friedns.length; i < j; i++) {
            var photo = friedns[i].photo;
            var alias = friedns[i].alias;
            var fid = friedns[i].fid;
            var name = friedns[i].name;
            var address = friedns[i].address;
            //当前用cur
            $("#friend-layout").append("<div class='ab-item' data-type='p' data-account='1' data-id='" + fid + "' data-address='" + address + "' data-name='" + name + "'><div class='abf-avatar-container'> <img src='" + photo + "' alt='' class='abf-avatar vertical-middle'></div><div class='ab-name'>" + alias + "</div></div>");
        }
        $("#info-content").hide();

        $(".ab-item").click(function () {
            $(".ab-item").removeClass("cur");
            $(this).addClass("cur");
            $(".chat--layout").addClass("hide");
            $("#address-book-wrapper").removeClass("hide");
            var photo = $(this).find("img").attr("src");
            var alias = $(this).children(".ab-name").html();
            var fid = $(this).attr("data-id");
            var name = $(this).attr("data-name");
            var address = $(this).attr("data-address");
            $("#info-de-avatar").attr("src", photo);
            $("#info-de-alias").children("em").html(alias);
            $("#info-de-nick").children("em").html(name);
            $("#info-de-area").children("em").html(address);
            $("#delete-friend").attr("data-id", fid);
            $("#info-content").show();
        });
    })
}

//显示好友信息
function friendApply(message) {
    var data = {"mid": message.mid};
    sendAjax("post", "/messages/read", data, function (msg) {
        if (msg.msgId == SUCCESS) {
            $("#sure-friend-verify-tab").find("img").attr("src", message.photo);
            $("#sure-tb-name-user-name").text(message.name);
            $("#sure-friend-verify-tab").show();
            //发送确认添加好友请求
            $("#sure-submit").click(function () {
                var data = {"uid": message.uid, "uidname": message.name, "fidname": $("#nickname-layout-span").text()};
                sendAjax("post", "/friend", data, function (msg) {
                    $("#sure-friend-verify-tab").hide();
                    if (msg.msgId == "0200") {
                        $("#success-alert-tab").show();
                    }
                })
            });
            $("#sure-close").click(function () {
                $("#sure-friend-verify-tab").hide();
            })
        }else{
            alert(msg.message);
        }
    });

}

//删除好友
function delFriend() {
    $("#delete-friend").click(function () {
        $("#delete-friend-verify-tab").find("img").attr("src", $("#info-de-avatar").attr("src"));
        $("#delete_friend-name").text($("#info-de-alias").children("em").html());
        $("#delete-friend-verify-tab").show();
        $("#dfv-close").click(function () {
            $("#delete-friend-verify-tab").hide();
        });
        $("#dfv-submit").click(function () {
            var fid = $("#delete-friend").attr("data-id");
            var data = {"fid": fid};
            sendAjax("get", "/friend/del", data, function (msg) {
                $("#delete-friend-verify-tab").hide();
                if (msg.msgId == "0200") {
                    hint("删除好友成功!");
                }
            })
        });
    });
}

//修改备注
function change_friend_alias() {
    $("#change-friend-alias").click(function () {
        var em = $("#info-de-alias").children("em");
        var $alias_edit_ipt = $("#alias-edit-ipt");
        em.addClass("hide");
        var oldAlias = em.text();
        $alias_edit_ipt.val(oldAlias);
        $alias_edit_ipt.removeClass("hide");
        $alias_edit_ipt.blur(function () {
            var newAlias = $alias_edit_ipt.val();
            if(oldAlias != newAlias) {

                var fid = $("#delete-friend").attr("data-id");
                var data = {"alias":newAlias,"fid":fid};
                sendAjax("post","/friend/alias",data,function (msg) {
                    if(msg.msgId==SUCCESS){
                        hint("修改成功");
                    } else {
                        hint("修改失败");
                    }
                })
            }
            em.text($alias_edit_ipt.val());
            $alias_edit_ipt.addClass("hide");
            em.removeClass("hide");
        });
    });
}
