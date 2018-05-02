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
    sendAjaxNotData("post", "/space/getSpace", function (msg) {
        $(".fs-my-notation-list").empty();
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
            console.log(comments);
            var commentHtml = "";
            for(var z=0,x=comments.length;z<x;z++){
                commentHtml=commentHtml+"<p>"+comments[z].name+":<span>"+comments[z].comment+"</span></p>";
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
                "                            </div>" +
                "                            <div style='margin-bottom: 10px;color: grey;border: 5px;'>\n" +
                "                                <div style=\"width: 100%;background-color: #e6e6e6;border-bottom: 5px;border-bottom: 1px #F5F5F5 solid;\">\n" +
                "                                    <span style=\"border-bottom: 5px\" id='sp" + sid + "'>" + names + "</span>\n" +
                "                                </div>" +
                "                               <div style=\"width: 100%;background-color: #e6e6e6\">\n" +
                "                                   "+commentHtml+"\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                        </div>\n" +
                "                    </div>";

            $(".fs-my-notation-list").append(html);
        }

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
                    console.log(names.indexOf(myName) + ":" + names.indexOf(myName) + ":" + names.length - myName.length);
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
        $(".comment_cls").click(function () {
            $("#comment-person-tab").removeClass("hide");
            var sid = $(this).parents(".fsn-up").attr("data-sid");
             $("#comment-person-tab").attr("data-sid",sid);
            //关闭评论弹框
            $("#comment-close").click(function () {
                $("#comment-person-tab").addClass("hide");
            });

            //发表评论
             $("#comment-submit").unbind('click').click(function () {

                 var sid = $("#comment-person-tab").attr("data-sid");
                 var comment = $("#comment_content").val();
                 var data = {"sid":sid,"comment":comment};
                 sendAjax("post","/space/insertComment",data,function () {
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

}

function sendText() {
    $("#friend_space_container").removeClass("hide");
    $("#fs_my_notation_container").addClass("hide");
    $("#my_space_messages").addClass("hide");
    $("#fs-add-photo").addClass("hide");
    $("#fs-send-new-item-btn").attr("data-type", 0);
}

function sendImg() {
    $("#friend_space_container").removeClass("hide");
    $("#fs_my_notation_container").addClass("hide");
    $("#my_space_messages").addClass("hide");
    $("#fs-add-photo").removeClass("hide");
    $("#fs-send-new-item-btn").attr("data-type", 1);
}
