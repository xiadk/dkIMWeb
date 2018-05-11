//对好友发起聊天
$("#info-de-send").click(function () {
    var fid = $("#delete-friend").attr("data-id");
    var alias = $("#info-de-alias").children("em").text();
    var data = {"fid": fid};
    sendAjax("post", "/friend/addcontact", data, function () {
    });
    StartChatInit(fid, alias, 0);
    session();
});

//获取聊天信息
function comment(fid, alias) {
    //隐藏更多消息链接
    $("#moreMsg").addClass("hide");

    var page = $("#moreMsg").attr("data-page");
    if (page == "" || page == null) {
        page = 1;
    }
    //获取最新消息(分页，6条)
    var data = {"fid": fid, "page": page};

    sendAjax("get", "/messages/getMessages", data, function (msg) {
        if (msg.messages.length == 6) {
            $("#moreMsg").removeClass("hide");
        }
        for (var i = 0; i < msg.messages.length; i++) {

            if (msg.messages[i].type == TYPE_GROUP_HINT) {
                $("#moreMsg").after(chatHint(msg.messages[i].body));
            } else if (fid == msg.messages[i].uid) {
                //好友发的
                var contentHtml = chat_content_append(msg.messages[i].body, 2, msg.messages[i].photo);
                if (msg.messages[i].type == TYPE_PHOTO) {
                    contentHtml = chat_content_append(msg.messages[i].body, 2, msg.messages[i].photo, 1);
                }
                $("#moreMsg").after(contentHtml);
            } else {
                //自己发的
                var contentHtml = chat_content_append(msg.messages[i].body, 1);
                if (msg.messages[i].type == TYPE_PHOTO) {
                    contentHtml = chat_content_append(msg.messages[i].body, 1, -1, 1);
                }
                $("#moreMsg").after(contentHtml);
            }
            $("#chat-content").scrollTop = $("#chat-content").scrollHeight;
        }
        var id = "#new_friend_hint" + fid;
        $(id).find("span").addClass("hide");
        $(id).find("span").text(0);
        //添加滚动条
        // addScrollbr($("#chat-content"));

    });

}

//加载更多消息
$("#moreMsg").click(function () {
    var page = $("#moreMsg").attr("data-page");
    $("#moreMsg").attr("data-page", parseInt(page) + 1);
    var alias = $("#nick-name").text();
    var fid = $("#team-setting").attr("data-id");
    comment(fid, alias);
});

/**群聊**/
//发起聊天入口
$("#statrt_chat").click(function () {
    menuToggle($("#tab_layout"));

    //获取通讯录
    sendAjaxNotData("get", "/friend/findFriends", function (msg) {
        var friedns = msg.friends;
        $("#cc-tl-friend-list").empty();
        for (var i = 0, j = friedns.length; i < j; i++) {
            var photo = friedns[i].photo;
            var alias = friedns[i].alias;
            var fid = friedns[i].fid;
            var html = "<div class=\"cc-tl-item cc-tl-friend-item\" data-account=\"1007\" data-id=" + fid + ">" +
                "<span class=\"cc-item-circle\" data-id=" + fid + "></span>" +
                "<div class=\"cc-item-avatar-container\">" +
                "<img src=" + photo + " alt=\"\" class=\"cc-item-avatar vertical-middle\">" +
                "</div>" +
                "<div class=\"cc-item-alias\">" + alias + "</div>" +
                "</div>";
            //当前用cur
            $("#cc-tl-friend-list").append(html);
        }

        //选择发起聊天对象
        $(".cc-tl-friend-item").click(function () {
            selectedAndCancle($(this));

        });

        //确认发起聊天
        $("#cc_submit").unbind('click').click(function () {
            var fids = [];
            $.each($(".cc-tl-friend-item>.selected"), function (i, n) {
                var fid = $(n).attr("data-id");
                fids.push(fid);
            });
            var members = JSON.stringify(fids);
            var data = {"members": members};
            sendAjax("post", "/group/create", data, function (msg) {
                var gid = msg.gid;
                var gname = msg.gname;
                //页面初始化
                StartChatInit(gid, gname, 1);
                //获取联系人列表
                session();
                menuToggle($("#tab_layout"));
                $("#add_team_member").removeClass("hide");
            })
        });


    })
});

//查看群聊成员
$("#add_team_member").click(function () {

    if ($("#team-member-layout").hasClass("an0")) {
        $("#team-member-layout").empty();
        classToggle($("#team-member-layout"), "an0", "an1");
        $("#team-member-layout").css("height", "90px");
        var gid = $("#team-setting").attr("data-id");
        var data = {"gid": gid};
        sendAjax("get", "/group/members", data, function (msg) {
            var add_del_html = "<img src=\"images/button_add.png\" class=\"member-item\" id=\"add-item\">\n" +
                "            <img src=\"images/button_delete.png\" class=\"member-item\" id=\"delete-member-item\">";
            $("#team-member-layout").append(add_del_html);
            var members = msg.members;
            for (var i = 0, j = members.length; i < j; i++) {
                var html = "<img src=" + members[i].photo + " title=" + members[i].name + " class=\"member-item\" data-account=" + members[i].uid + ">";
                $("#team-member-layout").append(html);
            }
            //显示名片
            $(".member-item").eq(1).nextAll().click(function () {
                var fid = $(this).attr("data-account");
                var data = {"fid": fid};
                sendAjax("get", "/group/memberInfo", data, function (msg) {
                    if (msg.sex == 0) {
                        $("#info-gender").attr("src", "https://cdn.mitures.com/web/assests/img/icon_men.png");
                    } else {
                        $("#info-gender").attr("src", "https://cdn.mitures.com/web/assests/img/icon_women.png");
                    }
                    $("#info_avatar_container").children("img").attr("src", msg.photo);
                    if (msg.alias == "") {

                        $("#info-alias").text(msg.name);
                        $("#info-box").addClass("isNotFriend");
                    } else {

                        $("#info-box").removeClass("isNotFriend");
                        $("#info-alias").text(msg.alias);
                    }
                    $("#info-name").text(msg.name);
                    $("#info-area").text(msg.address);
                    $("#info-box").removeClass("hide")
                });

            });
            //隐藏名片
            $("#team-member-layout").click(function () {
                $("#info-box").addClass("hide")
            });

            //删除成员
            $("#delete-member-item").click(function () {
                $("#delete-member-tab").removeClass("hide");
                $("#dm-friend-list").empty();

                //成员列表
                sendAjax("get", "/group/members", data, function (msg) {
                    var members = msg.members;
                    for (var i = 0, j = members.length; i < j; i++) {
                        var html = "<div class=\"tb-item dm-friend-item\"  data-id=\"p2p-&quot;1472&quot;\">" +
                            "<span class=\"tb-item-circle dm-item-circle\" data-id=" + members[i].uid + "></span>" +
                            "<img src=" + members[i].photo + " class=\"tb-item-avatar dm-item-avatar\">" +
                            "<div class=\"tb-item-alias dm-item-alias\">" + members[i].name + "</div>" +
                            "</div>";
                        $("#dm-friend-list").append(html);
                    }

                    //选择删除的成员
                    $(".dm-friend-item").click(function () {
                        selectedAndCancle($(this));
                    });

                    //确定删除的成员
                    $("#dm-submit").click(function () {
                        var fids = [];
                        var chatHintName = $("#nickname-layout-span").text() + "将";//群消息提示
                        $.each($(".dm-friend-item>.selected"), function (i, n) {
                            var fid = $(n).attr("data-id");
                            fids.push(fid);
                            chatHintName = chatHintName + $(n).parent().children(".tb-item-alias").text() + ",";
                        });
                        chatHintName = chatHintName.substring(0, chatHintName.length - 1) + "踢出群";
                        var members = JSON.stringify(fids);
                        var gid = $("#team-setting").attr("data-id");
                        var data = {"members": members, "gid": gid};
                        sendAjax("post", "/group/delmembers", data, function (msg) {

                            $("#delete-member-tab").addClass("hide");
                            closeTeamLayout();
                            $("#chat-content").append(chatHint(chatHintName));
                            var token = readCookie("token");
                            var fid = $("#team-setting").attr("data-id");
                            var id = "#new_friend_hint" + fid;
                            var ope = $(id).attr("data-ope");
                            var message = new form(token, ope, fid, TYPE_GROUP_HINT, chatHintName);
                            wsSend(message);
                        })
                    });

                });


                //关闭弹框
                $("#dm-close").click(function () {
                    $("#delete-member-tab").addClass("hide");
                });
            });

            //添加成员
            $("#add-item").click(function () {
                $("#add-member-tab").removeClass("hide");
                $("#am-friend-list").empty();

                sendAjax("post", "/group/getfriendsToGroup", data, function (msg) {

                    var members = msg.members;
                    for (var i = 0, j = members.length; i < j; i++) {
                        var html = "<div class=\"tb-item am-friend-item\" data-account=\"1007\">" +
                            "<span class=\"tb-item-circle am-item-circle\" data-id=" + members[i].fid + "></span>" +
                            "<img src=" + members[i].photo + " class=\"tb-item-avatar dm-item-avatar\" >\n" +
                            "<div class=\"tb-item-alias am-item-alias\">" + members[i].alias + "</div>\n" +
                            "</div>";
                        $("#am-friend-list").append(html);
                    }

                    //选择要添加的成员
                    $(".am-friend-item").click(function () {
                        selectedAndCancle($(this));
                    });

                    //确定要添加的成员
                    $("#am-submit").unbind('click').click(function () {
                        var fids = [];
                        var chatHintName = $("#nickname-layout-span").text() + "将";//群消息提示
                        $.each($(".am-friend-item>.selected"), function (i, n) {
                            var fid = $(n).attr("data-id");
                            fids.push(fid);
                            chatHintName = chatHintName + $(n).parent().children(".tb-item-alias").text() + ",";
                        });
                        chatHintName = chatHintName.substring(0, chatHintName.length - 1) + "拉入群中";
                        var members = JSON.stringify(fids);
                        var gid = $("#team-setting").attr("data-id");
                        var data = {"members": members, "gid": gid};
                        sendAjax("post", "/group/addMembers", data, function (msg) {

                            $("#add-member-tab").addClass("hide");
                            closeTeamLayout();
                            $("#chat-content").append(chatHint(chatHintName));
                            var token = readCookie("token");
                            var fid = $("#team-setting").attr("data-id");
                            var id = "#new_friend_hint" + fid;
                            var ope = $(id).attr("data-ope");
                            var message = new form(token, ope, fid, TYPE_GROUP_HINT, chatHintName);
                            wsSend(message);
                        })
                    });

                });


                //关闭
                $("#am-close").click(function () {
                    $("#add-member-tab").addClass("hide");
                });
            });
        });
    } else {
        closeTeamLayout();
    }

});

$("#cc-close").click(function () {
    menuToggle($("#tab_layout"));
});


//点击发送消息
$("#send").unbind("click").click(function () {
    var content = $("#send-text").val();
    var token = readCookie("token");
    var fid = $("#team-setting").attr("data-id");
    var id = "#new_friend_hint" + fid;
    var ope = $(id).attr("data-ope");
    var message = new form(token, ope, fid, TYPE_TEXT, content);
    wsSend(message);
    $("#send-text").val("");
    var contentHtml = chat_content_append(content, 1);
    $("#chat-content").append(contentHtml);

    if (content.length > 7) {
        content = content.substr(0, 7) + "......";
    }
    $(id).find(".last-msg").text(content);

});

//显示表情
$("#showEmoji").click(function (e) {

    e.stopPropagation();
    $("#emojiTag").children(".m-emoji-wrapper").css("display", "block");
});

//点击表情
$(".m-emoji-picCol-ul").children("span").click(function (e) {
    // e.stopPropagation();
    var image = $(this).attr("id");
    var te = $("#send-text").val();
    $("#send-text").val(te + image);
});

//从文本消息筛选出表情包并更换
function getEmoij(str) {
    var arr = str.split("[");
    for (var i = 0; i < arr.length; i++) {

        if (arr[i].indexOf("]") > 0) {
            var emoijId = "\\[" + arr[i].substring(0, arr[i].indexOf("]")) + "\\]";
            var src = $("#" + emoijId).children().attr("src");
            var img = "<img class=\"emoji\" src=\"" + src + "\">";
            var emoijStr = "[" + arr[i].substring(0, arr[i].indexOf("]")) + "]";
            str = str.replace(emoijStr, img);
        }
    }
    return str;
}

//fm=1自己发，fm=2别人发 type=0文本消息，1为图片,默认文本
function chat_content_append(body, fm, src, type) {
    if (type == undefined) {
        type = 0;
    }
    var content = "";
    if (fm == 2) {
        content = "<div data-time=\"1522328748882\" data-id=\"18a7215834217fc0dd6b9f142a0c137f\" id=\"18a7215834217fc0dd6b9f142a0c137f\" data-idserver=\"12997361748\" class=\"clear item item-you\">\n" +
            "                    <div class=\"j-img-container\"><img class=\"img j-img vertical-middle\" src=" + src + " data-account=\"601072\"></div>\n" +
            "                    <div class=\"msg msg-text j-msg\">\n" +
            "                        <div class=\"box\">\n" +
            "                            <div class=\"cnt\">";
        if (type == 0) {
            //分离出表情包
            body = getEmoij(body);
            content = content + " <div class=\"f-maxWid\">" + body + "</div>";
        } else {
            content = content + " <div class=\"f-maxWid\"><img class=\"emoji\" src=" + body + "></div>";
        }

        content = content + "         </div>\n" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                </div>";
    } else if (fm == 1) {
        var src = $("#avatar_img").attr("src");
        content = "<div data-time=\"1522065179070\" data-id=\"1bcfe2193015c31d0460cb7aa8cc2baa\" id=\"1bcfe2193015c31d0460cb7aa8cc2baa\" data-idserver=\"12839877731\" class=\"clear item item-me\">\n" +
            "                    <div class=\"j-img-container\"><img class=\"img j-img vertical-middle\" src=" + src + " data-account=\"100326\"></div>\n" +
            "                    <div class=\"msg msg-text j-msg\">\n" +
            "                        <div class=\"box\">\n" +
            "                            <div class=\"cnt\">";
        if (type == 0) {
            //分离出表情包
            body = getEmoij(body);
            content = content + " <div class=\"f-maxWid\">" + body + "</div>";
        } else {
            content = content + " <div class=\"f-maxWid\"><img class=\"emoji\" src=" + body + "></div>";
        }

        content = content + "         </div>\n" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                </div>";
    }

    return content;

}

//发起聊天
function StartChatInit(fid, alias, ope) {
    $("#team-setting").removeClass("hide");
    $("#add_team_member").addClass("hide");
    if (ope == 1) {
        $("#add_team_member").removeClass("hide");
    }
    $("#nick-name-layout").attr("data-show", ope);
    $("#team-setting").attr("data-id", fid);
    var id = "#new_friend_hint" + fid;
    $(".session-item").removeClass("cur");
    $(id).addClass("cur");
    $("#nick-name").text(alias);
    // $("#chat-content").append(" <p class='u-msgTime'>- - - - -&nbsp;2018-04-19 00:52&nbsp;- &#45;&#45; - -</p>\n");
    $(".item").remove();//清空聊天内容
    $("#moreMsg").attr("data-page", "1");//初始化消息页数
    $(".tab").removeClass("cur");
    $("#session").addClass("cur");
    $(".tab-view-container").addClass("hide");
    $("#session-list-container").removeClass("hide");
    $(".chat--layout").addClass("hide");
    $("#chatting-area-wrapper").removeClass("hide");

}

//查看成员弹框
function getMembersClick() {
    if ($("#team-member-layout").hasClass("an0")) {
        classToggle($("#team-member-layout"), "an0", "an1");
        $("#team-member-layout").css("height", "90px");
    } else {
        classToggle($("#team-member-layout"), "an1", "an0");
        $("#team-member-layout").css("height", "0px");
    }
}

//关闭显示成员弹框
function closeTeamLayout() {
    classToggle($("#team-member-layout"), "an1", "an0");
    $("#team-member-layout").css("height", "0px");
}

//选择和取消
function selectedAndCancle($obj) {
    if ($obj.children("span").hasClass("selected")) {
        $obj.children("span").removeClass("selected");
    } else {

        $obj.children("span").addClass("selected");
    }
}


//上传文件弹框
$("#chooseFileBtn").click(function () {
    $("#uploadForm").click();
});

$("#uploadForm").change(function () {
    var observable = qiniu.upload(file, key, token, putExtra, config);
    var observer = {
        next(res) {
            console.log("本次上传的总量控制信息:"+res.total.total);
        },
        error(err) {
            console.log("上传失败");
        },
        complete(res) {
            console.log("上传成功");
        }
    }
    var subscription = observable.subscribe(observer);
    $.ajax({
        type: "post",
        url: "/messages/upload",
        data: new FormData($('#uploadForm')[0]),
        cache: false,
        processData: false, // 不要对data参数进行序列化处理，默认为true
        contentType: false, // 不要设置Content-Type请求头，因为文件数据是以 multipart/form-data 来编码
        headers: {
            'token': readCookie("token")
        },
        success: function (msg) {
            console.log("响应消息");
            console.log(msg);
        }
    });
    // handlerFiles(test);
});

/*$("#text_container").dragenter(function (e) {
    e.stopPropagation();
  e.preventDefault();
});

$("#text_container").dragover(function (e) {
    e.stopPropagation();
  e.preventDefault();
});

$("#text_container").drop(function (e) {
    e.stopPropagation();
  e.preventDefault();
  alert("sss");

  var dt = e.dataTransfer;
  var files = dt.files;

  handleFiles(files[0]);
});*/

function handlerFiles(files) {
    var formData = new FormData();
    formData.append("file", files);
    // formData.append("token", token_value);
    $.ajax({
        url: "/upload",
        type: "POST",
        data: formData,
        processData: false, // 不要对data参数进行序列化处理，默认为true
        contentType: false, // 不要设置Content-Type请求头，因为文件数据是以 multipart/form-data 来编码
        xhr: function () {
            myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener('progress', function (e) {
                    if (e.lengthComputable) {
                        var percent = Math.floor(e.loaded / e.total * 100);
                        if (percent <= 100) {
                            $("#J_progress_bar").progress('set progress', percent);
                            $("#J_progress_label").html('已上传：' + percent + '%');
                        }
                        if (percent >= 100) {
                            $("#J_progress_label").html('文件上传完毕，请等待...');
                            $("#J_progress_label").addClass('success');
                        }
                    }
                }, false);
            }
            return myXhr;
        },
        success: function (res) {
            // 请求成功
        },
        error: function (res) {
            // 请求失败
            console.log(res);
        }
    });
}
