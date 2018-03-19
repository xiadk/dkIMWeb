function login() {
    var phone = $("#phone").val().trim();
    var password = $("#password").val();
    var flag = verify(password,phone);
    //验证以后做

    var data = {"phone":phone,"password":password};
    sendAjax ("post","/login",data,function (msg) {
        if (PWD_ERROR == msg.msgId) {
            $("#failMes").text(msg.message);
        } else if (REQUEST_NOT_EXIST == msg.msgId){
            $("#failMes").text(msg.message);
        } else {
            setCookie(token,msg.token);
            window.location.href="main.html";
        }

    })
}

function verify(password,phone) {
    var warn = "";
    var patt = /^\d{11}$/ig;
    if(phone==""){
        warn="电话号码为空";
        return warn;
    }else if(password==""){
        warn="密码为空";
        return warn;
    }else if(!patt.test(phone)){
       warn="请输入正确的电话号码";
       return warn;
    }else{
        return "true";
    }
}