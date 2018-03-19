var MT = {

}

MT.friend = function () {
    this.initFriendNode();
    this.addFriendEvent();
};

MT.initFriendNode = function () {
    //    发送好友申请
    this.$applyFriendInTeam = $('#apply-friend-in-team');
    this.applyFriendVerifyTab = $("#apply-friend-verify-tab");
    //    好友
    this.$deleteFriendVerifyTab = $('#delete-friend-verify-tab');
    this.$dfvClose = $('#dfv-close');
    this.$deleteFriendSubmit = $('#dfv-submit');
    this.$searchPersonTab = $('#search-person-tab');
    this.$friendSettingMenu = $('.p2p-setting-menu-layout');
    this.$fsMyNotationList = $('.fs-my-notation-list');
    this.$ccpClose = $( "#ccp-close" );
    this.$ccpSubmit = $( "#ccp-submit" );
    this.$pwdForChecking = $( "#pwd-for-checking" );
};

MT.addFriendEvent = function () {
    this.$friendSettingMenu.delegate('.p2p-setting-menu-item', 'click', this.friendSettingFunc.bind(this));
//    好友
    this.$dfvClose.on('click',  this.hideDeleteFriendVerifyTab.bind(this));
    this.$deleteFriendSubmit.on('click', this.deleteFriend.bind(this));
    $("#afv-submit").on('click', this.applyFriendSubmit.bind(this));
    $("#afv-close").on('click', this.hideApplyFriendVerifyTab.bind(this));
    $('#sp-close').on('click', this.hideSearchForFriendTab.bind(this));
    $('#nf-submit').on('click', this.hideNotFoudTab.bind(this));
    this.p = "235f";
    this.$ccpClose.on( "click", this.hideCheckCHPwdBtnClickHandler.bind( this ) );
    this.$ccpSubmit.on( "click", this.chattingHistoryPasswordSubmitHandler.bind( this ) );
};




MT.changeFriendAlias = function ( account, alias, callback ) {
    mysdk.updateFriend( account, alias, callback );
};

MT.updateFriendDone = function ( error, data ) {
    if ( typeof DEBUG !== "undefined" ) {
        console.log( '更新好友' + ( !error ? '成功' : '失败' ), error, data );
    }
    if ( !error ) {
        cache.updateFriendAlias( data.account, data.alias );
        this.ui.initAbFriendList();
        this.ui.initSessionList();
        this.hideEditTeamNameIpt();
    } else {
        this.ui.showAlert( "修改失败，请稍后重试!" );
        if ( !$( '.alias-edit-ipt' ).hasClass( 'hide' ) ) {
            $( '.alias-edit-ipt' ).addClass( 'hide' );
            $( '#info-de-alias em' ).show();
        }
        this.hideEditTeamNameIpt();
    }
};

MT.friendSettingFunc = function ( e ) {
    var evt = e || window.event,
        $ele = $( evt.target ),
        id = $ele.data( 'id' );
    switch ( id ) {
        case 0:
            let sessionId = this.getCurrentSessionId();
            if ( !sessionId ) {
                this.ui.showAlert( "非法操作！未指定要查看的会话" );
                return false;
            } else {
                this.showChattingHistoryItemHandler( sessionId );
            }
            break;
        case 1:
            this.showChangeTeamNameTab();
            break;
        case 2:
            this.ui.initDeleteFriendVerifyTabinitial( this.crtSessionAccount || $( '.session-item.cur' ).data( 'account' ) );
            this.$deleteFriendVerifyTab.removeClass( 'hide' );
            break;
        default:
            break;
    }
    this.addHideClassTo( this.$friendSettingMenu );
};

/**
 * handler func for clicking chatting history item
 * @param { String } sessionId: sessionId of session to brower chatting history
 * @returns {}
*/
MT.showChattingHistoryItemHandler = function ( sessionId ) {
    this.ui.initInputChattingHistoryPasswordTab( sessionId );
    this.ui.showInputChattingHistoryPasswordTab();
}

MT.chattingHistoryPasswordSubmitHandler = async function () {
    let chattingHistoryPassword = $.trim( this.$pwdForChecking.val() );
    if ( !chattingHistoryPassword ) {
        return;
    }
    let res;
    try {
        res = await this.sendCheckCHPwdRequest( { chattingHistoryPassword } );
    } catch ( e ) {
        if ( typeof DEBUG !== "undefined" ) {
            console.error( "sendCheckCHPwdRequestError: ", e );
        }
        if ( e !== "timeout" ) {
            this.ui.showAlert( "请求异常，请稍候再试！" );
        }
        return false;
    }
    let data = checkJSON( res );
    if ( data.msgId === "0200" ) {
        this.ui.hideInputChattingHistoryPasswordTab();
        this.ui.clearInputChattingHistoryPasswordTab();
        this.showChattingHistory();
    } else {
        this.ui.showAlert( "密码错误，请稍候再试！" );
        this.ui.clearInputChattingHistoryPasswordTab();
    }
}

MT.hideCheckCHPwdBtnClickHandler = function () {
    this.ui.clearInputChattingHistoryPasswordTab();
    this.ui.hideInputChattingHistoryPasswordTab();
}

/**
 * get current session's sessionId
 * @param {}
 * @returns { String } sessionId: current sessionId
 * @returns { Boolean } false: don't have current session
*/
MT.getCurrentSessionId = function () {
    if ( !!this.crtSessionType && !!this.crtSessionAccount ) {
        return this.crtSessionType + "-" +this.crtSessionAccount;
    } else {
        return false;
    }

}

MT.showDeleteFriendVerifyTab = function ( e ) {
    if ( this.$deleteFriendVerifyTab.hasClass( 'hide' ) ) {
        var evt = e || window.event,
            $ele = $( evt.target ),
            account = this.crtSessionAccount || $ele.data( 'id' ).split( '-' )[ 1 ];
        if ( !account ) {
            this.ui.showAlert( "请先选择一个好友！" );
            return;
        }
        this.ui.initDeleteFriendVerifyTabinitial( account );
        this.$deleteFriendVerifyTab.removeClass( 'hide' );
    } else {

    }

};

MT.deleteLocalSession = function ( sessionId ) {
    var that = this;
    if ( typeof DEBUG !== "undefined" ) {
        console.log( "deleteLocalSession", sessionId );
    }
    // debugger
    mysdk.nim.deleteLocalSession( {
        id: sessionId,
        //    refresh sessionList
        done: that.deleteLocalSessionDone.bind( that )
    } );
};

//    refresh sessionList
MT.deleteLocalSessionDone = function ( err, data ) {
    if ( typeof DEBUG !== "undefined" ) {
        console.log( '删除本地会话' + ( !err ? '成功' : '失败'), err, data );
    }

    if( !err ) {
        //删除云端会话
        var that = this,
            arr = data.id.split( "-" ),
            scene = arr[ 0 ],
            to = arr[ 1 ];
        mysdk.nim.deleteSession( {
            scene: scene,
            to: to,
            //    refresh sessionList
            done: that.deleteCloudSessionDone.bind( that )
        } );

    }
};

//p2p session OR team session
MT.deleteCloudSessionDone = function ( err, data ) {
    if ( typeof DEBUG !== "undefined" ) {
        console.log( '删除云端会话' + ( !err ? '成功':'失败' ), err, data );
    }
    if ( !err ) {
        //   本地缓存删除session
        var sessionId = data[ 0 ].scene + "-" + data[ 0 ].to;
        cache.removeSession( sessionId );
        this.ui.initSessionList();
        if( this.validTeamMap[ data[ 0 ].to ] ) {
            this.validTeamMap[ data[ 0 ].to ] = false;
        }
    }
}

MT.deleteFriend = async function ( e ) {
    var evt = e || window.event,
        $ele = $( evt.target ),
        account = $ele.data( 'id' ),
        that = this;
    this.hideDeleteFriendVerifyTab();
    let res;
    try {
        res = await this.sendDeleteFriendRequest( account );
    } catch ( e ) {
        if ( typeof DEBUG !== "undefined" ) {
            console.error( "sendDeleteFriendRequestError: ", e );
        }
        if ( e !== "timeout" ) {
            this.ui.showAlert( "删除好友失败，请稍候再试！" );
        }
        return;
    }
    let data = checkJSON( res );
    if ( !data || !data.msgId ) {
        this.ui.showAlert( "请求异常，请稍候再试！" );
    }
    if ( data.msgId === "0200" ) {
        this.ui.showAlert( "删除好友成功！" );
        cache.removeFriend( account );
        this.ui.initAbFriendList();
        // this.deleteLocalSession('p2p-' + account);
    } else {
        this.ui.showAlert("删除好友失败，请稍候再试！");
    }
};

MT.applyFriend = function ( account ) {
    mysdk.nim.applyFriend( {
        account: account,
        ps: '请求加为好友',
        done: this.applyFriendDone.bind( this )
    } );
};

MT.applyFriendDone = function ( error, data ) {
    if ( typeof DEBUG !== "undefined" ) {
        console.log( "applyFriendDone", '申请加为好友' + ( !error ? '成功' : '失败' ), error, data );
    }
    if ( !error ) {
        this.ui.showAlert( "好友申请已发送!" );
    }else {
        this.ui.showAlert( "好友申请发送失败，请稍后重试！" );
    }
    this.hideApplyFriendVerifyTab();
    this.hideSearchResultTab();
};

MT.hideApplyFriendVerifyTab = function () {
    if ( typeof DEBUG !== "undefined" ) {
        console.log( "hideAddFriendTab" );
    }
    if ( !this.applyFriendVerifyTab.hasClass( "hide" ) ) {
        this.applyFriendVerifyTab.addClass( "hide" );
    }
};

MT.passFriendApplyHandler = function ( friendData ) {
//    缓存中添加朋友
    this.cache.addFriend( friendData );
//    通讯录刷新
    this.ui.initAbFriendList();
//    alert通知
    this.ui.showAlert( getUserData( this.cache.getPersonById( friendData.account ) ).alias + "通过了您的好友申请！");
};



module.exports = MT






























