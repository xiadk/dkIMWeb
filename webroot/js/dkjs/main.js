$(function () {
    $("#menuclear").on("click",function () {
        // $(".menu-list hide clear").show();
        console.log("sss");
        alert("ss");
    });
})

sendAjax ("get","/user",function (msg) {
   alert(msg);
   $("#avatar_img").attr("src",msg.photo);
   $("#nickname-layout-span").text(msg.name);

})
