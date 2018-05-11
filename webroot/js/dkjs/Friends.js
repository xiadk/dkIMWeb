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

//获取通讯录好友
$("#address-book").click(function () {

    $("#info-content").hide();
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
            $("#friend-layout").append("<div class='ab-item' id='ab-item" + fid + "' data-type='p' data-account='1' data-id='" + fid + "' data-address='" + address + "' data-name='" + name + "'><div class='abf-avatar-container'> <img src='" + photo + "' alt='' class='abf-avatar vertical-middle'></div><div class='ab-name'>" + alias + "</div></div>");
        }

        //查看通讯录好友详情
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
});


//显示请求添加好友详细信息
function friendApply(message) {
    var data = {"mid": message.mid};
    sendAjax("post", "/messages/read", data, function (msg) {
        if (msg.msgId == SUCCESS) {
            $("#sure-friend-verify-tab").find("img").attr("src", message.photo);
            $("#sure-tb-name-user-name").text(message.name);
            $("#sure-friend-verify-tab").show();
            //发送确认添加好友请求
            $("#sure-submit").unbind("click").click(function () {
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
        } else {
            alert(msg.message);
        }
    });

}


//删除好友
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
                var delId = "#ab-item"+fid;
                $(delId).remove();
                hint("删除好友成功!");
            }
        })
    });
});


//添加好友
$("#add_friend").click(function () {
    $("#search-person-tab").show();
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

//查找好友
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

//修改备注
$("#change-friend-alias").click(function () {
    var em = $("#info-de-alias").children("em");
    var $alias_edit_ipt = $("#alias-edit-ipt");
    em.addClass("hide");
    var oldAlias = em.text();
    $alias_edit_ipt.val(oldAlias);
    $alias_edit_ipt.removeClass("hide");
    $alias_edit_ipt.blur(function () {
        var newAlias = $alias_edit_ipt.val();
        if (oldAlias != newAlias) {

            var fid = $("#delete-friend").attr("data-id");
            var data = {"alias": newAlias, "fid": fid};
            sendAjax("post", "/friend/alias", data, function (msg) {
                if (msg.msgId == SUCCESS) {
                    hint("修改成功");
                } else {
                    hint("修改失败");
                }
            })
        }
        em.text($alias_edit_ipt.val());
        $("#ab-item" + fid).children(".ab-name").text($alias_edit_ipt.val());
        $alias_edit_ipt.addClass("hide");
        em.removeClass("hide");
    });
});

//搜索
$("#search").blur(function () {
    var name = $(this).val();
    var data = {"name":name};
    sendAjax("get","/friend/search",data,function (msg) {

        var friedns = msg.friends;
        $("#friend-layout").empty();
        for (var i = 0, j = friedns.length; i < j; i++) {
            var photo = friedns[i].photo;
            var alias = friedns[i].alias;
            var fid = friedns[i].fid;
            var ope = friedns[i].ope;
            var html = "<div class='ab-item' id='search" + fid + "' data-type='p' data-account='1' data-id='" + fid + "' data-ope='"+ope+"'>" ;
            if(photo!="") {
                html+="<div class='abf-avatar-container'> " +
                "<img src='" + photo + "' alt='' class='abf-avatar vertical-middle'>" +
                "</div>";
            } else {
                html+="<div class=\"team-avatar\">"+alias.substring(0,1)+"</div>";
            }
            html+="<div class='ab-name'>" + alias + "</div>" +
                "</div>";

            //当前用cur
            $("#friend-layout").append(html);
        }

        $(".tab-view-container").addClass("hide");
        $("#address-book-list-container").removeClass("hide");

        $(".ab-item").click(function () {
            var fid = $(this).attr("data-id");
            var alias = $(this).children(".ab-name").text();
            var ope = $(this).attr("data-ope");
            var data = {"fid": fid};

            sendAjax("post", "/friend/addcontact", data, function () {});
            session();
            StartChatInit(fid, alias,ope);
            comment(fid, alias);
        });
    })
});
