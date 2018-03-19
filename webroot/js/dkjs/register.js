function subtn(){
    var password1 = $("#password1").val();
    var password2 = $("#password2").val();
    var name = $("#name").val().trim();
    var phone = $("#phone").val().trim();
    //验证参数
    var flag = verify(password1,password2,name,phone);

    if (flag=="true") {
        var data = {"name":name,"phone":phone,"password":password1};
        sendAjax ("post","/user/register",data,function (msg) {
            if (msg.msgId == REQUEST_EXIST) {
                $("#warn").text(msg.message);
            } else if (msg.msgId == SUCCESS) {
                alert("注册成功");
                window.location.href="login.html";
            }
        })
    } else {
        $("#warn").text(flag);
    }
}

function clearWarn() {
    $("#warn").text("");
}

function verify(password1,password2,name,phone) {
    var warn = "";
    var patt = /^\d{11}$/ig;
    if(name==""){
        warn="名称为空";
        return warn;
    }else if(phone==""){
        warn="电话号码为空";
        return warn;
    }else if(password1==""){
        warn="密码为空";
        return warn;
    }else if(password2==""){
        warn="请再一次输入密码";
        return warn;
    }else if(!patt.test(phone)){
       warn="请输入正确的电话号码";
       return warn;
    }else if(password1!=password2){
        warn="密码不一致";
        return warn;
    }else{
        return "true";
    }
}
