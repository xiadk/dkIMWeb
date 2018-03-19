var MT = {

}
MT.menu = function () {
    this.initMenuNode();
    this.addMenuEvent();
};

MT.initMenuNode = function () {
    this.$menu = $('.menu');
    this.$menuList = $('.menu-list');
    this.$html = $('html');
    this.$menuItem = $('.menu-item');
    //    发起聊天
    this.$tabLayout = $('.tab-layout');
    this.$ccTabChoose = $('.cc-tab-choose');
    this.$ccTabItem = $('.cc-tab-item');
    this.$ccTlList = $('.cc-tl-list ');
    this.$ccSubmit = $('#cc-submit');
    this.$ccClose = $('#cc-close');
    this.$ccTlFriendList = $('#cc-tl-friend-list');
    this.$ccTlTeamList = $('#cc-tl-team-list');
    this.$ccTlList = $('.cc-tl-list');
    this.$srlClose = $( '#srl-close' );
    this.$searchResultListTab = $( '#search-result-list-tab' );
};

MT.addMenuEvent = function () {
    //菜单
    this.$menu.on('click', this.menuToggle.bind(this));
    this.$html.on('click', this.menuHide.bind(this));
    this.$menuItem.on('click', this.menuFunc.bind(this));

//发起聊天
    this.$ccTabItem.on('click', this.chatTabToggle.bind(this));
    this.$ccSubmit.on('click', this.ccSubmit.bind(this));
    this.$ccClose.on('click', this.ccClose.bind(this));
    this.$ccTlFriendList.delegate('.cc-tl-friend-item', 'click', this.selectChatMember.bind(this));
    // this.$ccTlFriendList.delegate('.cc-tl-item', 'click', this.selectChatMember);
    this.$ccTlTeamList.delegate('.cc-tl-team-item', 'click', this.selectChatTeam);
    this.$srlClose.on( "click", this.hideSearchResultTab.bind( this ) );
    this.$searchResultListTab.delegate( ".srl-item-add-btn", "click", this.showResultDetail.bind( this ) );
};

MT.selectChatMember = function (e) {
//    add class selected to circle
    var evt = e || window.event,
        $this = $(evt.target),
        $ele;
    if($this.hasClass('cc-tl-item')){
        $ele = $this.find('.cc-item-circle');
    }else {
        $ele = $this.parents('.cc-tl-item').find('.cc-item-circle');
    }
    // debugger
    // var $ele = $().find('.cc-item-circle');
    if($ele.hasClass('selected')){
        $ele.removeClass('selected');
    } else {
      $ele.addClass('selected');
    }
    this.hideCCSearchedList();
};

MT.selectChatTeam = function () {
    if($(this).find('.cc-item-circle').hasClass('selected')){
        return;
    }
    $('.cc-tl-team-item').find('.cc-item-circle').removeClass('selected');
    $(this).find('.cc-item-circle').addClass('selected');
};

MT.ccSubmit = function () {
    if (typeof DEBUG !== "undefined") {
        console.log("ccSubmit");
    }
    //判断是选人还是选群
    if($('.cc-tab-friend').hasClass('cur')){
    //    选人
        var items = this.$ccTlFriendList.find('.selected').parent('.cc-tl-friend-item'),
            len = items.length;
        if(len === 0){
            return
        } else if (len === 1){
            //单人 => 进入私聊会话
            this.goToSessionListTab();
            var id = items.data("account");
            if(this.checkSessionId('p2p-' + id)){
                $('.session-item[data-id$=' + id + ']').get(0).click();
            }else{
                var interId = setInterval(function () {
                    var $ele = $('.session-item[data-id$=' + id + ']');
                    if($ele.length > 0){
                        $ele.get(0).click();
                        clearInterval(interId);
                    }
                }, 10);
            }
        } else {
        //    多人 ： 创建高级群
            this.goToSessionListTab();
            var obj = {};
            obj.accounts = [];
            for(var i = 0; i < len; ++i) {
                obj.accounts.push($(items[i]).data('account'));
            }
            obj.callback = this.createTeamDone.bind(this);
            mysdk.createTeam(obj);
        }

    } else {
    //    选群
        this.goToSessionListTab();
        var id = this.$ccTlTeamList.find('.selected').parent('.cc-tl-team-item').data('id');
        if(this.checkSessionId(id)){
            $('.session-item[data-id$=' + id + ']').get(0).click();
        }else{
            var interId = setInterval(function () {
                var $ele = $('.session-item[data-id$=' + id + ']');
                if($ele.length > 0){
                    $ele.get(0).click();
                    clearInterval(interId);
                }
            }, 10);
        }

    }
    this.$tabLayout.hide();
    $('.cc-item-circle').removeClass('selected');
};

MT.ccClose = function () {
    if (typeof DEBUG !== "undefined") {
        console.log("ccClose");
    }
    this.$tabLayout.hide();
    $('.cc-item-circle').removeClass('selected');
};

MT.menuToggle = function () {
    this.$menuList.toggle();
};

MT.menuHide = function (e) {
    var evt = e || window.event,
        $ele = $(evt.target);
    if(!($ele.parent('.menu').length > 0 || $ele.hasClass('menu'))){
        this.$menuList.hide();
    }
//    hide infoBox
    if (typeof DEBUG !== "undefined") {
        console.log("hide", $ele.hasClass('j-img'));
    }
    // debugger
    if(!$ele.hasClass('j-img') && !$ele.hasClass('member-item')){
        this.$infoBox.addClass('hide');
    }else if($ele.attr("id") === "add-item" || $ele.attr("id") === "delete-member-item" || $ele.data("account") == userUID){
        this.$infoBox.addClass('hide');
    }
    if(!$ele.hasClass('setting-layout')){
        if(!this.$teamSettingMenu.hasClass('hide')){
            this.$teamSettingMenu.addClass('hide');
        }
        if(!this.$friendSettingMenu.hasClass('hide')){
            this.$friendSettingMenu.addClass('hide');
        }
    }
    // debugger
    if(!$ele.hasClass("add-comment-view") && $ele.parents('.add-comment-view').length === 0 && !$ele.hasClass('icon-comment') && !$ele.hasClass('add-comment-ipt') && !$ele.hasClass('fs-item-commen-text') && ( !$ele.hasClass( "alert-container" ) && $ele.parents( ".alert-container" ).length === 0 )){
        this.hideCommentArea();
    }else {
        // debugger
    }

    this.hideSearchedList();

    if($ele.hasClass('tb-usual-submit')){
        if (typeof DEBUG !== "undefined") {
            console.log("tb-usual-submit");
        }
        this.ui.hideAlert.call(this.ui, $ele);
    }

};
//main menu function case
MT.menuFunc = function (e) {
    var evt = e || window.event,
        $ele = $(evt.target);
    var id = $ele.data("id"),
        of = $ele.data("of");
    switch(id){
        case 0:
            // start chat
            $('#cc-tab-friend').click();
            this.ui.initStartChatFriendList();
            this.$tabLayout.show();
            break;
        case 1:
            //todo: desktop notification of
            if(of === "off"){
                if (typeof DEBUG !== "undefined") {
                    console.log("note-close");
                }
            //    关闭桌面通知
                this.deskTopNoteTip = false;
                this.ui.colseDeskTopNoteTip();
                $ele.data("of", "on");
            }else{
                //开启桌面通知
                if (typeof DEBUG !== "undefined") {
                    console.log("note-on");
                }
                this.deskTopNoteTip = true;
                this.ui.openDeskTopNoteTip();
                $ele.data("of", "off");
            }
            break;
        case 2:
            // sound of
            if(of === "off"){
                //关闭声音通知
                this.soundTip = false;
                this.ui.colseSoundTip();
                if (typeof DEBUG !== "undefined") {
                    console.log("sound-close");
                }
                $ele.data("of", "on");
            }else{
                //开启声音通知
                this.soundTip = true;
                this.ui.openSoundTip();
                if (typeof DEBUG !== "undefined") {
                    console.log("sound-on");
                }
                $ele.data("of", "off");
            }
            break;
        case 3:
            //quit
            this.signOut();
            break;
        case 4:
            // add friend
            if (typeof DEBUG !== "undefined") {
                console.log("add friend");
            }
            this.showSearchForFriendTab();
            break;
        default:
            break;

    }
};

MT.showSearchForFriendTab = function () {
    if (typeof DEBUG !== "undefined") {
        console.log("showAddfriendTab");
    }
    this.$searchPersonTab.removeClass('hide');

};

MT.hideSearchForFriendTab = function () {
    if(!this.$searchPersonTab.hasClass('hide')){
        this.$searchPersonTab.addClass('hide');
    }
    this.ui.clearSearchForFriendTab();
};

MT.hideNotFoudTab = function () {
    if(!$('#not-found-tab').hasClass('hide')) {
        $('#not-found-tab').addClass('hide');
    }
};



MT.showVerifyApplyFriendTab = function (e) {
    if (typeof DEBUG !== "undefined") {
        console.log("showVerifyApplyFriendTab");
    }
    var $ele = $(getEle(e)),
        // that = this,
        account = $ele.data("account");
    if(account === userUID){
        alert("您不能添加自己！");
    }else if(cache.isFriend(account)){
        alert("该账户已经是您的好友了！");
    }else {
         mysdk.getPersonMsg(account, this.ui.initVerifyApplyFriendTab.bind(this.ui));
    }
};

MT.applyFriendSubmit = function (e) {
    if (typeof DEBUG !== "undefined") {
        console.log("addFriendSubmit");
    }
    var evt = e || window.event,
        $ele = $(evt.target),
        account = $ele.data("account");
    if(account === userUID || cache.isFriend(account)){
        //todo: 发起聊天
           if(this.checkSessionId('p2p-' + account)){
               this.clickSessionItem("p2p-" + account);
            }else{
               this.clickSessionItem("p2p-" + account);
            }
        this.hideApplyFriendVerifyTab();
        this.hideSearchResultTab();
        $( "#session" ).click();
        this.scrollToSessionCur();
    }else {
        this.applyFriend(account);
    }


};

MT.beforeCloseWindow = function () {
    // debugger
    // alert("close");
    // delCookie('uid');
    // delCookie('sdktoken');
    // var a_n = window.event.screenX - window.screenLeft;
    // var a_b = a_n > document.documentElement.scrollWidth-20;
    // if (typeof DEBUG !== "undefined") {
    //     console.log("closeWindow", a_b, a_n);
    // }
    // if(a_b && window.event.clientY< 0 || window.event.altKey){
    //     alert('关闭页面行为');
    // }else{
    //     alert('跳转或者刷新页面行为');
    // }
    if( !readCookie( "uid" ) || !readCookie( "sdktoken" ) ){

    } else {
        delCookie( "uid" );
        delCookie( "sdktoken" );
        return null;
    }

    // if (typeof DEBUG !== "undefined") {
    //     console.log(123);
    // }
};

MT.hideSearchResultTab = function () {
    this.addHideClassTo( this.$searchResultListTab );
}

MT.showResultDetail = function ( e ) {
    let evt = e || window.event,
        $item = $( evt.target ),
        account = $item.parents( ".srl-item" ).data( "account" );
    mysdk.getPersonMsg( account, this.ui.initVerifyApplyFriendTab.bind( this.ui ) );
}

MT.signOut = async function () {
    let res;
    try {
        res = checkJSON( await this.sendSignOutRequest() );
    } catch ( e ) {
        if ( typeof DEBUG !== "undefined" ) {
            console.error( "sendSignOutRequestError", e );
        }
    }
    delCookie('uid');
    delCookie('sdktoken');
    window.location.href = '../../../../webroot/login.html';
};



module.exports = MT

































