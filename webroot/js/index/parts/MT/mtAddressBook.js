var MT = {

}

MT.addressBook = function () {
    this.initABNode();
    this.addABEvent();
};

MT.initABNode = function () {
    //    通讯录
    this.$addressBookList = $( '#address-book-list' );
    this.$infoContent = $( '#info-content' );
    this.$tabViewContainer = $( '.tab-view-container' );
};

MT.addABEvent = function () {
//  通讯录
    this.$addressBookList.delegate( '.ab-item', 'click', this.showDetail.bind( this ) );
    this.$infoContent.delegate( '#info-de-send', "click", this.abSend.bind( this ) );
    this.$infoContent.delegate( '#info-de-serMsg', "click", this.showChattingHistoryWithFriend.bind( this ) );
    //好友的朋友圈
    this.$infoContent.delegate( '#info-de-fs', "click", this.showFriendsSpaceHandler.bind( this ) );

    this.$infoContent.delegate( '#delete-friend', "click", this.showDeleteFriendVerifyTab.bind( this ) );
    this.$infoContent.delegate( '.change-friend-alias', "click", this.showAliasEditIpt.bind( this ) );
    this.$infoContent.delegate( '.alias-edit-ipt', "blur", this.changeFriendAliasBlurHandler.bind( this ) );
    this.$infoContent.delegate( '.alias-edit-ipt', "keydown", this.changeFriendAliasKeyDownHandler.bind( this ) );
    this.a = "ab8ef";
};

/**
 * address book item click handler
 * @param { Object } e event object
 * @returns {}
*/
MT.showDetail = function ( e ) {
//    set current scene and id
    var evt = e || window.event,
        $ele = $( evt.target ),
        id;
    if ( $ele.hasClass( 'cur' ) || $ele.parent( '.ab-item' ).hasClass( 'cur' ) ) {
        return;
    }
    this.$addressBookList.find( '.ab-item' ).removeClass( 'cur' );
    if ( $ele.hasClass( 'ab-item' ) ) {
        $ele.addClass( 'cur' );
        id = $ele.data( "id" );
    } else {
        $ele.parent( '.ab-item' ).addClass( 'cur' );
        id = $ele.parent( '.ab-item' ).data( "id" );
    }
    //当前通讯录正在显示的sessionId(p2p-****)
    this.infoId = id;
    let arr = id.split( "-" );
    this.curABAccid = arr[ 1 ];
    this.curABScene = arr[ 0 ];
    this.refreshInfoUI();
};

/**
 * refresh address book detail part( right part )
 * @param {}
 * @returns {}
*/
MT.refreshInfoUI = function () {
    if ( !this.infoId ) {
        return;
    }
    var arr = this.infoId.split( "-" ),
        scene = arr[ 0 ],
        account = arr[ 1 ],
        temp = "";
    if ( scene === "p2p" ) {
        temp = this.ui.getFriendInfoBox( account );
        this.$infoContent.html( temp );
    } else if ( scene === "team" ) {
    //    群组
    }
};

/**
 * send message btn click handler in address book detail part
 * jump to session tab & click the session tab or create a new session with this friend
 * @param { Object } e event object
 * @returns {}
*/
MT.abSend = function ( e ) {
    var evt = e || window.event,
        $ele = $( evt.target ),
        id = $ele.data( "id" ),
        arr = id.split( '-' ),
        scene = arr[ 0 ],
        account = arr[ 1 ],
        $sessionItems = this.$sessionList.find( '.session-item' ),
        $tabViewContainer = $( '.tab-view-container' ),
        isHava = false,
        that = this;

    $.each( $sessionItems, function ( i, val ) {
        var $val = $( val );
        if ( $val.data(  'id' ) === id ) {
            //回到会话面板
            $( '#session' )[ 0 ].click();
            //点击该会话
            $val[ 0 ].click();
            //滚动到会话标签的位置
            var conTop = that.$sessionList.offset().top;
            var top1 = parseFloat( $val.offset().top - conTop );
            $tabViewContainer.scrollTop( top1 );
            isHava = true;
        }
    } );
    if ( !isHava ) {
        //    当前会话列表中无此用户地会话
        mysdk.nim.insertLocalSession( {
            scene: scene,
            to: account,
            done: that.insertLocalSessionDone.bind( that )
        } );
    }
};

/**
 * insert a local session in NIM done callback function
 * refresh session cache, session list, add cur class to that session tab, up that session tab to the top of session list
 * @param { Object } error value is null when success, else means insert local session fail
 * @param { Object } obj contain the session object when insert success
 * @returns {}
*/
MT.insertLocalSessionDone = function ( error, obj ) {
    if ( typeof DEBUG !== "undefined" ) {
        console.log( '插入本地会话记录' + ( !error ? '成功' : '失败' ), error, obj );
    }
    if ( !error ) {
        //todo: unnecessary cache.push and refresh
        var old = cache.getSessions(),
            session = obj.session,
            id = session.id;
        cache.setSessions( mysdk.nim.mergeSessions( old, session ) );
        this.ui.initSessionList();
        // this.ui.upSessionItemById( id );//null ?
        this.clickSessionItem( id );
        this.showSessionTab();
        this.scrollToSessionTop();
    } else {
        if ( error.message === "会话已存在" ) {
            let sessionId = obj.scene + "-" + obj.to,
                session = cache.getANewSession( sessionId );
            cache.unshiftSession( session );
            this.ui.initSessionList();
            // this.ui.upSessionItemById( id );//null ?
            this.clickSessionItem( sessionId );
            this.showSessionTab();
            this.scrollToSessionTop();
        } else {
            this.ui.showAlert( "会话生成失败，请稍候再试！" );
        }
    }
};

/**
 * scroll to the session tab with class cur
 * @param {}
 * @returns {}
*/
MT.scrollToSessionCur = function () {
    var $val = this.$sessionList.find( '.cur' ),
        conTop = this.$sessionList.offset().top;
    if ( $val.length === 0 ) {
        this.scrollToTop();
        return;
    }
    var top1 = parseFloat( $val.offset().top - conTop );
    this.$tabViewContainer.scrollTop( top1 );
};

MT.scrollToSessionTop = function () {
    this.$tabViewContainer.scrollTop( 0 );
}

/**
 * scroll to the address book tab with class cur
 * @param {}
 * @returns {}
*/
MT.scrollToABCur = function () {
    var $val = this.$addressBookList.find( '.cur' ),
        conTop = this.$addressBookList.offset().top;
    if ( $val.length === 0 ) {
        this.scrollToTop();
        return;
    }
    var top1 = parseFloat( $val.offset().top - conTop );
    this.$tabViewContainer.scrollTop( top1 );
};

//通讯录面板 => 修改备注
/**
 * change friend's alias btn click handler
 * @param { Object } e event object
 * @returns {}
*/
MT.showAliasEditIpt = function ( e ) {
    var evt = e || window.event,
        $ele = $( evt.target ),
        $alias = $( '#info-de-alias em' ),
        alias = $alias.html();
    $alias.hide();
    this.dontBlur = true;
    setTimeout( ( function () {
        this.dontBlur = false;
    } ).bind( this ), 0 );
    $( '.alias-edit-ipt' ).removeClass( 'hide' ).val( alias ).get( 0 ).focus();
};

/**
 * hide change alias input & show friends alias div
 * @param {}
 * @returns {}
*/
MT.hideAliasEditIpt = function () {
    $( '#info-de-alias em' ).show();
    this.addHideClassTo( $( '.alias-edit-ipt' ) );
};

/**
 * listen keydown event when user input in change alias input element
 * if enter "enter", fire change alias function
 * @param { Object } e event object
 * @returns {}
*/
MT.changeFriendAliasKeyDownHandler = function ( e ) {
    var evt = e || window.event;
    if ( evt.keyCode !== 13 ) {
        return;
    }
    var $ele = $( evt.target ),
        alias = $ele.val(),
        arr = $ele.data( "id" ).split( '-' ),
        scene = arr[ 0 ],
        account = arr[ 1 ],
        aliasBefore = getUserData( this.cache.getPersonById( account ) ).alias;
    if ( alias === aliasBefore ) {
        this.hideAliasEditIpt();
    } else {
        this.changeFriendAlias( account, alias, this.updateFriendDone.bind( this ) );
    }
};

/**
 * listen blur event of the change alias input element
 * fire change alias function when blur event fired
 * @param { Object } e event object
 * @returns {}
*/
MT.changeFriendAliasBlurHandler = function ( e ) {
    if ( this.dontBlur ) {
        return;
    }
    var evt = e || window.event,
        $ele = $( evt.target ),
        alias = $.trim( $ele.val() ),
        arr = $ele.data( "id" ).split( '-' ),
        scene = arr[ 0 ],
        account = arr[ 1 ],
        aliasBefore = getUserData( this.cache.getPersonById( account ) ).alias;
    if ( alias === aliasBefore ) {
        this.hideAliasEditIpt();
    } else {
        if( alias.length > this.nickLimitLen ){
            this.hideAliasEditIpt();
            this.ui.showAlert( "名称过长，请输入长度小于16的名称。" );
            return;
        }
        this.changeFriendAlias( account, alias, this.updateFriendDone.bind( this ) );
    }
};


module.exports = MT














