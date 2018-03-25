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
        var data = {"condition":$("#tel-for-search").val()};
        sendAjax("get","/friend",data,function (msg) {
            $("#afv-close").show();
            var friends = msg.friends;
            
            alert(friends[0].name);
        });
    });
}

//切换打开和隐藏
function menuToggle($obj) {
    if ($obj.css("display") == "none") {
        $obj.css("display", "block");
    } else {
        $obj.css("display", "none");
    }

}

function getFriend() {
    
}