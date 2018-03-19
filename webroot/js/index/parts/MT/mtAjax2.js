var MT = {

}

MT.TokenIsExpire = function ( msgId ) {
    if ( msgId === "0555" ) {
        window.location.href = "../../../../webroot/login.html";
        return true;
    } else {
        return false;
    }
}
/**
 * get more moment of my friend space
 * @param { String } lasttime moment time of the oldest moment
 * @param { Function } callback callback function handler the responsed moments' data
 * @returns {}
*/
MT.getMoreFSItemData = function ( lasttime ) {
    let params = {
        type: "get",
        url: this.CONFIG.mitures.root + this.CONFIG.mitures.urls.getMore,
        data: {
            lasttime
        },
        headers: {
            token: this.CONFIG.mitures.mttoken
        }
    }
    return this.getRequestPromise( params );
}

/**
 * get lastest moment data of my friend space
 * @param { Function } callback callback function handler the moment data get from server
 * @returns {}
*/
MT.getMyFriendSpaceData = function (callback) {//获取我的秘圈数据
    var that = this;
    let params = {
        url: this.CONFIG.mitures.root + this.CONFIG.mitures.urls.getMyFriendSpaceData,
        type: "get",
        data: {},
        headers: {
            token: this.CONFIG.mitures.mttoken
        }
    }
    return this.getRequestPromise( params );
};

//获取好友秘圈数据
/**
 * get moment data of user's friend
 * @param { String } id account of user's friend
 * @returns {}
*/
MT.getFriendsSpaceData = function (id) {
    var that = this;
    let params = {
        url: that.CONFIG.mitures.root + that.CONFIG.mitures.urls.getFriendsSpaceData + id,
        type: "get",
        data: {

        },
        headers: {
            token: that.CONFIG.mitures.mttoken
        }
    };
    return this.getRequestPromise( params );
};

//好友朋友圈 获取更多
/**
 * get more moment data of user's friend
 * @param { String } lastTime moment time of the oldest moment
 * @returns {}
*/
MT.getMoreFriendsFSData = function (lastTime) {
    var that = this;
    let params = {
        url: that.CONFIG.mitures.root + that.CONFIG.mitures.urls.getMoreFriendsSpaceData + that.friendAccount,
        type: "get",
        data: {
            "lasttime": lastTime
        },
        headers: {
            token: that.CONFIG.mitures.mttoken
        }
    };
    return this.getRequestPromise( params );
};

/**
 * send moment item which has webroot.image ( type = 2 )
 * @param { String } text moment words to send with images
 * @param { Object } access moment access to send with images
 * @returns {}
*/
MT.sendNewPhotoFsItemRequest = function (  text, access  ) {
    let params = {
        url: this.CONFIG.mitures.root + this.CONFIG.mitures.urls.sendNewFsItem,
        type: "post",
        data: JSON.stringify( {
            "type": 2,
            "res_json": JSON.stringify( this.photoList ),
            "words": text,
            "location": this.CONFIG.mitures.defaultLocation,
            shield_type: access.shield_type,
            shield_array: access.shield_array,
            allow_repost: access.allow_repost
        } ),
        contentType: "application/json",
        headers: {
            token: this.CONFIG.mitures.mttoken
        }
    };
    return this.getRequestPromise( params );
}

/**
 * send moment item which only have words ( type = 1 )
 * @param { String } text moment words to send
 * @param { Object } access moment access to send
 * @returns {}
*/

MT.sendNewTextFsItemRequest = function ( text, access, isTransportMoment, transportedMomentId ) {
    let type,
        res_json = "";
    if ( isTransportMoment ) {
        res_json  = JSON.stringify( { mid: transportedMomentId } );
        type = 5;
    } else {
        res_json = " ";
        type = 1;
    }
    let data = JSON.stringify({
        type,
        res_json,
        "words": text,
        "location": this.CONFIG.mitures.defaultLocation,
        shield_type: access.shield_type,
        shield_array: access.shield_array,
        allow_repost: access.allow_repost
    });
    let params = {
        url: this.CONFIG.mitures.root + this.CONFIG.mitures.urls.sendNewFsItem,
        type: "post",
        data,
        contentType: "application/json",
        headers: {
            token: this.CONFIG.mitures.mttoken
        }
    };
    return this.getRequestPromise( params );
}

/**
 * send comment btn click handler
 * @param { Object } e event object
 * @returns {}
*/

MT.sendCommentRequest = function ( mid, comment, to_user, to_cid ) {
    let params = {
        url: this.CONFIG.mitures.root + this.CONFIG.mitures.urls.addComment + "/" + mid,
        type: "post",
        data: JSON.stringify({
            comment: comment,
             to_user: +to_user,
             to_cid: +to_cid
         }),
        contentType: "application/json",
        headers: {
            token: this.CONFIG.mitures.mttoken
        }
    }
    return this.getRequestPromise( params );
}

/**
 * sure to delete moment in friend sapce btn click handler
 * @param { Obejct } e event object
 * @returns {}
*/

MT.sendDeleteFSItemRequest = function ( mid ) {
    let params = {
        url: this.CONFIG.mitures.root + this.CONFIG.mitures.urls.deleteSpaceItem + "/" + mid,
        type: "delete",
        data: {

        },
        headers: {
            token: this.CONFIG.mitures.mttoken
        }
    }
    return this.getRequestPromise( params );
}

/**
 * up moment btn click handler
 * @param { String } mid moment id
 * @param { ElementObject } $ele element object created by jq
 * @returns { }
*/

MT.sendUpFsItemRequest = function ( mid ) {
    let params = {
        url: this.CONFIG.mitures.root + this.CONFIG.mitures.urls.up + '/' + mid,
        data: {

        },
        type: "post",
        headers: {
            token: this.CONFIG.mitures.mttoken
        }
    };
    return this.getRequestPromise( params );
}

/**
 * cancel up moment btn click handler
 * @param { String } mid moment id
 * @param { ElementObject } $ele element object created by jq
 * @returns { }
*/
MT.sendDownFSItemRequest = function ( mid ) {
    let params = {
        url: this.CONFIG.mitures.root + this.CONFIG.mitures.urls.down + '/' + mid,
        data: {},
        type: "delete",
        headers: {
            token: this.CONFIG.mitures.mttoken
        }
    };
    return this.getRequestPromise( params );
}

/**
 * send tel or nick or mtNum to server searching people to add as friend
 * @param {}
 * @returns {}
*/
MT.sendSearchPeopleRqeust = function ( searchKey ) {
    let params = {
        url: this.CONFIG.mitures.root + this.CONFIG.mitures.urls.findUsers + searchKey,
        data: {

        },
        type: "get",
        headers: {
            token: this.CONFIG.mitures.mttoken
        }
    };
    return this.getRequestPromise( params );
}

MT.getCONFIGFile = function () {
    let params = {
        url: this.CONFIG.mitures.root + this.CONFIG.mitures.urls.getKeys,
        data: {
            local:  MD5( " " )
        },
        headers: {
            "x-random": this.aesKey
        },
        type: "get"
    }
    return this.getRequestPromise( params );
}

MT.getMomentDetail = function (uid, mid) {
    var that = this;
    let params = {
        url: this.CONFIG.mitures.root + this.CONFIG.mitures.urls.getMomentDetail + uid + '/detail/' + mid,
        type: "get",
        data: {

        },
        headers: {
            token: this.CONFIG.mitures.mttoken
        }
    }
    return this.getRequestPromise( params );
};

//删除评论
MT.sendDeleteCommentRequest = function ( mid, cid, scene, id ) {
    let params = {
        url: this.CONFIG.mitures.root + this.CONFIG.mitures.urls.deleteComment + mid + "/" + cid,
        type: "delete",
        data: {

        },
        headers: {
            token: this.CONFIG.mitures.mttoken
        }
    };
    return this.getRequestPromise( params );
}

/**
 * 获取白名单
*/
MT.getMeTrustlist = function () {
    var that = this,
        params = {};
    params.headers = {
        token: that.CONFIG.mitures.mttoken
    };
    params.type = "get";
    params.url = that.CONFIG.mitures.root + that.CONFIG.mitures.urls.getMeTrust;
    this.getRequestPromise( params );
};

MT.getTrustMelist = function () {
    var that = this,
        params = {};
    params.headers = {
        token: that.CONFIG.mitures.mttoken
    };
    params.type = "get";
    params.url = that.CONFIG.mitures.root + that.CONFIG.mitures.urls.getTrustMe;
    this.getRequestPromise( params );
};

/**
 * 手机找回
*/
//获取地理位置
MT.getLocation = function () {
    var that = this,
        params = {};
    params.headers = {
        token: that.CONFIG.mitures.mttoken
    };
    params.url = that.CONFIG.mitures.root + that.CONFIG.mitures.urls.getLocation;
    params.type = "get";
    return this.getRequestPromise( params );
};

/**
 * send fire alarm request
 * @param {}
 * @returns {}
*/
MT.sendFireAlarmRequest = function () {
    var that = this,
        params = {};
    params.url = that.CONFIG.mitures.root + that.CONFIG.mitures.urls.alarm;
    params.type = "get";
    params.headers = {
        token: that.CONFIG.mitures.mttoken
    };
    return this.getRequestPromise( params );
}

//向紧急联系人发送短信
MT.sendSendMessageToUrgentContactsRequest = function () {
    var that = this,
        params = {};
    params.url = that.CONFIG.mitures.root + that.CONFIG.mitures.urls.sendMessage;
    params.type = "get";
    params.headers = {
        token: that.CONFIG.mitures.mttoken
    };
    return this.getRequestPromise( params );
}

/**
 * check if user open find back mobile phoen in app
 * @param {}
 * @returns {}
*/
MT.getSafeOpenStatus = function () {
    var that = this,
        params = {};
    params.type = "get";
    params.url = that.CONFIG.mitures.root + that.CONFIG.mitures.urls.safe;
    params.headers = {
        token: that.CONFIG.mitures.mttoken
    };
    return this.getRequestPromise( params );
};

/**
 * send transpond moment request
 * @param { String } transpondedMomentData JSON string of transponded moment
 * @param { String } words comment for transponded moment
 * @returns {}
*/
MT.sendTransportMomentRequest = function ( { transpondedMomentData, words } ) {
    var that = this,
        params = {};
    params.type = "post";
    params.url = that.CONFIG.mitures.root + that.CONFIG.mitures.urls.sendNewFsItem;
    params.headers = {
        token: that.CONFIG.mitures.mttoken
    };
    var res_json;
    if ( transpondedMomentData.type === 5 ) {
        res_json = transpondedMomentData.res_json;
    } else {
        var copyedMomentData = deepCopy( transpondedMomentData );
        copyedMomentData.comments = [];
        copyedMomentData.star = [];
        res_json = JSON.stringify( { mid: transpondedMomentData.mid } );
    }
    params.contentType = "application/json";
    //all of transponded moments' type is 5
    params.data = JSON.stringify( {
        type : 5,
        res_json,
        words,
        "location": that.CONFIG.mitures.defaultLocation
    } );
    return this.getRequestPromise( params );
}

MT.sendCheckCHPwdRequest = function ( param ) {
    let that = this,
        url = this.CONFIG.mitures.root + this.CONFIG.mitures.urls.checkCHPwd;
    let params = {
        url,
        type: "post",
        data: {
            passwd: param.chattingHistoryPassword,
            type: "login"
        },
        headers: {
            token: this.CONFIG.mitures.mttoken
        }
    }
    return this.getRequestPromise( params );
};

MT.sendCreateLabelRequest = function ( data ) {
    let that = this,
        url = that.CONFIG.mitures.root + that.CONFIG.mitures.urls.createLabel;
    let params = {
        url,
        type: "post",
        data: JSON.stringify( data ),
        contentType: "application/json",
        headers: {
            token: this.CONFIG.mitures.mttoken
        }
    }
    return this.getRequestPromise( params );
}

MT.getLabelDataFromServer = function () {
    let that = this,
        url = that.CONFIG.mitures.root + that.CONFIG.mitures.urls.getAllLabels;
    let params = {
        url,
        type: "get",
        contentType: "application/json",
        headers: {
            token: this.CONFIG.mitures.mttoken
        }
    }
    return this.getRequestPromise( params );
}

//删除好友
MT.sendDeleteFriendRequest = function ( fid ) {
    let params = {
        url: this.CONFIG.mitures.root + this.CONFIG.mitures.urls.deleteFriend + fid,
        type: "delete",
        headers: {
            token: this.CONFIG.mitures.mttoken
        }
    }
    return this.getRequestPromise( params );
}

MT.sendDeleteLabelRequest = function ( labelName ) {
    let that = this,
        url = that.CONFIG.mitures.root + that.CONFIG.mitures.urls.deleteLabel;
    let params = {
        url,
        type: "delete",
        data: JSON.stringify( {
            name: labelName
        } ),
        contentType: "application/json",
        headers: {
            token: this.CONFIG.mitures.mttoken
        }
    }
    return this.getRequestPromise( params );
}

MT.sendUpdateLabelRequest = function ( newname, oldname ) {
    let that = this,
        url = that.CONFIG.mitures.root + that.CONFIG.mitures.urls.updateLabel;
    let params = {
        url,
        type: "put",
        data: JSON.stringify( {
            newname,
            oldname
        } ),
        contentType: "application/json",
        headers: {
            token: this.CONFIG.mitures.mttoken
        }
    }
    return this.getRequestPromise( params );
}

MT.sendDeleteLabelMemberRequest = function ( labelName, members ) {
    let that = this,
        url = that.CONFIG.mitures.root + that.CONFIG.mitures.urls.deleteLabelMembers;
    let params = {
        url,
        type: "delete",
        headers: {
            token: this.CONFIG.mitures.mttoken
        },
        data: JSON.stringify( {
            name: labelName,
            members
        } ),
        contentType: "application/json",
    }
    return this.getRequestPromise( params );
}

MT.sendAddMemberRequest = function ( labelName, members ) {
    let that = this,
        url = that.CONFIG.mitures.root + that.CONFIG.mitures.urls.addLabelMember;
    let params = {
        url,
        type: "post",
        headers: {
            token: this.CONFIG.mitures.mttoken
        },
        data: JSON.stringify( {
            name: labelName,
            members
        } ),
        contentType: "application/json"
    }
    return this.getRequestPromise( params );
}

MT.sendHeartbeat = function () {
    let that = this;
    let params = {
        url: that.CONFIG.mitures.root + that.CONFIG.mitures.urls.vipDeadline,
        type: "get",
        headers: {
            token: this.CONFIG.mitures.mttoken
        }
    }
    return this.getRequestPromise( params );
}

MT.uploadDebugInfo = function ( { url, params, responseStr, msg, err } ) {
    let that = this,
        uid = userUID,
        time = Date.now(),
        type = 0,//represent web
        content = "dont have log file",
        device = window.navigator.userAgent;
    let info = {
        uid,
        time,
        params: params || "",
        responseStr: responseStr || "",
        msg: msg || "",
        err: err || "",
        uAgent: device
    }
    return new Promise( ( resolve, reject ) => {
        $.ajax( {
            url: that.CONFIG.mitures.root + that.CONFIG.mitures.urls.uploadDebugInfo,
            type: "post",
            beforeSend: function ( request ) {
                request.setRequestHeader( "token", that.CONFIG.mitures.mttoken );
            },
            data: {
                type,
                // device,
                content,
                info: JSON.stringify( info )
            },
            success: function ( res ) {
                resolve( res );
            },
            error: function ( err ) {
                reject( err );
            }
        } )
    } );

}

MT.sendSignOutRequest = function () {
    let params = {
        url: this.CONFIG.mitures.root + this.CONFIG.mitures.urls.signOut,
        type: "get",
        headers: {
            token: this.CONFIG.mitures.mttoken
        }
    }
    return this.getRequestPromise( params );
}

MT.getRequestPromise = function ( params ) {
    let that = this;
    let { url, type, data } = params;
    data = data || {};
    let headers = params.headers || undefined;
    let timeout = params.timeout || 1000 * 20;
    let contentType = params.contentType || "application/x-www-form-urlencoded; charset=UTF-8";
    return new Promise( ( resolve, reject ) => {
        $.ajax( {
            url,
            type,
            data,
            contentType,
            cache: false,
            beforeSend: function ( request ) {
                if ( !headers ) {
                    return;
                }
                for ( let key in headers ) {
                    request.setRequestHeader( key, headers[ key ] );
                }
            },
            success: function ( res ) {
                let data = checkJSON( res ),
                    msgId = data && data.msgId
                if ( msgId !== "0200"  ) {
                    that.uploadDebugInfo({url: params.url, params: params.data, responseStr: res});
                }
                if ( that.TokenIsExpire( !!data.msgId && data.msgId ) ) {
                    reject( false );
                }
                resolve( res );
            },
            error: function ( err ) {
                that.uploadDebugInfo( { url: params.url, params: params.data, err: err } );
                if( !!err && err.statusText === "timeout" ) {
                    that.ui.showAlert( "请求超时，请稍候再试！" );
                    err = "timeout";
                }
                reject( err );
            }
        } );
    } );
}

module.exports = MT