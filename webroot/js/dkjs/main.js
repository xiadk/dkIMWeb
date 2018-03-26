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
            $("#search-result-list-tab").show();
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

function getFriend($friends) {
    for(var i=0;i<$friends.length;i++) {
        $("#search-result-container").append("<div class='srl-item clear' data-account='11'><div class='srl-item-avatar'><img src='https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=587180231,3004218230&fm=27&gp=0.jpg' alt='真善美'></div><div class='srl-item-text-container'><div class='srl-item-nickname'>真善美</div><div class='srl-item-mtnum'>mt_zsm</div></div><div class='srl-item-add-btn'></div></div>")

    }

}

$(".tab").click(function(event){
    var index=0;
    $.each($(".tab"),function(i,n){
        $(n).removeClass("cur");
        if($(this).attr("id") == $(n).attr("id")){
            index = i;
        }
    });

    $(this).addClass("cur");

    $.each($(".tab-view-container"),function(i,n){
        if(i==index){
            $(n).addClass("cur");
        }
        $(n).removeClass("cur");
    });


});