var Push = require("push.webroot.js");
var MT = {

}


MT.message = function () {
    this.initMessageNode();
    this.addMessageEvent();
    this.initEmoji();
    // this.team();
    // this.addressBook();
    this.historyLen = 20;
    this.fileSizeLimit = 1024 * 1024 * 20;//20MB
    this.msgLengthLimit = 500;//消息最大长度
};

MT.initMessageNode = function () {
    this.$send = $('#send');
    this.$fileForm = $('#uploadForm');
    // this.$to = $('#to');
    this.$chatContent = $('#chat-content');

    //session-tip-circle
    this.$sessionTipCircle = $('.fs-tip-session');
    //tabs

    this.$tab = $('.tab');
    this.$sessionTab = $('#session');
    this.$addressBookTab = $('#address-book');
    this.$friendSpaceTab = $('#friend-space');
    this.$findBackTab = $( '#find-back' );

    // this.$tabs = [ this.$sessionTab, this.$addressBookTab, this.$friendSpaceTab, this.$findBackTab ];

    this.$tabView = $('.tab-view');
    this.$sessionView = this.$sessionList = $('#session-list');
    this.$addressBookView = $('#address-book-list');
    this.$friendSapceView = $('#friend-space-view');
    this.$findBackView = $( '#find-back-view' );
    // this.$tabViews = [ this.$sessionView, this.$addressBookView, this.$friendSapceView, this.$findBackView ];

    this.$warppers = $('.chat--layout');
    this.$sessionWrapper = $('#chatting-area-wrapper');
    this.$addressBookWrapper = $('#address-book-wrapper');
    this.$chattingHistoryWrapper = $('#chatting-history-wrapper');
    this.$friendSpaceWrapper = $('#friend-space-wrapper');
    this.$findBackWrapper = $( "#find-back-wrapper" );
    // this.$wrappers = [ this.$sessionWrapper, this.$addressBookWrapper, this.$friendSpaceWrapper, this.$findBackWrapper ];// this.$chattingHistoryWrapper,
    this.ifShowChattingHistory = false;

    this.$sessionListlContainer = $('#session-list-container');
    this.$addressBookListlContainer = $('#address-book-list-container');
    this.$friendSpaceViewContainer = $('#friend-space-view-container');
    this.$findBackViewContainer = $( '#find-back-view-container' );


    //右边面板内容节点
    this.$rightPanel = $('#rightPanel');
    // this.$chatTitle = $('#chatTitle');
    // this.$chatTitle = $('#nick-name-layout');
    this.$devices = $("#devices");
    this.$nickName = $('#nick-name');
    this.$chooseFileBtn = $('#chooseFileBtn');
    this.$fileInput = $('#uploadFile');
    this.$cnt = $('.cnt');
    this.$myInfo = $('#myInfo');
    this.$infoBox = $('#info-box');
    // this.$sendText = $('#send-text');
    this.$messageText = $('#send-text');
    //    通知
    this.$audio = $('#tip-music');
    //    聊天记录
    this.$chtBack = $('.cht-back');
    this.$chattingHistoryContainer = $('.chatting-history-container');
    this.$chattingHistoryLayout = $('.chatting-history-layout');
    //    修改备注
    // this.$changeFriendAlias = $('.change-friend-alias');
    // this.$editTeamNameIpt = $('#edit-team-name-ipt');
//    文件上传进度
    this.$upSubmit = $('#up-submit');
    //合并转发消息
    this.$mergeMsgsTab = $('#merge-msgs-tab');
    this.$mmList = $('#mm-list');
    this.$mmClose = $('#mm-close');
};

MT.addMessageEvent = function () {
    this.$send.on('click', this.sendMessage.bind(this));
    this.$messageText.on('keydown', this.messageTextKeyDown.bind(this));
    this.$chooseFileBtn.on('click', this.chooseFile.bind(this));
    this.$fileInput.on('change', this.uploadFile.bind(this));
    this.$chatContent.delegate('.j-img','click',this.showInfoInChat.bind(this));
    this.$tab.on('click', this.changeTab.bind(this));
    this.$sessionList.delegate('.session-item', 'click', this.changeScene.bind(this));
//    聊天记录
    this.$chtBack.on('click', this.hideChattingHistory.bind(this));
    this.$upSubmit.on('click', this.hideUploadTab.bind(this));
    this.$chattingHistoryWrapper.delegate('#get-more', 'click', this.getMoreHistory.bind(this));
    //语音播发
    this.$chatContent.delegate('.j-mbox', 'click', this.playAudio);
    this.$chattingHistoryWrapper.delegate('.j-mbox', 'click', this.playAudio);
    //合并消息
    this.$chatContent.delegate('.cnt-merge', 'click', this.showMergeMsgs.bind(this));
    this.$chattingHistoryContainer.delegate('.cnt-merge', 'click', this.showMergeMsgs.bind(this));
    this.$mmClose.on('click', this.hideMergeMsgsTab.bind(this));
    //消息重发
    this.$chatContent.delegate('.j-resend', 'click', this.resendMsg.bind(this));
    //粘贴上传
    document.addEventListener( "paste", this.SendMsgPasteHandler.bind( this ) );
    //拖拽上传
    this.$messageText[0].addEventListener("drop", this.dropHandler.bind( this ), false);
};

MT.dropHandler = function ( e ) {
    e.preventDefault(); //取消默认浏览器拖拽效果
    if (typeof DEBUG !== "undefined") {
        console.log( "drop",e );
    }
    var that = this,
        scene = this.crtSessionType,
        to = this.crtSessionAccount,
        sessionId = scene + "-" + to;
    if ( !scene || !to ) {
        return;
    }
    if ( !e.dataTransfer ) {
        this.ui.showAlert( "您的浏览器不支持拖拽上传，请升级浏览器后再试！" );
        return false;
    }
    var fileList = e.dataTransfer.files; //获取文件对象
    //检测是否是拖拽文件到页面的操作
    if ( fileList.length == 0 ) {
        return false;
    }
    //检测文件是不是图片
    // if (fileList[0].type.indexOf('webroot.image') === -1) {
    //     alert("您拖的不是图片！");
    //     return false;
    // }
    fileList[0].value = Date.now() + fileList[0].name;
    this.fileHandler( fileList[0], sessionId );
    //拖拉图片到浏览器，可以实现预览功能
    // var img = window.webkitURL.createObjectURL(fileList[0]);
    // var filename = fileList[0].name; //图片名称
    // var filesize = Math.floor((fileList[0].size) / 1024);
    // var str = "![](" + img + ")<p>图片名称：" + filename + "</p><p>大小：" + filesize + "KB</p>";
    // this.ui.showAlert( str );
}
/**
 * 显示合并消息
*/
MT.showMergeMsgs = function ( e ) {
    var evt = e || window.event,
        $ele = $(evt.target),
        idClient = $ele.parents(".item").data("id");
    /**
     * show merge msgs wrapper
    */
    let msgs = cache.getMergeMsgByIdClient( idClient ),
        accounts = getAllAccount( msgs );
    this.checkUserInfo( accounts, this.showMergeMsgsTab.bind( this, idClient ) );
}

MT.showMergeMsgsTab = function ( idClient ) {
    var html = "";
    html = this.ui.initMergeMsgsTab( idClient );
    if ( !html ) {
        this.ui.showAlert( "数据异常，请稍候再试！" );
        return;
    }
    this.$mmList.html( html );
    this.$mergeMsgsTab.removeClass( 'hide' );
    $( '.mm-for-position' ).scrollTop( 0 ).scrollTop( 0 );
}

MT.hideMergeMsgsTab = function () {
    this.addHideClassTo( this.$mergeMsgsTab );
    this.$mmList.html( "" );
}

/**
 * 语音播放
 */
MT.playAudio = function() {
    if ( !!window.Audio ) {
        var node = $( this ),
            btn = $( this ).children( ".j-play" );
        node.addClass( "play" );
        setTimeout( function() {
            node.removeClass( "play" );
        }, parseInt( btn.attr( "data-dur" ) ) );
        new window.Audio( btn.attr( "data-src" ) + "?audioTrans&type=mp3" ).play();
    }else {
        alert( "您的浏览器不支持音频播放，为了更好地体验秘图网页版，建议您使用IE10、Chrome、FireFox、Safari、360等主流浏览器。" );
    }
};
/*************************************************************/
/******************** tab 切换逻辑 ***********************************/
/*************************************************************/
MT.addHideClassTo = function ( $ele ) {
    if ( !$ele.hasClass( 'hide' ) ) {
        $ele.addClass( 'hide' );
    }
};

MT.addClassTo = function ( className, $ele ) {
    if( !$ele.hasClass( className ) ) {
        $ele.addClass( className );
    }
};

MT.showSessionTab = function () {
    if( this.$sessionTab.hasClass( "cur" ) ){
        return;
    }
    //去除session tip红点
    this.addHideClassTo( this.$sessionTipCircle );
    //tab toggle
    this.$tab.removeClass( 'cur' );
    this.$sessionTab.addClass( 'cur' );
    //view toggle
    this.$sessionListlContainer.removeClass( 'hide' );
    this.addHideClassTo( this.$addressBookListlContainer );
    this.addHideClassTo( this.$friendSpaceViewContainer );
    this.addHideClassTo( this.$findBackViewContainer );

    this.scrollToSessionCur();
    //wrapper toggle
    this.addHideClassTo( this.$addressBookWrapper );
    this.addHideClassTo( this.$friendSpaceWrapper );
    this.addHideClassTo( this.$findBackWrapper );
    this.$sessionWrapper.removeClass( 'hide' );
    // Ps.initialize($('.tab-view-container').get(0));
    if( this.ifShowChattingHistory ){
    //    show chattiong history wrapper
        this.$chattingHistoryWrapper.removeClass( 'hide' );
    }else {
        this.addHideClassTo( this.$chattingHistoryWrapper );
    }
};


MT.showAddressBookTab = function () {
    if ( this.$addressBookTab.hasClass( 'cur' ) ) {
        return;
    }
    //tab toggle
    this.$tab.removeClass('cur');
    this.$addressBookTab.addClass('cur');

    //view toggle
    this.$addressBookListlContainer.removeClass('hide');
    this.addHideClassTo(this.$sessionListlContainer);
    this.addHideClassTo(this.$friendSpaceViewContainer);
    this.addHideClassTo(this.$findBackViewContainer);
    // Ps.initialize($('.tab-view-container').get(0));
    // this.scrollToTop();
    this.scrollToABCur();
    //wrapper toggle
    this.addHideClassTo(this.$sessionWrapper);
    this.addHideClassTo(this.$friendSpaceWrapper);
    this.addHideClassTo(this.$chattingHistoryWrapper);
    this.addHideClassTo(this.$findBackWrapper);
    this.$addressBookWrapper.removeClass('hide');
};

MT.showFriendSpaceTab = function () {
    if( this.$friendSpaceTab.hasClass( 'cur' ) ){
        return;
    }
    //tab toggle
    this.$tab.removeClass('cur');
    this.$friendSpaceTab.addClass('cur');

    //view toggle
    this.$friendSpaceViewContainer.removeClass( 'hide' );
    this.addHideClassTo( this.$sessionListlContainer );
    this.addHideClassTo( this.$addressBookListlContainer );
    this.addHideClassTo( this.$findBackViewContainer );
    this.scrollToTop();
    //wrapper toggle
    this.addHideClassTo( this.$sessionWrapper );
    this.addHideClassTo( this.$addressBookWrapper );
    this.addHideClassTo( this.$chattingHistoryWrapper );
    this.addHideClassTo( this.$findBackWrapper );
    this.$friendSpaceWrapper.removeClass( 'hide' );
    // Ps.initialize($('.tab-view-container').get(0));
//    click mySpace
    if( !$( '.fs-tb-item' ).hasClass( 'cur' ) ) {
        $( '#fs-my-space' ).get( 0 ).click();
    }
};

MT.checkIfShowFindBackTab = async function () {
    this.getGaodeScript();
    if ( this.$findBackTab.hasClass( 'cur' ) ) {
        return;
    }
    let res;
    try {
        res = await this.getSafeOpenStatus();
    } catch ( e ) {
        if ( typeof DEBUG !== "undefined" ) {
            console.error( "getSafeOpenStatusError: ", e );
        }
        if ( e !== "timeout" ) {
            this.ui.showAlert( "请求失败，请稍候再试！" );
        }
        return;
    }
    let data = checkJSON( res );
    if ( !data || !!data && !data.msgId ) {
        this.ui.showAlert( "服务器正忙，请稍后再试！" );
        return;
    }
    if ( data.msgId === "0200" ) {
        //isVip & open
        this.isVip = true;
        this.showFindBackTab();
    } else if ( data.msgId === "0414" ) {
        //isVip & not open
        this.isVip = true;
        this.ui.showAlert( "请先在app中开启手机找回功能再试！" );
    } else if ( data.msgId === "1503" ) {
        //no vip
        this.isVip = false;
        this.ui.showAlert( "您不是会员，无法使用手机找回功能！" );
    } else {
        //other msgId
        this.ui.showAlert( "请求失败，请稍后再试！" );
    }

};

MT.showFindBackTab = function () {
    if(this.$findBackTab.hasClass('cur')){
        return;
    }
    //tab toggle
    this.$tab.removeClass('cur');
    this.$findBackTab.addClass('cur');

    //view toggle
    this.$findBackViewContainer.removeClass('hide');
    this.addHideClassTo(this.$sessionListlContainer);
    this.addHideClassTo(this.$addressBookListlContainer);
    this.addHideClassTo( this.$friendSpaceViewContainer );
    this.scrollToTop();
    //wrapper toggle

    this.addHideClassTo(this.$sessionWrapper);
    this.addHideClassTo(this.$addressBookWrapper);
    this.addHideClassTo(this.$chattingHistoryWrapper);
    this.addHideClassTo(this.$friendSpaceWrapper);
    this.$findBackWrapper.removeClass('hide');
    // Ps.initialize($('.tab-view-container').get(0));
//    click mySpace
    this.refreshLocation();
};

MT.showChattingHistoryWrapper = function () {
    this.ifShowChattingHistory = true;
    this.$chattingHistoryWrapper.removeClass('hide');
};

MT.hideChattingHistoryWrapper = function () {
    this.ifShowChattingHistory = false;
    this.addHideClassTo(this.$chattingHistoryWrapper);
    $( '#get-more' ).removeClass( "clicked" );
};

MT.scrollToTop = function () {
    $('.tab-view-container').scrollTop("0");
};


/*************************************************************/
/*************************************************************/
/*************************************************************/

MT.hideUploadTab = function () {
    this.ui.hideUploadPercentage();
};

MT.hideChattingHistory = function () {
    this.hideChattingHistoryWrapper();
};

MT.showChattingHistory = function ( sce, t ) {
    var scene, to;
    if( !sce || !t ){
        var sessionId = $( '.session-item.cur' ).data( 'id' ),
            arr = sessionId.split( '-' );
        scene = arr[ 0 ];
        to = arr[ 1 ];
    }else {
        scene = sce;
        to = t;
    }
    //如果此时群成员列表处于显示状态，隐藏群成员列表
    if ( this.$teamMemberLayout.hasClass( 'an1' ) ) {
        this.ui.hideMembers();
    }
    var that = this,
        id = scene + '-' + to,
        msgs = this.cache.findHistoryMsg( id );
    // if ( !msgs ) {//无缓存
    //always get lastest data from server
    this.cache.clearHistoryMsgs( id );
    mysdk.nim.getHistoryMsgs( {
        scene: scene,
        to: to,
        limit: that.historyLen,
        done: that.getHistoryMsgsDone.bind( that )
    } );
    // } else {//有缓存
    //     var array = getAllAccount( msgs );
    // //    显示 消息
    //      this.checkUserInfo( array, function () {
    //         that.doChatHistoryUI( id );
    //     } );
    // }

};

//加载更多
MT.getMoreHistory = function ( e ) {
    var evt = e || window.event,
        $ele = $(evt.target),
        sessionId = $( '.session-item.cur' ).data( 'id' ),
        arr = sessionId.split( '-' ),
        that = this;
    var scene = arr[ 0 ],
        to = arr[ 1 ];
    var msgs = cache.findHistoryMsg( sessionId );
    if( !msgs ){//一条消息都没有
        this.ui.showAlert( "没有更多消息了！" );
        return;
    }
    var lastMsgId = msgs[ 0 ].idClient,
        endTime = msgs[ 0 ].time;
    mysdk.nim.getHistoryMsgs( {
        scene: scene,
        to: to,
        endTime: endTime,
        reverse: false,
        // lastMsgId: lastMsgId,
        limit: that.historyLen,
        done: that.getMoreHistoryMsgsDone.bind( that )
    } );
};

MT.showChattingHistoryWithFriend = function (e) {
    var evt = e || window.event,
        $ele = $(evt.target),
        sessionId = $ele.data('id'),
        arr = sessionId.split('-'),
        scene = arr[0],
        to = arr[1];
    this.showChattingHistory(scene, to);
};

MT.getMoreHistoryMsgsDone = function (error, data) {
    if ( typeof DEBUG !== "undefined" ) {
        console.error( 'getMoreHistoryMsgsDone' + ( !error ? '成功' : '失败' ), error, data );
    }
    if ( !error ) {
    //    填充 cache
        if ( data.msgs.length === 0 ) {
            this.ui.showAlert( "没有更多消息了！" );
            return;
        }
        cache.addHistoryMsgsByReverse( data.msgs );
        var id = data.scene + '-' + data.to;
        var array = getAllAccount( data.msgs );
    //    显示 消息
        var that = this;
        this.checkUserInfo( array, function () {
            that.doChatHistoryUI( id, true );
            $( '#get-more' ).addClass( "clicked" );
        } );
    }
};

MT.getHistoryMsgsDone = function ( error, data ) {
    if ( typeof DEBUG !== "undefined" ) {
        console.log( 'getHistoryMsgsDone' + ( !error ? '成功' : '失败' ), error, data );
    }
    if ( !error ) {
        cache.addHistoryMsgsByReverse( data.msgs );
        var id = data.scene + '-' + data.to;
        var array = getAllAccount( data.msgs );
    //    显示 消息
        var that = this;
        this.checkUserInfo( array, function () {
            that.doChatHistoryUI( id );
        } );
    }

};

MT.chatTabToggle = function ( e ) {
    var evt = e || window.event,
        $ele = $( evt.target );
    if ( $ele.hasClass( 'cur' ) ) {
        return false;
    }
    this.$ccTlList.toggle();
    this.$ccTabItem.removeClass( 'cur' );
    $ele.addClass( 'cur' );
    if ( $ele.hasClass( 'cc-tab-friend' ) ) {
        this.ui.initStartChatFriendList();
    } else {
        this.ui.initStartChatTeamList();
    }
    this.hideCCSearchedList();
    return false;
};

MT.goToSessionListTab = function () {
    $( '#session' ).get( 0 ).click();
};

MT.createTeamDone = function ( err, obj ) {
    console.log( '创建' + obj.team.type + '群' + ( !err ? '成功' : '失败' ), obj );
    if ( !err ) {
        this.onCreateTeam( obj );
    }
};

MT.onCreateTeam = function ( obj ) {
    var data = {};
    data.teamId = obj.team.teamId;
    data.name = "群聊" + obj.team.teamId;
    data.done = this.updateTeamDone.bind( this );
    mysdk.updateTeam( data );
};

MT.updateTeamDone = function ( err, obj ) {
    if ( typeof DEBUG !== "undefined" ) {
        console.log( '更新群' + ( !err ? '成功' : '失败' ), err, obj );
    }
    if ( !err ) {
        var id = "team-" + obj.teamId;
        if ( this.checkSessionId( id ) ) {
            var interId = setInterval( function () {
                var $ele = $( '.session-item[data-id$=' + id + ']' );
                if ( $ele.length > 0 ) {
                    $ele.get( 0 ).click();
                    clearInterval( interId );
                }
            }, 10 );
        } else {
            var interId = setInterval( function () {
                var $ele = $( '.session-item[data-id$=' + id + ']' );
                if( $ele.length > 0 ) {
                    $ele.get( 0 ).click();
                    clearInterval( interId );
                }
            }, 10 );
        }
    }
};


//session and addressBook change
//07/21 change logic  here for more tabs
MT.changeTab = function ( e ) {
    var evt = e || window.event,
        $ele = $( evt.target ),
        $tv = this.$tabView,
        id = $ele.data( "id" );
    // debugger
    if( id === "session" ) {
        this.showSessionTab();
    } else if( id === "address-book" ) {
        this.showAddressBookTab();
    } else if( id === "friend-space" ) {
        this.showFriendSpaceTab();
    } else if ( id === "find-back" ) {
        this.checkIfShowFindBackTab();
    } else {

    }
};

MT.changeScene = function ( e ) {
    var evt = e || window.event,
        $ele = $( evt.target ),
        account,
        scene;
    if( $ele.hasClass( 'cur' ) || $ele.parent( '.session-item' ).hasClass( 'cur' ) ) {
        return;
    }
    this.ui.hideMembers();
    this.hideChattingHistory();
    this.$sessionList.find( '.session-item' ).removeClass( 'cur' );
    if ( $ele.hasClass( 'session-item' ) ) {
        $ele.addClass( 'cur' );
    } else {
        $ele.parent( '.session-item' ).addClass( 'cur' );
    }
    account = this.$sessionList.find( '.cur' ).data( "account" );
    scene = this.$sessionList.find( '.cur' ).data( "scene" );
    //check valid team map
    // this.checkValidTeamMap(scene + '-' + account);
    if ( this.$sessionList.find( '.cur' ).data( 'unread' ) != 0 ) {//未读数不为0时刷新未读数
        this.$sessionList.find( '.cur' ).data( 'unread', "0" ).find( '.unread' ).html( "0" ).hide();
        mysdk.nim.resetSessionUnread( scene + '-' + account );
    }
    //change scene get account & scene
    this.openChatBox( account, scene );
};

MT.clickSessionItem = function ( sessionId ) {
    var interId = setInterval( function () {
        if( !!cache.findSession( sessionId ) ){
            var $ele = $( '.session-item[data-id$=' + sessionId + ']' );
                    if( $ele.length > 0 ) {
                        $ele.get( 0 ).click();
                        clearInterval( interId );
                    }
        }else {
            clearInterval( interId );
        }
    }, 10 );
};

// 从聊天面板头像点进去显示好友资料卡
MT.showInfoInChat = function( e ) {
    //todo: show nickInTeam ?
    var evt = e || window.event,
        $ele = $( evt.target ),
        x,
        y;
    if ( $ele.attr( "id" ) === "add-item" || $ele.attr( "id" ) === "delete-member-item" ) {
        return;
    }
    x = evt.clientX - $ele.offsetParent().offset().left;
    y = evt.clientY - $ele.offsetParent().offset().top;
    var account = $ele.attr( 'data-account' ),
        user = cache.getPersonById( account ), type;
    if ( account == userUID ) {//点击自己的头像
        //hide infoInChat
        //do this in clickHandler of html => this.menuHide
        return
    }
    let that = this;
    this.checkUserInfo( [ account ], function() {
        that.showInfoBox( { account }, x, y );
    } );
    // var msg = this.getInfo( user, type, x, y );
    // if ( msg ) {
    //     this.showInfoBox( msg, x, y );
    // }
};
MT.hideInfoBox = function () {
    this.$personCard.addClass( 'hide' );
    this.$mask.addClass( 'hide' );
    this.$personCard.removeClass( 'notFriend' );
    this.$personCard.removeClass( 'blacklist' );
    this.$personCard.find( ".mutelist .u-switch" ).removeClass( 'off' );
    this.$personCard.find( ".blacklist .u-switch" ).removeClass( 'off' );
};
// MT.showMyInfo = function () {
//     var user = mysdk.getUserById( userUID );
//     var $node = this.$myInfo.data({info:user});
//     $node.find(".u-icon").attr('src', getAvatar(user.avatar));
//     $node.find(".j-nick").text(user.nick);
//     $node.find(".j-nickname").text(user.nick);
//     var avatarSrc = "";
//     if(user.gender&&user.gender!=="unknown"){
//         avatarSrc = 'images/'+user.gender+'.png';
//         $node.find(".j-gender").removeClass("hide");
//     }else{
//         $node.find(".j-gender").addClass("hide");
//     }
//     $node.find(".j-gender").attr('src',avatarSrc);
//     $node.find(".j-username").text("帐号："+user.account);
//     $node.find(".j-birth").text(user.birth ===undefined?"--":user.birth||"--");
//     $node.find(".j-tel").text(user.tel ===undefined?"--":user.tel||"--");
//     $node.find(".j-email").text(user.email ===undefined?"--":user.email||"--");
//     $node.find(".j-sign").text(user.sign ===undefined?"--":user.sign||"--");
//     $node.removeClass('hide');
//     this.$mask.removeClass('hide');
// };

/*************************************************************************
 * 发送消息逻辑
 *
 ************************************************************************/
MT.SendMsgPasteHandler = function ( evt ) {
    if ( !document.activeElement ) {
        alert( "您的浏览器不支持粘贴上传，为了更好地体验秘图网页版，建议您使用IE10、Chrome、FireFox、Safari、360等主流浏览器。" );
    }
    if ( document.activeElement.id !== "send-text" ) {
        //输入面板未获得焦点
        return;
    }
    var e = evt || window.event,
        cbd = e.clipboardData;
    var ua = window.navigator.userAgent;

    // 如果是 Safari 直接 return
    if ( !(e.clipboardData && e.clipboardData.items) ) {
        return;
    }

    // Mac平台下Chrome49版本以下 复制Finder中的文件的Bug Hack掉
    if ( cbd.items && cbd.items.length === 2 && cbd.items[0].kind === "string" && cbd.items[1].kind === "file" &&
        cbd.types && cbd.types.length === 2 && cbd.types[0] === "text/plain" && cbd.types[1] === "Files" &&
        ua.match(/Macintosh/i) && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49 ) {
        return;
    }
    var that = this,
        scene = this.crtSessionType,
        to = this.crtSessionAccount,
        sessionId = scene + "-" + to;
    if( !scene ) {
        this.$chatContent.scrollTop( 99999 );
        // self: 表单重置 => 可用来重置input[ type = 'file'];
        $( '#uploadForm' ).get( 0 ).reset();
        return;
    }

    for( var i = 0; i < cbd.items.length; i++ ) {
        var item = cbd.items[ i ];
        if ( item.kind == "file" ) {
            var blob = item.getAsFile();
            blob.value = Date.now() + blob.name;
            this.fileHandler( blob, sessionId );
            // blob 就是从剪切板获得的文件 可以进行上传或其他操作
        }
    }
};

MT.fileHandler = function ( file, sessionId ) {
    if ( typeof DEBUG !== "undefined" ) {
        console.log( "fileHandler", file );
    }
    if ( this.uploadingSessionIds[ sessionId ] ) {
        this.ui.showAlert( "一次只能发送一个文件！" );
        return;
    }
    var arr = sessionId.split( "-" ),
        scene = arr[ 0 ],
        to = arr[ 1 ];
    if ( !scene || !to ) {
        return;
    }
    var fileSize = file.size;
    if (fileSize == 0) {
        this.ui.showAlert( "不能传空文件" );
        return
    } else if ( fileSize > this.fileSizeLimit ) {
        this.ui.showAlert( "文件体积过大，请压缩后再上传！" );
        return;
    }
    this.$messageText.blur();
    this.uploadingSessionIds[ sessionId ] = true;
    try {
        ///todo: check is friend & team valid
        let callback = this.sendFileMsgDone.bind( this );
        callback.isLocal = false;
        if ( scene === "team" ) {
            if ( !cache.isTeamValid( to ) ) {
                delete this.uploadingSessionIds[ sessionId ];
                this.ui.showAlert( "没有权限，无法发送！" );
                $('#uploadForm').get(0).reset();
                return;
            }
        } else if ( scene === "p2p" ) {
            //to: { Number }; userUID: { String }
            // 不是好友或自己的手机，不发送消息
            if ( !cache.isFriend( to ) && ( to + "" !== userUID ) ) {
                delete this.uploadingSessionIds[ sessionId ];
                this.ui.showAlert( "发送失败，请先加为好友！" );
                $( '#uploadForm' ).get( 0 ).reset();
                return;
            }
            //*黑名单限制
            //当自己在别人的黑名单中时,消息发送会被云信限制失败
            //考虑发送失败时，做出提示
            //当对方在自己的黑名单时，发送消息，提示用户先从将收不到对方的消息
            // if ( cache.isInBlacklist( to ) ) {
            //     this.ui.showAlert( "他是您的黑名单好友，您将接受不到他的消息哦" );
            // }
        }
        mysdk.sendFileMessage(scene, to, file, callback );
    } catch ( e ) {
        if (typeof DEBUG !== "undefined") {
            console.log( "fileHandler:sendFileMessageError", e );
        }
        delete this.uploadingSessionIds[ sessionId ];
    }

}

MT.uploadFile = function () {
    var that = this,
        scene = this.crtSessionType,
        to = this.crtSessionAccount,
        sessionId = scene + "-" + to,
        fileInput = this.$fileInput.get( 0 );
    if ( !scene ) {
        this.$chatContent.scrollTop( 99999 );
        // self: 表单重置 => 可用来重置input[ type = 'file'];
        $( '#uploadForm' ).get( 0 ).reset();
        return;
    }
    if ( !fileInput.files[ 0 ] ) {
        return;
    }
    fileInput.files[ 0 ].value = Date.now() + fileInput.files[ 0 ].name;
    this.fileHandler( fileInput.files[ 0 ], sessionId );
    //todo: 文件压缩
    // console.log(fileInput);
//         var b = new Blob(fileInput.files),
//             name = fileInput.value;
//         console.log(b);
//         var zip = new JSZip();
//         zip.file(b, "1\n");
//         zip.generateAsync({type:"blob"}).then(function(content) {
//             // see FileSaver.webroot.js
//             console.log(content);
//             mysdk.sendFileMessage(scene, to, content, that.sendMsgDone.bind(that), name)
// //            saveAs(content, "example.zip");
//         });
};

MT.resendMsg = function ( evt ) {
    var $node
    if ( evt.target.tagName.toLowerCase() === 'span' ) {
        $node = $( evt.target );
    } else {
        $node = $( evt.target.parentNode );
    }
    var sessionId = $node.data( "session" );
    var idClient = $node.data( "id" );
    var msg = this.cache.findMsg( sessionId, idClient ),
        arr = sessionId.split( "-" ),
        scene = arr[ 0 ],
        account = arr[ 1 ];
    //无效的群聊或因为自己在对方的黑名单中 不重发
    if ( scene === "team" ) {
        if ( !cache.isTeamValid( account ) ) {
            return;
        }
    } else if ( scene === "p2p" ) {
        //自己被对方拉入黑名单 => 会刷新 无用
        // if ( cache.isInOthersBlacklist( account + "" ) ) {
        //     return;
        // }
    }
    this.mysdk.resendMsg( msg, function ( err, data ) {
        if ( err ) {
            alert( err.message || '发送失败' );
        } else {
            this.cache.setMsg( sessionId, idClient, data );
            var msgHtml = this.ui.buildChatContentUI( sessionId, this.cache );
            this.$chatContent.html( msgHtml ).scrollTop( 99999 );
            $( '#uploadForm' ).get( 0 ).reset();
        }
    }.bind( this ) );
}

MT.sendMessage = function () {
    var $session = $( '.session-item.cur' ),
        to = $session.data( 'account' ),
        scene = $session.data( 'scene' ),
        text = this.$messageText.val(),
        that = this;
    if ( !!to ) {
        if ( text.length > this.msgLengthLimit ) {
            this.ui.showAlert( '消息长度最大为' + this.msgLengthLimit + '字符' );
        } else if ( text.length === 0 ) {
            return;
        } else {
            //非好友或无效的群，不发送消息;
            if ( scene === "team" ) {
                if ( !cache.isTeamValid( to ) ) {
                    this.sendFailLocalMessage( scene, to, text );
                    this.ui.showAlert( "没有权限，无法发送！" );
                    this.$messageText.val( "" );
                    $( '#uploadForm' ).get( 0 ).reset();
                    return;
                }
            } else if ( scene === "p2p" ) {
                //to: { Number }; userUID: { String }
                // 不是好友或自己的手机，不发送消息
                if ( !cache.isFriend( to ) && ( to + "" !== userUID ) ) {
                    this.sendFailLocalMessage( scene, to, text );
                    this.ui.showAlert( "发送失败，请先加为好友！" );
                    this.$messageText.val( "" );
                    $( '#uploadForm' ).get( 0 ).reset();
                    return;
                }
                //*黑名单限制
                //当自己在别人的黑名单中时,消息发送会被云信限制失败
                //考虑发送失败时，做出提示
                //当对方在自己的黑名单时，发送消息，提示用户先从将收不到对方的消息
                if ( cache.isInBlacklist( to ) ) {
                    this.ui.showAlert( "他是您的黑名单好友，您将接受不到他的消息哦" );
                }
            }
            //send custom data for ios & android sys tip
            var custom = {};
            custom.pushContent = getUserData( cache.getPersonById( userUID ) ).name + ":" + text;
            custom = JSON.stringify( custom );
            window.mysdk.sendTextMessage( {
                scene: scene || 'p2p',
                to: to,
                text: text,
                custom: custom,
                isLocal: false,
                isHistoryable: true,
                isRoamingable: true,
                isSyncable: true,
                done: that.sendMsgDone.bind( that )
            } );
        }
    }
};

MT.sendFailLocalMessage = function ( scene, to, text ) {
    let that = this;
    window.mysdk.sendTextMessage( {
        scene: scene || 'p2p',
        to: to,
        text: text,
        isLocal: true,
        isSyncable: true,
        done: that.sendFailLocalMessageDone.bind( that, scene + "-" + to )
    } );
};

MT.sendFailLocalMessageDone = function ( sessionId, err, msg ) {
    // delete this.uploadingSessionIds[ sessionId ];
    if ( !err ) {
        msg.status = "fail";
        cache.addMsgs( msg );
        this.$messageText.val( "" );
        //刷新最近会话
        var msgHtml = this.ui.updateChatContentUI( msg, cache );
        this.$chatContent.append( msgHtml ).scrollTop( 99999 );
        //todo: lg webroot.image,however can't rotate webroot.image
        // $('.bubble-webroot.image-wrapper').parent().lightGallery();
        //self: 表单重置 => 可用来重置input[ type = 'file'];
        $( '#uploadForm' ).get( 0 ).reset();
        this.ui.upSessionItem( msg.sessionId );
    }
}


MT.sendMsgDone = function ( error, msg ) {
    if ( typeof DEBUG !== "undefined" ) {
        console.log( "sendMsgDone: ", error, msg );
    }
    if ( error ) {
        if ( error.code === 7101 ) {
            cache.addOthersBlacklist( msg.to + "" );
            this.ui.showAlert( "消息发送成功，但被对方拒收！" );
        }
    }
    cache.addMsgs( msg );
    this.$messageText.val( "" );
    //    todo: 刷新最近会话
    var msgHtml = this.ui.updateChatContentUI( msg, cache );
    this.$chatContent.append( msgHtml ).scrollTop( 99999 );
    //todo: lg webroot.image,however can't rotate webroot.image
    // $('.bubble-webroot.image-wrapper').parent().lightGallery();
    //self: 表单重置 => 可用来重置input[ type = 'file'];
    $( '#uploadForm' ).get( 0 ).reset();
    this.ui.upSessionItem( msg.sessionId );
};

//if send file, don't clear textarea
MT.sendFileMsgDone = function ( error, msg ) {
    if ( typeof DEBUG !== "undefined" ) {
        console.log( "sendMsgDone", error, msg );
    }
    if ( error ) {
        if ( error.code === 7101 ) {
            cache.addOthersBlacklist( msg.to + "" );
            this.ui.showAlert( "消息发送成功，但被对方拒收！" );
        }
    }
    cache.addMsgs( msg );
    //    todo: 刷新最近会话
    var msgHtml = this.ui.updateChatContentUI( msg, cache );
    this.$chatContent.append( msgHtml ).scrollTop( 99999 );
    //todo: lg webroot.image,however can't rotate webroot.image
    // $('.bubble-webroot.image-wrapper').parent().lightGallery();
    //self: 表单重置 => 可用来重置input[ type = 'file'];
    $( '#uploadForm' ).get( 0 ).reset();
    this.ui.upSessionItem( msg.sessionId );
};

MT.doMsg = function (msg) {
    //如果缓存中存在这条消息 不做处理
    // if(!cache.findMsg(msg.sessionId, msg.idClient)){
    //     return;
    // }
    //用户在浏览其他tab时，收到消息显示红点
    if( !this.$sessionTab.hasClass( 'cur' ) ){
        this.$sessionTipCircle.removeClass('hide');
    }
    var that = this,
        who = msg.to === userUID ? msg.from : msg.to,
        updateContentUI = function () {
        //如果当前消息对象的会话面板打开
            if ( that.crtSessionAccount == who ) {
                //todo: self: 发送已读回执
                that.sendMsgRead( who, msg.scene );
                //更新聊天界面
                var msgHtml = that.ui.updateChatContentUI( msg, cache );
                that.$chatContent.find( '.no-msg' ).remove();
                that.$chatContent.append( msgHtml ).scrollTop( 99999 );
                //todo: lg webroot.image,however can't rotate webroot.image
                // $('.bubble-webroot.image-wrapper').parent().lightGallery();
            } else {
            //    刷新未读提示
               that.ui.updateUnread( msg.sessionId );
               that.ui.upSessionItemById( msg.sessionId );
            }
            //如果此时桌面处于未激活状态显示桌面通知
            if( document[ that.hiddenProperty ] && msg.from !== userUID ) {
                //桌面通知
                that.showDeskTopNote( msg );
                //声音提示
                if ( that.soundTip ) {
                    //    发声
                    that.$audio.get( 0 ).play();
                } else {
                    //    噤声
                }
            }
        };
        //非群通知消息处理
        if ( /text|image|file|audio|video|geo|custom|tip/i.test( msg.type ) ) {
            if ( typeof DEBUG !== "undefined" ) {
                console.log( "addMsg::非通知消息", msg );
            }
            cache.addMsgs( msg );
            var account = ( msg.scene === "p2p" ? who : msg.from );
            //用户信息本地没有缓存，需存储
            if ( !cache.getPersonById( account ) ) {
                // debugger
                mysdk.getUser( account, function ( err, data ) {
                    if ( !err ) {
                        cache.updatePersonlist( data );
                        updateContentUI();
                    }
                } )
            } else {
                // this.buildSessions();
                //如果有  返回该会话 入如果没有 新建一个
                //然后 置顶那个会话
                //我这里是直接根据会话列表刷新了一边会话
                this.checkSessionId( msg.sessionId );
                updateContentUI();
            }
        } else {
            // 群消息处理
            this.messageHandler( msg, updateContentUI );
            if ( typeof DEBUG !== "undefined" ) {
                console.log( "doMsg::群消息", msg );
            }
        }
    };

MT.showDeskTopNote = function ( msg ) {
    //桌面提醒
    var pushMsg = {};
    var who = msg.to === userUID ? msg.from : msg.to;
    pushMsg.text = this.getText( msg );
    if ( msg.scene === "team" ) {
        if( cache.hasTeam( who ) ) {
            var teamItem = cache.getTeamById( who );
            pushMsg.from = ( !!teamItem && teamItem.name ) ? teamItem.name : "新的消息";
        } else {
            pushMsg.from = "新的消息";
        }
    } else {
        pushMsg.from = getUserData( cache.getPersonById( who ) ).alias;
    }

    if(this.deskTopNoteTip){
        //    提示
        Push.create( pushMsg.from, {
            body: pushMsg.text,
            icon: window.imageRoot + '/images/logo.png',
            timeout: 4000,
            onClick: function () {
                window.focus();
                this.close();
            }
        });
    }else {
        // 不提示

    }
}

//撤回消息
MT.backoutMsg = function ( id, data ) {
    var msg = data ? data.msg : this.cache.findMsg( this.crtSession, id );
    var to = msg.target;
    var session = msg.sessionId;
    this.mysdk.nim.sendTipMsg( {
        isLocal: true,
        scene: msg.scene,
        to: to,
        tip: sliceName( userUID === msg.from ? '你' : getUserData( cache.getPersonById( msg.from ) ).alias, 12 ) + '撤回了一条消息',
        time: msg.time,
        done: function ( err, data ) {
            if ( !err ) {
                this.cache.backoutMsg( session, id, data );
                if ( this.crtSession === session ) {
                    var msgHtml = this.ui.buildChatContentUI( this.crtSession, this.cache );
                    this.$chatContent.html( msgHtml ).scrollTop( 99999 );
                    //已读回执UI处理
                    this.markMsgRead( this.crtSession );
                }
            } else {
                this.ui.showAlert( '操作失败' );
            }
        }.bind( this )
    })
};

// //红包消息
// MT.moneyGiftMsg = function (id, data) {
//     if (typeof DEBUG !== "undefined") {
//         console.log("moneyGiftMsg", id, data);
//     }
//     var msg = data ? data.msg : this.cache.findMsg(this.crtSession, id);
//     var to = msg.target;
//     var session = msg.sessionId;
//     this.mysdk.nim.sendTipMsg({
//         isLocal: true,
//         scene: msg.scene,
//         to: to,
//         tip: sliceName(userUID === msg.from ? '你' : getUserData(cache.getPersonById(msg.from)).alias, 12) + '发送了一个红包，请在手机上查看！',
//         time: msg.time,
//         done: function (err, data) {
//             if (!err) {
//                 this.cache.moneyGiftMsg(session, id, data);
//                 if (this.crtSession === session) {
//                     var msgHtml = this.ui.buildChatContentUI(this.crtSession, this.cache);
//                     this.$chatContent.html(msgHtml).scrollTop(99999);
//                     //已读回执UI处理
//                     this.markMsgRead(this.crtSession)
//                 }
//             } else {
//                 alert('操作失败')
//             }
//         }.bind(this)
//     })
// };

MT.getText = function ( data ) {
    var text;
    if ( !data ) {
        return "[暂无消息]";
    }
    if ( data.type === "text" ) {
        text = data.text;
    } else if ( data.type === 'custom' ) {
        var content = checkJSON( data.content );
        if( !!content.type && +content.type === 6 || !!content.ope || content.ope === 0 || !!content.msgId && content.msgId === "0200" ) {
            text = "[红包]";
        } else if ( !!content.type && +content.type === 5 ) {
            test = "[转发消息]"
        } else if ( !!content.type && +content.type === 9 ) {
            test = "[明信片]"
        } else if ( !!content.type && +content.type === 3 ) {
            text = "[贴图]";
        } else if ( !!content.type && +content.type === 7 ) {
            text = "[转账消息]";
        } else if ( !!content.type && +content.type === 8 ) {
            if ( content.data ) {
                var transpondData = checkJSON( content.data );
                if ( transpondData.type == 1 ) {
                    text = "[图片]";
                } else if ( transpondData.type == 2 ) {
                    text = "[视频]";
                } else if ( transpondData.type == 3 ) {
                    text = "[文章]";
                } else {
                    text = "[转发消息]";
                }
            } else {
                 text = "[转发消息]";
            }
        } else {
            text = "[自定义消息]";
        }
    } else if ( data.type === 'image' ) {
        text = "[图片]";
    } else if ( data.type === 'file' ) {
        text = "[文件]";
    } else if ( data.type === 'notification' ) {
        text = "[通知]";
    } else if ( data.type === "geo" ) {
        text = "[位置]";
    } else if ( data.type === "audio" ) {
        text = "[音频消息]";
    } else if ( data.type === "video" ) {
        text = "[视频消息]";
    } else {
        text = ""
    }
    return text;
};

MT.openChatBox = function ( account, scene ) {
    var info;
    //update session
    mysdk.setCurrSession( scene, account );
    //update scene and account
    this.crtSession = scene + "-" + account;
    this.crtSessionType = scene;
    this.crtSessionAccount = account;
    //隐藏其他窗口

    //退群的特殊UI

    this.$messageText.val( '' );
    this.$fileForm.get( 0 ).reset();
    // 让netcall.js感知到打开聊天框的操作，做一些UI层的控制

    //根据帐号跟消息类型获取消息数据
    if( scene === "p2p" ) {
        info = getUserData( cache.getPersonById( account ) );
        if ( info.account == userUID ) {
            this.$nickName.text( "我的手机" );
        } else {
            this.$nickName.text( info.alias );
        }
        this.$chatTitle.find( '.team-options' ).addClass( 'hide' );
        this.$chatTitle.find( '.setting-layout' ).removeClass( 'hide' ).data( "id", scene + '-' + account );
        // 群资料入口隐藏
        this.$teamInfo && this.$teamInfo.addClass( 'hide' );
    } else {
        //群聊
        info = cache.getTeamById( account + "" );
        if ( info ) {
            this.$nickName.text( info.name );
        } else {
            this.$nickName.text( account );
        }
        this.$chatTitle.find( '.team-options' ).removeClass( 'hide' );
        this.$chatTitle.find( '.setting-layout' ).data( "id", scene + '-' + account );
        this.crtSessionTeamType = info ? info.type : "normal";
    }
    // 根据scene-id取聊天记录 => 这是切换标签的时候
    this.getHistoryMsgs( scene, account );
//    获取记录之后更新缓存
//    更新缓存之后刷新chat-view的UI
};

MT.chooseFile = function () {
    this.$fileInput.click();
};

/************************************************************
 * 获取当前会话消息
 * @return {void}
 *************************************************************/
MT.getHistoryMsgs = function ( scene, account ) {
    var id = scene + "-" + account,
        sessions = cache.findSession( id ),
        msgs = cache.getMsgs( id );
    //标记已读回执
    this.sendMsgRead( account, scene );
    let array = getAllAccount( msgs );
    var that = this;
    this.checkUserInfo( array, function () {
        that.doChatUI( id );
    } );
    // if (!!sessions) {
    //     //缓存中存在此会话
    //     if (sessions.unread >= msgs.length) {
    //
    //     }else{
    //         this.doChatUI(id);
    //     }
    // }else{
    //     this.doChatUI(id);
    // }

};

// MT.getLocalMsgsDone = function ( err, data ) {
//     if ( !err ) {
//         if ( typeof DEBUG !== "undefined" ) {
//             console.log( "addMsg::getLocalMsgsDone", data.msgs );
//         }
//         cache.addMsgsByReverse( data.msgs );
//         if ( typeof DEBUG !== "undefined" ) {
//             console.log( "getLocalMsgsDone", data );
//         }
//         var id = data.sessionId,
//             array = getAllAccount( data.msgs ),
//             that = this;
//         this.checkUserInfo( array, function () {
//             that.doChatUI( id );
//         } );
//     } else {
//         this.ui.showAlert( "获取历史消息失败" );
//     }
// };

//检查用户信息有木有本地缓存 没的话就去拿拿好后在执行回调
MT.checkUserInfo = function ( array, callback ) {
    array = Array.from( new Set( array ) );
    var arr = [];
    var that = this;
    for ( var i = array.length - 1; i >= 0; i-- ) {
        if ( !cache.getPersonById( array[ i ] ) ) {
            arr.push( array[ i ] );
        }
    }
    if ( arr.length > 0 ) {
        mysdk.getUsers( arr, function ( error, data ) {
            if ( !error ) {
                cache.setPersonlist( data );
                callback();
            } else {
                this.ui.showAlert( "获取用户信息失败" );
            }
        } );
    } else {
        callback();
    }
};

//拿到历史消息后聊天面板UI呈现
MT.doChatUI = function ( id ) {
    var temp = this.ui.buildChatContentUI( id, cache );
    this.$chatContent.html( temp );
    this.$chatContent.scrollTop( 99999 );
    //todo: lg webroot.image,however can't rotate webroot.image
    // $('.bubble-webroot.image-wrapper').parent().lightGallery();
    //已读回执UI处理
    this.markMsgRead( id )
};

MT.doChatHistoryUI = function ( id, ifMore ) {
    var temp = this.ui.buildChatHistoryContentUI( id, cache );
    if ( typeof DEBUG !== "undefined" ) {
        console.log( "doChatHistoryUI", "temp" );
    }
    this.showChattingHistoryWrapper();
    // this.$chattingHistoryLayout.show();
    // $('.chat--layout-history').show();
    this.$chattingHistoryContainer.html( temp );
    if ( !ifMore ) {
        this.$chattingHistoryContainer.scrollTop( 99999 );
        this.$chattingHistoryContainer.scrollTop( 99999 );
        this.$chattingHistoryContainer.scrollTop( 99999 );
    }else {
        this.$chattingHistoryContainer.scrollTop( 0 );
        this.$chattingHistoryContainer.scrollTop( 0 );
        this.$chattingHistoryContainer.scrollTop( 0 );
    }
    //todo: lg webroot.image,however can't rotate webroot.image
    // $('.bubble-webroot.image-wrapper').parent().lightGallery();
    //已读回执UI处理
    this.markMsgRead( id );
//    添加加载更多按钮
    this.$chattingHistoryContainer.prepend( '<div class="get-more-wrapper"><em id="get-more">加载更多</em></div>' );
};

//UI上标记消息已读
MT.markMsgRead = function ( id ) {
    if ( !id || this.crtSession !== id ) {
        return
    }
    //todo: unnecessary
    // var msgs = cache.getMsgs( id );
    // for ( var i = msgs.length - 1; i >= 0; i-- ) {
    //     var message = msgs[ i ];
    //     // 目前不支持群已读回执
    //     if ( message.scene === "team" ) {
    //         return
    //     }
    //     if( message.type !== 'tip' && window.nim.isMsgRemoteRead( message ) ){
    //         $( ".item.item-me.read" ).removeClass( "read" );
    //         $( "#" + message.idClient ).addClass( "read" );
    //         break
    //     }
    // }
};

MT.getNick = function ( account ) {
    // 使用util中的工具方法
    return getNick( account, cache );
};

MT.sendMsgRead = function ( account, scene ) {
    if ( scene === "p2p" ) {
        var id = scene + "-" + account;
        var sessions = cache.findSession( id );
        mysdk.sendMsgReceipt( sessions.lastMsg, function ( err, data ) {
            if ( err ) {
                if ( typeof DEBUG !== "undefined" ) {
                    console.error( "sendMsgReceiptError: ", err );
                }
            }
        } );
    }
};

/**
 * 列表想内容提供方法（用于ui组件）
 * @param  {Object} data 数据
 * @param  {String} type 类型
 * @return {Object} info 需要呈现的数据
 */
// MT.infoProvider = function(data,type){
//     var info = {};
//     switch(type){
//         case "session":
//             var msg = data.lastMsg;
//             if(!msg){
//                 return;
//             }
//             var scene = msg.scene;
//             info.scene = scene;
//             info.account = msg.target;
//             info.target = msg.scene + "-" + msg.target;
//             info.time =  transTime2(msg.time);
//             info.crtSession = this.crtSession;
//             info.unread = data.unread>99?"99+":data.unread;
//             info.text = buildSessionMsg(msg);
//             if(scene==="p2p"){
//                 //点对点
//                 if(msg.target === userUID){
//                     info.nick = "我的手机";
//                     info.avatar = "images/myPhone.png";
//                 }else{
//                     var userInfo = cache.getPersonById(msg.target);
//                     info.nick = this.getNick(msg.target);
//                     info.avatar = getAvatar(userInfo.avatar);
//                 }
//
//             }else{
//                 //群组
//                 var teamInfo = cache.getTeamById(msg.target);
//                 if(teamInfo){
//                     info.nick = teamInfo.name;
//                     if(teamInfo.avatar){
//                         info.avatar = teamInfo.avatar+"?imageView&thumbnail=40x40&quality=85"
//                     }else{
//                         info.avatar = "images/"+teamInfo.type+".png"
//                     }
//                 }else{
//                     info.nick = msg.target;
//                     info.avatar = "images/normal.png";
//                 }
//             }
//             break;
//         case "friend":
//             info.target = "p2p-"+data.account;
//             info.account = data.account;
//             info.nick = this.getNick(info.account);
//             info.avatar = getAvatar(data.avatar);
//             info.crtSession = this.crtSession;
//             break;
//         case "team":
//             info.type = data.type;
//             info.nick = data.name;
//             info.target = "team-"+data.teamId;
//             info.teamId = data.teamId;
//             if(data.avatar){
//                 info.avatar = data.avatar+"?imageView&thumbnail=40x40&quality=85"
//             }else{
//                 info.avatar = info.type==="normal"?"images/normal.png":"images/advanced.png"
//             }
//             info.crtSession = this.crtSession;
//             break
//     }
//     return info
// };
/**
 * 用户名片
 */
MT.showInfo = function ( account,type ) {
    if ( type == "p2p" ) {
        var user = cache.getPersonById( account );
        this.showInfoBox( user );
    }

};

// MT.getInfo = function( user, type, x , y ) {
//     var account = user.account;
//     if ( account == userUID ) {
//         msg = cache.getPersonById( account );
//     }
//     if ( type !== 'team' ) {
//     //    好友/陌生人
//     //    取缓存
//         var msg;
//         if ( cache.isFriend( account ) ) {
//             msg = cache.getFriendMsg( account );
//         } else {
//             if( !!cache.getPersonById( account ) ) {
//                 msg = cache.getPersonById( account );
//             } else {
//                 //    服务器拉取
//                 //todo: is there any way to optimize this shit code?
//                 window.mysdk.getUser({
//                     account:account,
//                     done : function (err, messag) {
//                         if(!err){
//                             cache.addFriend(messag);
//                             message.showInfoBox(messag,  x , y);
//                         }
//                     }
//                 });
//             }
//         }
//     }else{
//     //    群成员
//     }
//     return msg;
// };

MT.showInfoBox = function ( msg, x, y ) {
    this.ui.updateInfoBox( msg );
    if( $( '#team-member-layout' ).hasClass( 'an1' ) ) {
        y += 70;
    } else {
        y += 20;
    }
    this.$infoBox.css( {
        top: y + 'px',
        left: x + 'px'
    } ).removeClass( 'hide' );
};

// MT.getLocalSessionsDone = function (error, obj) {
//     if (typeof DEBUG !== "undefined") {
//         console.log('获取本地会话列表' + (!error?'成功':'失败'), error, obj);
//     }
//     if (!error) {
//         var old = cache.getSessions(),
//             sessions = obj.sessions;
//         cache.setSessions(mysdk.nim.mergeSessions(old, sessions));
//         for(var i = 0; i < sessions.length;i++){
//             if (sessions[i].scene === "p2p") {
//                 var tmpUser = sessions[i].to;
//                 // 如果会话列表不是好友，需要订阅关系
//                 if (!cache.isFriend(tmpUser)) {
//                     that.subscribeMultiPortEvent([tmpUser]);
//                 }
//                 mysdk.person[tmpUser] = true;
//             } else if (sessions[i].scene === "team") {
//                 mysdk.team.push(sessions[i].to);
//                 var arr = null
//                 if (sessions[i].lastMsg) {
//                     arr = getAllAccount(sessions[i].lastMsg);
//                 }
//                 if(!arr){
//                     continue;
//                 }
//                 for(var j = arr.length -1; j >= 0; j--){
//                     mysdk.person[arr[j]] = true;
//                 }
//             }
//         }
//         $('#session')[0].click();
//         $('.session-item').get(0).click();
//     }
// };

/*****************************************************************
 * 根据sessionId判断有无此Id，有则返回true，无则返回false
 * 同时生成新会话
 * 将已存在的会话或者是生成的会话放到会话列表顶端
 ****************************************************************/
MT.checkSessionId = function ( sessionId ) {
    if( !!cache.findSession( sessionId ) ) {
        //存在此会话
        this.ui.upSessionItemById( sessionId );
        // this.clickSessionItem(sessionId);
        //todo: clear here
        var interId;
        interId = setInterval( function () {
            var $ele = $( '.session-item[data-id$=' + sessionId + ']' );
            if ( $ele.length > 0 ) {
                if ( cache.findSession( sessionId ) ) {
                    var data = cache.findSession( sessionId );
                    if ( data.unread == 0 ) {
                        clearInterval( interId );
                        return
                    }
                    $ele.data( 'unread', data.unread );
                    $ele.find( '.unread' ).html( data.unread ).show();
                    clearInterval( interId );
                } else {
                    clearInterval( interId );
                }
            }
        }, 10 );
        return true;
    } else {
        //session not exist => inset a new session
        var arr = sessionId.split( '-' ),
            scene = arr[ 0 ],
            account = arr[ 1 ];
        mysdk.nim.insertLocalSession( {
            scene: scene,
            to: account,
            done: this.insertLocalSessionDone.bind( this )
        } );
        return false;
    }
};
/*****************************************************************
 * emoji模块
 ****************************************************************/
MT.initEmoji = function () {
    this.$showEmoji = $( '#showEmoji' );
    this.$showEmoji.on( 'click', this.showEmoji.bind( this ) );
    var that = this,
        emojiConfig = {
            'emojiList': emojiList,  //普通表情
            'pinupList': pinupList,  //贴图
            'width': 500,
            'height': 300,
            'imgpath': window.imageRoot + '/images/',
            'callback': function ( result ) {
                that.cbShowEmoji( result );
            }
        }
    this.$emNode = new CEmojiEngine( $( '#emojiTag' )[ 0 ], emojiConfig );
    this.$emNode._$hide();
    //scrollbar problem
    $( 'body' ).delegate( '.m-emoji-chnCol-ul', 'click', function () {
        $( '.m-emoji-picCol' ).scrollTop( 0 );
    } );
    //set appkey
    this.y = "c42";
};
/**
 * 选择表情回调
 * @param  {objcet} result 点击表情/贴图返回的数据
 */
MT.cbShowEmoji = function ( result ) {
    if ( !!result ) {
        var scene = this.crtSessionType,
            to = this.crtSessionAccount
        // 贴图，发送自定义消息体
        if ( result.type === "pinup" ) {
            var index = Number( result.emoji ) + 1,
                catalog = result.category,
                chartlet = result.category + '0' + ( index >= 10 ? index : '0' + index );
            var catalog2 = _$escape( catalog ),
                chartvar = _$escape( chartlet );
            var content = {
                type: 3,
                data: {
                    catalog: catalog,
                    chartlet: chartlet,
                    url: window.imageRoot + '/images/' + catalog2 + '/' + chartvar + '.png'
                }
            }
            mysdk.sendCustomMessage( scene, to, content, this.sendMsgDone.bind( this ) );
        } else {
            // 表情，内容直接加到输入框
            this.$messageText[ 0 ].value = this.$messageText[ 0 ].value + result.emoji;
        }
    }
};

MT.showEmoji = function () {
    this.$emNode._$show()
};


module.exports = MT