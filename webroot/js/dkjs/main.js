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
    $("#sp-submit").click(function () {
        $("#search-person-tab").hide();
        var data = {"condition":$("#tel-for-search").val()};
        sendAjax("get","/friend",data,function (msg) {
            $("#afv-close").show();
            $("#search-result-list-tab").show();
            var friends = msg.friends;
            getFriend(friends);
        });
    });
    $("#afv-close").click(function () {
        $("#apply-friend-verify-tab").hide();
    });
    $("#srl-close").click(function () {
        $("#search-result-list-tab").hide();
    });
    $("#afv-submit").click(function () {
        var fid = $("#afv-submit").attr("data-account");
        var token = readCookie("token");
        var message = new form(token,OPE_PERSONAL,fid,TYPE_ADD_FRIEND,"");
        wsSend(message);
        $("#apply-friend-verify-tab").hide();
        $("#usual-alert-tab").show();
    });
    $("#ua-submit").hide();
}


//切换打开和隐藏
function menuToggle($obj) {
    if ($obj.css("display") == "none") {
        $obj.css("display", "block");
    } else {
        $obj.css("display", "none");
    }

}

//获取添加好友列表
function getFriend($friends) {
    for(var i=0;i<$friends.length;i++) {
        var imgUrl = $friends[i].photo;
        var name = $friends[i].name;
        var phone = $friends[i].phone;
        var id = $friends[i].uid;
        $("#search-result-container").empty();
        $("#search-result-container").append("<div class='srl-item clear' data-account='" + id + "'><div class='srl-item-avatar'><img src='" + imgUrl + "' alt='"+name+"'></div><div class='srl-item-text-container'><div class='srl-item-nickname'>" + name + "</div><div class='srl-item-mtnum'>" + phone + "</div></div><div class='srl-item-add-btn'></div></div>")

    }
    $(".srl-item-add-btn").click(function () {
        $("#search-result-list-tab").hide();
        var photo = $(this).parent().children(".srl-item-avatar").children("img").attr("src");
        var name = $(this).parent().children(".srl-item-avatar").children("img").attr("alt");
        $("#apply-friend-verify-tab").find("img").attr("src",photo);
        $("#tb-name-user-name").html(name);
        var fid = $(this).parent().attr("data-account");
        $("#afv-submit").attr("data-account",fid);
        $("#apply-friend-verify-tab").show();
    });
}

$(".tab").click(function(event){
    $(".tab").removeClass("cur");
    $(".tab-view-container").addClass("hide");
    $(".chat--layout").addClass("hide");
    $(this).addClass("cur");
    var data_id_val = $(this).attr("data-id");
    $.each($(".tab-view-container"),function(i,n){
         var childVal = $(n).children().attr("data-id");
        if(data_id_val==childVal){
            $(n).removeClass("hide");
        }
    });
    $.each($(".chat--layout"),function(i,n){
         var chat_id = $(n).attr("data-id");
        if(data_id_val==chat_id){
            $(n).removeClass("hide");
        }
    });
});