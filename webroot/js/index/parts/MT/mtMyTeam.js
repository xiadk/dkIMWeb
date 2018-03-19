var MT = {

}
MT.myTeam = function () {
    this.initMyTeamNode();
    this.addMyTeamEvent();
};
MT.initMyTeamNode = function () {
//    修改群名
    this.$editTeamNameIpt = $('#edit-team-name-ipt ');
    //    群组
    this.$chatTitle = $('.chat-title');
    this.$teamMemberLayout = $('#team-member-layout');
    this.$addMemberTab = $('#add-member-tab');
    this.$amFriendList = $('#am-friend-list');
    this.$amClose = $('#am-close');
    this.$amSubmit = $('#am-submit');
    this.$teamSetting = $('#team-setting');
    this.$dmFriendList = $('#dm-friend-list');
    this.$dmClose = $('#dm-close');
    this.$dmSubmit = $('#dm-submit');
    this.$spSubmit = $('#sp-submit');
    this.$deleteMemberTab = $('#delete-member-tab');
    this.$leaveTeamVerifyLayout = $('#leave-team-verify-tab');
    this.$ltvClose = $('#ltv-close');
    this.$leaveTeamSubmit = $('#ltv-submit');
    this.$teamSettingMenu = $('.team-setting-menu-layout');
};
MT.addMyTeamEvent = function () {
//    修改群名
    this.$editTeamNameIpt.on('blur', this.changeTeamNameBlurHandler.bind(this));
    this.$editTeamNameIpt.on('keydown', this.changeTeamNameKeyDownHandler.bind(this));
    //    群组
    this.$chatTitle.on('click', this.showMembers.bind(this));
    //添加群成员
    this.$teamMemberLayout.delegate('#add-item', 'click', this.showAddMemberTab.bind(this));
    this.$amFriendList.delegate('.am-friend-item', 'click', this.addMembers.bind(this));
    this.$amClose.on('click', this.closeAddMemberTab.bind(this));
    this.$amSubmit.on('click', this.addMemberSubmit.bind(this));
    //删除群成员
    this.$teamMemberLayout.delegate('#delete-member-item', 'click', this.showDeleteMemberTab.bind(this));
    //显示用户名片
    this.$teamMemberLayout.delegate('.member-item', 'click', this.showInfoInChat.bind(this));
    this.$dmClose.on('click', this.hideDeleteMemberTab.bind(this));
    //批量删除群成员
    this.$dmSubmit.on('click', this.deleteTeamMembersHandler.bind(this));
    this.$dmFriendList.delegate('.dm-friend-item', 'click', (function(that){
        return function () {
            $(this).toggleClass("selected");
            that.hideDMSearchedList();
        };
    })(this));
    // this.$dmFriendList.delegate('.tb-item', 'click', this.selectMemberToDelete.bind(this));
    //添加群组中的陌生人为好友
    this.$applyFriendInTeam.on('click', this.showVerifyApplyFriendTab.bind(this));
    this.$spSubmit.on('click', this.searchPeopleToApply.bind(this));
    //设置
    //设置菜单
    this.$teamSetting.on('click', this.toggleTeamSettingMenu.bind(this));
    this.$leaveTeamSubmit.on('click', this.leaveTeam.bind(this));

    this.$teamSettingMenu.delegate('.team-setting-menu-item', 'click', this.teamSettingFunc.bind(this));
    this.$ltvClose.on('click', this.hideLeaveTeamVerifyTab.bind(this));
};

MT.showAddMemberTab = function () {
    //ui 渲染
    this.ui.initAddMemberTab();
    //显示alert
    this.$addMemberTab.show();
};

//修改群名
MT.changeTeamNameKeyDownHandler = function (e) {
    var evt = e || window.event;
    if(evt.keyCode !== 13){
        return;
    }
    var $ele = $(evt.target),
        name = $ele.val(),
        nameBefore = this.$nickName.html(),
        that = this,
        $curSessionItem = $('.session-item.cur'),
        teamId = $curSessionItem.data('account');
    if(name === nameBefore){
        this.hideEditTeamNameIpt();
    }else {
        var scene = $curSessionItem.data('scene');
        if(scene === "team"){
            this.changeTeamName(teamId, name, this.changeTeamNameDone.bind(that));
        }else if (scene === "p2p") {
            this.changeFriendAlias(teamId, name, this.updateFriendDone.bind(this));
        }else {

        }

    }
};

MT.changeTeamNameBlurHandler = function ( e ) {
    if ( this.dontBlur ) {
        return;
    }
    var evt = e || window.event,
        $ele = $( evt.target ),
        name = $ele.val(),
        nameBefore = this.$nickName.html(),
        that = this,
        $curSessionItem = $( '.session-item.cur' ),
        account = $curSessionItem.data( 'account' );
    if ( name === nameBefore ) {
        this.hideEditTeamNameIpt();
    } else {
        if ( $.trim( name ).length > this.nickLimitLen ) {
            this.hideEditTeamNameIpt();
            alert( "名称过长，请输入小于16个字符的名称。" );
            return;
        }
         var scene = $curSessionItem.data('scene');
        if( scene === "team" ){
            this.changeTeamName( account, name, this.changeTeamNameDone.bind( that ) );
        } else if ( scene === "p2p" ) {
            this.changeFriendAlias( account, name, this.updateFriendDone.bind( that ) );
        } else {

        }
    }
};

MT.changeTeamName = function (teamId, name, callback) {
    mysdk.updateTeam({
        teamId: teamId,
        name: name,
        done: callback
    });
};

MT.changeTeamNameDone = function (error, team) {
    if (typeof DEBUG !== "undefined") {
        console.log('更新群' + (!error?'成功':'失败'), error, team);
    }
    if(!error){
        cache.updateTeam(team.teamId, {
            name : team.name
        });
        this.ui.initSessionList();
        this.hideEditTeamNameIpt();
    }else {
        alert("修改失败，请稍后重试！");
        this.hideEditTeamNameIpt();
    }

};

MT.showChangeTeamNameTab = function () {
    if(!this.$nickName.hasClass('hide')){
        this.$nickName.addClass('hide');
        this.dontBlur = true;
        setTimeout( ( function () {
            this.dontBlur = false;
        } ).bind( this ), 0 );
        this.$editTeamNameIpt.removeClass('hide').val(this.$nickName.html()).get(0).focus();
    }

};

MT.hideEditTeamNameIpt = function () {
    if ( this.$nickName.hasClass( 'hide' ) ) {
        this.$nickName.removeClass( 'hide' );
    }
    this.addHideClassTo( this.$editTeamNameIpt );
};

MT.toggleTeamSettingMenu = function ( e ) {
    var evt = e || window.event,
        $ele = $( evt.target ),
        id = $ele.data( "id" ),
        arr = id.split( '-' ),
        scene = arr[ 0 ],
        account = arr[ 1 ];
    if ( typeof DEBUG !== "undefined" ) {
        console.log("toggleTeamSettingMenu::id", id);
    }
    if ( scene === "team" ) {//      session scene is team
        //未同步群成员
        if( !cache.getTeamMembers( account ) ) {
            this.getTeamMembers( account, ( function ( err, data ) {
                //获得群成员数据
                this.showTeamMenu( err, account );
            } ).bind( this ) );
        } else {
            this.showTeamMenu( null, account );
        }

    } else if( scene === "p2p" ){//    session scene is p2p
        //我的手机的菜单，没有删除好友和修改备注选项
        //如果以后允许陌生人聊天，这里应该要有一个添加好友的选项
        if ( account + "" === userUID || !cache.isFriend( account ) ) {
            this.addClassTo( "my-mobile", this.$friendSettingMenu );
            this.$friendSettingMenu.toggleClass( 'hide' );
        } else {
            this.$friendSettingMenu.removeClass( "my-mobile" ).toggleClass( 'hide' );
        }


    }else {//    error case

    }
};

MT.showTeamMenu = function ( err, account ) {
    //用户非管理员，或获取群成员数据出错，隐藏修改群名选项
    if( !cache.isTeamManager( userUID, account ) || !!err ) {
        this.addHideClassTo( this.$teamSettingMenu.find(".change-team-name") );
    } else {//用户是管理员，开放修改群名权限
        this.$teamSettingMenu.find(".change-team-name").removeClass('hide');
    }
    this.$teamSettingMenu.toggleClass('hide');
}

MT.closeAddMemberTab = function () {
    this.$amFriendList.find('.am-item-circle').removeClass('selected');
    this.$addMemberTab.hide();
    this.ui.hideMembers();
};

MT.showMembers = function (e) {
    var evt = e || window.event,
        $ele = $(evt.target);
    if($ele.hasClass('add-team-member') || ($ele.hasClass('nick-name') && $ele.parent('.chat-title').find('.add-team-member').css('display') !=='none') || ($ele.hasClass('arrows-layout') && $ele.parent('.chat-title').find('.add-team-member').css('display') !=='none')){
        if (typeof DEBUG !== "undefined") {
            console.log("can");
        }
        if(this.$chatTitle.data('show') == '1'){
            this.ui.hideMembers();
        } else {
            var teamId = this.$sessionList.find('.cur').data('account');
            if (typeof DEBUG !== "undefined") {
                console.log(teamId);
            }
            var alertID = Date.now();
            this.ui.showAlert( "数据加载中，请稍候。", alertID );
            mysdk.getTeamMembers(teamId, this.getTeamMembersDone.bind(this, alertID));
        }
    //    can show members
    //    get teamID
    }else {
        if (typeof DEBUG !== "undefined") {
            console.log("can't");
        }
    }
};

MT.getTeamMembersDone = function ( alertID, err, obj ) {
    if (!err) {
        //    cache teamMembers
        cache.setTeamMembers( obj.teamId, obj );
        this.setTeamMembersDone( obj.teamId );
        if( !!this.ui.$alertsButton[ alertID ] ){
            // setTimeout( (function () {
            this.ui.hideAlert( this.ui.$alertsButton[ alertID ] );
            // } ).bind(this), this.ui.alertHideDelay);

        }
    } else {
        if( !!this.ui.$alertsButton[ alertID ] ) {
            this.ui.hideAlert(this.ui.$alertsButton[alertID]);
        }
        this.ui.showAlert( err.message );
    }

};

MT.setTeamMembersDone = function (id) {
    //    initMembersUI
    this.ui.initTeamMembers(id);
    //    showMembersUI
    this.ui.showMembers();
};

//群设置
MT.teamSettingFunc = function (e) {
    var evt = e || window.event,
        $ele = $(evt.target),
        id = $ele.data('id');
    switch (id) {
        case 0:
            if (typeof DEBUG !== "undefined") {
                console.log("chatting-history");
            }
            let sessionId = this.getCurrentSessionId();
            if ( !sessionId ) {
                this.ui.showAlert( "非法操作！未指定要查看的会话" );
                return false;
            } else {
                this.showChattingHistoryItemHandler( sessionId );
            }
            // this.showChattingHistory();
            break;
        case 1:
            if (typeof DEBUG !== "undefined") {
                console.log("change-team-name");
            }
            this.showChangeTeamNameTab();
            break;
        case 2:
            if (typeof DEBUG !== "undefined") {
                console.log("quit team");
            }
            this.showLeaveTeamVerifyTab($('.session-item.cur').data('account'));
            break;
        default:
            break;
    }
    this.$teamSettingMenu.addClass('hide');
};

MT.hideLeaveTeamVerifyTab = function () {
    if(!this.$leaveTeamVerifyLayout.hasClass('hide')){
        this.$leaveTeamVerifyLayout.addClass('hide');
    } else {

    }
};

MT.hideDeleteFriendVerifyTab = function () {
    if(!this.$deleteFriendVerifyTab.hasClass('hide')){
        this.$deleteFriendVerifyTab.addClass('hide');
    } else {

    }
};

MT.showLeaveTeamVerifyTab = function (teamId) {
    if(this.$leaveTeamVerifyLayout.hasClass('hide')){
        this.ui.initLeaveTeamVerifyTab(teamId);
        this.$leaveTeamVerifyLayout.removeClass('hide');
        //确定时leave
        // this.leaveTeam(teamId);
    } else {

    }

};

MT.leaveTeam = function (e) {
    var evt = e || window.event,
        $ele = $(evt.target),
        teamId = $ele.data('id'),
        teamData = cache.getTeamById(teamId + ""),
        owner = teamData.owner,
        that = this;
    if (typeof DEBUG !== "undefined") {
        console.log("leave team", teamId);
    }
    if(owner != userUID){
    //    not owner leave team
        mysdk.leaveTeam({
            teamId: teamId,
            done: this.leaveTeamDone.bind(this)
        })
    }else {
    //    is owner dismiss team
        mysdk.dismissTeam({
            teamId: teamId,
            done: this.dismissTeamDone.bind(this)
        })
    }
    this.hideLeaveTeamVerifyTab();
};

MT.leaveTeamDone = function (err, data) {
    if ( typeof DEBUG !== "undefined" ) {
        console.log( '主动退群' + ( !err ? '成功' : '失败' ), err, data );
    }
    // debugger
    // this.deleteLocalSession( "team-" + data.teamId );
    //删除缓存
    cache.removeTeamById( data.teamId );
};

MT.dismissTeamDone = function (error, data) {
    if (typeof DEBUG !== "undefined") {
        console.log('解散群' + (!error?'成功':'失败'), error, data);
    }
    // debugger
    // this.deleteLocalSession( "team-" + data.teamId );
    //删除缓存
    cache.removeTeamById( data.teamId );
};

MT.messageTextKeyDown = function (e) {
    var evt = e || window.event,
        $ele = $(evt.target);
    if(evt.keyCode == 13 && evt.ctrlKey){
        $ele.val($ele.val() + "\n");
    }else if(evt.keyCode == 13 ){
        this.$send.get(0).click();
    }else {

    }
};

//show delete member tab
MT.showDeleteMemberTab = function () {
    if (typeof DEBUG !== "undefined") {
        console.log("showDeleteMemberTab");
    }

    this.ui.initDeleteMemberTab($('.session-item.cur').data('account'));
    this.$deleteMemberTab.removeClass('hide');
};

MT.hideDeleteMemberTab = function () {
    if(!this.$deleteMemberTab.hasClass("hide")){
        this.$deleteMemberTab.addClass("hide");
    }

};

MT.selectMemberToDelete = function (e) {
    $(this).toggleClass("selected");
};

MT.deleteTeamMembersHandler = function (e) {//点击确定
    var items = this.$dmFriendList.find('.selected'),
        accounts = [];
    if(items.length === 0){
        this.hideDeleteMemberTab();
        return;
    }
    var teamId = $('.session-item.cur').data("account");
    $.each(items, function (i, val) {
        accounts.push($(val).data("account"));
    });
    mysdk.nim.removeTeamMembers({
        teamId: teamId,
        accounts: accounts,
        done: this.removeTeamMembersDone.bind(this)
    });
    this.hideDeleteMemberTab();

};

MT.removeTeamMembersDone = function (error, obj) {
    if (typeof DEBUG !== "undefined") {
        console.log('踢人出群' + (!error?'成功':'失败'), error, obj);
    }
    if(!error){
        alert("删除成功！");
         this.ui.hideMembers();
    }

};

MT.addMembers = function (e) {
    var evt = e || window.event,
        $ele = $(evt.target),
        $this;
    if($ele.hasClass('am-friend-item')){
        $this = $ele;
    }else {
        $this = $ele.parents(".am-friend-item");
    }
    // debugger
    var $circle = $this.find('.am-item-circle');
    if(!$circle.hasClass('selected')){
        $circle.addClass('selected');
    } else {
        $circle.removeClass('selected');
    }
    this.hideAMSearchedList();
};

MT.addMemberSubmit = function () {
    var $eles = this.$amFriendList.find('.selected').parent('.am-friend-item'),
        len = $eles.length;
    if(len <= 0){
        this.closeAddMemberTab();
        return false;
    } else {
        var accounts = [],
            that = this,
            teamId =  this.$sessionList.find('.cur').data('account');
        for(var i = 0; i < len; ++i){
            accounts.push($($eles[i]).data('account'));
        }
        mysdk.addTeamMembers({
            teamId: teamId,
            accounts: accounts,
            done : function (err, obj) {
                if(!err){
                    alert('添加成员成功');
                    that.closeAddMemberTab();
                }else {
                    alert('添加成员失败');
                }
            }
        })
    }
};

MT.checkValidTeamMap = function ( sessionId ) {
    var arr = sessionId.split( '-' ),
        that = this,
        scene = arr[ 0 ],
        account = arr[ 1 ];
    if( scene === 'p2p' && Object.keys( this.validTeamMap ).length === 0 ) {
        return;
    }
//    check if validTeamMap has true value
    for( var key in this.validTeamMap ) {
       if ( this.validTeamMap[ key ] ) {
       //    check if sessionId = thisSessionId
           if( key == account ){
               return;
           } else {
               //  delete session
               this.deleteLocalSession( "team-" + key );
           }
       }
    }
    // debugger
    var isValid = !!cache.getTeamById( account ) && cache.getTeamById( account ).valid;
    if( !isValid ) {
        //此群无效
        //    add validTeamMap
        this.validTeamMap[ account ] = true;
    } else {

    }
};

MT.searchPeopleToApply = async function () {
    var searchKey = $('#tel-for-search').val().trim();
    this.hideSearchForFriendTab();
    let trimReg = /^\s+|\s+$/g;
    searchKey = searchKey.replace( trimReg, "" );
    if ( searchKey === "" ) {
        $( '#not-found-tab' ).removeClass( 'hide' );
        return;
    }
    let res;
    try {
        res = await this.sendSearchPeopleRqeust( searchKey );
    } catch ( e ) {
        if ( typeof DEBUG !== "undefined" ) {
            console.error( "sendSearchPeopleRqeustError: ", e );
        }
        if ( e !== "timeout" ) {
            this.ui.showAlert( "请求异常，请稍候再试！" );
        }
        return;
    }
    let data = checkJSON( res );
    if ( !data ) {
        this.ui.showAlert( "请求异常，请稍候再试！" );
        return;
    }
    if ( !!data.msgId && data.msgId === "0200" ) {
        if ( !!data.user || !!data.users ) {
            if ( !!data.users && data.users.length === 0 ) {
                 $( '#not-found-tab' ).removeClass( 'hide' );
            } else {
                this.ui.initFriendResultTab( data.user || data.users );
            }
        } else {
            this.ui.showAlert( "请求异常，请稍候再试！" );
            return;
        }
    } else if ( !!data.msgId && data.msgId === "0414" ) { //result not found
        $( '#not-found-tab' ).removeClass( 'hide' );
    } else {
        $( '#not-found-tab' ).removeClass( 'hide' );
    }
}

module.exports = MT











