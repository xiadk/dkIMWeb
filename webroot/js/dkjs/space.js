//发送朋友圈
$("#fs-send-new-item-btn").click(function () {

    var content = $("#fs-new-item-text").val();
    var type = $("#fs-send-new-item-btn").attr("data-type");
    var data = {"content": content, "type": type};
    sendAjax("post", "/space/add", data, function (msg) {
        hint("发布成功");
        mySpace();
    });
});

//我的朋友圈
function mySpace() {
    $("#friend_space_container").addClass("hide");
    $("#fs_my_notation_container").removeClass("hide");
    $("#my_space_messages").addClass("hide");
    $("#fs-add-photo").addClass("hide");
    $("#fs_my_notation_Details").addClass("hide");
    sendAjaxNotData("post", "/space/getSpace", function (msg) {
        spaces($("#fs_my_notation_container"),msg);

        //点赞
        $(".good_cls").click(function () {
            var img = $(this).attr("src");
            if (img === "images/good_red.png") {
                //取消点赞
                $(this).attr("src", "images/good.png");
                var sid = $(this).parents(".fsn-up").attr("data-sid");
                var data = {"sid": sid};
                sendAjax("post", "/space/dellove", data, function (msg) {
                    var spid = "#sp" + sid;
                    var names = $(spid).text();
                    var myName = $("#nickname-layout-span").text();
                    if (names == myName) {
                        names = names.replace(myName, "");
                    }
                    if (names.indexOf(myName) == names.length - myName.length) {
                        names = names.replace("," + myName, "");
                    } else {

                        names = names.replace(myName + ",", "");
                    }
                    $(spid).text(names);
                });
            } else {
                //点赞
                $(this).attr("src", "images/good_red.png");
                var sid = $(this).parents(".fsn-up").attr("data-sid");
                var data = {"sid": sid};
                sendAjax("post", "/space/updatelove", data, function (msg) {
                    var spid = "#sp" + sid;
                    var names = $(spid).text();
                    var myName = $("#nickname-layout-span").text();
                    if (names.trim() == "") {
                        names = myName;
                    } else {

                        names = myName + "," + names;
                    }
                    $(spid).text(names);
                });
            }
        });

        //评论
        $("#fs_my_notation_container").find(".comment_cls").click(function () {
            $("#comment-person-tab").removeClass("hide");
            var sid = $(this).parents(".fsn-up").attr("data-sid");
            $("#comment-person-tab").attr("data-sid", sid);
            //关闭评论弹框
            $("#comment-close").click(function () {
                $("#comment-person-tab").addClass("hide");
            });

            //发表评论
            $("#comment-submit").unbind('click').click(function () {

                var sid = $("#comment-person-tab").attr("data-sid");
                var comment = $("#comment_content").val();
                var data = {"sid": sid, "comment": comment};
                sendAjax("post", "/space/insertComment", data, function () {
                    $("#comment-person-tab").addClass("hide");
                    mySpace();
                });

            });
        });

    });
}


//我的消息
function myMessage() {
    $("#friend_space_container").addClass("hide");
    $("#fs_my_notation_container").addClass("hide");
    $("#my_space_messages").removeClass("hide");
    $("#fs-add-photo").addClass("hide");
    $("#fs_my_notation_Details").addClass("hide");


    sendAjaxNotData("get", "/space/messages", function (msg) {
        $("#my_space_messages").children(".fs-my-notation-list").empty();
        var messages = msg.messages;
        for (var i = 0; i < messages.length; i++) {
            var commentId = messages[i].id;//点评id
            var alias = messages[i].alias;//点评人别名
            var photo = messages[i].photo;//点评人头像
            var mtp = messages[i].type;//点评的是赞还是评论
            var create_time = messages[i].create_time;//点评时间
            var stp = messages[i].stp;//说说的类型
            var fid = messages[i].fid;//点评人id
            var content = messages[i].content;//说说内容
            var comment = messages[i].comment;//评论内容
            var sid = messages[i].sid;//说说id
            var messageHtml = "<div class=\"fsn-item fsn-up\" data-uid=" + fid + " data-mid=" + commentId + " data-sid=" + sid + " style=\"width: 100%; max-height: 300px\">\n" +
                "                        <div class=\"fsni-avater-wrapper\">\n" +
                "                            <img src=" + photo + " class=\"fsni-avatar\">\n" +
                "                        </div>\n" +
                "                        <div class=\"fsni-main-wrapper\" style=\"width: 249px;\">\n" +
                "                            <div class=\"fsni-main-line fsni-line1\">\n" +
                "                                <div class=\"fsni-alias\">" + alias + "</div>\n" +
                "                            </div>";

            if (messages[i].type == 0) {
                //评论
                messageHtml = messageHtml + "<div class=\"fsni-main-line fsni-line2\" style=\"overflow: hidden;height:25px;\">\n" +
                    "                                <div class=\"fsni-timetag\">" + comment + "</div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"fsni-main-line fsni-line3\" style=\"margin-bottom: 10px\">\n" +
                    "                                <div class=\"fsni-timetag\" style=\"margin-bottom: 10px\">" + create_time + "</div>\n" +
                    "                            </div>\n" +
                    "                        </div>";
            } else if (messages[i].type == 1) {
                //点赞

                messageHtml = messageHtml + "<div class=\"fsni-main-line fsni-line2\" style=\"overflow: hidden;height:25px;\">\n" +
                    "                                <div class=\"fsni-timetag\"><img class=\"good_cls\" src=\" images/good.png\"  style=\"height:25px;width:25px;cursor: pointer;\"></div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"fsni-main-line fsni-line3\" style=\"margin-bottom: 10px\">\n" +
                    "                                <div class=\"fsni-timetag\" style=\"margin-bottom: 10px\">" + create_time + "</div>\n" +
                    "                            </div>\n" +
                    "                        </div>";
            }

            if (messages[i].stp == 0) {
                //纯文本
                messageHtml = messageHtml + "<div class=\"my-space-messages-content\">\n" +
                    "                            <!-- 文字内容 -->\n" +
                    "                             <div class=\"text\">" + content + "</div>\n" +
                    "                        </div>";

            } else if (messages[i].stp == 1) {
                //图片
                messageHtml = messageHtml + "<div class=\"my-space-message-img\">\n" +
                    "                            <img src=\"https://cdn.mitures.com/headings/default/4.jpg?x-oss-process=image/format,webp\">\n" +
                    "                        </div>";

            }
            messageHtml = messageHtml + "</div>";
            $("#my_space_messages").children(".fs-my-notation-list").append(messageHtml);


            //查看说说详情
            $("#my_space_messages").children(".fs-my-notation-list").children(".fsn-up").unbind("click").click(function () {
                var sid = $(this).attr("data-sid");
                console.log(sid);

                $("#friend_space_container").addClass("hide");
                $("#fs_my_notation_container").addClass("hide");
                $("#my_space_messages").addClass("hide");
                $("#fs-add-photo").addClass("hide");
                $("#fs_my_notation_Details").removeClass("hide");
                var data = {"sid":sid};
                sendAjax("post", "/space/detail",data, function (msg) {
                    spaces($("#fs_my_notation_Details"),msg);
                });


            });

        }


    })

}

function sendText() {
    $("#friend_space_container").removeClass("hide");
    $("#fs_my_notation_container").addClass("hide");
    $("#my_space_messages").addClass("hide");
    $("#fs-add-photo").addClass("hide");
    $("#fs_my_notation_Details").addClass("hide");
    $("#fs-send-new-item-btn").attr("data-type", 0);
}

function sendImg() {
    $("#friend_space_container").removeClass("hide");
    $("#fs_my_notation_container").addClass("hide");
    $("#my_space_messages").addClass("hide");
    $("#fs_my_notation_Details").addClass("hide");
    $("#fs-add-photo").removeClass("hide");
    $("#fs-send-new-item-btn").attr("data-type", 1);
}

//朋友圈内容拼接
function spaces($obj,msg) {
    $($obj).children(".fs-my-notation-list").empty();
    var spaces = msg.spaces;
    for (var i = 0, j = spaces.length; i < j; i++) {
        var content = spaces[i].content;
        var sid = spaces[i].id;
        var type = spaces[i].type;
        var photo = spaces[i].photo;
        var names = spaces[i].names;
        var goodSrc = "images/good.png";
        var myName = $("#nickname-layout-span").text();
        if (names.indexOf(myName) >= 0) {
            goodSrc = "images/good_red.png";
        }
        var alias = spaces[i].alias;
        var fid = spaces[i].fid;
        var create_time = spaces[i].create_time;
        var comments = spaces[i].comments;
        var commentHtml = "";
        for (var z = 0, x = comments.length; z < x; z++) {
            commentHtml = commentHtml + "<p>" + comments[z].name + ":<span>" + comments[z].comment + "</span></p>";
        }

        var delSpaceImg = "";
        //判断是否是自己发的说说
        if($("#nickname-layout-span").attr("data-id")==fid){
             delSpaceImg = "<img src=\"images/icon_delete.png\" onclick=\"delSpace(this)\"  style=\"height:25px;width:25px;cursor: pointer;\">";
        }

        var html = "<div class=\"fsn-item fsn-up\" data-uid=" + fid + " data-sid=" + sid + " date-type=" + type + " style=\"width: 100%;\">\n" +
            "                        <div class=\"fsni-avater-wrapper\">\n" +
            "                            <img src=" + photo + " class=\"fsni-avatar\">\n" +
            "                        </div>\n" +
            "                        <div class=\"fsni-main-wrapper\">\n" +
            "                            <div class=\"fsni-main-line fsni-line1\">\n" +
            "                                <div class=\"fsni-alias\">" + alias + "</div>\n" +
            "                            </div>\n" +
            "                            <div class=\"fsni-main-line fsni-line2\" style=\"overflow: hidden;height:60px;\">\n" +
            "                                <div class=\"fsni-timetag\">" + content + "\n" +
            "                                </div>\n" +
            "                            </div>\n" +
            "                            <div class=\"fsni-main-line fsni-line3\">\n" +
            "                                <div class=\"fsni-timetag\">" + create_time + "</div>\n" +
            "                            </div>\n" +
            "                            <div class=\"fsni-main-line fsni-line4\">\n" +
            "                                <img class=\"good_cls\" src=" + goodSrc + "  style=\"height:25px;width:25px;cursor: pointer;\">\n" +
            "                                <img class=\"comment_cls\" src=\"images/comment.png\"  style=\"height:25px;width:25px;cursor: pointer;\">\n" +
            delSpaceImg+
            "                            </div>" +
            "                            <div style='margin-bottom: 10px;color: grey;border: 5px;'>\n" +
            "                                <div style=\"width: 100%;background-color: #e6e6e6;border-bottom: 5px;border-bottom: 1px #F5F5F5 solid;\">\n" +
            "                                    <span style=\"border-bottom: 5px\" id='sp" + sid + "'>" + names + "</span>\n" +
            "                                </div>" +
            "                               <div style=\"width: 100%;background-color: #e6e6e6\">\n" +
            "                                   " + commentHtml + "\n" +
            "                                </div>\n" +
            "                            </div>\n" +
            "                        </div>\n" +
            "                    </div>";

        $($obj).children(".fs-my-notation-list").append(html);
    }
}

function delSpace(obj) {
    var sid = $(obj).parent().parent().parent().attr("data-sid");
    var data = {"sid":sid};
    sendAjax("post","/space/delSpace",data,function (msg) {
       hint("删除成功");
       mySpace();
    });
}