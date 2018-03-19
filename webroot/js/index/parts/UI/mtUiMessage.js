var UI = {};

UI.init = function () {
    this.initNode();
    this.preloadImg();
};
UI.initNode = function () {
    this.$avatar = $('.avatar img');
    //用户自己的昵称
    this.$myNickName = $('.nickname-layout span');
    this.$sessionList = $('#session-list');
    this.$teamLayout = $('#team-layout');
    this.$friendLayout = $('#friend-layout');
    this.$addressBookList = $('#address-book-list');
    this.$infoBox = $('#info-box');
    //    发起聊天
    this.$ccTlFriendList = $('#cc-tl-friend-list');
    this.$ccTlTeamList = $('#cc-tl-team-list');
    //    群聊
    this.$memberList = $('#team-member-layout');
    this.$chatTitle = $('.chat-title');
    this.lenHeight = 90;
    this.$amFriendList = $('#am-friend-list');
    //    退群
    this.$leaveTeamVerifyTab = $('#leave-team-verify-tab');
    this.$deleteFriendVerifyTab = $('#delete-friend-verify-tab');
    this.$applyFriendVerifyTab = $("#apply-friend-verify-tab");
    //    群聊删人
    this.$dmFriendList = $('#dm-friend-list');
//    文件上传进度
    this.$uploadPercentageTab = $('#upload-percentage-tab');
//    通用弹窗
    this.$usualAlert = $('#usual-alert-tab');
    //置顶区
    this.$topArea = $( '#top-layout' );
//  搜索结果列表
    this.$searchResultContainer = $( '#search-result-container' );
    this.$searchResultListTab = $( '#search-result-list-tab' );
    this.$checkChPwdTab = $( '#check-ch-pwd-tab' );
};

UI.preloadImg = function () {

};

UI.getMergeMsgMessage = function (msg) {
    var str = '',
        url = msg.fileName ? _$escape(msg.url) : '',
        sentStr = (msg.from !== userUID) ? "收到" : "发送";
    switch(+msg.type){
        case 0://test
            var re = /(http(s)?:\/\/[\w.\/]+)(?![^<]+>)/gi; // 识别链接
            str = _$escape(msg.text);
            str = str.replace(re, "<a href='$1' target='_blank'>$1</a>");
            str = buildEmoji(str);
            str = "<div class='f-maxWid'>" + str + "</div>"
            break;
        case 1://webroot.image
            msg.url = _$escape(msg.url);
            str = '<a href="' + msg.url + '?imageView" target="_blank"><img onload="loadImg()" data-src="' + msg.url + '" src="' + msg.url + '?imageView&thumbnail=200x0&quality=85"/></a>';
            break;
        case 2://file
            if (/png|jpg|bmp|jpeg|gif/i.test(msg.url)) {
                msg.url = _$escape(msg.url);
                str = '<a class="f-maxWid" href="' + msg.url + '?imageView" target="_blank"><img data-src="' + msg.url + '" src="' + msg.url + '?imageView&thumbnail=200x0&quality=85"/></a>';
            } else if (!/exe|bat/i.test(msg.fileName)) {
                url += msg.fileName ? '?download=' + encodeURI(_$escape(msg.fileName)) : '';
                str = '<a href="' + url + '" target="_blank" class="download-file f-maxWid"><span class="icon icon-file2"></span>' + _$escape(msg.fileName) + '</a>';
            } else {
                str = '<p>[非法文件，已被本站拦截]</p>';
            }
            break;
    }
    return str;
}

UI.initMergeMsgsTab = function ( idClient ) {
    var data = cache.getMergeMsgByIdClient( idClient );
    if( !data ){
        return false;
    }
    var len = data.length,
        msgHtml = "";
    for ( var i = 0; i < len; ++i ) {
        var personData = cache.getPersonById( data[ i ].from ),
            alias = "";
        if( !personData ) {//person not cached
            alias = sliceName( data[ i ].name, this.nameLen );
        } else {
            alias = sliceName( getUserData( personData ).alias, this.nameLen );
        }
        msgHtml += [ '<div id="' + idClient + '" class="clear item item-you">',
                '<img class="img j-img" src="' + data[ i ].avatarUrl + '"/>',
                '<p class="nick">' + alias + '</p>',
                '<div class="msg msg-text j-msg">',
                '<div class="box">',
                '<div class="cnt">',
                this.getMergeMsgMessage( data[ i ] ),
                '</div>',
                '</div>',
                '</div>',
                '</div>' ].join( '' );
    };
    return msgHtml;
}


UI.showAlert = function ( message, id ) {
    var html = [ '<div class="alert-container usual-alert-tab" data-id="' + id + '">\n' ,
    '        <div class="tab-inner2">\n' ,
    '            <div class="tb-title tb-percent ua-text">' + message + '</div>\n' ,
    '            <!--<div class="tb-text">请检查输入的手机号码是否正确</div>-->\n' ,
    '            <button class="tb-submit tb-usual-submit">确定</button>\n' ,
    '        </div>\n' ,
    '    </div>' ].join( "" );
    var $html = $( html );
    this.$alertsButton[ id ] = $html.find( "button" );
    $('body').prepend($html);
    // this.$usualAlert.find('.ua-text').html(message);
    // this.$usualAlert.removeClass('hide');
};

UI.hideAlert = function ($ele) {
    $ele.parents('.usual-alert-tab').remove();
    // if(!this.$usualAlert.hasClass('hide')){
    //     this.$usualAlert.addClass('hide');
    // }
};

// var ui = {
//     UI.init = function () {
//         this.initNode();
//         this.preloadImg();
//     },
//     UI.initNode = function () {
//         this.$avatar = $('.avatar img');
//         this.$nickName = $('.nickname-layout span');
//         this.$sessionList = $('#session-list');
//         this.$teamLayout = $('#team-layout');
//         this.$friendLayout = $('#friend-layout');
//         this.$addressBookList = $('#address-book-list');
//         this.$infoBox = $('#info-box');
//     //    发起聊天
//         this.$ccTlFriendList = $('#cc-tl-friend-list');
//         this.$ccTlTeamList = $('#cc-tl-team-list');
//     //    群聊
//         this.$memberList = $('#team-member-layout');
//         this.$chatTitle = $('.chat-title');
//         this.lenHeight = 90;
//         this.$amFriendList = $('#am-friend-list');
//     //    退群
//         this.$leaveTeamVerifyTab = $('#leave-team-verify-tab');
//         this.$deleteFriendVerifyTab = $('#delete-friend-verify-tab');
//         this.$applyFriendVerifyTab = $("#apply-friend-verify-tab");
//     //    群聊删人
//         this.$dmFriendList = $('#dm-friend-list');
//     };

UI.preloadImg = function () {
    // this.loadImage("./images/icon_selected.png", function () {
    //     // debugger
    //     //console.log("img loaded");
    // });
};

//通知
UI.openDeskTopNoteTip = function () {
    $('.desktop-notification').removeClass('open').addClass('close').html("关闭桌面通知");

};

UI.colseDeskTopNoteTip = function () {
    $('.desktop-notification').removeClass('colse').addClass('open').html("开启桌面通知");
};

UI.openSoundTip = function () {
    $('.sound').removeClass('open').addClass('close').html("关闭声音");

};

UI.colseSoundTip = function () {
    $('.sound').removeClass('colse').addClass('open').html("开启声音");
};

//发起聊天
// UI.initStartChatFriendList2 = function () {
//     //console.log("initStartChatFriendList");
//     this.$ccTlFriendList.html("");
//     var data = cache.getFriendList(),
//         len = data.length;
//     // debugger
//     for(var i = 0; i < len; ++i){
//         this.addStartChatFriendItem(data[i]);
//     }
//     this.loadImage("./images/icon_selected.png", function () {
//         // debugger
//         //console.log("img loaded");
//     });
//
// };
//发起聊天
UI.initStartChatFriendList = function () {
    //console.log("initStartChatFriendList");
    this.$ccTlFriendList.html("");
    var data = cache.getFriendList(),
        len = data.length,
        aliasList = getAliasList(),
        aLen = aliasList.length;
    // debugger
    for(var i = 0; i < aLen; ++i){
        if(!aliasList[i]){
            continue
        }
        this.addSCFGroup(aliasList[i]);
    }
    // for(var i = 0; i < len; ++i){
    //     this.addStartChatFriendItem(data[i]);
    // }
    this.loadImage( window.imageRoot + "/images/icon_selected.png", function () {
        // debugger
        //console.log("img loaded");
    });

};

UI.addSCFGroup = function (data) {
    if(!!data.key){//a-z
        this.$ccTlFriendList.append("<div class='cc-line'>" + data.key.toUpperCase() + "</div>");
        for(var j = 0; j < data.group.length; ++j){
            this.addStartChatFriendItem(cache.getFriendMsg(data.group[j]));
        }
    }else {//others
        var groups = [];
        for(j = 0; j < data.length; ++j){
            groups = groups.concat(data[j].group);
        }
        if(groups.length === 0){
            return;
        }
        this.$ccTlFriendList.append("<div class='cc-line'>" + "其它" + "</div>");
        for(j = 0; j < groups.length; ++j){
            this.addStartChatFriendItem(cache.getFriendMsg(groups[j]));
        }
    }
};

UI.loadImage = function (url, callback) {
    var img = new Image();
    img.src = url;
    img.onload = function(){ //图片下载完毕时异步调用callback函数。
        callback.call(img); // 将callback函数this指针切换为img。
    };
};

UI.addStartChatFriendItem = function (item) {
    var account = item.account,
        // alias = cache.getFriendAlias(account),
        data = cache.getPersonById(account);
    //     html = "",
    //     heading,
    //     msg;
    //
    // if(data.custom){
    //     msg = JSON.parse(data.custom);
    //     heading = msg.heading;
    //     alias = alias ? alias : msg.name;
    // }else {
    //     heading = data.avatar;
    //     alias = alias ? alias : data.nick;
    // }
    var userData = getUserData(data),
                avatar = userData.avatar,
                // name = userData.name,
                alias = userData.alias,
                html = "";
    alias = sliceName(alias, this.nameLen);

    html += '<div class="cc-tl-item cc-tl-friend-item" data-account="' + account +  '" data-id=p2p-"' + account + '">';
    html += '<span class="cc-item-circle"></span>';
    html += '<img src="' + avatar + '" alt="" class="cc-item-avatar">';
    html += '<div class="cc-item-alias">' + alias + '</div>';
    html += '</div>';
    this.$ccTlFriendList.append(html);

};

UI.initStartChatTeamList = function () {
    //console.log("initStartChatTeamList");
    this.$ccTlTeamList.html("");
    var data = cache.getTeamlist(),
        len = data.length;
    for(var i = 0; i < len; ++i){
        if ( data[ i ].valid ) {
            this.addStartChatTeamItem(data[i]);
        }
    }
};

UI.addStartChatTeamItem = function (item) {
    var id = item.teamId,
        name = item.name,
        heading = item.name.slice(0,1),
        html = "";
    // debugger
    html += '<div class="cc-tl-item cc-tl-team-item" data-id="team-' + id + '">';
    html += '<span class="cc-item-circle"></span>';
    html += '<div class="cc-item-heading">' + heading + '</div>';
    html += '<div class="cc-item-alias">' + name + '</div>';
    html += '</div>';
    this.$ccTlTeamList.append(html);
};

UI.initDeleteMemberTab = function (teamId) {
    this.$dmFriendList.html("");
//    get teamMembers
    var memberAccounts = getTeamMemberAccounts(teamId),
        data = cache.getTeamMembers(teamId),
        that = this,
        members = data.members,
        len = memberAccounts.length;
    for(var i = 0; i < len; ++i){
        if(memberAccounts[i] === userUID){
            memberAccounts.splice(i , 1);
            break;
        }
    }
    // debugger
    checkUserInfo(memberAccounts, function () {
        var nameList = getTeamMemberNameList(teamId, memberAccounts),
            aLen = nameList.length;
        for(i = 0; i < aLen; ++i){
            if(!nameList[i]){
                continue
            }
            that.addDMGroup(nameList[i]);
        }
    });

    // for(var i = 0; i < len; i++) {
    //     if(userUID === members[i].account){
    //         continue
    //     }
    //     mysdk.getPersonMsg(members[i].account, this.addDeleteMemberItem.bind(this));
    // }
//    init memberList
};

UI.addDMGroup = function (data) {
    // debugger
    if(!!data.key){//a-z
        // if(data.group.length === 1 && data.group[0] === userUID){
        //     return;
        // }
        this.$dmFriendList.append("<div class='dm-line'>" + data.key.toUpperCase() + "</div>");
        for(var j = 0; j < data.group.length; ++j){
            if(data.group[j] === userUID){
                continue
            }
            this.addDeleteMemberItem(cache.getPersonById(data.group[j]));
        }
    }else {//others
        var groups = [];
        for(j = 0; j < data.length; ++j){
            groups = groups.concat(data[j].group);
        }
        if(groups.length === 0){
            return;
        }
        // else if(groups.length === 1 && groups[0] === userUID){
        //     return;
        // }
        this.$dmFriendList.append("<div class='dm-line'>" + "其它" + "</div>");
        for(j = 0; j < groups.length; ++j){
            this.addDeleteMemberItem(cache.getPersonById(groups[j]));
        }
    }
};

UI.addDeleteMemberItem = function (data) {
    var html = "",
        account = data.account,
        userData = getUserData(data),
        avatar = userData.avatar,
        // name = userData.name,
        alias = userData.alias,
        html = "";
    alias = sliceName(alias, this.nameLen);
    //     alias = cache.getFriendAlias(account);
    // if(data.custom){
    //     msg = JSON.parse(data.custom);
    //     heading = msg.heading;
    //     alias = alias ? alias : msg.name;
    // }else {
    //     heading = data.avatar;
    //     alias = alias ? alias : data.nick;
    // }

    html += '<div class="tb-item dm-friend-item" data-account="' + account +  '" data-id=p2p-"' + account + '">';
    html += '<span class="tb-item-circle dm-item-circle"></span>';
    html += '<img src="' + avatar + '" alt="" class="tb-item-avatar dm-item-avatar">';
    html += '<div class="tb-item-alias dm-item-alias">' + alias + '</div>';
    html += '</div>';
    this.$dmFriendList.append(html);
};

UI.initUserMsg = function (data) {
    var uData = getUserData(data),
        avatar = uData.avatar,
        name = uData.name;
    this.$avatar.attr("src", convertWebp( avatar ) );
    // this.$nickName.html(name);
    this.$myNickName.html(sliceName(!!name ? name : "未知的用户名", this.nameLen));
};

UI.initSessionList = function (id) {
    // var id = this.$sessionList.find('.cur').data('id');
    var curId = id || this.$sessionList.find('.session-item.cur').length > 0 ? this.$sessionList.find('.session-item.cur').data("id") : false;
    // debugger
    this.$sessionList.html("");
    var data = cache.getSessions(),
        len = data.length;
    for(var i = 0; i < len; i++){
        this.addSessionItem(data[i]);
    }
    if(curId){
        if(this.$sessionList.find('.session-item[data-id$=' + curId + ']').length > 0){
            this.$sessionList.find('.session-item[data-id$=' + curId + ']').get(0).click();
        }else {
            this.$sessionList.find('.session-item').get(0).click();
        }

    }


    // this.$sessionList.find('.session-item[data-id$=' + id + ']').get(0).click();

};

UI.initAbTeamList = function () {
    this.$teamLayout.html("");
  var data = cache.getTeamlist(),
      len = data.length;
  // //debugger
    for(var i = 0;i < len;i++){
        if(!data[i]){
            continue;
        }
        this.addAbTeamItem(data[i]);
    }
};

UI.addAbTeamItem = function (data) {
    var html = "";
    html += '<div class="ab-item" data-type="team" data-account="' + data.teamId + '" data-gtype="' + data.type + '" data-id="team-' + data.teamId + '">';
    html += '<div class="abt-avatar">' + data.name.slice(0,1) +'</div>';
    html += '<div class="ab-name">' + sliceName(data.name, this.nameLen) + '</div></div>';
    this.$teamLayout.append(html);
};

//useless
// UI.initAbFriendList2 = function () {
//     var curId = this.$friendLayout.find('.ab-item.cur').length > 0 ? this.$friendLayout.find('.ab-item.cur').data("id") : false;
//     this.$friendLayout.html("");
//     var data = cache.getFriends(),
//         len = data.length;
//     // //debugger
//     for(var i = 0;i < len;i++){
//         if(!data[i]){
//             continue;
//         }
//         this.addAbFriendItem(data[i]);
//     }
//     if(curId){
//         if(this.$friendLayout.find('.ab-item[data-id$=' + curId + ']').length > 0){
//             this.$friendLayout.find('.ab-item[data-id$=' + curId + ']').get(0).click();
//         }else {
//             if(this.$friendLayout.find('.ab-item').length > 0){
//                 this.$friendLayout.find('.ab-item').get(0).click();
//             }
//
//         }
//
//     }
// };

UI.initAbFriendList = function () {
    var curId = this.$friendLayout.find('.ab-item.cur').length > 0 ? this.$friendLayout.find('.ab-item.cur').data("id") : false;
    this.$friendLayout.html("");
    var data = cache.getFriends(),
        len = data.length,
        aliasList = getAliasList(),
        aLen = aliasList.length;
    // //debugger
    if (typeof DEBUG !== "undefined") {
        //console.log("getAliasList", aliasList);
    }

    for(var i = 0; i < aLen; ++i){
        if(!aliasList[i]){
            continue
        }
        this.addAbGroup(aliasList[i]);
    }
    if(curId){
        if(this.$friendLayout.find('.ab-item[data-id$=' + curId + ']').length > 0){
            this.$friendLayout.find('.ab-item[data-id$=' + curId + ']').get(0).click();
        }else {
            if(this.$friendLayout.find('.ab-item').length > 0){
                this.$friendLayout.find('.ab-item').get(0).click();
            }else{
                this.clearDetailInfo();
            }

        }
    }else{
        this.clearDetailInfo();
        setTimeout(this.scrollToTop.bind(this), 10);
        // this.scrollToTop();
        // if(this.$friendLayout.find('.ab-item').length > 0){
        //     this.clearDetailInfo();
        //     // this.$friendLayout.find('.ab-item').get(0).click();
        // }else {
        //     this.clearDetailInfo();
        // }
    }
};

//初始化通讯录置顶区域
UI.initABTop = function () {
    var html = "",
        i,
        accounts = [ userUID ];
    //获取置顶区域数据，目前只有用户自己的数据，以后如果有新的置顶需求，添加到cache中
    //如果未来有新的置顶需求，要先验证是否有置顶区用户的数据: mysdk.getUsers();

    //刷新置顶区UI
    for ( i = accounts.length - 1; i >= 0; --i ) {
       html += this.addABTopItem( accounts[ i ] );
    }

    this.$topArea.html( html );
};

//添加置顶区html
UI.addABTopItem = function ( account ) {
    var html = "",
        data = getUserData( cache.getPersonById( account ) ),
        name = account === userUID ? "我的手机" : sliceName( data.alias, this.nameLen );

    html += '<div class="ab-item" data-type="p" data-account="' + data.account + '" data-id="p2p-' + data.account + '">';
    html += '<img src="' + convertWebp( data.avatar ) + '" alt="" class="abf-avatar">';
    html += '<div class="ab-name">' + name + '</div>';
    html += '</div>';

    return html;
};

UI.scrollToTop = function () {
    $('.tab-view-container').scrollTop("0");
};

UI.clearDetailInfo = function () {
    $('#info-content').html("");
};

UI.addAbGroup = function (data) {
    if(!!data.key){//a-z
        if(data.group.length === 0){
            return;
        }
        this.$friendLayout.append("<div class='ab-line'>" + data.key.toUpperCase() + "</div>");
        for(var j = 0; j < data.group.length; ++j){
            this.addAbFriendItem(cache.getFriendMsg(data.group[j]));
        }
    }else {//others

        var groups = [];
        for(j = 0; j < data.length; ++j){
            groups = groups.concat(data[j].group);
        }
        // debugger
        if(groups.length > 0){
            this.$friendLayout.append("<div class='ab-line'>" + "其它" + "</div>");
            for(j = 0; j < groups.length; ++j){
                this.addAbFriendItem(cache.getFriendMsg(groups[j]));
            }
        }

    }

};

UI.addAbFriendItem = function (data) {
    // debugger
    var perData = cache.getPersonById(data.account),
        that = this;
    if(!perData){
        window.mysdk.getUser(data.account, function (err, data) {
            //console.log(err, data);
            if (!err) {
                cache.updatePersonlist(data);
                that.initAbFriendList();
                //console.log("addAbFriendItem", cache.getPersonlist());
            }
        })
    }
    var html = "";
    html += '<div class="ab-item" data-type="p" data-account="' + data.account + '" data-id="p2p-' + data.account + '">';
    html += '<img src="' + convertWebp( perData.avatar ) + '" alt="" class="abf-avatar">';
    var name = !!data.alias ? data.alias: !!perData.custom ? JSON.parse(perData.custom).name : perData.nick;
    html += '<div class="ab-name">' + sliceName(name, this.nameLen) + '</div>';
    html += '</div>';
    this.$friendLayout.append(html);
};

UI.getFriendInfoBox = function ( account ) {
//    获取好友详情html
    var perData = cache.getPersonById( account );
    var userData = getUserData( perData ),
                avatar = convertWebp( userData.avatar ),
                name = userData.name,
                alias = userData.alias,
                area = userData.area,
                temp = "";
    // 如果是我的手机，去掉：移除好友，修改昵称
    if ( account !== userUID ) {
        temp += '<div class="delete-friend" id="delete-friend" data-id="p2p-' + account + '">移除好友</div>';
    }
    temp += '<img  class="info-de-avatar" id="info-de-avatar" src="' + avatar + '" alt="">';
    temp += '<div class="info-de-alias info-de-info"  id="info-de-alias"><em>'
        + alias
        + '</em>';

    if ( account !== userUID ) {
        temp += '<input type="text" class="alias-edit-ipt hide" id="alias-edit-ipt" data-id="p2p-' + account + '"><span class="change-friend-alias" id="change-friend-alias"></span>';
    }
    temp +=  '</div>';
    temp +=    '<div class="info-de-nick info-de-info"  id="info-de-nick">';
    temp +=    '<span>昵称:</span>';
    temp += '<em>' + name + '</em>';
    temp += '</div>';
    temp += '<div class="info-de-area  info-de-info"  id="info-de-area">';
    temp += '<span>地区:</span>';
    temp += '<em>' + area + '</em>';
    temp += '</div>';
    temp += '<div class="info-btn-container">';
    temp += '<button class="info-btn info-de-send"  id="info-de-send" data-id="p2p-' + account + '">发消息</button>';
    // temp += '<button class="info-btn info-de-serMsg"  id="info-de-serMsg" data-id="p2p-' + account + '">云端消息</button>';
    temp += '<button class="info-btn info-de-fs"  id="info-de-fs" data-id="p2p-' + account + '" data-account="' + account + '">秘圈</button>';
    temp += '</div>';
    return temp;
};

UI.getTeamInfoBox = function (id) {
//    获取群组详情html

};

UI.initAddressBookList = function () {
    this.$addressBookList.html("");
    var teamData = cache.getTeamlist(),
        friendData = cache.getFriends();

};
UI.getTagHtml = function (data) {

};

UI.getFriendAddressListHtml = function () {
    var friendData = cache.getFriends(),
        array = [];
    for (var i = 65; i <= 90; i++) {
        array[String.fromCharCode(i)] = [];
    }
    array["其他"] = [];
    //console.log(array, friendData);
    var name;
    for(i = 0;i < friendData.length;i++){
        name = friendData.account;
    }

};

UI.buildChatContentUI = function ( id, cache ) {
    var msgHtml = "",
        msgs = cache.getMsgs( id );
    if ( msgs.length === 0 ) {
        // msgHtml = '<div class="no-msg tc"><span class="radius5px">暂无消息</span></div>';
        msgHtml = '';
    } else {
        //self: 遍历消息
        for ( var i = 0, l = msgs.length; i < l; ++i ) {
            var message = msgs[ i ],
                user = cache.getPersonById( message.from );
            if ( message.attach && message.attach.netcallType !== undefined && ( message.attach.type !== 'netcallBill' && message.attach.type !== "netcallMiss" ) ) {
                // 隐藏掉netcall相关的系统消息
                continue;
            }
            //消息时间显示
            if ( i == 0 ) {
                msgHtml += this.makeTimeTag( transTime( message.time ) );
            } else {
                if ( message.time - msgs[ i - 1 ].time > 5 * 60 * 1000 ) {
                    msgHtml += this.makeTimeTag( transTime( message.time ) );
                }
            }
            msgHtml += this.makeChatContent( message, user );
        }
    }
    return msgHtml;
};

UI.buildChatHistoryContentUI = function (id, cache) {
    var msgHtml = "",
        msgs = cache.getHistoryMsgs(id);
    if (msgs.length === 0) {
        // msgHtml = '<div class="no-msg tc"><span class="radius5px">暂无消息</span></div>';
        msgHtml = '';
    } else {
        //self: 遍历消息
        for (var i = 0, l = msgs.length; i < l; ++i) {
            var message = msgs[i],
                user = cache.getPersonById(message.from);
            if (message.attach && message.attach.netcallType !== undefined && (message.attach.type !== 'netcallBill' && message.attach.type !== "netcallMiss")) {
                // 隐藏掉netcall相关的系统消息
                continue;
            }
            //消息时间显示
            if (i == 0) {
                msgHtml += this.makeTimeTag(transTime(message.time));
            } else {
                if (message.time - msgs[i - 1].time > 5 * 60 * 1000) {
                    msgHtml += this.makeTimeTag(transTime(message.time));
                }
            }
            msgHtml += this.makeChatContent(message, user);
        }
    }
    return msgHtml;
};

UI.getLastText = function (data) {
    var text;
    if(!data.lastMsg){
        return "[暂无消息]";
    }
    if(data.lastMsg.type === 'custom'){//贴图和红包都是custom
        // debugger
        var content = checkJSON(data.lastMsg.content);
        if(!content){
            text = "[自定义消息]";
        }else if(!!content.ope || content.ope === 0 || !!content.msgId && content.msgId === "0200" || !!content.type && +content.type === 6){
            text = "[红包]";
        }else if(!!content.type && content.type === 5) {
            text = "[转发消息]"
        }else if(!!content.type && content.type === 9) {
            text = "[明信片]"
        }else if(!!content.type && content.type === 3) {
            text = "[贴图]";
        }else if(!!content.type && content.type === 7) {
            text = "[转账消息]";
        }else if(!!content.type && content.type === 8) {
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
        }else {
            text = "[自定义消息]";
        }

    }else if(data.lastMsg.type === 'image'){
        text = "[图片]";
    }else if(data.lastMsg.type === 'file'){
        text = "[文件]";
    }else if(data.lastMsg.type === 'notification'){
        if(data.lastMsg.attach.type === "dismissTeam"){
            text = '[群被解散]';
        }else {
            text = "[通知]";
        }

    }else if(data.lastMsg.type === "geo"){
      text = "[位置]"
    }else if(data.lastMsg.type === 'tip'){
        text = data.lastMsg.tip;
    }else if(data.lastMsg.type === 'audio'){
        text = "[音频消息]";
    }else if(data.lastMsg.type === 'video'){
        text = "[视频消息]"
    }else{
        // debugger
        text = "";
    }
    return text;
};
UI.addSessionItem = function (data) {
    var item = "",
        personMsg,
        teamMsg,
        that = this,
        arr = data.id.split("-"),
        scene = data.scene ? data.scene : arr[0],
        to = data.to ? data.to : arr[1];
    if(scene === "p2p"){
        if(cache.getPersonById(to)){
            personMsg = cache.getPersonById(to);
        }else{
            window.mysdk.getUser(to, function (err, data) {
                //console.log(err, data);
                if (!err) {
                    // //console.log("session", data);
                    cache.updatePersonlist(data);
                    // updateContentUI();
                    //console.log("initSessionList");
                    that.initSessionList();
                    //console.log("addSession", cache.getPersonlist());
                }
            })
        }

        if(personMsg){
            var userData = getUserData(personMsg),
                        avatar = userData.avatar,
                        name = userData.name,
                        alias = userData.alias,
                        html = "";
            // debugger
            name = sliceName(name === alias ? name : alias, this.nameLen);
            var c1 = data.unread > 0 ? "" : "hide",
                unreadNum = data.unread < 99 ? data.unread : "99+";
            name = to == userUID ? "我的手机" : name;

            item += '<div class="session-item" data-scene="' + scene + '" data-account="' + to + '"  data-id="' + data.id + '" data-unread="' + data.unread + '">';
            item += '<img src="' + avatar + '" alt="" class="session-avatar">';
            item += '<span class="unread ' + c1 + '">' + unreadNum + '</span>';
            item += '<div class="to-name">' + name + '</div>';
            // //debugger
            var text;
            if(!data.lastMsg){
                text = "[暂无消息]";
            }else if(data.lastMsg.type !== 'text'){
                text = this.getLastText(data);
            }else{
                text = data.lastMsg.text;
            }

            text = text.length > 8 ? text.slice(0, 8) + "..." : text;
            item += '<div class="last-msg">' + text + '</div>';
            item += '</div>';
            this.$sessionList.append($(item));
        }
        // //console.log("addSessionItem", personMsg, item);
    }else if(scene === "team") {
        if(cache.getTeamById(to)){
            teamMsg = cache.getTeamById(to);
        }else{
            window.mysdk.getTeam(to, (function (err, data) {
                // //console.log(err, data);
                if (!err) {
                    // //console.log("session", data);
                    cache.addTeam(data);
                    // updateContentUI();
                    this.initSessionList();
                    // //console.log("addSession", cache.getTeamlist());
                }
            }).bind(this));
        }
        if(teamMsg){
            teamMsg.name = !!teamMsg.name ? teamMsg.name : "未知的群聊";
            // //console.log("addSessionItem", data, personMsg);
            // personMsg = JSON.parse(personMsg.custom);
            item += '<div class="session-item" data-scene="' + scene + '" data-account="' + to + '"  data-id="' + data.id + '" data-unread="' + data.unread + '">';
            // item += `<div class="session-item" data-scene="${data.scene}" data-account="${data.to}"  data-id="${data.id}"  data-unread="${data.unread}">`;
            try{
                item += this.getTeamAvatar(teamMsg.name);
            }catch ( e ) {
                if (typeof DEBUG !== "undefined") {
                    console.log(e, teamMsg);
                }
            }
            
                // `<div class="team-avatar">${personMsg.name.slice(0,1)}</div>`;
            // item += `<div class="to-name">${personMsg.name}</div>`;
            item += '<div class="to-name">' + sliceName(teamMsg.name, this.nameLen) + '</div>';
            // if(data.unread > 0){
            var c2 = data.unread > 0 ? "" : "hide",
                unreadNum2 = data.unread < 99 ? data.unread : "99+";
                // item += `<span class="unread ${data.unread > 0 ? "" : "hide"}">${data.unread>99 ? "99+" : data.unread}</span>`;
            item += '<span class="unread ' + c2 + '">' + unreadNum2 + '</span>';
            // }
            var text;
            if(!data.lastMsg){
                text = "[暂无消息]";
            }else if(data.lastMsg.type !== 'text'){
                text = this.getLastText(data);
            }else{
                text = data.lastMsg.text;
            }
            text = text.length > this.maxLastMsgLen ? text.slice(0, this.maxLastMsgLen) + "..." : text;
            item += '<div class="last-msg">' + text + '</div>';
            item += '</div>';
            // item += '<div class="last-msg">${text.length > 20 ? text.slice(0, 20) + "..." : text}</div>';
            // item +=  '</div>';
            this.$sessionList.append($(item));
        }
    }
};
UI.getTeamAvatar = function (name) {
    return '<div class="team-avatar">' + name.slice(0,1) + '</div>';
};
UI.changeTeamName = function (teamId, name) {
    var $ele = this.$sessionList.find('.session-item[data-id$=team-' + teamId + ']');
    $ele.find('.to-name').html(name);
    $ele.find('.team-avatar').html(name.slice(0, 1));
//    此群是当前聊天界面群 则修改title
    if($ele.hasClass('cur')){
        $('#nick-name').text(name.slice(0, 20));
    }
};
UI.addNewSession = function (data) {
    this.addSessionItem(data.data.sessions[0]);
};
UI.upSessionItem = function (id) {
    $('#session-list').prepend($('.session-item.cur').get(0));
    $('.tab-view-container').scrollTop(0);
};
UI.upSessionItemById = function (id) {
    $( '#session-list' ).prepend( $( '.session-item[data-id$=' + id + ']' ).get( 0 ) );
};
UI.updateChatContentUI = function (msg, cache) {
    // debugger
    // //console.log();//, cache
    var lastItem = $("#chat-content .item").last(),
        msgHtml = "",
        user = cache.getPersonById(msg.from);
    var message = msg;

    // alert(msg);
    if (message.attach && message.attach.netcallType !== undefined && (message.attach.type !== 'netcallBill' && message.attach.type !== "netcallMiss")) return ''; // 隐藏掉netcall相关的系统消息
    if (lastItem.length == 0) {
        msgHtml += this.makeTimeTag(transTime(msg.time));
    } else {
        //todo: self: 5分钟后再添加时间提示
        if (msg.time - parseInt(lastItem.attr('data-time')) > 5 * 60 * 1000) {
            // //console.log(msg.time - parseInt(lastItem.attr('data-time')) > 5 * 60 * 1000, msg.time);
            msgHtml += this.makeTimeTag(transTime(msg.time));
        }
    }
    msgHtml += this.makeChatContent(msg, user);
    if (typeof DEBUG !== "undefined") {
        //console.log("updateChatContentUI");
    }
    return msgHtml;
};
UI.updateLastMsg = function (data) {
    var str = '[data-id$="'+ data.id + '"]';
    if (typeof DEBUG !== "undefined") {
        //console.log("updateLastMsg", data.lastMsg);
    }
    var text;
    // text = this.getLastText(data);

    if(!data.lastMsg){
        text = "[暂无消息]";
    }else if(data.lastMsg.type !== 'text'){
        text = this.getLastText(data);
    }else{
        text = data.lastMsg.text;
    }

    $(str).find('.last-msg').html(text.length > this.maxLastMsgLen ? text.slice(0, this.maxLastMsgLen) + "..." : text);

};
UI.makeChatContent = function ( message, user ) {
    var msgHtml;
    //通知类消息
    if ( message.attach && message.attach.type && ( message.attach.netcallType === undefined || ( message.attach.type !== "netcallBill" && message.attach.type !== "netcallMiss" ) ) ) {
        if ( message.attach.netcallType !== undefined ) {
            return '';// 隐藏掉netcall相关的系统通知消息
        }
        var notificationText = transNotification( message );
        msgHtml = '<p class="u-notice tc item" data-time="' + message.time + '" data-id="' + message.idClient + '" data-idServer="' + message.idServer + '"><span class="radius5px">' + notificationText + '</span></p>';
    } else {
        //聊天消息
        var type = message.type,
            from = message.from,
            avatar = convertWebp( user.avatar ),
            showNick = message.scene === 'team' && from !== userUID,
            nickInTeam,
            msgHtml;
        if ( showNick ) {
            nickInTeam = getMemberNick( message.target, from, cache )  || getNick( from );
        }
        if ( type === "geo" ) {
            msgHtml = [ '<div data-time="' + message.time + '" data-id="' + message.idClient + '" id="' + message.idClient + '" data-idServer="' + message.idServer + '">',
                '<p class="u-notice tc item ' + (from == userUID && message.idServer ? "j-msgTip" : "") + '" data-time="' + message.time + '" data-id="' + message.idClient + '" data-idServer="' + message.idServer + '"><span class="radius5px">' + ( "您" + ( ( message.from !== userUID ) ? "收到" : "发送" ) + "了一条地理位置信息，请在手机上查看!" ) + '</span></p>',
                '</div>'].join( '' );
            return msgHtml;
        }

        if ( type === "tip" ) {
            msgHtml = [
                '<div data-time="' + message.time + '" data-id="' + message.idClient + '" id="' + message.idClient + '" data-idServer="' + message.idServer + '">',
                '<p class="u-notice tc item ' + ( from == userUID && message.idServer ? "j-msgTip" : "" ) + '" data-time="' + message.time + '" data-id="' + message.idClient + '" data-idServer="' + message.idServer +
                '"><span class="radius5px">' + getMessage( message ) + '</span></p>',
                '</div>'
            ].join( '' );
        } else {
            if ( type === "custom" && ( typeof message.content === "string" ) &&
                !!checkJSON( message.content ) ) {//红包或合并转发消息
                var content = checkJSON( message.content );
                if( !!content.ope || content.ope === 0 ||
                    !!content.msgId && content.msgId === "0200"
                    || !!content.type && +content.type === 6 ) {
                       msgHtml = [
                           '<div data-time="' + message.time + '" data-id="' + message.idClient + '" id="' + message.idClient + '" data-idServer="' + message.idServer + '">',
                    '<p class="u-notice tc item ' + ( from == userUID && message.idServer ? "j-msgTip" : "" ) + '" data-time="' + message.time + '" data-id="' + message.idClient + '" data-idServer="' + message.idServer +
                    '"><span class="radius5px">' + ( "您" + ( ( message.from !== userUID ) ? "收到" : "发送" ) + "了一个红包，请在手机上查看!" ) + '</span></p>',
                    '</div>'
                       ].join( '' );
                        return msgHtml;
                } else if( typeof content.type === 'number' ) {
                    var type = content.type;
                    if( type === 5 || type === 0 ) {
                        var data = content.data;
                        var title = data.title,
                            subTitle = data.subTitle;
                            /**set cache
                             * cache format
                             * {
                             *      idClient: msgs
                             * }
                             * cache.mergeMsgs[idClient] = msgs;
                            */
                        cache.setMergeMsg( message.idClient, data.forwardMessage );
                        msgHtml = [
                            '<div data-time="' + message.time + '" data-id="' + message.idClient + '" id="' + message.idClient + '" data-idServer="' + message.idServer + '" class="clear item item-' + buildSender(message) + '">',
                '<img class="img j-img" src="' + getAvatar(avatar) + '" data-account="' + from + '"/>',
                showNick ? '<p class="nick">' + nickInTeam + '</p>' : '',
                '<div class="msg msg-text j-msg">',
                '<div class="box">',
                '<div class="cnt cnt-merge">',
                title,
                '<div class="cnt2">',
                subTitle,
                '</div>',
                '</div>',
                '</div>',
                '</div>',
                message.status === "fail" ? '<span class="error j-resend" data-session="' + message.sessionId + '" data-id="' + message.idClient + '"><i class="icon icon-error"></i>发送失败,点击重发</span>' : '',
                // '<span class="readMsg"><i></i>已读</span>',
                '</div>'
                        ].join( '' );
                        return msgHtml;
                    } else if ( +type === 7 ) {//转账消息
                        let tipMsg = ( from === userUID ? "您发送" : "您收到" ) + "了一条转账消息";
                        msgHtml = [
                            '<div data-time="' + message.time + '" data-id="' + message.idClient + '" id="' + message.idClient + '" data-idServer="' + message.idServer + '">',
                    '<p class="u-notice tc item ' + (from == userUID && message.idServer ? "j-msgTip" : "") + '" data-time="' + message.time + '" data-id="' + message.idClient + '" data-idServer="' + message.idServer + '"><span class="radius5px">' + tipMsg + '</span></p>',
                    '</div>'
                        ].join( '' );
                        return msgHtml;
                    }
                }
        }
            msgHtml = [
                '<div data-time="' + message.time + '" data-id="' + message.idClient + '" id="' + message.idClient + '" data-idServer="' + message.idServer + '" class="clear item item-' + buildSender(message) + '">',
                '<img class="img j-img" src="' + getAvatar( avatar ) + '" data-account="' + from + '"/>',
                showNick ? '<p class="nick">' + getNick( from ) + '</p>' : '',
                '<div class="msg msg-text j-msg">',
                '<div class="box">',
                '<div class="cnt">',
                getMessage( message ),
                '</div>',
                '</div>',
                '</div>',
                message.status === "fail" ? '<span class="error j-resend" data-session="' + message.sessionId + '" data-id="' + message.idClient + '"><i class="icon icon-error"></i>发送失败,点击重发</span>' : '',
                // '<span class="readMsg"><i></i>已读</span>',
                '</div>'
            ].join( '' );
        }
    }
    return msgHtml;
};

//聊天消息中的时间显示
UI.makeTimeTag = function (time) {
    return '<p class="u-msgTime">- - - - -&nbsp;' + time + '&nbsp;- -- - -</p>';
    // return '<p class="u-msgTime"></p>';
    // return "";
};

UI.updateInfoBox = function ( msg ) {
    var account = msg.account;
    var isFriend = cache.isFriend( account );
    var data = cache.getPersonById( account );
    var userData = getUserData( data ),
                avatar = userData.avatar,
                name = userData.name,
                alias = userData.alias,
                area = userData.area,
                sex = userData.sex,
                html = "";
    name = sliceName(name === alias ? name : alias, this.nameLen);
    // var heading,
    //     name,
    //     area,
    //     sex,
    //     alias;
    // if(msg.custom){
    //     var custom = JSON.parse(msg.custom);
    //     heading = custom.heading;
    //     name = custom.name;
    //     area = custom.area;
    //     sex = custom.sex;
    // }else{
    //     heading = msg.avatar;
    //     name = msg.nick;
    //     area = "中国";
    //     sex = msg.gender == "male" ? "男" : "女";
    // }

    this.$infoBox.find('#info-avatar').attr('src', avatar);
    // if(cache.getFriendAlias(msg.account)){
    //     alias = cache.getFriendAlias(msg.account);
    // }else{
    //     alias = name;
    // }
    this.$infoBox.find('#info-alias').html(sliceName(alias, this.nameLen));
    var genSrc = window.imageRoot + "/images/icon_";
    genSrc += sex === "男" ? "men.png" : "women.png";
    this.$infoBox.find('#info-gender').attr('src', genSrc);
    // name = name.length <= 11 ? name : name.slice(0,11) + "...";
    this.$infoBox.find('#info-name').html(name);
    this.$infoBox.find('#info-area').html(area);

    if(isFriend) {//account is user's friend
        if(this.$infoBox.hasClass('isNotFriend')){
            this.$infoBox.removeClass('isNotFriend');
        }
    } else {//account isn't user's friend
        if(!this.$infoBox.hasClass('isNotFriend')){
            this.$infoBox.addClass('isNotFriend');
        }
        $('#apply-friend-in-team').data("account", account);
    }
};

//    群成员
UI.initTeamMembers = function (id) {
    this.$memberList.html('<img src="https://mituresprd.oss-cn-hangzhou.aliyuncs.com/web/1f6f5924c1f4c65f2663a590cf5cfcda/images/button_add.png" class="member-item" id="add-item">');
    var data = cache.getTeamMembers(id),
        members = data.members,
        len = members.length,
        itemNum;
    if(cache.isTeamManager(userUID, id)){
    //    用户是群管理员
        this.$memberList.append('<img src="' + window.imageRoot + '/images/button_delete.png" class="member-item" id="delete-member-item">');
        itemNum = len + 2;
    } else {
        itemNum = len + 1;
    }
//todo : 还有自己是群管理的时候又两个按钮
//     if(len < 10){//少于10个成员，只有一行
//         this.lenNum = 1;
//     } else{//多于10个成员
//         var num = len - 9;
//         this.lenNum = num % 10 === 0 ? parseInt( num / 10, 10 ) + 1 : parseInt( num / 10, 10 ) + 2;
//     }
    this.lenNum = itemNum % 10 === 0 ? parseInt( itemNum / 10, 10 ) : parseInt( itemNum / 10, 10 ) + 1;
    this.$memberList.css('height', ( this.lenNum * this.lenHeight ) + 'px');
    var memberAccountsWithoutCache = [];
    var memberAccounts = [];
    for(var i = 0; i < len; ++i) {
        if ( !cache.getPersonById( members[ i ].account ) ) {
            memberAccountsWithoutCache.push( members[ i ].account );
        }
        memberAccounts.push( members[ i ].account );
    }
    if ( memberAccountsWithoutCache.length > 0 ) {
        mysdk.getUsers( memberAccountsWithoutCache, ( function ( err, datas ) {
            for (var i = datas.length - 1; i >= 0; i--) {
                cache.updatePersonlist(datas[i]);
            }
            for ( i = memberAccounts.length - 1; i >= 0 ; i-- ) {
                this.addTeamMembersItem( id, memberAccounts[ i ], cache.getPersonById( memberAccounts[ i ] ) );
            }
        } ).bind( this ) );
    } else {
        for ( i = memberAccounts.length - 1; i >= 0 ; i-- ) {
            this.addTeamMembersItem( id, memberAccounts[ i ], cache.getPersonById( memberAccounts[ i ] ) );
        }
    }
};

UI.addTeamMembersItem = function ( teamId, account, data) {
    var userData = getUserData(data),
        avatar = userData.avatar,
        nickInTeam = getMemberNick( teamId, account, cache ),
        name = nickInTeam || userData.name,
        alias = nickInTeam || userData.alias,
        html = "";
    name = sliceName(name === alias ? name : alias, this.nameLen);
    html += '<img src="' + avatar + '" title="' + name + '" class="member-item" data-account="' + data.account + '">';
    this.$memberList.append(html);
};

UI.showMembers = function () {
    this.$memberList.css('height', ( this.lenNum * this.lenHeight ) + 'px').removeClass('an0').addClass('an1');
    this.$chatTitle.data('show', "1");
};

UI.hideMembers = function () {
    this.$memberList.removeClass('an1').addClass('an0').css('height', 0);
    this.$chatTitle.data('show', "0");
};

UI.initAddMemberTab = function () {
//    清空html
    this.$amFriendList.html("");
//    获取好友数据
//    todo: 分栏 am-line
    var data = cache.getFriendList(),
        len = data.length,
        teamId = this.$sessionList.find('.cur').data('account'),
        aliasList = getAliasList(),
        aLen = aliasList.length;
    if (typeof DEBUG !== "undefined") {
        //console.log("initAddMemberTab", data);
    }
    for(var i = 0; i < aLen; ++i){
        if(!aliasList[i]){
            continue
        }
        this.addAMTGroup(aliasList[i], teamId);
    }

};

UI.addAMTGroup = function (data, teamId) {
    if(!!data.key){//a-z
        var flag = false;
        for(var j = 0; j < data.group.length; ++j){
            if(!cache.isTeamMember(teamId, data.group[j])){
                flag = true;
                break;
            }
        }
        if(flag){
            this.$amFriendList.append("<div class='am-line'>" + data.key.toUpperCase() + "</div>");
            for(j = 0; j < data.group.length; ++j){
                this.addAddMemberItem(cache.getPersonById(data.group[j]));
            }
        }

    }else {//others
        var groups = [];
        for(var j = 0; j < data.length; ++j){
            groups = groups.concat(data[j].group);
        }
        if(groups.length === 0){
            return;
        }
        var flag = false;
        for(j = 0; j < groups.length; ++j){
            if(!cache.isTeamMember(teamId, groups[j])){
                flag = true;
                break;
            }
        }
        if(flag){
            this.$amFriendList.append("<div class='am-line'>" + "其它" + "</div>");
            for(j = 0; j < groups.length; ++j){
                this.addAddMemberItem(cache.getPersonById(groups[j]));
            }
        }

    }
    // //    渲染UI
    // for(var i = 0; i < len; ++i) {
    //     if(!cache.isTeamMember(teamId, data[i].account)){
    //         mysdk.getPersonMsg(data[i].account, this.addAddMemberItem.bind(this));
    //     }
    // }
};

UI.addAddMemberItem = function (data) {
    var useData = getUserData(data),
        account = useData.account,
        alias = useData.alias,
        name = useData.name,
        avatar = useData.avatar,
        html = "";

    name = sliceName(name === alias ? name : alias, this.nameLen);
    // debugger
    html += '<div class="tb-item am-friend-item" data-account="' + account  + '">';
    html +=   '<span class="tb-item-circle am-item-circle"></span>';
    // debugger
    html +=   '<img src="' +  avatar + '" alt="' + name + '" title="' + name + '" class="tb-item-avatar am-item-avatar">';
    html +=   '<div class="tb-item-alias am-item-alias">' + name + '</div>';
    html +=   '</div>';
    this.$amFriendList.append(html);
};

//    退群
UI.initLeaveTeamVerifyTab = function (teamId) {
    var data = cache.getTeamById(teamId + "");
    if (typeof DEBUG !== "undefined") {
        //console.log("ui::initLeaveTeamVerifyTab", data);
    }
    var name = data.name;
    this.$leaveTeamVerifyTab.find('.team-heading').html(name[0]);
    this.$leaveTeamVerifyTab.find('.team-name').html(name.slice(0, this.nameLen));
    this.$leaveTeamVerifyTab.find('#ltv-submit').data("id", data.teamId);
};

//    删除好友
UI.initDeleteFriendVerifyTabinitial = function (account) {
    var data = cache.getPersonById(account),
        name = getNick(account, cache),
        userData = getUserData(data),
        avatar = userData.avatar;
    if (typeof DEBUG !== "undefined") {
        //console.log("ui::initDeleteFriendVerifyTabinitial", data);
    }
    this.$deleteFriendVerifyTab.find('.tb-avatar-img').attr('src', avatar);
    this.$deleteFriendVerifyTab.find('.tb-name').html(name.slice(0, this.nameLen));
    this.$deleteFriendVerifyTab.find('#dfv-submit').data("id", account);
};

/**
 * init search-result-list-tab
 * @param { Object } data : search results return from server side
 * @returns {}
*/
UI.initFriendResultTab = function ( data ) {
    let html = "";
    if ( Array.isArray( data ) ) {
    //    多人
        let dLen = data.length;
        for ( let i = 0; i < dLen; ++i ) {
            html += this.getFriendResultItemHTML( data[ i ] );
        }
    } else {
    //    单人
        html = this.getFriendResultItemHTML( data );
    }
    this.$searchResultContainer.html( html );
    this.$searchResultListTab.removeClass( "hide" );
}

UI.getFriendResultItemHTML = function ( data ) {
    return `<div class="srl-item" data-account="${ data.uid }">
                    <div class="srl-item-avatar">
                        <img src="${ data.avatar }" alt="${ data.name }" title="${ data.name }" >
                    </div>
                    <div class="srl-item-text-container">
                        <div class="srl-item-nickname">${ sliceName( data.name, this.nameLen ) }</div>
                        <div class="srl-item-mtnum">${ data.mt_number }</div>
                    </div>
                    <div class="srl-item-add-btn"></div>
                </div>`;

}

//    添加好友弹框
UI.initVerifyApplyFriendTab = function (data) {
    var userData = getUserData(data),
        avatar = userData.avatar,
        name = userData.name,
        account = userData.account;

    if ( account === userUID ) {
        this.showAlert("对不起，您不能添加自己为好友。");
        return;
    }
    this.$applyFriendVerifyTab.find(".tb-avatar-img").attr("src", avatar);
    this.$applyFriendVerifyTab.find(".user-name").html(name);

    this.$applyFriendVerifyTab.find("#afv-submit").data("account", account);
    if ( cache.isFriend( account ) ) {
        this.$applyFriendVerifyTab.find("#afv-submit").html("发起聊天");
        this.$applyFriendVerifyTab.find(".tip-text").html("此用户已经是您的好友了，你可以向他发送消息。");
    }else {
        this.$applyFriendVerifyTab.find("#afv-submit").html("确定");
        this.$applyFriendVerifyTab.find(".tip-text").html("您确定要将该陌生人添加至个人通讯录中？添加好友后需等待对方同意。");
    }
    this.$applyFriendVerifyTab.removeClass("hide");
};

UI.clearSearchForFriendTab = function () {
    $('#tel-for-search').val("");
};

UI.updateUnread = function (sessionId) {
    var session = cache.findSession(sessionId),
        unread = session.unread;
    if(unread == 0){
        return
    }
    var $sessionItem = this.$sessionList.find('.session-item[data-id$=' + sessionId + ']');
    $sessionItem.data("unread", unread).find('.unread').html(unread).removeClass('hide');
};

UI.showUploadPercentage = function ( percentageText, sessionId ) {
    this.$uploadPercentageTab.find("#percentage").html(percentageText);
    this.$uploadPercentageTab.removeClass('hide');
    if(percentageText === "100%"){
        this.hideUploadPercentage();
        this.showAlert( "文件处理中，请稍候。。。", sessionId + this.uploadingFlag );
    }
};

UI.hideUploadPercentage = function () {
    if(!this.$uploadPercentageTab.hasClass('hide')){
        this.$uploadPercentageTab.addClass('hide');
    }
};

UI.initInputChattingHistoryPasswordTab = function ( sessionId ) {
    this.$checkChPwdTab.find( "#ccp-submit" ).data( "sessionid", sessionId );
}

UI.showInputChattingHistoryPasswordTab = function () {
    this.$checkChPwdTab.removeClass( "hide" );
}

UI.hideInputChattingHistoryPasswordTab = function () {
    this.addHideClassTo( this.$checkChPwdTab );
}

UI.clearInputChattingHistoryPasswordTab = function () {
    this.$checkChPwdTab.find( "input" ).val( "" );
}


module.exports = UI;