var MT = {

}
MT.friendSpace = function () {
    this.initFriendSpaceNode();
    this.addFriendSpaceEvent();
    this.photoIptList = [];
    this.photoList = [];
    this.photoUploadedCount = 0;
    this.ifCanComment = true;//是否可点击评论按钮，防止连点
    this.ifCanRefresh = true;//是否可刷新秘圈，防止连点
    this.ifCanGetMore = true;//是否可以加载更多，防止多次点击
    this.ifCanFSGetMore = true;//是否可以好友秘圈加载更多，防止多次点击
    this.ifCanUpItem = true;//是否                   可以点赞，防止连点出错
    this.ifCanDownItem = true;//是否可以取消点赞，防止取消点赞出错
    this.ifCanDeleteItem = true;//是否可以删除说说，防止出错
    this.k = "e572a5";
    this.momentAccess = {
        transportAccess: 1,
        visiableAccess: 1,
        visiableAccessUidArray: []
    };
};

MT.initFriendSpaceNode = function () {
    this.$fsList = $('.fs-list');
    this.$fsItem = $('.fs-tb-item');
    this.$fsCommonCon = $('.fs-common-con');
    //我的秘圈
    this.$FSTitle = $('.fst-discribe');
    this.$mySpaceTab = $('#fs-my-space');
    this.$fsSendNewItem = $('.fs-send-new-item');
    this.$photoArea = $('.fs-photo-area');
    this.$sendNewItemBtn = $('#fs-send-new-item-btn');
    this.$textArea = $('.fs-new-item-text');
    this.$fsGetMore = $('#fs-get-more');//加载更多
    this.$fstRefresh = $('.fst-refresh');//刷新
//    滚动动画friend-space-container
    this.$friendSpaceContainer = $('.friend-space-container');
//    删除秘圈
    this.$deleteSpaceItemVerifyTab = $('#delete-space-item-tab');
    this.$dsiSubmit = $('#dsi-submit');
    this.$dsiConcel = $('#dsi-concel');
//    我的消息
    this.$myNotation = $('.fs-my-notation-container');
    this.$fsDetailTab = $('#fs-detail-tab');
    this.$fsdContainer = $('.fsd-container');
    this.$fsdClose = $('#fsd-close');
//    好友的空间
    this.$otherFsTab = $('#other-fs-tab');
    this.$ofsContainer = $('.ofs-container');
    this.$ofsClose = $('#ofs-close');
//    tip
    this.$mySpaceTip = $('.fs-tip-friend-space');
    this.$myMessageTip = $('.fs-tip-my-message');
    //删除评论
    this.$dcSubmit = $('#dc-submit');
    this.$dcConcel = $('#dc-concel');
    this.$transportedMomentLayout = $( "#transported-moment-layout" );

//    秘圈权限
    this.$maiNfBtn = $( ".mai-nf-btn" );
    this.$maiSelectArea = $( ".mai-select-area" );
    this.$maiOptions = $( ".mai-option" );
    this.$maiDownArrow = $( ".mai-down-arrow" );
    this.$chooseGroupArea = $( ".mai-select-area" );
    this.$showGroupArea = $( "#show-group" );
    this.$hideGroupArea = $( "#hide-group" );
    this.$createGroup = $( ".create-group" );
    this.$groupListContainer = $( ".group-list-container" );
    this.momentAccessIds = {
        allowTransport: 1,
        refuseTransport: 0,
        showToAll: 1,
        hideToAll: -1,
        showToGroup: 2,
        hideToGroup: -2
    }
};

MT.addFriendSpaceEvent = function () {
    //切换 fs item
    this.$fsItem.on('click', this.changeFsItem.bind(this));
    this.$sendNewItemBtn.on('click', this.sendNewFsItem.bind(this));
    this.$friendSpaceContainer.on('#fs-get-more', this.getMoreFSItemHandler.bind(this));//加载更多
    this.$fstRefresh.on('click', this.refreshFriendSpaceHandler.bind(this));//加载更多
//  add photo
    this.$fsSendNewItem.delegate('#fs-add-photo', 'click', this.selectPhoto.bind(this));
//    delete photo
    this.$fsSendNewItem.delegate('.fs-photo-hover', 'click', this.deletePhoto.bind(this));
//    scroll animate
    this.$friendSpaceContainer.on('scroll', this.moveAddNewFsItemArea.bind(this));
    //点赞 / 取消
    // this.$friendSpaceContainer.delegate('.icon-hot', 'click', this.starFriendSpaceItemHandler.bind(this));
    // this.$ofsContainer.delegate('.icon-hot', 'click', this.starFriendSpaceItemHandler.bind(this));
    this.$fsCommonCon.delegate('.icon-hot', 'click', this.starFriendSpaceItemHandler.bind(this));
    this.$fsCommonCon.delegate('.icon-transpond', 'click', this.transpondBtnClickHandler.bind(this));

    //删除说说
    // this.$friendSpaceContainer.delegate('.icon-delete', 'click', this.deleteFriendSpaceItemHandler.bind(this));
    // this.$ofsContainer.delegate('.icon-delete', 'click', this.deleteFriendSpaceItemHandler.bind(this));
    this.$fsCommonCon.delegate('.icon-delete', 'click', this.deleteFriendSpaceItemHandler.bind(this));
    //评论
    // this.$friendSpaceContainer.delegate('.icon-comment', 'click', this.showCommentArea.bind(this));
    // this.$ofsContainer.delegate('.icon-comment', 'click', this.showCommentArea.bind(this));
    this.$fsCommonCon.delegate('.icon-comment', 'click', this.showCommentArea.bind(this));

    // this.$friendSpaceContainer.delegate('.add-comment-ipt', 'click', this.showCommentArea.bind(this));
    // this.$ofsContainer.delegate('.add-comment-ipt', 'click', this.showCommentArea.bind(this));
    this.$fsCommonCon.delegate('.add-comment-ipt', 'click', this.showCommentArea.bind(this));

    // this.$friendSpaceContainer.delegate('.fs-item-commen-text', 'click', this.showCommentArea.bind(this));
    // this.$ofsContainer.delegate('.fs-item-commen-text', 'click', this.showCommentArea.bind(this));
    //点击评论文字，如果是别人的评论则回复，自己的评论则是删除。
    this.$fsCommonCon.delegate('.fs-item-commen-text', 'click', this.clickCommenTextHandler.bind(this));
    this.$dcSubmit.on( 'click', this.deleteCommentSubmit.bind( this ) );
    this.$dcConcel.on( 'click', this.ui.hideDeleteCommentVerify.bind( this.ui ) );

    // this.$friendSpaceContainer.delegate('.fs-item-comment-btn', 'click', this.commentFriendSpaceItemHandler.bind(this));
    // this.$ofsContainer.delegate('.fs-item-comment-btn', 'click', this.commentFriendSpaceItemHandler.bind(this));
    this.$fsCommonCon.delegate('.fs-item-comment-btn', 'click', this.commentFriendSpaceItemHandler.bind(this));
    //加载更多
    this.$friendSpaceContainer.delegate('#fs-get-more', 'click', this.getMoreFSItem.bind(this));
    this.$ofsContainer.delegate('#ofs-get-more', 'click', this.getMoreFriendsFSItem.bind(this));

//删除秘圈
    this.$dsiSubmit.on('click', this.deleteFriendSpaceItem.bind(this));
    this.$dsiConcel.on('click', this.hideDeleteSpaceItemVerify.bind(this));

    //好友的秘圈
    // this.$ofsContainer.delegate('#ofs-close', 'click', this.hideFriendsSpace.bind(this));
    this.$ofsClose.on('click', this.hideFriendsSpace.bind(this));
//    我的消息
    this.$myNotation.delegate('.fsn-item', 'click', this.showFSDetailTabHandler.bind(this));
    this.$fsdClose.on('click', this.closeFSDetailTab.bind(this));

//    秘圈权限
    this.$maiNfBtn.on( "click", this.toggletMaiNfBtn.bind( this ) );
    this.$maiSelectArea.delegate( ".mai-option", "click", this.toggleMaiOption.bind( this ) );
    this.$maiDownArrow.on( "click", this.toggleChooseGroupArea.bind( this ) );
    this.$createGroup.on( "click", this.showCreateGroupTab.bind( this ) );
    this.$groupListContainer.delegate( ".mgi-check-item", "click", this.selectLabel.bind( this ) );
    this.$groupListContainer.delegate( ".mgi-add-member", "click", this.showEditLabelTab.bind( this ) );
};

MT.clearMomentAccess = function () {
    this.momentAccess.transportAccess = 1;
    this.momentAccess.visiableAccess = 1;
    this.momentAccess.visiableAccessUidArray.length = 0;
}

MT.setMomentTransportAccess = function ( accessId ) {
    this.momentAccess.transportAccess = accessId;
}

MT.setMomentVisiableAccess = function ( accessId ) {
    this.momentAccess.visiableAccess = accessId;
}

MT.setMomentVisiableAccessUidArray = function ( uids ) {
    this.momentAccess.visiableAccessUidArray.length = 0;
    this.momentAccess.visiableAccessUidArray.push( ...uids );
}

MT.toggletMaiNfBtn = function ( evt ) {
    let e = evt || window.event,
        $ele = $( e.target ),
        $btnConatinaer = $ele.parent();
    let $selectedAccessOption = $( ".mai-option.cur" ),
        Accessvalue = +$selectedAccessOption.data( "value" );
    if ( Accessvalue === 0 ) {
        if ( $btnConatinaer.hasClass( "on" ) ) {
            $btnConatinaer.removeClass( "on" );
            this.setMomentTransportAccess( this.momentAccessIds.refuseTransport );
        } else {
            $btnConatinaer.addClass( "on" );
            this.setMomentTransportAccess( this.momentAccessIds.allowTransport );
        }
    } else {
        this.ui.showConfirm( {
            title: "",
            msg: "设置非公开权限后将不能使用转发权限，请先把好友权限设置为公开。"
        } );
    }

}

MT.toggleMaiOption = function ( evt ) {
    let e = evt || window.event,
        $ele = $( e.target ),
        $parent = $ele.parents( ".mai-option" ),
        that = this,
        $option;
    let $maiFn = $( ".mai-nf" ),
        isAllowRepost = $maiFn.hasClass( "on" )
    if ( $parent.length > 0 ) {
        $option = $parent;
    } else {
        $option = $ele;
    }
    let value = +$option.data( "value" );
    switch( value ) {
        case 0:
            if ( !$option.hasClass( "cur" ) ) {
                 this.$maiOptions.removeClass( "cur" );
                 $option.addClass( "cur" );
                 this.hideGroupAreaOfShown();
                 this.hideGroupAreaOfHidden();
                 this.$hideGroupArea.find( ".group-list-container" ).html( "" );
                 this.$showGroupArea.find( ".group-list-container" ).html( "" );
                 this.setMomentVisiableAccess( this.momentAccessIds.showToAll );
             } else {
                return;
             }
            break;
        case 1:
            function onlyShowToSelf() {
                this.hideGroupAreaOfShown();
                this.hideGroupAreaOfHidden();
                this.$hideGroupArea.find( ".group-list-container" ).html( "" );
                this.$showGroupArea.find( ".group-list-container" ).html( "" );
                this.$maiOptions.removeClass( "cur" );
                $option.addClass( "cur" );
                this.setMomentVisiableAccess( this.momentAccessIds.hideToAll );
            }
            if ( !$option.hasClass( "cur" ) ) {
                if ( isAllowRepost ) {
                    this.ui.showConfirm( {
                        title: "",
                        msg: "设置非公开权限后将不能使用转发权限，确定要这样设置吗？",
                        submitCallback: ( function () {
                            onlyShowToSelf.call( that );
                            //refuse transport
                            $( ".mai-nf" ).removeClass( "on" );
                            this.setMomentTransportAccess( this.momentAccessIds.refuseTransport );
                        } ).bind( this )
                    } );
                } else {
                    onlyShowToSelf.call( that );
                }
            } else {
                return;
            }
            break;
        case 2:
            function showToSelected() {
                this.$maiOptions.removeClass( "cur" );
                $option.addClass( "cur" );
                this.setMomentVisiableAccess( this.momentAccessIds.showToGroup );
                this.hideGroupAreaOfHidden();
                this.$hideGroupArea.find( ".group-list-container" ).html( "" );
                this.showGroupAreaOfShown();
            }
            if ( !$option.hasClass( "cur" ) ) {
                if ( isAllowRepost ) {
                    this.ui.showConfirm( {
                        title: "",
                        msg: "设置非公开权限后将不能使用转发权限，确定要这样设置吗？",
                        submitCallback: ( function () {
                            showToSelected.call( that );
                            //refuse transport
                            $( ".mai-nf" ).removeClass( "on" );
                            this.setMomentTransportAccess( this.momentAccessIds.refuseTransport );
                        } ).bind( this )
                    } );
                } else {
                    showToSelected.call( that );
                }
            } else {
                if ( $( "#select-to-show-arrow" ).hasClass( "up" ) ) {
                    this.hideGroupAreaOfShown();
                } else {
                    this.showGroupAreaOfShown( true );
                }
            }
            break;
        case 3:
            function hideToSelected() {
                this.$maiOptions.removeClass( "cur" );
                $option.addClass( "cur" );
                this.setMomentVisiableAccess( this.momentAccessIds.hideToGroup );
                this.hideGroupAreaOfShown();
                this.$showGroupArea.find( ".group-list-container" ).html( "" );
                this.showGroupAreaOfHidden();
            }
            if ( !$option.hasClass( "cur" ) ) {
                if ( isAllowRepost ) {
                    this.ui.showConfirm( {
                        title: "",
                        msg: "设置非公开权限后将不能使用转发权限，确定要这样设置吗？",
                        submitCallback: ( function () {
                            hideToSelected.call( that );
                            //refuse transport
                            $( ".mai-nf" ).removeClass( "on" );
                            this.setMomentTransportAccess( this.momentAccessIds.refuseTransport );
                        } ).bind( this )
                    } );
                } else {
                    hideToSelected.call( that );
                }

            } else {
                if ( $( "#select-to-hide-arrow" ).hasClass( "up" ) ) {
                    this.hideGroupAreaOfHidden();
                } else {
                    this.showGroupAreaOfHidden( true );
                }
            }
            break;
        default:
            break;
    }
}

MT.showGroupAreaOfShown = function ( hasCur ) {
    $( "#select-to-show-arrow" ).addClass( "up" );
    if ( !hasCur ) {
        this.refreshLabels();
    }
    this.$showGroupArea.show();
}

MT.hideGroupAreaOfShown = function () {
    $( "#select-to-show-arrow" ).removeClass( "up" );
    this.$showGroupArea.hide();
}

MT.showGroupAreaOfHidden = function ( hasCur ) {
    $( "#select-to-hide-arrow" ).addClass( "up" );
    if ( !hasCur ) {
        this.refreshLabels();
    }
    this.$hideGroupArea.show();
}

MT.hideGroupAreaOfHidden = function () {
    $( "#select-to-hide-arrow" ).removeClass( "up" );
    this.$hideGroupArea.hide();
}

MT.selectLabel = function ( evt ) {
    let e = evt || window.event,
        $ele = $( e.target ),
        $item;
    if ( $ele.hasClass( "mai-group-item" ) ) {
        $item = $ele;
    } else {
        $item = $ele.parents( ".mai-group-item" );
    }
    $item.toggleClass( "label-selected" );

}

MT.showEditLabelTab = function ( evt ) {
    let that = this,
        e = evt || window.event,
        $ele = $( e.target ),
        name = $ele.parent().find( ".mgi-group-title" ).html();
    ( async function () {
        let res;
        try {
            res = await that.getLabelDataFromServer();
        } catch ( e ) {
            if ( typeof DEBUG !== "undefined" ) {
                console.error( "getLabelDataFromServer" );
            }
            if ( e !== "timeout" ) {
                that.ui.showAlert( "获取标签数据失败，请稍候再试！" );
            }
            return;
        }
        let labelDatas = checkJSON( res );
        let msgId = labelDatas.msgId;
        if ( msgId === "0200" ) {
            let accounts = [],
                currentGroupData,
                labels = labelDatas.labels,
                len = labels.length;
            for( let i = 0; i < len; ++i ) {
                if ( labels[ i ].name === name ) {
                    currentGroupData = labels[ i ];
                    break;
                }
            }
            if ( !currentGroupData ) {
                that.ui.showAlert( "数据异常，请稍候再试！" );
                return;
            }
            let callbacks = {
                deleteLabelCallback: that.deleteLabelCallback.bind( that ),
                deleteLabelMemberCallback: that.deleteLabelMemberCallback.bind( that ),
                updateLabelCallback: that.updateLabelCallback.bind( that ),
                addNewMemberCallback: that.addNewMemberCallback.bind( that )
            }
            that.ui.showEditLabelTab( currentGroupData, callbacks, that );
        } else if ( msgId === "0414" ) {
            that.ui.showAlert( "获取标签数据失败，请稍候再试！" );
        }
    } )();
}

MT.updateLabelCallback = async function ( newName, oldName ) {
    if ( newName === oldName ) {
        this.refreshLabels();
        return;
    }
    let res;
    try {
       res = await this.sendUpdateLabelRequest( newName, oldName );
    } catch ( e ) {
        if ( typeof DEBUG !== "undefined" ) {
            console.error( "update label error: ", e );
        }
        if ( e !== "timeout" ) {
            this.ui.showAlert( "更新失败，请稍候再试！" );
        }
        return;
    }
    let data = checkJSON( res );
    if ( !data ) {
        this.ui.showAlert( "服务器正忙，请稍候再试" );
        return;
    }
    let msgId = data.msgId;
    if ( msgId === "0200" ) {
        // this.ui.showAlert( "更新成功！" );
        this.refreshLabels();
    } else if ( msgId === "0414" ) {
        this.ui.showAlert( "更新失败，请稍候再试！" );
    } else if ( msgId === "0400" ) {
        this.ui.showAlert( "数据异常，请稍候再试！" );
    } else {
        this.ui.showAlert( "服务器正忙，请稍候再试！" );
    }
}

MT.addNewMemberCallback = async function ( membersInLabel, labelName, $elFriendList, newMembers ) {
    let that = this;
    this.ui.showChooseFriendsTab( {
        deletedIds: membersInLabel,
        sureCallback: async function ( accounts ) {
            let res;
            try {
                res = await that.sendAddMemberRequest( labelName, accounts );
            } catch ( e ) {
                if ( typeof DEBUG !== "undefined" ) {
                    console.error( "sendAddMemberRequestError: ", e );
                }
                if ( e !== "timeout" ) {
                    that.ui.showAlert( "添加失败，请稍候再试！" );
                }
                return;
            }
            let data = checkJSON( res ),
                msgId = data.msgId;
            if ( msgId === "0200" ) {
                //update groupMemberList
                newMembers.push( ...accounts );
                //获取数据
                let res;
                try {
                    res = await that.getLabelDataFromServer();
                } catch ( e ) {
                    if ( typeof DEBUG !== "undefined" ) {
                        console.error( "getLabelDataFromServerError: ", e );
                    }
                    if ( e !== "timeout" ) {
                        this.ui.showAlert( "获取数据失败，请稍候再试！" );
                    }
                    return;
                }
                let labelDatas = checkJSON( res );
                let msgId2 = labelDatas.msgId;
                if ( msgId2 === "0200" ) {
                    let accounts = [],
                        currentGroupData,
                        labels = labelDatas.labels,
                        len = labels.length;
                    for (let i = 0; i < len; ++i) {
                        if (labels[i].name === labelName) {
                            currentGroupData = labels[i];
                            break;
                        }
                    }
                    that.ui.updateGroupMemberList(currentGroupData, $elFriendList);
                    that.refreshLabels();
                } else {
                    this.ui.showAlert( "获取数据失败，请稍候再试！" );
                }
            } else if ( msgId === "0400" ) {
                that.ui.showAlert( "添加失败，请稍候再试！" );
            } else {
                this.ui.showAlert(  "服务器正忙，请稍候再试！" );
            }
        }
    } );
}

MT.deleteLabelCallback = async function ( labelName, signals ) {
    let res;
    try {
       res = await this.sendDeleteLabelRequest( labelName );
    } catch ( e ) {
        if ( typeof DEBUG !== "undefined" ) {
            console.error( "delete label error: ", e );
        }
        signals.deleteLabelCompleted = true;
        if ( e !== "timeout" ) {
            this.ui.showAlert( "删除失败，请稍候再试！" );
        }
        return;
    }
    let data = checkJSON( res );
    if ( !data ) {
        signals.deleteLabelCompleted = true;
        this.ui.showAlert( "服务器正忙，请稍候再试" );
        return;
    }
    let msgId = data.msgId;
    if ( msgId === "0200" ) {
        this.ui.showAlert( "删除成功！" );
        this.refreshLabels();
    } else if ( msgId === "0414" ) {
        this.ui.showAlert( "删除失败，请稍候再试！" );
    } else {
        this.ui.showAlert( "服务器正忙，请稍候再试！" );
    }
    signals.deleteLabelCompleted = true;
}

MT.deleteLabelMemberCallback = async function ( labelName, deletedUids, signals, $elFriendList, newMembers ) {
    let that = this,
        res;
    try {
        res = await this.sendDeleteLabelMemberRequest( labelName, deletedUids );
    } catch ( e ) {
        signals.deleteMemberCompleted = true;
        if ( typeof DEBUG !== "undefined" ) {
            console.error( "deleteLabelMember error:", e );
        }
        if ( e !== "timeout" ) {
            this.ui.showAlert( "删除失败，请稍候再试！" );
        }
        return;
        // this.commonRequestErrorHandler( e );
    }
    let data = checkJSON( res );
    if ( !data ) {
        signals.deleteMemberCompleted = true;
        this.ui.showAlert( "服务器正忙，请稍候再试！" );
        signals.deleteMemberCompleted = true;
        return;
    }
    let msgId = data.msgId;
    if ( msgId === "0200" ) {
        newMembers.splice( newMembers.indexOf( deletedUids[ 0 ] ), 1 );
        this.ui.showAlert( "删除成功！" );
        //获取数据
        let res;
        try {
            res = await that.getLabelDataFromServer();
        } catch ( e ) {
            if ( typeof DEBUG !== "undefined" ) {
                console.error( "getLabelDataFromServerError: ", e );
            }
            if ( e !== "timeout" ) {
                this.ui.showAlert( "获取数据失败，请稍候再试！" );
            }
            signals.deleteMemberCompleted = true;
            return;
        }
        let labelDatas = checkJSON( res );
        let msgId = labelDatas.msgId;
        if ( msgId === "0200" ) {
            let accounts = [],
                currentGroupData,
                labels = labelDatas.labels,
                len = labels.length;
            for( let i = 0; i < len; ++i ) {
                if ( labels[ i ].name === labelName ) {
                    currentGroupData = labels[ i ];
                    break;
                }
            }
            this.ui.updateGroupMemberList( currentGroupData, $elFriendList );
            this.refreshLabels();
        } else {
            this.ui.showAlert( "获取数据失败，请稍候再试！" );
        }

    } else if ( msgId === "0414" ) {
        this.ui.showAlert( "删除失败，请稍候再试！" );
    } else {
        this.ui.showAlert( "服务器正忙，请稍候再试！" );
    }
    signals.deleteMemberCompleted = true;
}

MT.showCreateGroupTab = function () {
    try {
         let that = this,
            param = {};
        param.title = "选择好友";
        param.sureCallback = ( function ( accounts ) {
            let param = {};
            param.placeholder = "设置标签名称（不可重名）";
            param.sureCallback = ( async function ( labelName ) {
                if ( labelName === "" ) {
                    param.notDeleteTabAfterSbumit = true;
                    that.ui.showAlert( "标签名不可为空！" );
                    return;
                } else {
                    param.notDeleteTabAfterSbumit = false;
                }
                let res;
                try {
                    res = await that.sendCreateLabelRequest( {
                        name: labelName,
                        members: accounts
                    } );
                } catch ( e ) {
                    if ( typeof DEBUG !== "undefined" ) {
                        console.error( "sendCreateLabelRequestError: ", e );
                    }
                    if ( e !== "timeout" ) {
                        that.ui.showAlert( "请求失败，请稍候再试！" );
                    }
                    return;
                }
                let data = checkJSON( res );
                if ( !data ) {
                   that.ui.showAlert( "请求失败，请稍候再试！" );
                   return;
                }
                let msgId = data.msgId;
                if ( msgId === "0200" ) {
                    that.refreshLabels();
                } else if ( msgId === "0414" ) {
                    that.ui.showAlert( "请求失败，请稍候再试！" );
                } else if ( msgId === "0400" ) {
                    that.ui.showAlert( "创建失败！" );
                } else {
                    that.ui.showAlert( "请求失败，请稍候再试！" );
                }
            } ).bind( that );
            that.ui.showCommonPrompt( param );
        } ).bind( this );
        this.ui.showChooseFriendsTab( param );
    } catch ( e ) {
        if ( typeof DEBUG !== "undefined" ) {
            console.error( "showCreateGroupTab error: ", e.message );
        }
    }
   
}

MT.refreshLabels = async function () {
    let $groupOptions = $( ".mai-option[data-value$=2],.mai-option[data-value$=3]" );
    if ( !$groupOptions.hasClass( "cur" ) ) {
        return;
    }
    let $labelContainer = $( ".mai-option.cur" ).next().find( ".group-list-container" );
    let res;
    try {
        res = await this.getLabelDataFromServer();
    } catch ( e ) {
        if ( typeof DEBUG !== "undefined" ) {
            console.error( "getLabelDataFromServerError: ", e );
        }
        if ( e !== "timeout" ) {
            this.ui.showAlert( "获取标签数据失败，请稍候再试！" );
        }
        return;
    }
    let labelDatas = checkJSON( res );
    let msgId = labelDatas.msgId;
    if ( msgId === "0200" ) {
        let accounts = [],
            labels = labelDatas.labels,
            len = labels.length;
        for( let i = 0; i < len; ++i ) {
            accounts.push( ...( labels[ i ].members ) );
        }
        let uniqueAccounts = Array.from( new Set( accounts ) );
        this.checkUserInfo( uniqueAccounts, this.ui.initLabel.bind( this.ui, $labelContainer, labelDatas.labels ) );
    } else if ( msgId === "0414" ) {
        this.ui.showAlert( "获取标签数据失败，请稍候再试！" );
    }
}

MT.toggleChooseGroupArea = function ( evt ) {
    let e = evt || window.event,
        $ele = $( e.target );
    if ( $ele.hasClass( "mai-down-arrow-select" ) ) {
        $ele.removeClass( "mai-down-arrow-select" );
        this.$chooseGroupArea.removeClass( "choose-group" );
    } else {
        this.refreshLabels();
        $ele.addClass( "mai-down-arrow-select" );
        this.$chooseGroupArea.addClass( "choose-group" );
    }
}

MT.clickCommenTextHandler = function ( e ) {
    var evt = e || window.event,
        $ele = $(evt.target),
        $fsItem = $ele.parents('.fs-item');
    this.hideCommentArea();
    var toUid = $ele.data("uid");
    //点击自己的评论，删除评论
    if (typeof DEBUG !== "undefined") {
        console.log( "toUid", toUid, userUID );
    }
    if ( toUid + "" === userUID ) {
        if ( $('#other-fs-tab').hasClass('hide') ) {
            // this.deleteComment( $fsItem.data("mid"), $ele.data("cid"), "own");
            this.ui.showDeleteCommentVerify( $fsItem.data("mid"), $ele.data("cid"), "own");
        } else {
            // this.deleteComment( $fsItem.data("mid"), $ele.data("cid"), "friendAB", $fsItem.data("uid") );
            this.ui.showDeleteCommentVerify( $fsItem.data("mid"), $ele.data("cid"), "friendAB", $fsItem.data("uid") );
        }

        return;
    } else {
        $fsItem.find('.fs-item-comment-btn').data('tocid', $ele.data("cid"));
        $fsItem.find('.fs-item-comment-btn').data('touser', $ele.data("uid"));
        this.showCommentTextArea( $ele );
    }
};

MT.deleteCommentSubmit = async function ( e ) {
    var evt = e || window.event,
        $ele = $( evt.target ),
        mid = $ele.data( "mid" ),
        cid = $ele.data( "cid" ),
        scene = $ele.data( "scene" ),
        id = $ele.data( "id" );
    //不让用户多次点击
    this.ui.hideDeleteCommentVerify();
    let res;
    try {
        res = await this.sendDeleteCommentRequest( mid, cid, scene, id );
    } catch ( e ) {
        if ( typeof DEBUG !== "undefined" ) {
            console.error( "sendDeleteCommentRequestError: ", e );
        }
        if ( e !== "timeout" ) {
            this.ui.showAlert( "删除失败，请稍候再试！" );
        }
        return false;
    }
    let data = checkJSON( res );
    if ( data.msgId === "0200" ) {
        if ( scene === "own" ) {
            cache.deleteComment( mid, cid );
            this.refreshFriendSpaceByCache();
        } else if ( scene === "friendAB" ) {
            cache.deleteFSComment( id, mid, cid );
            this.refreshFriendsFS( id );
        }

    } else {
        this.ui.showAlert("服务器正忙，请稍候再试。");
    }
};

MT.showCommentTextArea = function ($ele) {
    if (typeof DEBUG !== "undefined") {
        console.log("showCommentTextArea", $ele);
    }
    var $fsItem = $ele.parents(".fs-item");
    this.addClassTo('comment-status', $fsItem.find('.fs-item-add-comment-layout'));
    var $thisTextArea = $fsItem.find('textarea').get(0);
    // Ps.initialize($thisTextArea);
    if(!$($thisTextArea).hasClass('ps')){
        Ps.initialize($thisTextArea);
    }
    if($fsItem.parents('.fsd-wrapper').length > 0){
        $('.fsd-wrapper').scrollTop(9999999);
    }
    $thisTextArea.focus();

};

//show edit comment area
MT.showCommentArea = function (e) {
    var evt = e || window.event,
        $ele = $(evt.target),
        $fsItem = $ele.parents('.fs-item');
    this.hideCommentArea();
    if($ele.hasClass("fs-item-commen-text")){
        $fsItem.find('.fs-item-comment-btn').data('tocid', $ele.data("cid"));
        $fsItem.find('.fs-item-comment-btn').data('touser', $ele.data("uid"));
    }else {
        $fsItem.find('.fs-item-comment-btn').data('tocid', "0");
        $fsItem.find('.fs-item-comment-btn').data('touser', "0");
    }
    this.showCommentTextArea( $ele );
    // this.addClassTo('comment-status', $fsItem.find('.fs-item-add-comment-layout'));
    // var $thisTextArea = $fsItem.find('textarea').get(0);
    // // Ps.initialize($thisTextArea);
    // if(!$($thisTextArea).hasClass('ps')){
    //     Ps.initialize($thisTextArea);
    // }
    // if($fsItem.parents('.fsd-wrapper').length > 0){
    //     $('.fsd-wrapper').scrollTop(9999999);
    // }
    // $thisTextArea.focus();
};

MT.hideCommentArea = function () {
    $('.add-comment-view textarea').val("");
    $('.fs-item-add-comment-layout').removeClass("comment-status");
};

MT.deleteFriendSpaceItemHandler = function (e) {
    if (typeof DEBUG !== "undefined") {
        console.log("deleteFriendSpaceItemHandler");
    }
    if(!this.ifCanDeleteItem){
        return;
    }else {
        this.ifCanDeleteItem = false;
    }
    var evt = e || window.event,
        $ele = evt.target;
    
    var mid = $($ele).parents(".fs-item").data("mid");//    获取mid
    this.showDeleteSpaceItemVerify(mid);
};

MT.showDeleteSpaceItemVerify = function (mid) {
    this.$deleteSpaceItemVerifyTab.find("#dsi-submit").data("mid", mid);
    this.$deleteSpaceItemVerifyTab.removeClass('hide');
};

MT.hideDeleteSpaceItemVerify= function () {
    this.ifCanDeleteItem = true;
    this.addHideClassTo(this.$deleteSpaceItemVerifyTab);
};



MT.starFriendSpaceItemHandler = async function (e) {
    if (typeof DEBUG !== "undefined") {
        console.log("upFriendSpaceItem");
    }
    var evt = e || window.event,
        $ele = $(evt.target),
        // mid = $($ele).parent().data("mid");//    获取mid
        // mid = $ele.parents().parent().parent().data("mid");//    获取mid
        mid = $ele.parents(".fs-item").data("mid");//    获取mid
    
//    判断点赞还是取消点赞
    if( !$ele.hasClass( 'cur' ) ) {
    //    up
        if ( !this.ifCanUpItem ){
            return;
        } else {
            this.ifCanUpItem = false;
        }
        let res;
        try {
            res = await this.sendUpFsItemRequest( mid );
        } catch ( e ) {
            if ( typeof DEBUG !== "undefined" ) {
                console.error( "sendUpFsItemRequestError: ", e );
            }
            if ( e !== "timeout" ) {
                this.ui.showAlert( "点赞失败，请稍候重试！" );
            }
            this.ifCanUpItem = true;
            return;
        }
        let data = checkJSON( res );
        if ( !!data && !!data.msgId ) {
            if ( data.msgId === "0200" ) {
                if ( !this.$fsDetailTab.hasClass( 'hide' ) ) {
                    this.refreshFSDetailTab();
                } else if ( !this.$otherFsTab.hasClass( 'hide' ) ) {
                    cache.upFSItem( this.friendAccount, mid );
                    this.refreshFriendsFS( this.friendAccount );
                } else {
                    this.cache.upFriendSpaceItem( mid );
                    this.refreshFriendSpaceByCache();
                }
            } else {
                this.ui.showAlert( "点赞失败，请稍后重试！" );
            }
        } else {
            this.ui.showAlert( "点赞失败，请稍后重试！" );
        }
        this.ifCanUpItem = true;
    }else {
        // down
        if ( !this.ifCanDownItem ) {
            return;
        } else {
            this.ifCanDownItem = false;
        }
        let res;
        try {
            res = await this.sendDownFSItemRequest( mid );
        } catch ( e ) {
            if ( typeof DEBUG !== "undefined" ) {
                console.error( "sendDownFSItemRequestError: ", e );
            }
            if ( e !== "timeout" ) {
                this.ui.showAlert("取消点赞失败，请稍后重试！");
            }
            this.ifCanDownItem = true;
            return;
        }
        let data = checkJSON( res );
        if ( !!data && !!data.msgId ) {
            if ( data.msgId === "0200" ) {
                try{
                    if ( !this.$fsDetailTab.hasClass( 'hide' ) ) {
                        this.refreshFSDetailTab();
                    } else if ( !this.$otherFsTab.hasClass( 'hide' ) ) {
                        cache.downFSItem( this.friendAccount, mid );
                        this.refreshFriendsFS( this.friendAccount );
                    } else {
                        this.cache.downFriendSpaceItem( mid );
                        this.refreshFriendSpaceByCache();
                    }
                } catch ( e ) {
                    if ( typeof DEBUG !== "undefined" ) {
                        console.log( "downFSItemError", e );
                    }
                    this.ifCanDownItem = true;
                }
            } else {
                this.ui.showAlert("取消点赞失败，请稍后重试！");
            }
        } else {
            this.ui.showAlert("取消点赞失败，请稍后重试！");
        }
        this.ifCanDownItem = true;
    }
};

MT.deletePhoto = function (e) {
    var evt = e || window.event,
        $ele = $(evt.target),
        $parentEle = $ele.parent(),
        index = $parentEle.index();
    if (typeof DEBUG !== "undefined") {
        console.log("deletePhoto");
    }
    //
    this.photoIptList.splice(index, 1);
    //删除元素
    $parentEle.remove();
};

MT.selectPhoto = function () {
    if($('.fs-send-photo-wrapper').length > 9){
        alert("最多只能添加9张图片！");
        return;
    }
    var ipt = document.createElement('input');
    ipt.addEventListener('change', this.readFile.bind(this, ipt), false);
    ipt.type = 'file';
    ipt.accept = 'webroot.image/*';
    ipt.click();
};

MT.readFile = function ( ipt ) {
    // console.log('readFile',ipt);
    var that = this;
    var file = ipt.files[0];//获取input输入的图片
    var name = file.name;
    //file reader 的兼容性检测
    if ( this.ifSupportFileReader ) {
        var reader = new FileReader();
        if(!/image\/\w+/.test(file.type)){
            alert("请确保文件为图像类型");
            return false;
        }//判断是否图片，在移动端由于浏览器对调用file类型处理不同，虽然加了accept = 'webroot.image/*'，但是还要再次判断
        this.photoIptList.push(ipt);
        reader.readAsDataURL(file);//转化成base64数据类型
        reader.onload = function(){
            that.ui.showNewPhotoItem(this.result);
        }
    } else {
        //只提示一次
        if ( !this.ifTipedFileReader ) {
            alert( "您的浏览器不支持图片预览，为了更好的体验秘图网页版，，建议您使用IE10、Chrome、FireFox、Safari、360等主流浏览器。" );
            this.ifTipedFileReader = true;
        }
        that.ui.showNewPhotoItem( this.defalutImage );
    }

};

MT.changeFsItem = function (e) {
    var evt = e || window.event,
        $ele = $(evt.target),
        $item;
    if($ele.hasClass('fs-tb-item')){
        $item = $ele;
    }else {
        $item = $ele.parent('.fs-tb-item');
    }
    if($item.hasClass('cur')) {
        return;
    }
    this.$fsItem.removeClass('cur');
    $item.addClass('cur');

//    change scene
    this.changeFriendSpaceScene();
};

MT.changeFriendSpaceScene = function () {
    var id = this.$friendSapceView.find('.cur').data('id');
    if (typeof DEBUG !== "undefined") {
        console.log("changeFriendSpaceScene", id);
    }
    
    this.hideMyMessageInFriendSpace();
    switch (id){
        case 0://我的消息
            this.showMyMessageInFriendSpace();
            break;
        case 1://发文字
            this.sendTextMessageInFriendSpace();
            break;
        case 2://发照片
            this.sendPhotoInFriendSpace();
            break;
        case 3://秘圈
            this.showFriendSpace();
            break;
    }
};
MT.showFriendSpace = function () {
    if (typeof DEBUG !== "undefined") {
        console.log("showFriendSpace");
    }
    this.fsRefreshId = Date.now();
    this.ui.showAlert("秘圈加载中...", this.fsRefreshId);
    this.hideAddNewItemArea();
    if( this.cache.getFriendSpaceList().length === 0 ) {
        //    获取数据//    缓存//    渲染ui
        this.refreshFriendSpace();
    }else {
        this.refreshByCache();
    }

};
MT.getMoreFSItem = async function () {
    var lastTime = $('.fs-list .fs-item:last').data("time");
    this.fsRefreshId = Date.now();
    this.ui.showAlert( "秘圈加载中...", this.fsRefreshId );
    if( !this.ifCanGetMore ){
        return;
    }else{
       this.ifCanGetMore = false;
    }
    let res;
    try {
        res = await this.getMoreFSItemData( lastTime );
    } catch ( e ) {
        this.hideAlertById( this.fsRefreshId );
        if ( typeof DEBUG !== "undefined" ) {
            console.error( "getMoreFSItemDataError: ", e );
        }
        if ( e !== "timeout" ) {
            this.ui.showAlert( "加载失败，请稍候重试！" );
        }
        this.ifCanGetMore = true;
        return;
    }
    let data = checkJSON( res );
    if ( !!data && !!data.msgId ) {
        if ( data.msgId === "0200" ) {
            let moments = checkJSON( data.moments );
            if ( !!moments ) {
                this.cache.addFriednSpaceList( moments );
            } else {
                this.ui.showAlert( "数据异常，请稍候重试！" );
                this.ifCanGetMore = true;
                return false;
            }
            var callbacks = [];
            callbacks[0] = this.ui.addMoreFSItem.bind( this.ui );
            callbacks[1] = ( function ( err, data ) {
                if (typeof DEBUG !== "undefined") {
                    console.log( "获取朋友圈陌生人数据" + ( !!err ? "失败" : "成功" ), err, data );
                }
                if (!err) {
                    this.cache.updatePersonlist( data );
                    //秘圈ui渲染
                    this.ui.addMoreFSItem();
                    this.hideAlertById( this.fsRefreshId );
                }
            } ).bind( this );
            this.getAllFriendSpaceAccounts( data.moments, callbacks );
        } else {
            this.hideAlertById( this.fsRefreshId );
            this.ui.showAlert( "加载失败，请稍候重试！" );
        }
    } else {
        this.hideAlertById( this.fsRefreshId );
        this.ui.showAlert( "加载失败，请稍候重试！" );
    }
    this.ifCanGetMore = true;
};

MT.getMoreFriendsFSItem = async function () {
    if( !this.ifCanFSGetMore ){
        return;
    }else {
        this.ifCanFSGetMore = false;
    }
    var lastTime = $('.ofs-container .fs-item:last').data( "time" );
    let res;
    try{
        res = await this.getMoreFriendsFSData( lastTime );
    } catch( e ) {
        if ( e !== "timeout" ) {
            this.ui.showAlert( '获取好友秘圈失败，请稍候再试！' );
        }
        this.ifCanFSGetMore = true;
        return;
    }
    let data = checkJSON( res );
    if ( !data ) {//返回值不合法
        this.ui.showAlert( '获取好友秘圈失败，请稍候再试！' );
        return;
    }
    if ( !!data.msgId ) {
        if ( data.msgId === "0200" && !!data.moments ) {
            cache.addFriendsFSList( this.friendAccount, data.moments );
            this.showMoreFriendsFS( data.moments );
        } else {
            this.ui.showAlert( '获取好友秘圈失败，请稍候再试！' );
        }
    } else {
        this.ui.showAlert( '获取好友秘圈失败，请稍候再试！' );
    }
    this.ifCanFSGetMore = true;
    // this.getMoreFriendsFSData( lastTime );
};

MT.refreshFriendSpaceHandler = function (e) {
    if(!this.ifCanRefresh){
        return;
    }else {
        this.ifCanRefresh = false;
    }
    if(!!this.rotateIntervalId){
        clearInterval(this.rotateIntervalId)
    }
    this.rotateAnimation();
    this.rotateIntervalId = setInterval(this.rotateAnimation.bind(this), 1000);
    // this.rotateAnimation();
    this.refreshFriendSpace();
};

MT.rotateAnimation = function () {
    var $ele = this.$fstRefresh,
        style = $ele.attr("style");
    if(!style || style === ""){
        $ele.attr("style", "transform: rotate(720deg);");
    }else {
        var re = /(\d+)/ig;
        var r = re.exec(style);
        $ele.attr("style", "transform: rotate(" + (parseInt(r[0]) + 720) + "deg);");
    }
};

MT.refreshFriendSpace = function () {
    let that = this;
    setTimeout( async function () {
        let res;
        try {
            res = await that.getMyFriendSpaceData();
        } catch ( e ) {
            if ( typeof DEBUG !== "undefined" ) {
                console.error( "getMyFriendSpaceDataError: ", e );
            }
            if ( e !== "timeout" ) {
                that.ui.showAlert( "请求失败，请稍候再试！" );
            }
            that.ifCanRefresh = true;
            if ( !!that.rotateIntervalId ) {
                clearInterval( that.rotateIntervalId );
            }
            if ( !!that.fsRefreshId ) {
                that.hideAlertById( that.fsRefreshId );
            }
            return;
        }
        let data = checkJSON( res );
        if ( !!data && !!data.msgId ) {
            if ( data.msgId === "0200" ) {
                let moments = checkJSON( data.moments );
                if ( !!moments ) {
                    that.cache.setFriendSpaceList( moments );
                } else {
                    that.ui.showAlert( "数据异常，请稍候再试！" );
                    that.ifCanRefresh = true;
                    if ( !!that.rotateIntervalId ) {
                        clearInterval( that.rotateIntervalId );
                    }
                    if ( !!that.fsRefreshId ) {
                        that.hideAlertById( that.fsRefreshId );
                    }
                    return false;
                }
                that.getAllFriendSpaceAccounts( moments );
            } else {
                that.ui.showAlert("加载失败，请稍候重试！");
            }
        } else {
            that.ui.showAlert("加载失败，请稍候重试！");
        }
        if ( !!that.rotateIntervalId ) {
            clearInterval( that.rotateIntervalId );
        }
        if ( !!that.fsRefreshId ) {
            that.hideAlertById( that.fsRefreshId );
        }
        that.ifCanRefresh = true;

        that.$friendSpaceContainer.scrollTop(0);
    }, 100 );
};

MT.refreshFriendSpaceByCache = function () {//秘圈根据缓存刷新
    var spaceList = cache.getFriendSpaceList(),
        accounts = this.getAllAccountsInMoments(spaceList);
    this.checkUserInfo(accounts, (function () {
        this.ui.initFriendSpaceList(spaceList);
    }).bind(this));
};

MT.getMoreFSItemHandler = function (e) {

};

MT.refreshByCache = function () {
    this.ui.initFriendSpaceList();
    this.hideAlertById(this.fsRefreshId);
};

MT.getAllAccountsInMoment = function (data) {
    if(!data || !data.comments || !data.star){
        return false;
    }
    var accounts = {},
        comments = data.comments,
        cLen = comments.length,
        stars = data.star,
        sLen = stars.length;
        
    if(!cache.getPersonById(data.uuid)){
        accounts[data.uuid] = true;
    }
    for(var i = 0; i < cLen; i++) {
        if(comments[i].to_user + "" !== "0"){
            if(!cache.getPersonById(comments[i].to_user)){
                accounts[comments[i].to_user] = true;
            }
        }
        if(!!comments[i].uid){
            if(!cache.getPersonById(comments[i].uid)){
                accounts[comments[i].uid] = true;
            }
        }
    }
    for(var j = 0; j < sLen; j++) {
        if(stars[j].uid){
            if(!cache.getPersonById(stars[j].uid)){
                accounts[stars[j].uid] = true;
            }
        }
    }
    var accountArray = [];
    for(var key in accounts){
        accountArray.push(key);
    }
    return accountArray;
};

MT.getAllAccountsInMoments = function (data) {
    if(!data){
        return false;
    }
    var dLen = data.length,
        accounts = {};
    //获取所有存在的id的数据=> comments and stars
    for(var k = 0; k < dLen; k++){
        var comments = data[k].comments;
        var type = data[ k ].type,
            cLen = comments.length,
            stars = data[k].star,
            sLen = stars.length;
        
        if(!cache.getPersonById(data[k].uuid)){
            accounts[data[k].uuid] = true;
        }
        for(var i = 0; i < cLen; i++) {
            if(comments[i].to_user + "" !== "0"){
                if(!cache.getPersonById(comments[i].to_user)){
                    accounts[comments[i].to_user] = true;
                }
            }
            if(!!comments[i].uid){
                if(!cache.getPersonById(comments[i].uid)){
                    accounts[comments[i].uid] = true;
                }
            }
        }
        for(var j = 0; j < sLen; j++) {
            if(stars[j].uid){
                if(!cache.getPersonById(stars[j].uid)){
                    accounts[stars[j].uid] = true;
                }
            }
        }
        if ( type == 5 ) {
            let transportedMomentData = checkJSON( data[ k ].res_json );

            if( !!transportedMomentData && !cache.getPersonById( transportedMomentData.uuid )){
                accounts[ transportedMomentData.uuid ] = true;
            }
        }
    }

    var accountArray = [];
    for(var key in accounts){
        accountArray.push(key);
    }
    return accountArray;
};

MT.getAllFriendSpaceAccounts = function (data, callbacks) {
    var dLen = data.length,
        accounts = {};
    //获取所有存在的id的数据=> comments and stars
    for(var k = 0; k < dLen; k++){
        let moment = data[ k ];
        var comments = moment.comments;
        var cLen = comments.length,
            stars = moment.star,
            sLen = stars.length;
        
        if(!cache.getPersonById(moment.uuid)){
            accounts[moment.uuid] = true;
        }
        for(var i = 0; i < cLen; i++) {
            if(comments[i].to_user + "" !== "0"){
                if(!cache.getPersonById(comments[i].to_user)){
                    accounts[comments[i].to_user] = true;
                }
            }
            if(!!comments[i].uid){
                if(!cache.getPersonById(comments[i].uid)){
                    accounts[comments[i].uid] = true;
                }
            }
        }
        for(var j = 0; j < sLen; j++) {
            if(stars[j].uid){
                if(!cache.getPersonById(stars[j].uid)){
                    accounts[stars[j].uid] = true;
                }
            }
        }
        if ( moment.type === 5 ) {
            let transportedMomentData = JSON.parse( moment.res_json );
            if ( transportedMomentData.is_del != 1 ) {
                accounts[ transportedMomentData.uuid ] = true;
            }
        }
    }

    var accountArray = [];
    for(var key in accounts){
        accountArray.push(key);
    }
    if(!callbacks){
        
        if(accountArray.length === 0){
            this.ui.initFriendSpaceList();
            this.hideAlertById(this.fsRefreshId);
        }else {
            //渲染前 先获取陌生人的数据
            this.mysdk.getUsers(accountArray, this.getFriendSpaceUsersDone.bind(this));
        }
    }else {
        if(accountArray.length === 0){
            //addMoreFSItem(data)

            callbacks[0](data);
            // this.ui.initFriendSpaceList();
            this.hideAlertById(this.fsRefreshId);
        }else {
            //渲染前 先获取陌生人的数据
            var func = (function (data) {
                return function (err, obj) {
                    if (typeof DEBUG !== "undefined") {
                            console.log(!!err ? "失败" : "成功");
                        }
                        if (typeof DEBUG !== "undefined") {
                            console.log("获取更多朋友圈陌生人数据" + (!!err ? "失败" : "成功"), err, obj);
                        }
                        if(!err){
                            
                            this.cache.updatePersonlist(obj);
                            //秘圈ui渲染
                            this.ui.addMoreFSItem(data);
                            
                            
                            this.hideAlertById(this.fsRefreshId);
                        }
                }
            })(data);
            this.mysdk.getUsers(accountArray, func.bind(this));
        }
    }


};

MT.getFriendSpaceUsersDone = function (err, data) {
    if (typeof DEBUG !== "undefined") {
        console.log(!!err ? "失败" : "成功");
    }
    if (typeof DEBUG !== "undefined") {
        console.log("获取朋友圈陌生人数据" + (!!err ? "失败" : "成功"), err, data);
    }
    if(!err){
        
        this.cache.updatePersonlist(data);
        //秘圈ui渲染
        this.ui.initFriendSpaceList();
        
        this.hideAlertById(this.fsRefreshId);
    }

};

MT.getMoreFriendSpaceUsersDone = function (err, data) {
    if (typeof DEBUG !== "undefined") {
        console.log(!!err ? "失败" : "成功");
    }
    if (typeof DEBUG !== "undefined") {
        console.log("获取更多朋友圈陌生人数据" + (!!err ? "失败" : "成功"), err, data);
    }
    if(!err){
        
        this.cache.updatePersonlist(data);
        //秘圈ui渲染
        this.ui.initFriendSpaceList();
        
        this.hideAlertById(this.fsRefreshId);
    }
};

MT.hideAlertById = function (id) {
    if(!!id){
        $('.usual-alert-tab[data-id$="' + id + '"]').remove();
    }
};

MT.showMyMessageInFriendSpace = function () {
    if (typeof DEBUG !== "undefined") {
        console.log("showMyMessageInFriendSpace");
    }
    this.hideAddNewItemArea();
    this.$FSTitle.html('我的消息');
    this.addHideClassTo(this.$fstRefresh);
    this.$myNotation.removeClass('hide');
    this.hideMyMessageTipCircle();
};

MT.hideMyMessageInFriendSpace = function () {
    this.$FSTitle.html('秘圈');
    this.$fstRefresh.removeClass('hide');
    this.addHideClassTo(this.$myNotation);
};

MT.sendTextMessageInFriendSpace = function () {
    if (typeof DEBUG !== "undefined") {
        console.log("sendTextMessageInFriendSpace");
    }
    this.ui.clearSendNewItemArea();
    this.$fsSendNewItem.removeClass('fs-send-photos');
    this.showAddNewItemArea();

};

MT.sendPhotoInFriendSpace = function () {
    if (typeof DEBUG !== "undefined") {
        console.log("sendPhotoInFriendSpace");
    }
    this.ui.clearSendNewItemArea();
    this.addClassTo("fs-send-photos", this.$fsSendNewItem);
    $( ".transported-moment-layout" ).hide();
    this.showAddNewItemArea();
};

MT.hideAddNewItemArea = function () {
    this.$fsSendNewItem.removeClass('show');
    this.$fsSendNewItem.attr("style", "");
    this.ui.clearSendNewItemArea();
    $( ".transported-moment-layout" ).hide();
    // this.$fsList.webroot.css({
    //     "marginTop": "0"
    //     });
    $( ".fs-send-new-item" ).hide();
};

MT.showAddNewItemArea = function () {
    $('.friend-space-container').scrollTop(0);
    this.addClassTo('show', this.$fsSendNewItem);
    // this.$fsList.webroot.css({
    //     "marginTop": "320px"
    // });
    $( ".fs-send-new-item" ).show();
    if ( !$( ".mai-nf" ).hasClass( "on" ) ) {
        this.$maiNfBtn.click();
    }
};

MT.moveAddNewFsItemArea = function (e) {
    if(!this.$fsSendNewItem.hasClass('show')){
        return;
    }
    var evt = e || window.event,
        $ele = evt.target,
        offTop = $ele.scrollTop,
        startTop = -296,
        endTop = 26,
        curTop = parseInt(this.$fsSendNewItem.css("top"));
    
    var newTop = (endTop - offTop) < startTop ? startTop : (endTop - offTop);
    this.$fsSendNewItem.css({
        "top": newTop + "px"
    });
    if (typeof DEBUG !== "undefined") {
        console.log("moveAddNewFsItemArea");
    }
};



MT.clearPhotoData = function () {
    this.photoIptList.length = 0;
    this.photoList.length = 0;
    this.photoUploadedCount = 0;
};

MT.sendPhotosSubmit = function ( text, access ) {
    var len = this.photoIptList.length;
    if(len === 0){
        //无照片 => 发送纯文字说说
        this.sendTextSubmit( text, access );
        return;
    }
    if ( text.length > 255 ) {
        this.ui.showAlert("文本过长!");
        return;
    }
    this.photoList.length = 0;
    this.photoUploadedCount = 0;
    if ( !this.isCanUploadImg || !this.client ) {
        let params = {
            title: "发送失败",
            msg: "上传图片失败，是否重试？",
            submitCallback: this.reSendPhotosSubmit.bind( this )
        }
        this.ui.showConfirm( params );
        return;
    }
    for(var i = 0; i < len; i++){
        var file = this.photoIptList[i].files[0];
        var name = file.name,
            mixin = parseInt( Math.random() * 100000000 ) + "",
            suffix = name.substr(name.lastIndexOf(".")),//获取 .jpg 这样的后缀
            fileName = name.substr(0, name.lastIndexOf("."));//获取后缀前的文件名
        this.photoList[ i ] = ( MD5( fileName + mixin ) + suffix + ".webp" );//为了保证图片顺序一致
        var time = Date.now();
        const storeAs = 'images/'+ MD5("15942696014" + "mitures") + '/' + time + '/' + MD5( fileName + mixin ) + suffix + ".webp";  //命名空间
        this.uploadImgToOss( storeAs, file, text, access );
    }
};

//重新发送秘圈请求
MT.reSendPhotosSubmit = async function () {
    this.initAesKey();
    try {
        await this.getServerConfig();
    } catch ( e ) {
        if ( typeof DEBUG !== "undefined" ) {
            console.error( "reSendPhotosSubmitError: ", e );
        }
        if ( e !== "timeout" ) {
            this.ui.showAlert( "请求失败，请稍候再试！" );
        }
        return;
    }
    this.$sendNewItemBtn.click();
}

MT.sendNewFsItem = function () {
    var that = this,
        isTransportMoment = false,
        transportedMomentId,
        access = this.getAccessOfTheNewMoment(),
        text = this.$textArea.val().trim();
    if ( ( access.shield_type === 2 || access.shield_type === -2 ) && access.shield_array.length === 0 ) {
        this.ui.showAlert( "请至少选择一个非空的标签" );
        return;
    }
    if($("#fs-send-text").hasClass('cur')){
        if ( this.$transportedMomentLayout.css( "display" ) !== "none" ) {
            isTransportMoment = true;
            transportedMomentId = this.$transportedMomentLayout.find( ".transponded-tab-moment-container" ).data( "mid" );
        }
        this.sendTextSubmit( text, access, isTransportMoment, transportedMomentId );
    }else if($("#fs-send-photo").hasClass('cur')){
        this.sendPhotosSubmit( text, access );
    }
    
};

MT.getAccessOfTheNewMoment = function () {
    let $selectedOption = this.$maiSelectArea.find( ".mai-option.cur" ),
        value = +$selectedOption.data( "value" ),
        access = {
            shield_type: 1,
            shield_array: [],
            allow_repost: 1
        };
    if ( !this.$maiNfBtn.parent().hasClass( "on" ) ) {
        access.allow_repost = 0;
    }
    switch ( value ) {
        case 0:
            access.shield_type = 1;
            break;
        case 1:
            access.shield_type = -1;
            break;
        case 2:
            access.shield_type = 2;
            break;
        case 3:
            access.shield_type = -2;
            break;
        default:
            access.shield_type = 1;
            break;
    }
    let $labelContainer = $( ".mai-option.cur" ).next().find( ".group-list-container" ),
        $selectedLabels = $labelContainer.find( ".label-selected" ),
        members = [];
    $.each( $selectedLabels, function ( i, v ) {
        members.push( ...$( v ).data( "members" ) );
    } );
    members = Array.from( new Set( members ) );
    access.shield_array = members;
    return access;
}

MT.pushHandler = function (msg) {
    var type = msg.type;
    switch(type){
        case 1://好友发布新说说 => 不提示
            // var html = this.ui.addNewFSNotationItem(msg);
            // if(!!html){
            //     this.$fsMyNotationList.append(html);
            // }
            // this.showMyMessageTipCircle();
            break;
        case 2://好友点赞
            var html = this.ui.getUpNotationItem(msg);
            if(!!html){
                this.$fsMyNotationList.append(html);
            }
            this.showMyMessageTipCircle();
            break;
        case 3://好友评论
            var html = this.ui.addNewComNotationItem(msg);
            if(!!html){
                this.$fsMyNotationList.append(html);
            }
            this.showMyMessageTipCircle();
            break;
        case 4://秘圈被转发
            var html = this.ui.addTransportFSNotationItem(msg);
            if(!!html){
                this.$fsMyNotationList.append(html);
            }
            this.showMyMessageTipCircle();
            break;
    }
    // this.showMyMessageTipCircle();
};

/*
* 好友的空间
* 入口：通讯录
*
*/

MT.showFriendsSpaceHandler = async function (e) {
    var that = this,
        evt = e || window.event,
        $ele = $(evt.target),
        account = $ele.data("account");
    if (!account) {
        alert("获取好友秘圈失败，请刷新后重试！");
        return;
    }
    this.friendAccount = account;
    this.ABFsRefreshId = Date.now();
    this.ui.showAlert( "数据加载中...", this.ABFsRefreshId );
    let res;
    try {
        res = await this.getFriendsSpaceData( this.friendAccount );
    } catch( e ) {
        if ( typeof DEBUG !== "undefined" ) {
            console.error( "getFriendsSpaceDataError: ", e );
        }
        if ( e !== "timeout" ) {
            this.showGetFriendsSpaceDataErrorTip( this.ABFsRefreshId );
        } else {
            this.hideAlertById( this.ABFsRefreshId );
        }
        return;
    }
    let data = checkJSON( res );
    if ( !data ) {
        this.showGetFriendsSpaceDataErrorTip( this.ABFsRefreshId );
        return;
    }
    if ( !!data.msgId ) {
        if ( data.msgId === "0200" && !!data.moments ) {
            cache.setFriendsFSList( this.friendAccount, data.moments );
            this.showFriendsSpace( data.moments );
        } else {
            this.showGetFriendsSpaceDataErrorTip( this.ABFsRefreshId );
        }
    } else {
        this.showGetFriendsSpaceDataErrorTip( this.ABFsRefreshId );
    }
    this.scrollToFriendFSTabTop();
    //this.getFriendsSpaceData( this.friendAccount );
};

MT.showGetFriendsSpaceDataErrorTip = function ( alertId ) {
    this.hideAlertById( alertId );
    this.ui.showAlert( '获取好友秘圈失败，请稍候再试！' );
}

MT.scrollToFriendFSTabTop = function () {
    $('.ofs-wrapper').scrollTop(0);
};

MT.refreshFriendsFS = function (account) {
    this.showFriendsSpace(cache.findFriendsFSList(account));
};

MT.showFriendsSpace = function (data) {//data => moments list
    var accounts = this.getAllAccountsInMoments(data);
    if(accounts.length === 0){
        this.ui.initFriendsFriendSpaceList(data);
        this.hideAlertById( this.ABFsRefreshId );
        this.showFriendsFSTab();
    }else {
        //渲染前 先获取陌生人的数据
        this.checkUserInfo(accounts, (function () {
            //account 数据获取完毕
            //此处渲染页面
            this.ui.initFriendsFriendSpaceList(data);
            this.hideAlertById( this.ABFsRefreshId );
            this.showFriendsFSTab();
        }).bind(this));
    }
};

MT.showMoreFriendsFS = function (data) {
    var accounts = this.getAllAccountsInMoments(data);
    if(accounts.length === 0){
        this.ui.addMoreFriendsFSItem(data);
        // this.showFriendsFSTab();
    }else {
        //渲染前 先获取陌生人的数据
        this.checkUserInfo(accounts, (function () {
            //account 数据获取完毕
            //此处渲染页面
            this.ui.addMoreFriendsFSItem(data);
            // this.showFriendsFSTab();
        }).bind(this));
    }
};

MT.showFriendsFSTab = function () {
    if(this.$otherFsTab.hasClass('hide')){
        this.$otherFsTab.removeClass('hide');
        $('.ofs-wrapper').scrollTop(0);
    }

};

MT.hideFriendsSpace = function () {
    this.addHideClassTo(this.$otherFsTab);
};

//我的消息
MT.showFSDetailTabHandler = function (e) {
    var evt = e || window.event,
        $ele = $(evt.target),
        $item;
    if($ele.hasClass('fsn-item')){
        $item = $ele;
    }else {
        $item = $ele.parents('.fsn-item');
    }
    var uid = $item.data('uid'),
        mid = $item.data('mid');
    
    this.detailUid = uid;
    this.detailMid = mid;
    this.refreshFSDetailTab();
    // this.getMomentDetail(this.detailUid, this.detailMid);
};

MT.showFSDetailTab = function (data) {
    var accounts = this.getAllAccountsInMoment(data);
    this.checkUserInfo(accounts, (function () {
        this.ui.initFSDetail(data);
        this.$fsDetailTab.removeClass('hide');
        $('.fsn-item[data-mid$=' + this.detailMid + ']').remove();
    }).bind(this));
};

MT.refreshFSDetailTab = async function () {
    let res;
    try {
        res = await this.getMomentDetail(this.detailUid, this.detailMid);
    } catch ( e ) {
        if ( typeof DEBUG !== "undefined" ) {
            console.error( "getMomentDetailError: ", e );
        }
        if ( e!== "timeout" ) {
            this.ui.showAlert("获取说说详情失败，请稍候再试！");
        }
        return false;
    }
    let data = checkJSON( res );
    if ( !!data.msgId && data.msgId === '0200' ) {
        if ( !!data.moments ) {
            this.showFSDetailTab( data.moments[ 0 ] );
        } else {
            this.ui.showAlert( "获取说说详情失败，请稍候再试！" );
            return false;
        }
    } else {
        if ( !!data.msgId && data.msgId === '0706' ) {
            this.ui.showAlert( "该秘圈已被删除！" );
            $( '.fsn-item[data-mid$=' + this.detailMid + ']' ).remove();
        } else {
            this.ui.showAlert( "获取说说详情失败，请稍候再试！" );
        }
        return false;
    }
};

MT.closeFSDetailTab = function () {
    this.addHideClassTo(this.$fsDetailTab);
};

MT.showMyMessageTipCircle = function () {
    this.$mySpaceTip.removeClass('hide');
    this.$myMessageTip.removeClass('hide');
};

MT.hideMyMessageTipCircle = function () {
    this.addHideClassTo(this.$mySpaceTip);
    this.addHideClassTo(this.$myMessageTip);
};

/**
 * transpond btn click handler
 * @param { Object } evt event object
 * @returns {}
*/
MT.transpondBtnClickHandler = function ( evt ) {
    var e = evt || window.event,
        $fsItem = $( e.target ).parents( ".fs-item" ),
        mid = $fsItem.data( "mid" ),
        type = $fsItem.data( "type" ),
        momentData = this.getMomentDataByMid( mid + "" );
    if ( typeof momentData.allow_repost !== "undefined" && +momentData.allow_repost === 0 ) {
        this.ui.showAlert( "此说说禁止转发！" );
        return;
    }
    if ( !momentData ) {
        this.ui.showAlert( "数据异常，请稍候再试！" );
        return false;
    } else {
        if ( momentData.type == 5 ) {
            let data = checkJSON( momentData.res_json );
            if ( typeof data.is_del !== "undefined" && data.is_del == 1 ) {
                this.ui.showAlert( "您不能转发被删除的说说！" );
                return false;
            }
        }
        this.ui.showTranspondVerifyTab( momentData, this.transpondSureCallback.bind( this, momentData, type ) );
    }
};

/**
 * get momentdata by mid (only can be used in friendspace event handler )
 * @param { String } mid moment id
 * @returns { Object|Boolean } is exist return momentData else return false
*/
MT.getMomentDataByMid = function ( mid ) {
    var momentData,
        notInFriendsFS = this.$otherFsTab.hasClass( "hide" );
    if ( notInFriendsFS ) {
        momentData = cache.findFSItemInMyFriendSpace( mid );
    } else {
        if ( !this.friendAccount ) {
            return false;
        }
        momentData = cache.findFSItem( this.friendAccount, mid );
    }
    return momentData;
};

/**
 * callback function runs after click sure btn in transpond verify tab
 * @param { Object } transpondedMomentData JSON String of momentData
 * @param { String } words comment words
 * @param { String } type moment type, can be 4, 5, 6; sign type of transponded moment; 4 is article; 5 is other moment; 6 is game share message;
 * @returns {}
*/
MT.transpondSureCallback = async function ( transpondedMomentData, type, words ) {
    let res;
    try {
        res = await this.sendTransportMomentRequest( { transpondedMomentData, type, words } );
    } catch ( e ) {
        if ( typeof DEBUG !== "undefined" ) {
            console.error( "sendTransportMomentRequestError: ", e );
        }
        if ( e !== "timeout" ) {
            this.ui.showAlert( "转发失败，请稍后再试！" );
        }
        return;
    }
    let data = checkJSON( res );
    if ( !data ) {
        //res illegal
        this.ui.showAlert( "数据异常，请稍候重试！" );
        return false;
    }
    var msgId = data.msgId;
    if ( msgId === "0200" ) {
        //判断处于自己的秘圈还是在查看好友的秘圈
        var isInMySpace = this.$friendSpaceTab.hasClass( "cur" );
        if( isInMySpace ) {
            //refresh & scroll to top
            this.$fstRefresh.click();
        } else {
            //show tip
            this.ui.showAlert( "转发成功。" );
        }
    } else if ( msgId === "0414" ) {
        this.ui.showAlert( "转发失败，请稍后再试！" );
    } else {
        this.ui.showAlert( "服务器正忙，请稍后再试！" );
    }
}

MT.uploadImgToOss = function ( storeAs, f, text, access ) {
    var that = this;
    this.client.multipartUpload( storeAs, f ).then( function ( result ) {
        if ( typeof DEBUG !== "undefined" ) {
            console.log( "uploadImage", result );
        }
        var url,
            len = that.photoList.length;
        if ( !!result.url ) {
            url = result.url;
        } else {
            url = "https://" + that.CONFIG.oss.bucket + ".oss-cn-hangzhou.aliyuncs.com/" + result.name;
        }
        if (typeof DEBUG !== "undefined") {
            console.log("url:", url);
        }
        //为了保证图片顺序一致
        for ( var i = 0; i < len; i++ ) {
            if ( ~url.indexOf( that.photoList[ i ] ) ) {//找到匹配
                that.photoList[ i ] = url;
                break;
            }
        }
        if ( ++that.photoUploadedCount === len ) {
            that.sendPhotoFsItem( text, access );
        }
    } ).catch( function ( e ) {
        that.uploadDebugInfo( { url: "uploadImgToOss", msg: e.message || "", params: {  } } );
        if ( typeof DEBUG !== "undefined" ) {
            console.error( e );
        }
    });
};

//fs item
MT.sendPhotoFsItem = async function ( text, access ) {
    var that = this;
    if ( text === "" ) {
        text = " ";
    }
    if ( text.length > this.maxLengthOfMomentText ) {
        this.photoList.length = 0;
        this.photoUploadedCount = 0;
        this.ui.showAlert( "文本过长!" );
        return;
    }
    let res;
    try {
        res = await this.sendNewPhotoFsItemRequest( text, access );
    } catch( e ) {
        this.photoList.length = 0;
        this.photoUploadedCount = 0;
        if ( e !== "timeout" ) {
            this.ui.showAlert( "发布失败！" );
        }
        if ( typeof DEBUG !== "undefined" ) {
            console.error( "sendNewPhotoFsItemRequestError", e );
        }
        return;
    }
    let data = checkJSON( res );
    if ( !!data.msgId ) {
        if (data.msgId === "0200") {
            this.ui.showAlert("发布成功！");
            this.clearPhotoData();
            $('#fs-my-space').get(0).click();
            this.refreshFriendSpace();
            // that.$fstRefresh.get(0).click();
            // that.hideAddNewItemArea();
        } else {
            this.ui.showAlert("发布失败！");
            // that.ui.clearSendNewItemArea();
            this.photoList.length = 0;
            this.photoUploadedCount = 0;
        }
    }
}

MT.sendTextSubmit = async function ( text, access, isTransportMoment, transportedMomentId ) {
    if ( text === "" && !isTransportMoment ) {
        //文字为空且不是转发的说说 => 直接返回
        return;
    }
    if ( text.length > this.maxLengthOfMomentText ) {
        this.ui.showAlert("文本过长!");
        return;
    }
    let res;
    try {
        res = await this.sendNewTextFsItemRequest( text, access, isTransportMoment, transportedMomentId );
    } catch ( e ) {
        if ( typeof DEBUG !== "undefined" ) {
            console.error( "sendNewTextFsItemRequestError: ", e );
        }
        if ( e !== "timeout" ) {
            this.ui.showAlert( "发布失败！" );
        }
        return;
    }
    let data = checkJSON( res );
    if ( !!data.msgId ) {
        if ( data.msgId === "0200" ) {
            this.ui.showAlert( "发布成功！" );
            $( '#fs-my-space' ).get( 0 ).click();
            this.refreshFriendSpace();
            // that.hideAddNewItemArea();
        } else {
            this.ui.showAlert( "发布失败!" );
        }
    } else {
        this.ui.showAlert( "发布失败!" );
    }
}

MT.commentFriendSpaceItemHandler = async function ( e ) {
    var that = this,
        evt = e || window.event,
        $ele = $( evt.target ),
        comment = $ele.parent().siblings( 'textarea' ).val().trim();
    if ( comment === "" ) {
        this.hideCommentArea();
    } else {
        if( comment.length > this.commentLenLimit ) {
            this.ui.showAlert( "最多输入200个字。" );
            return;
        }
        var mid = $ele.data( 'mid' ),
            to_user = $ele.data( "touser" ),
            to_cid = $ele.data( "tocid" );
         if ( !!mid && !!to_cid && !!to_user ) {
             if ( !this.ifCanComment ) {
                 return;
             }
             this.ifCanComment = false;
             let res;
             try {
                 res = await this.sendCommentRequest( mid, comment, to_user, to_cid );
             } catch ( e ) {
                 if ( typeof DEBUG !== "undefined" ) {
                     console.error( "sendCommentRequestError: ", e );
                 }
                 if ( e !== "timeout" ) {
                     this.ui.showAlert( "评论失败，请稍候再试！" );
                 }
                 this.hideCommentArea();
                 this.ifCanComment = true;
                 return;
             }
             let data = checkJSON( res );
             if ( !!data.msgId ) {
                if ( data.msgId === '0200' ) {
                    let { cid, to_cid, to_user, comment, mid } = data;
                    this.hideCommentArea();//todo:多个评论区一起显示时 会一起消失

                    this.$mySpaceTab[ 0 ].click();
                    if ( !this.$fsDetailTab.hasClass( 'hide' ) ) {
                        this.refreshFSDetailTab();
                    } else if ( !this.$otherFsTab.hasClass( 'hide' ) ) {
                        cache.replyFSIem( this.friendAccount, mid, cid, to_cid, to_user, comment );
                        this.refreshFriendsFS( this.friendAccount );
                    } else {
                        this.cache.addComment( mid, cid, comment, to_user, to_cid );
                        this.refreshFriendSpaceByCache();
                    }
                } else {
                    this.ui.showAlert( "评论失败，请稍候重试！" );
                    this.hideCommentArea();
                }
            } else {
                this.ui.showAlert( "评论失败，请稍候重试！" );
                this.hideCommentArea();
            }
            this.ifCanComment = true;
         } else {
             this.ui.showAlert("评论失败，请稍候再试！");
             this.hideCommentArea();
         }
    }
}

MT.deleteFriendSpaceItem = async function ( e ) {
    var evt = e || window.event,
        $ele = $(evt.target),
        mid = $ele.data("mid"),
        that = this;
    let res;
    try {
        res = await this.sendDeleteFSItemRequest( mid );
    } catch ( e ) {
        if ( typeof DEBUG !== "undefined" ) {
            console.error( "sendDeleteFSItemRequestError", e );
        }
        if ( e !== "timeout" ) {
            this.ui.showAlert( "删除失败，请稍候重试！" );
        }
        this.hideDeleteSpaceItemVerify();
        this.ifCanDeleteItem = true;
        return;
    }
    let data = checkJSON( res );
    if ( !!data.msgId ) {
        if ( data.msgId === "0200" ) {
            this.ui.showAlert( "删除成功！" );
            // refresh friendSpace
            this.cache.deleteSapceItem( mid );
            this.$mySpaceTab[ 0 ].click();
            this.refreshFriendSpaceByCache();
        } else {
            this.ui.showAlert( "删除失败，请稍候再试！" );
        }
    } else {
        this.ui.showAlert( "删除失败，请稍候再试！" );
    }
    this.hideDeleteSpaceItemVerify();
    this.ifCanDeleteItem = true;
}


module.exports = MT