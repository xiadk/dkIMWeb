/**
 * Created by xox on 2017/7/4.
 */
var SDKBridge = function (ctr, data) {//ctr,
    var sdktoken = readCookie('sdktoken'),
        // var sdktoken = readCookie('mt_token'),
        userUID = readCookie('uid'),
        that = this;
    if(!sdktoken){
        //console.log("sdktoken is undefined");
        window.location.href = '../../../../webroot/login.html';
        return;
    }
    this.controller = ctr;
    //缓存需要获取的用户信息账号
    this.person = {};
    //缓存需要获取的群组账号
    this.team = [];
    this.cache = data;
    // //console.log("cache", data, data.setFriendList);
    window.nim = this.nim = new NIM({
        //控制台日志，上线时应该关掉
        debug: false,
        // debug: true || { api: 'info', style: 'font-size:14px;color:white;background-color:rgba(0,0,0,0.1)' },
        //应用的appkey
        appKey: this.controller.$facker.data( "account" ),
        //云信账号
        account: userUID,
        //云信token
        token: sdktoken,
        db: false,
        //连接
        onconnect: onConnect.bind(this),
        ondisconnect: onDisconnect.bind(this),
        onerror: onError.bind(this),
        onwillreconnect: onWillReconnect.bind(this),
        // 多端登录变化
        onloginportschange: onLoginPortsChange.bind(this),
        // 群
        onteams: onTeams.bind(this),
        syncTeamMembers: false,//全成员先不同步了
        // onupdateteammember: onUpdateTeamMember.bind(this),
        // onteammembers: onTeamMembers.bind(this),
        //消息
        onmsg: onMsg.bind(this),
        onroamingmsgs: saveMsgs.bind(this),
        onofflinemsgs: saveMsgs.bind(this),
        //会话

        syncSessionUnread: true,
        onsessions: onSessions.bind(this),
        onupdatesession: onUpdatesession.bind(this),
        //同步完成
        // onsyncteammembersdone: onSyncTeamMembersDone.bind(this),
        onsyncdone: onSyncDone.bind(this),

        //个人信息
        onmyinfo: onMyInfo.bind(this),
        onupdatemyinfo: onMyInfo.bind(this),

        //系统通知
        onsysmsg: onSysMsg.bind(this, 1),
        onofflinesysmsgs: onOfflineSysmsgs.bind(this),
        onupdatesysmsg: onSysMsg.bind(this, 0),
        oncustomsysmsg: onCustomSysMsg.bind(this),
        onofflinecustomsysmsgs: onOfflineCustomSysMsgs.bind(this),
        // 静音，黑名单，好友
        onmutelist: onMutelist.bind(this),
        onblacklist: onBlacklist.bind(this),
        onfriends: onFriends.bind(this),
        // syncFriendUsers: true,

        onsynccreateteam: onSyncCreateteam.bind(this),
        //添加/删除黑名单回调
        onsyncmarkinblacklist: onSyncMarkinBlacklist.bind(this),
        onsyncmarkinmutelist: onSyncMarkinMutelist.bind(this),
        onsyncfriendaction: onSyncFriendAction.bind(this),

        onusers: onUsers.bind(this),
// 监听订阅事件列表
        onpushevents: onPushEvents.bind(this)
    });


    function saveMsgs(msgs) {
        msgs = msgs.msgs;
        if (typeof DEBUG !== "undefined") {
            //console.log("saveMsgs", msgs);
        }
        this.cache.addMsgs(msgs);
        // for (var i = 0; i < msgs.length; i++) {
        //     //console.log(msgs[i]);
        //     // if (msgs[i].scene === "p2p") {
        //     //     // this.person[msgs[i].from !== userUID ? msgs[i].from : msgs[i].to] = true;
        //     // }
        // }
    }

    function onConnect() {
        //console&&//console.log('连接成功');
    };

    function onWillReconnect(obj){
        // 此时说明 `SDK` 已经断开连接，请开发者在界面上提示用户连接已断开，而且正在重新建立连接
    };

    function onError(error) {
        //console.log('错误信息' + error);
    };
    function onDisconnect(error) {
        // 此时说明 `SDK` 处于断开状态，开发者此时应该根据错误码提示相应的错误信息，并且跳转到登录页面
        var that = this;
        //console.log('连接断开');
        if (error) {
            switch (error.code) {
                // 账号或者密码错误, 请跳转到登录页面并提示错误
                case 302:
                    alert(error.message);
                    delCookie('uid');
                    delCookie('sdktoken');
                    window.location.href = '../../../../webroot/login.html';
                    break;
                // 被踢, 请提示错误后跳转到登录页面
                case 'kicked':
                    var map={
                        PC:"电脑版",
                        Web:"网页版",
                        Android:"手机版",
                        iOS:"手机版",
                        WindowsPhone:"手机版"
                    };
                    var str =error.from;
                    alert("你的帐号于"+dateFormat(+new Date(),"HH:mm")+"被"+(map[str]||"其他端")+"踢出下线，请确定帐号信息安全!");
                    delCookie('uid');
                    delCookie('sdktoken');
                    //跳转至登录页面
                    window.location.href = '../../../../webroot/login.html';
                    break;
                default:
                    break;
            }
        }
    };
    function onLoginPortsChange(loginPorts) {
        //console.log('当前登录帐号在其它端的状态发生改变了');//, sessions
        // this.controller.loginPorts(loginPorts);
    };
    function onTeams(teams) {
        if (typeof DEBUG !== "undefined") {
            //console.log('onTeams:收到群列表', teams);
        }
        // debugger
        // //console.log();//, teams
        var teamlist = this.cache.getTeamlist();
        teamlist = this.nim.mergeTeams(teamlist, teams);
        teamlist = this.nim.cutTeams(teamlist, teams.invalid);
        this.cache.setTeamList(teamlist);
        if (typeof DEBUG !== "undefined") {
            //console.log("onTeams:teamList:", this.cache.getTeamlist());
        }

    //     渲染群组通讯录
        this.controller.ui.initAbTeamList();
    };
    function onFriends(friends){
        // var friendlist = this.nim.mergeFriends(friendlist, friends);
        var that = this,
            friendlist = this.cache.getFriends();
        friendlist = this.nim.mergeFriends(friendlist, friends);
        friendlist = this.nim.cutFriends(friendlist, friends.invalid);
        this.cache.setFriends(friendlist);
        // log

        // //console.log("onFriends", friends, friendlist, this.nim, friendlist, this.cache.getFriends());

        // 订阅好友账号
        var subscribeAccounts = [];
        for (var i = 0; i < friendlist.length; i++) {
            this.person[friendlist[i].account] = true;
            subscribeAccounts.push(friendlist[i].account)
        }
        // 订阅好友事件
        // //console.log("onFriends", friends,  friendlist);
        if(subscribeAccounts.length > 0){
            that.subscribeMultiPortEvent(subscribeAccounts);
        }


    };
    function onUsers(users) {
        //console.log('收到用户名片列表');//, users
        var person = this.cache.getPersonlist();
        users = this.nim.mergeUsers(person, users);
        // //console.log("users", users);
        // //console.log("cache", this.nim, this.cache);
        // debugger
        this.cache.setPersonlist(users);
        this.cache.updateAliasMap();
        //todo : 渲染好友通讯录
        // debugger
        this.controller.ui.initAbFriendList();
        //初始化发起聊天的选择好友列表
        this.controller.ui.initStartChatFriendList();


        // this.cache.setFriends(users);
        // ui.initSessionList();
        // //console.log("onUsers",this, this.nim === window.nim, this.cache.getFriendList());
    //
    }
    function onUpdateUser(user) {
        //console.log('用户名片更新了');//, user
        data.users = nim.mergeUsers(data.users, user);
    }
    function onSessions(sessions){
        if (typeof DEBUG !== "undefined") {
            console.log('收到会话列表', sessions);
        }
        // //console.log();//

        // this.cache.setSessions(sessions);
        // ui.initSessionList();
        var old = this.cache.getSessions();
        this.cache.setSessions(this.nim.mergeSessions(old, sessions));
        let that = this;
        for(var i = 0;i<sessions.length;i++){
            if (sessions[i].scene==="p2p") {
                var tmpUser = sessions[i].to;
                // 如果会话列表不是好友，需要订阅关系
                if (!this.cache.isFriend(tmpUser)) {
                    this.subscribeMultiPortEvent([tmpUser]);
                }
                this.person[tmpUser] = true;
            } else if (sessions[i].scene==="team") {
                let teamId = sessions[i].to;
                this.team.push( teamId );
                if ( !this.cache.getTeamMembers( teamId ) ) {
                    this.getTeamMembers( teamId, function ( err, data ) {
                        if ( !err ) {
                            that.cache.setTeamMembers( teamId, data );
                        }
                    } );
                }

                var arr = null
                if (sessions[i].lastMsg) {
                    arr = getAllAccount(sessions[i].lastMsg);
                }
                if(!arr){
                    continue;
                }
                for(var j = arr.length -1; j >= 0; j--){
                    this.person[arr[j]] = true;
                }
            }
        }
        this.controller.ui.initSessionList();


    };
    function onUpdatesession(session){
        if (typeof DEBUG !== "undefined") {
            console.log( "onUpdatesession", session );
        }
        var id = session.id || "",
            flag = true;
        if(!cache.findSession(id)){
            flag = false;
        }
        // debugger
        if(session.lastMsg && session.lastMsg.attach && session.lastMsg.attach.type && session.lastMsg.attach.type === "dismissTeam" ){

        } else if(session.scene === 'team' && !!cache.getTeamById(session.to) && cache.getTeamById(session.to).valid){
            var old = this.cache.getSessions();
            this.cache.setSessions(this.nim.mergeSessions(old, session));
        }else {
            var old = this.cache.getSessions();
            this.cache.setSessions(this.nim.mergeSessions(old, session));
        }

        if (typeof DEBUG !== "undefined") {
            //console.log("onUpdatesession", session, "flag:", flag);
        }
        // //console.log();//
        if(!flag){//session not exist
            // //console.log("initSessionList");
            if (typeof DEBUG !== "undefined") {
                //console.log();
            }
            this.controller.ui.addSessionItem(session);
            this.controller.ui.upSessionItemById(id);
            // this.controller.clickSessionItem(id);
            // ui.initSessionList();
            // message.checkSessionId(session.id);
        }
        this.controller.ui.updateUnread(id);
        this.controller.ui.updateLastMsg(session);

    };
    function onSyncDone() {
        //todo:show main page in this func
        //console.log('消息同步完成');
        // loginEd = true;
        // login.showMainView();
        $('.over').hide();
        this.cache.updateAliasMap();

    };
    function onMsg(msg) {
        if (typeof DEBUG !== "undefined") {
            console.log('收到消息', msg.scene, msg.type, msg);
        }
        // //console.log();//
        //缓存msg  => 如果是当前会话窗口的msg => 添加元素（self/others）
        //         => 如果不是 => 提示tip
        //
        // $('#msg-get').val(msg.text);
        this.controller.doMsg(msg);
    };
    function onOfflineSysmsgs(sysMsgs){
        //console.log('收到离线消息');//, sysMsgs
    }
    function onSysMsg(newMsg, msg) {
        if (typeof DEBUG !== "undefined") {
            console.log('收到系统通知', newMsg, msg);
        }//
        var type = msg.type,
          ctr = this.controller,
          cache = this.cache;
        data = cache.getSysMsgs();
        if(!type){
            return;
        }
        if (type === "deleteMsg") {
          ctr.backoutMsg(msg.deletedIdClient, msg);
          return;
        } else if ( type === "passFriendApply" ) {//通过好友申请
          // ctr.backoutMsg(msg.deletedIdClient, msg);
            var friendAccount = msg.from;
            this.getPersonMsg( friendAccount, ctr.passFriendApplyHandler.bind( ctr ) );
           return;
        } else if ( type === "deleteFriend" ){//好友删除通知
            var deletedUid = ( msg.from + "" ) === ( userUID + "" ) ? msg.to: msg.from;
            //缓存删除好友
            cache.removeFriend( deletedUid );
            //删除好友会话
            ctr.deleteLocalSession('p2p-' + deletedUid );
            //通讯录删除好友
            ctr.ui.initAbFriendList();
        } else {

        }


    }

    function onCustomSysMsg(msg){
        if (typeof DEBUG !== "undefined") {
            console.log('收到自定义系统通知', msg);
        }
        var data = checkJSON(!!msg.content ? msg.content : null);
        if(!data){
            return false;
        }

        var type = data.content.type,
            ctr = this.controller,
            cache = this.cache;
        // debugger
        if ( type === 1 || type === 2 || type === 3 || type === 4 ) {
            // 1：好友发布了一条说说
            // 2：好友赞了自己的说说
            // 3：好友评论了自己的说说
            // 4: 秘圈被转发
            ctr.pushHandler(data.content);
        } else if( type === 8 ){
            //红包被领取
        } else {

        }
    }

    function onOfflineCustomSysMsgs(msgs){
        //console.log('收到离线自定义系统通知');//, msgs
    };
    // 黑名单
    function onBlacklist( blacklist ) {
        //console.log('收到黑名单');//, blacklist
        if (typeof DEBUG !== "undefined") {
            console.log( "onBlacklist", blacklist);
        }
        var data = cache.getBlacklist();
        data = nim.mergeRelations(data, blacklist);
        cache.setBlacklist( nim.cutRelations( data, blacklist.invalid ) );
    };
    //静音
    function onMutelist(mutelist){
        //console.log('收到静音列表');//, mutelist
    };

    function onMyInfo(data){
        // debugger
        this.cache.updatePersonlist(data);
        this.controller.ui.initUserMsg(data);
        if (typeof DEBUG !== "undefined") {
            console.log('收到我的名片', data);
        }
        //当前版本先隐藏
        this.controller.ui.initABTop();
    };

    function onSyncCreateteam(data){
        if (typeof DEBUG !== "undefined") {
            //console.log('同步群列表完成', data);
        }
        // //console.log();//, data
        this.cache.addTeam(data);
        this.controller.buildTeams();

    };
    // 多端同步好友关系
    function onSyncFriendAction(data){
        //console.log('同步其他端好友申请完成');//, data
    };

    function onSyncMarkinBlacklist ( obj ) {
        if ( typeof DEBUG !== "undefined" ) {
            console.log( obj.account + '被你' + ( obj.isAdd ? '加入' : '移除' ) + '黑名单' );
        }
        if ( obj.isAdd ) {
            addToBlacklist( obj );
        } else {
            removeFromBlacklist( obj );
        }
    };

    function onSyncMarkinMutelist(param){
        //console.log('同步其他端静音列表完成');//, param
    };
    // 订阅的事件，这里会用于同步多端登录状态
    function onPushEvents(param) {
        // 没有开启订阅服务，忽略通知
        if (!window.CONFIG.openSubscription) {
            return
        }
        // if (param.msgEvents) {
        //     var msgEvents = param.msgEvents
        //     for (var i = 0; i < msgEvents.length; i++) {
        //         var msgEvent = msgEvents[i]
        //         this.cache.updatePersonSubscribe(msgEvent)
        //     }
        //     var ctr = this.controller
        //     // ctr.buildFriends()
        //     // ctr.buildSessions()
        //     if (/^p2p-/.test(ctr.crtSession)) {
        //         var account = ctr.crtSessionAccount
        //         if (account) {
        //             if (this.cache.getMultiPortStatus(account)) {
        //                 $('#nickName').text(ctr.getNick(account) + ' [' + this.cache.getMultiPortStatus(account) + ']')
        //             } else {
        //                 $('#nickName').text(ctr.getNick(account))
        //             }
        //         }
        //     }
        //     //console.log('订阅事件');//, param.msgEvents
        // }
    }

};
SDKBridge.prototype.sendTextMessage = function (scene) {
    // //console.log("nim", scene, scene.done);
    scene.isLocal = !!scene.isLocal;
    this.nim.sendText({
        scene: scene.scene || 'p2p',
        to: scene.to,
        text: scene.text,
        isLocal: scene.isLocal,
        custom: scene.custom,
        done: scene.done
    });
};
SDKBridge.prototype.getUser = function (account, callback) {
    this.nim.getUser({
        account: account,
        done: callback
    });
};
/**
 * 已读回执
 */
SDKBridge.prototype.sendMsgReceipt = function ( msg, done ) {
    this.nim.sendMsgReceipt( {
        msg: msg,
        done: done
    } );
}
/**
 * 设置当前会话，当前会话未读数会被置为0，同时开发者会收到 onupdatesession回调
 * @param {String} scene
 * @param {String} to
 */
SDKBridge.prototype.setCurrSession = function ( scene, to ) {
    this.nim.setCurrSession( scene + "-" + to );
};
/**
 * 获取用户信息（如果用户信息让SDK托管）上层限制每次拉取150条
 */
SDKBridge.prototype.getUsers = function ( accounts, callback ) {
    accounts = Array.from( new Set( accounts ) );
    var arr1 = accounts.slice( 0, 150 );
    var arr2 = accounts.slice( 150 );
    var datas = [];
    var that = this;
    var getInfo = function () {
        that.nim.getUsers({
            accounts: arr1,
            done: function ( err, data ) {
                if (err) {
                    callback( err );
                } else {
                    datas = datas.concat( data );
                    if ( arr2.length > 0 ) {
                        arr1 = arr2.slice( 0, 150 );
                        arr2 = arr2.slice( 150 );
                        getInfo();
                    } else {
                        callback( err, datas );
                    }
                }
            }
        });
    };
    getInfo();
};
/**
 * 获取本地历史记录消息
 */
SDKBridge.prototype.getLocalMsgs = function (sessionId, end, done) {
    if (end) {
        this.nim.getLocalMsgs({
            sessionId: sessionId,
            end: end,
            limit: 20,
            done: done
        });
    } else {
        this.nim.getLocalMsgs({
            sessionId: sessionId,
            limit: 20,
            done: done
        });
    }

};
/********** 这里通过原型链封装了sdk的方法，主要是为了方便快速阅读sdkAPI的使用 *********/

/**
 * 订阅用户登录状态事件
 * @param {StringArray} accounts
 */
SDKBridge.prototype.subscribeMultiPortEvent = function (accounts) {

    if (!window.CONFIG.openSubscription) {
        // 并未开启订阅服务

        return
    }
    accounts.forEach(function (val, i) {
        if(val == userUID) {
            accounts.splice(i , 1);
        }
    });
    if (accounts.length === 0){
        return;
    }
    //console.log("subscribeMultiPortEvent");//, !window.CONFIG.openSubscription
    this.nim.subscribeEvent({
        // type 1 为登录事件，用于同步多端登录状态
        type: 1,
        accounts: accounts,
        subscribeTime: 3600 * 24 * 30,
        // 同步订阅事件，保证每次登录时会收到推送消息
        sync: true,
        done: function onSubscribeEvent(err, res) {
            if (err) {
                //console.error('订阅好友事件失败', err)
            } else {
                //console.info('订阅好友事件', res)
            }
        }
    });
};
// 获取群信息
SDKBridge.prototype.getTeam = function (account, done) {
    this.nim.getTeam({
        teamId: account,
        done: done
    });
}
/**
 * 发送自定义消息
 * @param scene：场景，分为：P2P点对点对话，team群对话
 * @param to：消息的接收方
 * @param content：消息内容对象
 * @param callback：回调
 */
SDKBridge.prototype.sendCustomMessage = function ( scene, to, content, callback ) {
    var custom = {};
    var text = "[贴图]";
    custom.pushContent = getUserData( cache.getPersonById( userUID ) ).name + ":" + text;
    custom = JSON.stringify( custom );
    this.nim.sendCustomMsg( {
        scene: scene || 'p2p',
        to: to,
        content: JSON.stringify( content ),
        custom: custom,
        done: callback
    } );
};
/**
 * 发送文件消息
 * @param scene：场景，分为：P2P点对点对话，team群对话,callback回调
 * @param to：消息的接收方
 * @param text：发送的消息文本
 * @param callback：回调
 */
SDKBridge.prototype.sendFileMessage = function (scene, to, fileInput, callback, name) {
    var sessionId = scene + "-" + to,
        that = this,
        value = fileInput.value,
        ext = value.substring(value.lastIndexOf('.') + 1, value.length),
        type = /png|jpg|bmp|jpeg|gif/i.test(ext) ? 'image' : 'file';
    var custom = {};
    var text = type === "file" ? "[文件]" : "[图片]";
    custom.pushContent = getUserData(cache.getPersonById(userUID)).name + ":" + text;
    custom = JSON.stringify(custom);
    this.nim.sendFile({
        scene: scene,
        to: to,
        type: type,
        blob: fileInput,
        custom: custom,
        // blob: fileInput,
        uploadprogress: function (data) {
            that.controller.ui.showUploadPercentage(data.percentageText, sessionId );
            //console && //console.log(data.percentageText);
        },
        uploaderror: function () {
            //console && //console.log('上传失败');
        },
        uploaddone: function (error, file) {
            //console.log(error);
            //console.log(file);
            //console.log('上传' + (!error ? '成功' : '失败'));
            that.controller.ui.hideUploadPercentage();
            that.controller.hideAlertById( sessionId + that.uploadingFlag );
            that.controller.ui.showAlert('上传' + (!error ? '成功' : '失败'));
            delete that.controller.uploadingSessionIds[ sessionId ];
            if (typeof DEBUG !== "undefined") {
                if ( error ) {
                    console.log( "uploadError", error );
                }
            }

        },
        beforesend: function (msgId) {
            //console && //console.log('正在发送消息, id=' + msgId);
        },
        done: callback
    });
};

SDKBridge.prototype.createTeam = function (obj) {
    this.nim.createTeam({
        type: 'advanced',
        name: '新的聊天',
        avatar: 'avatar',
        accounts: obj.accounts,
        intro: '',
        announcement: '',
        joinMode: 'noVerify',
        beInviteMode: 'noVerify',
        inviteMode: 'all',
        updateTeamMode: 'manager',
        updateCustomMode: 'manager',
        ps: '',
        custom: '{}',
        done: obj.callback
    });
};
// SDKBridge.prototype.updateTeam = function (obj) {
//     this.nim.updateTeam({
//         teamId: obj.teamId,
//         name: "群聊" + obj.teamId,
//         done: obj.callback
//     });
// };
SDKBridge.prototype.getTeamMembers = function (id, callback) {
    this.nim.getTeamMembers({
        teamId: id,
        done: callback
    });
};
SDKBridge.prototype.getPersonMsg = function (id, callback) {
    if(cache.getPersonById(id)){
        callback(cache.getPersonById(id));
    }else {
        this.getUser(id, function (err, data) {
            // //console.log(err, data);
            if (!err) {
                cache.updatePersonlist(data);
                callback(data);
            }
        })
    }
};
SDKBridge.prototype.addTeamMembers = function (param) {
    this.nim.addTeamMembers(param);
}
//退群
SDKBridge.prototype.leaveTeam = function (param) {
    this.nim.leaveTeam(param);
}
//解散群
SDKBridge.prototype.dismissTeam = function (param) {
    this.nim.dismissTeam(param);
}
SDKBridge.prototype.deleteFriend = function (account, callback) {
    this.nim.deleteFriend({
        account: account,
        done: callback
    });
}
/**
 * 获取云记录消息
 * @param  {Object} param 数据对象
 * @return {void}
 */
SDKBridge.prototype.getHistoryMsgs = function (param) {
    this.nim.getHistoryMsgs(param);
}
SDKBridge.prototype.updateFriend = function ( account, alias, callback ) {
    this.nim.updateFriend( {
        account: account,
        alias: alias,
        done: callback
    } );
}
//修改群信息
SDKBridge.prototype.updateTeam = function ( param ) {
    this.nim.updateTeam( param );
}

SDKBridge.prototype.updateNickInTeam = function ( teamId, nickInTeam ) {
    let that = this;
    return new Promise( ( resolve, reject ) => {
        if ( !teamId || !nickInTeam ) {
            reject( {
                teamId,
                nickInTeam
            } );
        }
        that.nim.updateInfoInTeam( {
            teamId,
            nickInTeam,
            done: function ( err, data ) {
                if ( !err ) {
                    resolve( data );
                }
                reject( err );
            }
        } );
    } );
}

SDKBridge.prototype.updateMembersNickInTeam = function ( teamId, account, nickInTeam ) {
    let that = this;
    return new Promise( ( resolve, reject ) => {
        if ( !teamId || !account || !nickInTeam ) {
            reject( {
                teamId,
                account,
                nickInTeam
            } );
        }
        that.nim.updateNickInTeam( {
            teamId,
            account,
            nickInTeam,
            done: function ( err, data ) {
                if ( !err ) {
                    resolve( data );
                }
                reject( err );
            }
        } );
    } );
}

/**
 * 消息重发
 */
SDKBridge.prototype.resendMsg = function (msg, done) {
  this.nim.resendMsg({
    msg: msg,
    done: done
  });
}


/**
 * 删除本地消息
 */
SDKBridge.prototype.deleteLocalMsg = function (msg, done) {
  this.nim.deleteLocalMsg({
    msg: msg,
    done: done
});
}

module.exports = {
    SDKBridge
}