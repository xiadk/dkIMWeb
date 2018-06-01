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
                } else if(msg.messages[i].type == TYPE_FILE) {
                    contentHtml = chat_content_append(msg.messages[i].body, 2, msg.messages[i].photo, 4);
                }
                $("#moreMsg").after(contentHtml);
            } else {
                //自己发的
                var contentHtml = chat_content_append(msg.messages[i].body, 1);
                if (msg.messages[i].type == TYPE_PHOTO) {
                    contentHtml = chat_content_append(msg.messages[i].body, 1, -1, 1);
                } else if(msg.messages[i].type == TYPE_FILE) {
                    contentHtml = chat_content_append(msg.messages[i].body, 1, -1, 4);
                }
                $("#moreMsg").after(contentHtml);
            }
            //滚动条置底
            $("#chat-content")[0].scrollTop = $("#chat-content")[0].scrollHeight;
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

    statrt_chat_friend();
    //发起好友聊天
    $("#cc-tab-friend").click(function () {
        //界面初始化
        statrt_chat_friend();
    });
    //发起群聊天
    $("#cc-tab-team").click(function () {
        //界面初始化
        statrt_chat_team();
    });

});

//和好友发起聊天
function statrt_chat_friend() {
    $("#cc-tl-friend-list").removeClass("hide");
    $("#cc-tl-team-list").addClass("hide");
    $("#cc-tab-friend").addClass("cur");
    $("#cc-tab-team").removeClass("cur");
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
                //获取联系人列表
                session();
                //页面初始化
                StartChatInit(gid, gname, 1);
                menuToggle($("#tab_layout"));
                $("#add_team_member").removeClass("hide");
            })
        });


    })
}

//发起群聊天
function statrt_chat_team() {
    $("#cc-tab-friend").removeClass("cur");
    $("#cc-tab-team").addClass("cur");
    $("#cc-tl-friend-list").addClass("hide");
    $("#cc-tl-team-list").removeClass("hide");
    //获取群
    sendAjaxNotData("get", "/group", function (msg) {
        var groups = msg.groups;
        $("#cc-tl-team-list").empty();
        for (var i = 0, j = groups.length; i < j; i++) {
            var photo = groups[i].photo;
            var gname = groups[i].gname;
            var gid = groups[i].gid;
            var html = "<div class=\"cc-tl-item cc-tl-team-item\" data-id=" + gid + ">" +
                "<span class=\"cc-item-circle\" data-id=" + gid + "></span>";
            if (photo == "") {
                html = html + "<div class=\"cc-item-heading\">" + gname.substring(0, 1) + "</div>";
            } else {
                html = html + "<div class=\"cc-item-avatar-container\">\n" +
                    "                <img src=\"" + photo + "\" alt=\"\" class=\"cc-item-avatar horizontal-middle\">\n" +
                    "                </div>";
            }
            html = html + "<div class=\"cc-item-alias\">" + gname + "</div>" +
                "</div>";
            //当前用cur
            $("#cc-tl-team-list").append(html);
        }

        //选择发起聊天对象
        $(".cc-tl-team-item").click(function () {
            $(".cc-tl-team-item").children("span").removeClass("selected");
            $(this).children("span").addClass("selected");
        });

        //确认发起聊天
        $("#cc_submit").unbind('click').click(function () {
            var gid = $(".cc-tl-team-item>.selected").attr("data-id");
            var gname = $(".cc-tl-team-item>.selected").nextAll(".cc-item-alias").text();
            //获取联系人列表
            session();
            //页面初始化
            StartChatInit(gid, gname, 1);
            menuToggle($("#tab_layout"));
            comment(gid, gname);
            $("#add_team_member").removeClass("hide");
        });


    })
}

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
                        var gname = $("#nick-name").text();
                        var data = {"members": members, "gid": gid,"gname":gname};
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

    //滚动条置底
    $("#chat-content")[0].scrollTop = $("#chat-content")[0].scrollHeight;

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

//fm=1自己发，fm=2别人发 type=0文本消息，1为图片,4为文件。默认文本
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
        } else if (type == 4) {
            content = content + "<span class=\"icon icon-file2\"></span><span>" + body + "</span>"+
            "<a href=\"" + kodoUrl + body + "\" target=\"_blank\">下载</a>";
        } else {
            content = content + " <a download=\"\" href=\"" + kodoUrl + body + "\" target=\"_blank\"><img  data-src=\"\" src=\"http://p8go9rpgo.bkt.clouddn.com/" + body + "\" style='height: 150px;width: 150px'></a>";
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
        } else if (type == 4) {
            content = content + "<span class=\"icon icon-file2\"></span><span>" + body + "</span> "+
            "<a download=\"\" href=\"" + kodoUrl + body + "\" target=\"_blank\">下载 </a>";
        } else if (type == 1) {
            content = content + " <a href=\"" + kodoUrl + body + "\" target=\"_blank\"><img  data-src=\"\" src=\"http://p8go9rpgo.bkt.clouddn.com/" + body + "\" style='height: 150px;width: 150px'></a>";
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
    $("#file").click();
});

function processFile(files) {
    var file = files[0];
    var key = file.name;
    sendAjaxNotData("get", "/file/uploadToken", function (msg) {
        var uploadToken = msg.uploadToken;
        var config = {
            region: qiniu.region.z2
        };
        var putExtra = {
            fname: key,
            mimeType: [] || null
        };
        var observable = qiniu.upload(file, key, uploadToken, putExtra, config);
        var observer = {
            next(res) {
                var total = res.total;
                $("#upload-percentage-tab").removeClass("hide");
                $("#percentage").text(parseInt(total.percent) + "%");
            },
            error(err) {
                $("#upload-percentage-tab").addClass("hide");
            },
            complete(res) {
                $("#upload-percentage-tab").addClass("hide");
                var contentHtml = "";
                //发送消息
                if (IMAGE_TYPE.indexOf(key.split(".")[1]) != -1) {
                    contentHtml = chat_content_append(key, 1, -1, 1);
                } else {
                    contentHtml = chat_content_append(key, 1, -1, 4);
                }
                $("#chat-content").append(contentHtml);
                //滚动条置底
                $("#chat-content")[0].scrollTop = $("#chat-content")[0].scrollHeight;

                var token = readCookie("token");
                var fid = $("#team-setting").attr("data-id");
                var id = "#new_friend_hint" + fid;
                var ope = $(id).attr("data-ope");
                var message = new form(token, ope, fid, TYPE_FILE, key);
                wsSend(message);
            }
        }
        var subscription = observable.subscribe(observer);
    });
}

//下载文件
function fileDown(url) {
    console.log(url);
    sendAjaxNotData("get",url,function (msg) {
        console.log(msg);
    });
}
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
