let Cache = (function () {
    var Cache = function (argument) {
        this.friendList = [];
        this.sessions = [];
        this.personlist = [];
        this.count = 0;
        this.msgs = {};
        this.historyMsgs = {};
        // 用户订阅的事件同步
        this.personSubscribes = {};
        this.teamlist = [];
        this.teamMembers = {};
        this.teamMemberNames = {};
        this.teamMap = {};
        this.sysMsgs = [];
        this.aliasMap = {};
        this.aliasMapGroup = {};
        this.teamNameMap = {};
        this.teamNameMapGroup = {};
        //    friend space
        this.friendSpaceList = [];//my space data
        this.friendsSpaceMap = {};//friend's space data map id: {data}
        //merge msgs
        this.mergeMsgs = {};

        this.blacklist = [];
        this.meTrustlist = [];
        this.trustMelist = [];
        //把自己拉黑的好友账号数组
        this.othersBlacklist = [];
    };

    /**
     * 黑白名单
    */
    Cache.prototype.setBlacklist = function ( blacklist ) {
        this.blacklist = blacklist;
    };

    Cache.prototype.getBlacklist = function () {
        return this.blacklist;
    };

    Cache.prototype.isInBlacklist = function ( account ) {
        var list = this.blacklist,
            len = list.length;
        for ( var i = 0; i < len; ++i  ) {
            if ( account + "" === list[i].account + "" ) {
                return true;
            }
        }
        return false;
    };

    Cache.prototype.addOthersBlacklist = function ( account ) {
        //{Strings}
        this.othersBlacklist.push( account );
    }

    Cache.prototype.isInOthersBlacklist = function ( account ) {
        return !!~this.othersBlacklist.indexOf( account );
    }

    Cache.prototype.setMeTrustlist = function ( list ) {
        this.meTrustlist = list;
    };

    Cache.prototype.getMeTrustlist = function () {
        return this.meTrustlist;
    };

    Cache.prototype.setTrusrMelist = function ( list ) {
        this.trustMelist = list;
    };

    Cache.prototype.getTrustMelist = function () {
        return this.trustMelist;
    };
    /**
     * 合并转发
    */
    Cache.prototype.setMergeMsg = function (idClient, msgs) {
        this.mergeMsgs[idClient] = msgs;
    };

    Cache.prototype.getMergeMsgByIdClient = function (idClient) {
        if(!this.mergeMsgs[idClient]){
            return false;
        }
        return this.mergeMsgs[idClient];
    }

    /********** friend space *************/
    Cache.prototype.setFriendSpaceList = function (spacelist) {
        this.friendSpaceList = spacelist;
        // this.friendsSpaceMap[userUID] = spacelist;
    };

    Cache.prototype.getFriendSpaceList = function () {
        return this.friendSpaceList;
    };

    Cache.prototype.addFriednSpaceList = function (spacelist) {
        var len = spacelist.length;
        for (var i = 0; i < len; ++i) {
            this.friendSpaceList.push(spacelist[i]);
            // this.friendsSpaceMap[userUID].push(spacelist[i]);
        }
    };
    Cache.prototype.setFriendsFSList = function (id, spaceList) {
        this.friendsSpaceMap[id] = spaceList;
    };

    Cache.prototype.addFriendsFSList = function (id, spaceList) {
        if(!this.hasFriendsFSList(id)){
            return false;
        }
        var sLen = spaceList.length;
        for(var i = 0; i < sLen; ++i){
            this.friendsSpaceMap[id].push(spaceList[i]);
        }
    };

    Cache.prototype.hasFriendsFSList = function (id) {
        return !!this.friendsSpaceMap[id];
    };

    Cache.prototype.findFriendsFSList = function (id) {
        return !!this.friendsSpaceMap[id] ? this.friendsSpaceMap[id] : false;
    };

    /**
     * find friend space item in my friend space
     * @param { String } mid moment id
     * @returns { Object|Boolean } momentData|false is has that moment return momentData else return false
    */
    Cache.prototype.findFSItemInMyFriendSpace = function ( mid ) {
        var list = this.friendSpaceList,
            len = list.length,
            i = 0;
        for ( ; i < len; ++i ) {
            if ( list[ i ].mid + "" === mid + "" ) {
                return list[ i ];
            }
        }
        return false;
    }

    /**
     * get friends' friend space item by friends' userId & moment id
     * @param { String } id friends' userId
     * @param { String } mid moment id
     * @returns { Object|Boolean } momentData|false is has that moment return momentData else return false
    */
    Cache.prototype.findFSItem = function (id, mid) {
        var list = this.findFriendsFSList(id);
        if(!list){
            return false;
        }
        var len = list.length;
        for (var i = 0; i < len; ++i) {
            if (list[i].mid === mid) {
                return list[i];
            }
        }
        return false;
    };


    //点赞
    Cache.prototype.upFSItem = function (id, mid) {
        var item = this.findFSItem(id, mid),
            userData = getUserData(this.getPersonById(userUID));
        // debugger
        if(!item){
            return false;
        }
        item.star.push({
            "shield": null,
            "emergent": [
                "{\"ss\":\"ss\"}"
            ],
            "sex": userData.sex,
            "is_del": null,
            "area": null,
            "create_time": Date.now(),
            "me_trust": null,
            "autograph": null,
            "avatar": userData.avatar,
            "phone": null,
            "tcode": null,
            "password": "123123",
            "shielded": null,
            "name": userData.name,
            "mt_token": null,
            "trust_me": null,
            "uid": userData.account,
            "birthday": null
        });
    };

    //取消点赞
    Cache.prototype.downFSItem = function (id, mid) {
        var item = this.findFSItem(id, mid),
            userData = getUserData(this.getPersonById(userUID));
        // debugger
        if(!item){
            return false;
        }
        var sLen = item.star.length;
        for(var i = 0; i < sLen; ++i){
            if(item.star[i].uid == userUID){
                item.star.splice(i ,1);
                return true;
            }
        }
    };
    Cache.prototype.deleteFSComment = function ( id, mid, cid ) {
        var item = this.findFSItem(id, mid);
        if(!item){
            return false;
        }
        var comments = item.comments,
            cLen = comments.length;
        for ( var i = 0; i < cLen; ++i ) {
            if ( comments[ i ].cid === cid ) {
                return comments.splice( i, 1 );
            }
        }
        return false;

    }
    //评论
    Cache.prototype.commentFSItem = function (id, mid, cid, words) {
        var item = this.findFSItem(id, mid),
            userData = getUserData(this.getPersonById(userUID));
        if(!item){
            return false;
        }
        item.comments.push({
            "to_cid": "",//回复评论的ID
            "comment": words,//评论内容
            "cid": cid,//此评论ID
            "comment_time": Date.now(),
            "uid": userUID,//评论人ID
            "to_user": id//回复的人的ID
        });
    };
    //回复评论
    Cache.prototype.replyFSIem = function (id, mid, cid, tocid, touser, words) {
        var item = this.findFSItem(id, mid),
            userData = getUserData(this.getPersonById(userUID));
        if(!item){
            return false;
        }
        item.comments.push({
            "to_cid": tocid,//回复评论的ID
            "comment": words,//评论内容
            "cid": cid,//此评论ID
            "comment_time": Date.now(),
            "uid": userUID,//评论人ID
            "to_user": touser//回复的人的ID
        });
    };

    //删除说说
    Cache.prototype.deleteFSItem = function (id, mid) {
        var item = this.findFSItem(id, mid),
            userData = getUserData(this.getPersonById(userUID));
        if(!item){
            return false;
        }
        var list = this.findFriendsFSList(id);
        if(!list){
            return false;
        }
        var len = list.length;
        for (var i = 0; i < len; ++i) {
            if (list[i].mid === mid) {
                return list.splice(i, 1);
            }
        }
        return false;

    };
    //上面是好友的（单一账号）
    //下面是自己的秘圈的（自己和自己好友发的）
    //find spaceItem
    Cache.prototype.findSpaceItem = function (mid) {
        var len = this.friendSpaceList.length;
        for (var i = 0; i < len; ++i) {
            if (this.friendSpaceList[i].mid === mid) {
                return this.friendSpaceList[i];
            }
        }
        return false;
    };

    Cache.prototype.findSpaceItemIndex = function (mid) {
        var len = this.friendSpaceList.length;
        for (var i = 0; i < len; ++i) {
            if (this.friendSpaceList[i].mid === mid) {
                return i;
            }
        }
        return -1;
    };

    //删除说说
    Cache.prototype.deleteSapceItem = function (mid) {
        if(~this.findSpaceItemIndex(mid)){
            this.friendSpaceList.splice(this.findSpaceItemIndex(mid), 1);
        }else {
            return false;
        }
    };

    //添加评论 、回复
    Cache.prototype.addComment = function (mid, cid, comment, to_user, to_cid) {
        if(~this.findSpaceItemIndex(mid)){
            this.friendSpaceList[this.findSpaceItemIndex(mid)].comments.push({
                "to_cid": to_cid,
                "comment": comment,
                "cid": cid,
                "comment_time": Date.now(),
                "uid": userUID,
                "to_user": to_user
            })
        }else {
            return false;
        }
    };

    Cache.prototype.deleteComment = function ( mid, cid ) {
        if(~this.findSpaceItemIndex(mid)){
            var comments = this.friendSpaceList[this.findSpaceItemIndex(mid)].comments,
                cLen = comments.length;
            for ( var i = 0; i < cLen; ++i ) {
                if ( comments[ i ].cid === cid ) {
                    return comments.splice( i, 1 );
                }
            }
            return false;
        } else {
            return false;
        }
    }

    //点赞
    Cache.prototype.upFriendSpaceItem = function (mid) {
        var item = this.findSpaceItem(mid),
            userData = getUserData(this.getPersonById(userUID));
        if(!item){
            return false;
        }
        item.star.push({
            "shield": null,
            "emergent": [
                "{\"ss\":\"ss\"}"
            ],
            "sex": userData.sex,
            "is_del": null,
            "area": null,
            "create_time": Date.now(),
            "me_trust": null,
            "autograph": null,
            "avatar": userData.avatar,
            "phone": null,
            "tcode": null,
            "password": "123123",
            "shielded": null,
            "name": userData.name,
            "mt_token": null,
            "trust_me": null,
            "uid": userData.account,
            "birthday": null
        });
        return true;
    };
    //取消点赞
    Cache.prototype.downFriendSpaceItem = function (mid) {
        var item = this.findSpaceItem(mid),
            userData = getUserData(this.getPersonById(userUID));
        // debugger
        if(!item.star){
            return false;
        }
        for(var i = 0, len = item.star.length; i < len; i++){
            if(item.star[i].uid == userUID){
                item.star.splice(i, 1);
                return true;
            }
        }
    };

    Cache.prototype.addFriendSpaceMapByReverse = function (spacelist) {
        var user;
        for (var i = 0; i < spacelist.length; i++) {
            user = spacelist[i].to;
            if (!this.friendSpaceMap[user]) {
                this.friendSpaceMap[user] = [];
            }
            this.friendSpaceMap[user].unshift(spacelist[i]);
        }
    };
    //friend space end

    //friends
    Cache.prototype.setFriends = function (list) {
        this.friendList = list;
        this.setAliasMap(list);
        // //console.log(""friends);
        //console.log("setFriends");//, list
    };

    Cache.prototype.getAliasMapGroup = function () {
        return this.aliasMapGroup;
    };

     Cache.prototype.setAliasMapGroup = function () {
          for(var item in this.aliasMapGroup){
              this.aliasMapGroup[item].length = 0;
          }

        for(var key in this.aliasMap){
            var name = this.aliasMap[key];
            if(!this.aliasMapGroup[name[0]]){
                this.aliasMapGroup[name[0]] = [];
            }
            this.aliasMapGroup[name[0]].push(key);
        }
    };

     Cache.prototype.getTeamNameMapGroup = function () {
         return this.teamNameMapGroup;
     };



     Cache.prototype.setTeamNameMapGroup = function () {

         for(var item in this.teamNameMapGroup){
              this.teamNameMapGroup[item].length = 0;
          }

        for(var key in this.teamNameMap){
            var name = this.teamNameMap[key];
            if(!this.teamNameMapGroup[name[0]]){
                this.teamNameMapGroup[name[0]] = [];
            }
            this.teamNameMapGroup[name[0]].push(key);
        }
     }

    Cache.prototype.setAliasMap = function (list) {
        var len = list.length;
        for(var i = 0; i < len; i++){
            this.aliasMap[list[i].account] = getPinYinByAccount(list[i].account);
        }

    };
     Cache.prototype.getAliasMap = function () {
         return this.aliasMap;
     };

    Cache.prototype.updateAliasMap = function () {
        var len = this.friendList.length;
        for(var i = 0; i < len; i++){
            this.aliasMap[this.friendList[i].account] = getPinYinByAccount(this.friendList[i].account).toLowerCase();
        }
    };

    Cache.prototype.getFriends = function (list) {
        return this.friendList;
    };
    Cache.prototype.addFriend = function (list) {
        if (!this.isFriend(list.account)) {
            this.friendList.push(list);
            this.aliasMap[list.account] = getPinYinByAccount(list.account).toLowerCase();
        }
    }
    Cache.prototype.updateFriendAlias = function (account, alias) {
        for (var i = this.friendList.length - 1; i >= 0; i--) {
            if (!this.friendList[i]) {
                continue;
            }
            if (this.friendList[i].account == account) {
                this.friendList[i].alias = alias;
                this.aliasMap[account] = getPinYinByAccount(account);
                return;
            }
        }
        ;
    }
    Cache.prototype.getFriendList = function () {
        return this.friendList;
    };
    Cache.prototype.getFriendMsg = function (id) {
        for (var i in this.friendList) {
            if (!this.friendList[i]) {
                continue;
            }
            if (this.friendList[i].account == id) {
                return this.friendList[i];
            }
        }
        return false;
    };

    // 获取好友备注名
    Cache.prototype.getFriendAlias = function (account) {
        for (var i = this.friendList.length - 1; i >= 0; i--) {
            if (!this.friendList[i]) {
                continue;
            }
            if (this.friendList[i].account == account) {
                return this.friendList[i].alias || "";
            }
        }
        ;
    }
    //获取好友信息


    Cache.prototype.isFriend = function (account) {
        for (var i = this.friendList.length - 1; i >= 0; i--) {
            // //console.log(this.friendList[i]);
            if (!this.friendList[i]) {
                continue;
            }
            if (this.friendList[i].account == account) {
                return true;
            }
        }
        ;
        return false;
    };
    Cache.prototype.removeFriend = function (account) {
        for (var i = this.friendList.length - 1; i >= 0; i--) {
            if (this.friendList[i].account == account) {
                this.friendList.splice(i, 1);
                delete this.aliasMap[account];
                return true;
            }
        };
    };
    //team
    /**
     * 初始化群列表
     * @param {array} list
     */
    Cache.prototype.getTeamNameMap = function () {
        return this.teamNameMap;
    };

     Cache.prototype.updateTeamNameMap = function () {
         var item;
        for (var i = this.teamlist.length - 1; i >= 0; i--) {
            item = this.teamlist[i];
            this.teamNameMap[item.teamId] = getPinYin(item.name).toLowerCase();
        };
     };

    Cache.prototype.setTeamList = function (list) {
        var item;
        for (var i = list.length - 1; i >= 0; i--) {
            item = list[i];
            this.teamMap[item.teamId] = item;
            this.teamNameMap[item.teamId] = getPinYin(item.name);
        };
        this.teamlist = list;
    };

    Cache.prototype.addTeam = function (team) {
        if (!this.hasTeam(team.teamId)) {
            this.teamMap[team.teamId] = team;
            this.teamlist.push(team);
            this.teamNameMap[team.teamId] = getPinYin(team.name);
        }
    };

    Cache.prototype.deleteTeamById = function (teamId) {
        var item;
        for ( var i = this.teamlist.length - 1; i >= 0; i-- ) {
            item = this.teamlist[i];
            if ( item.teamId === teamId ) {
                delete this.teamMap[ teamId ];
                this.teamlist.splice( i, 1 );
                delete this.teamNameMap[ teamId ]
            }
        }
    };

    Cache.prototype.hasTeam = function (id) {
        id += "";
        var item;
        for (var i = this.teamlist.length - 1; i >= 0; i--) {
            item = this.teamlist[i];
            if (item.teamId === id) {
                return true;
            }
        }
        ;
        return false;
    };

    /**
     * 获取群列表
     */
    Cache.prototype.getTeamlist = function () {
        return this.teamlist;
    };

    /**
     * 获取群对象
     */
    Cache.prototype.getTeamMap = function () {
        return this.teamMap;
    };
    Cache.prototype.addTeamMap = function (data) {
        for (var i = data.length - 1; i >= 0; i--) {
            item = data[i];
            this.teamMap[item.teamId] = item;
            this.teamNameMap[item.teamId] = getPinYin(item.name);
        };
    };
    /**
     * 根据群id获取群对象
     */
    Cache.prototype.getTeamById = function (teamId) {
        if (this.hasTeam(teamId)) {
            return this.teamMap[teamId];
        }
        return null;
    };

    Cache.prototype.isTeamValid = function (teamId) {
        var item = this.getTeamById( teamId );
        if ( !item ) {
            return false;
        }
        return item.valid;
    }

    Cache.prototype.setTeamInvaild = function (teamId) {
        var team = this.getTeamById(teamId);
        if(!team){
            return false;
        }
        team.valid = false;
        return true;
    }
    Cache.prototype.getTeamMapById = function (teamId) {
        return this.teamMap[teamId] || null;
    };
    Cache.prototype.getTeamNameMapById = function (teamId) {
        return this.teamNameMap[teamId] || null;
    }

    /**
     * 根据群id删除群
     */
    Cache.prototype.removeTeamById = function (id) {
        for (var i in this.teamlist) {
            if (this.teamlist[i].teamId === id) {
                this.teamlist.splice(i, 1);
                break;
            }
        }
        this.teamNameMap[id] = undefined;
    };


    /**
     * 更变群名
     */
    Cache.prototype.updateTeam = function (teamId, obj) {
        for (var p in obj) {
            this.teamMap[teamId][p] = obj[p];
            if(p === 'name'){
                this.teamNameMap[teamId] = getPinYin(obj[p]);
            }
        }
        for (var i in this.teamlist) {
            if (this.teamlist[i].teamId === teamId) {
                for (var p in obj) {
                    this.teamlist[i][p] = obj[p];
                }
                break;
            }
        }
    };

    Cache.prototype.setTeamMembers = function (id, list) {
        this.teamMembers[id] = list;
        // this.setTeamMemberNames(id, list);
    };

    Cache.prototype.setTeamMemberNamesMap = function (id, data) {
        this.teamMemberNames[id] = data;
    };

    Cache.prototype.getTeamMemberNames = function (id) {
        return !!this.teamMemberNames[id] ? this.teamMemberNames[id] : false;
    };

    Cache.prototype.updateTeamMemberNames = function (id, account, newName) {
        if(!!this.teamMemberNames[id]){
            this.teamMemberNames[id][(account + "")] = newName;
            return true;
        }else {
            return false;
        }
    };

    Cache.prototype.removeTeamMemberNames = function (id, account) {
        if(!!this.teamMemberNames[id]){
            delete this.teamMemberNames[id][(account + "")];
            return true;
        }else {
            return false;
        }
    };


    Cache.prototype.addTeamMembers = function (id, array) {
        if (!this.teamMembers[id]) {
            return;
        }
        for (var i = array.length - 1; i >= 0; i--) {
            this.teamMembers[id].members.push(array[i])
        }
        ;
    }
    Cache.prototype.isTeamMember = function (teamId, account) {
        var team = this.getTeamMembers(teamId)
        if (!team) {
            return false;
        } else {
            var members = team.members,
                len = members.length;
            for (var i = 0; i < len; ++i) {
                if (members[i].account === account) {
                    return true
                }
            }
            return false;
        }
    }
    Cache.prototype.removeTeamMembers = function (id, array) {
        var obj = this.teamMembers[id],
            account;
        if (obj) {
            for (var j = array.length - 1; j >= 0; j--) {
                account = array[j];
                for (var i = obj.members.length - 1; i >= 0; i--) {
                    if (obj.members[i].account === account) {
                        obj.members.splice(i, 1);
                        break;
                    }
                }
                ;
            }
            ;
        }
    }
    Cache.prototype.getTeamMembers = function (id) {
        return this.teamMembers[id];
    }
    Cache.prototype.getTeamMemberInfo = function (account, id) {
        var obj = this.teamMembers[id];
        if (obj && obj.members) {
            for (var i = obj.members.length - 1; i >= 0; i--) {
                if (obj.members[i].account === account) {
                    return obj.members[i]
                }
            }
            ;
        }
        return false
    }
    Cache.prototype.isTeamManager = function (account, id) {
        var obj = this.teamMembers[id];
        if (obj) {
            for (var i = obj.members.length - 1; i >= 0; i--) {
                if (obj.members[i].account === account && (obj.members[i].type === 'owner' || obj.members[i].type === 'manager')) {
                    return true
                }
            }
            ;
        }
        return false
    }
    Cache.prototype.updateTeamMemberMute = function (id, account, mute) {
        var obj = this.teamMembers[id];
        if (obj) {
            for (var i = obj.members.length - 1; i >= 0; i--) {
                if (obj.members[i].account === account) {
                    obj.members[i].mute = mute;
                    return;
                }
            }
            ;
        }
    }


    //session
    Cache.prototype.setSessions = function (sessions) {
        this.sessions = sessions;
    };

    Cache.prototype.unshiftSession = function ( session ) {
        let sessionId = session.id,
            sessionCache = this.findSession( sessionId );
        if ( sessionCache ) {
            this.removeSession( sessionId );
            this.sessions.unshift( sessionCache );
        } else {
            this.sessions.unshift( session );
        }
    }

    Cache.prototype.getANewSession = function ( sessionId ) {
        let arr = sessionId.split( "-" ),
            scene = arr[ 0 ],
            to = arr[ 1 ];
        let session = {
            id: sessionId,
            scene,
            tounread: 0,
            updateTime: Date.now()
        }
        return session;
        // this.unshiftSession( session );
    }
    // Cache.prototype.getSessions = function () {
    //     return this.sessions;
    // };
    Cache.prototype.updateSession = function (session) {

    };

    Cache.prototype.updateSessionNameMap = function () {

    };


    /**
     * 获取当前会话
     * @return {Array} 会话集合
     */
    Cache.prototype.getSessions = function () {
        return this.sessions;
    };
    /**
     * 获取指定会话
     * @return {Array} 会话集合
     */
    Cache.prototype.findSession = function ( id ) {
        for ( var i = this.sessions.length - 1; i >= 0; --i ) {
            if ( this.sessions[ i ].id === id ) {
                return this.sessions[ i ];
            }
        };
        return false;
    }
    Cache.prototype.removeSession = function (id) {
        // debugger
        for (var i = this.sessions.length - 1; i >= 0; i--) {
            if (this.sessions[i].id === id) {
                this.sessions.splice(i, 1);
                return true;
            }
        }
        ;
        return false;
    }

    //person

    Cache.prototype.getPersonById = function (account) {
        if (this.personlist[account]) {
            return this.personlist[account];
        }
        return false;
    };

    Cache.prototype.updatePersonlist = function (list) {
        if (!list) {
            return;
        }
        if (!!list.account && !this.personlist[list.account]) {
            this.personlist[list.account] = list;
        } else {
            for (var p in list) {
                this.personlist[list[p].account] = list[p];
            }
        }
        //console.log("updatePersonlist");//, this.personlist
    };

    Cache.prototype.getPersonlist = function () {
        return this.personlist;
    };

    // 用户对象相关
    Cache.prototype.setPersonlist = function (list) {
        var item;
        for (var i = list.length - 1; i >= 0; i--) {
            item = list[i];
            if (!item) {
                continue;
            }
            this.personlist[item.account] = item;
        }
        ;
    };

    //msg
    Cache.prototype.addMsgs = function (msgs) {
        var item,
            user;
        if (!$.isArray(msgs)) {
            this.addMsg(msgs);
            return;
        }
        for (var i = 0; i < msgs.length; i++) {
            if (msgs[i].scene === "team") {
                user = msgs[i].to;
                if (!this.msgs["team-" + user]) {
                    this.msgs["team-" + user] = [];
                }
                this.msgs["team-" + user].push(msgs[i]);
            } else {
                user = (msgs[i].from === userUID ? msgs[i].to : msgs[i].from);
                if (!this.msgs["p2p-" + user]) {
                    this.msgs["p2p-" + user] = [];
                }
                this.msgs["p2p-" + user].push(msgs[i]);
            }
        }
        ;
    };
    Cache.prototype.addMsg = function (msg) {
        var user;
        if (msg.scene === "team") {
            user = "team-" + msg.to;
            if (!this.msgs[user]) {
                this.msgs[user] = [];
            }
            this.msgs[user].push(msg);
        } else {
            user = "p2p-" + (msg.from === userUID ? msg.to : msg.from);
            if (!this.msgs[user]) {
                this.msgs[user] = [];
            }
            this.msgs[user].push(msg);
        }
        for (var i = 0; i < this.sessions.length; i++) {
            if (user === this.sessions[i]) {
                this.sessions.splice(i, 1);
                break;
            }
        }
    };
    Cache.prototype.addMsgsByReverse = function (msgs) {
        var item,
            user;
        for (var i = 0; i < msgs.length; i++) {
            if (msgs[i].scene === "team") {
                user = msgs[i].to;
                if (!this.msgs["team-" + user]) {
                    this.msgs["team-" + user] = [];
                }
                this.msgs["team-" + user].unshift(msgs[i]);
            } else {
                user = (msgs[i].from === userUID ? msgs[i].to : msgs[i].from);
                if (!this.msgs["p2p-" + user]) {
                    this.msgs["p2p-" + user] = [];
                }
                this.msgs["p2p-" + user].unshift(msgs[i]);
            }
        }
        ;
    };

    /**
     * 获取漫游/历史消息
     * @return {Array}
     */

    Cache.prototype.getMsgs = function ( id ) {
        if ( !!this.msgs[ id ] ) {
            return this.msgs[ id ];
        } else {
            return [];
        }
    };
    //查消息 session-id idClient
    Cache.prototype.findMsg = function (sid, cid) {
        var list = this.msgs[sid];
        if (!list) {
            return false;
        }
        for (var i = list.length - 1; i >= 0; i--) {
            if (list[i].idClient === cid) {
                return list[i];
            }
        }
        ;
        return false
    }
    //设置消息用于重发状态变化 session-id idClient 消息
  Cache.prototype.setMsg = function(sid, cid, msg) {
    var list = this.msgs[sid];
    for (var i = list.length - 1; i >= 0; i--) {
      if(list[i].idClient === cid){
        list.splice(i,1);
        list.push(msg);
        return;
      }
    };
  }


    // 获取特定账号的订阅状态
    Cache.prototype.getMultiPortStatus = function (account) {
        if (this.personSubscribes[account] && this.personSubscribes[account][1]) {
            return this.personSubscribes[account][1].multiPortStatus
        }
        return ''
    }
    // 获取用户的订阅关系
    Cache.prototype.getPersonSubscribes = function () {
        return this.personSubscribes
    };
    //云端消息
    Cache.prototype.getHistoryMsgs = function (id) {
        if (!!this.historyMsgs[id]) {
            return this.historyMsgs[id];
        } else {
            return [];
        }
    };

    Cache.prototype.clearHistoryMsgs = function ( id ) {
        delete this.historyMsgs[id];
    }

    Cache.prototype.addHistoryMsgsByReverse = function (msgs) {
        var item,
            user;
        // if (msgs[0].scene === "team") {
        //     user = msgs[0].to;
        //     this.historyMsgs["team-" + user] = [];
        // }else {
        //     user = (msgs[0].from === userUID ? msgs[0].to : msgs[0].from);
        //     this.historyMsgs["p2p-" + user] = [];
        // }
        for (var i = 0; i < msgs.length; i++) {
            if (msgs[i].scene === "team") {
                user = msgs[i].to;
                if (!this.historyMsgs["team-" + user]) {
                    this.historyMsgs["team-" + user] = [];
                }
                this.historyMsgs["team-" + user].unshift(msgs[i]);
            } else {
                user = (msgs[i].from === userUID ? msgs[i].to : msgs[i].from);
                if (!this.historyMsgs["p2p-" + user]) {
                    this.historyMsgs["p2p-" + user] = [];
                }
                this.historyMsgs["p2p-" + user].unshift(msgs[i]);
            }
        }
        // debugger
        ;
    };

    Cache.prototype.findHistoryMsg = function (sessionId) {
        return !!this.historyMsgs[sessionId] ? this.historyMsgs[sessionId] : false;
    };

    //回撤消息,回撤的消息用tip替换
    Cache.prototype.backoutMsg = function (sid, cid, msg) {
        var list = this.msgs[sid];
        if (!list) {
            this.msgs[sid] = [msg]
            return;
        }
        for (var i = list.length - 1; i >= 0; i--) {
            if (list[i].idClient === cid) {
                list[i] = msg;
                return;
            }
        }
        this.msgs[sid].push(msg)
    };
    //红包消息， 红包消息用tip显示
    Cache.prototype.moneyGiftMsg = function (sid, cid, msg) {

    };

    //系统消息
    Cache.prototype.setSysMsgs = function (data) {
        this.sysMsgs = data;
    }
    Cache.prototype.getSysMsgs = function (data) {
        return this.sysMsgs;
    }


    return Cache;
})();

// let cache = new Cache();

module.exports = {
    Cache
}