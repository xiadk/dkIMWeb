/**
 * 群通知处理
 */
var MT = {

}
MT.notification =  function() {

};

MT.messageHandler = function(msg,callback) {
	var type = msg.attach.type,
		team = msg.attach.team;
	switch (type) {
		case 'addTeamMembers':		// 添加成员
			this.addTeamMembersNotification(msg,callback);
			break;
		case 'removeTeamMembers':	// 移除成员
			this.removeMembersNotification(msg,callback);
			break;
		case 'leaveTeam':		// 离开群
			this.leaveTeamNotification(msg,callback);
			break;
		case 'updateTeam':		// 更新群
			this.updateTeamNotification(msg,callback);
			break;
		case 'acceptTeamInvite':	// 接受入群邀请
			this.acceptTeamInviteNotification(msg,callback);
			break;
		case 'passTeamApply':		// 群主/管理员 通过加群邀请
			this.passTeamApplyNotification(msg,callback);
			break;
		case 'dismissTeam':
			this.dismissTeamNotification(msg,callback);
			break;
		case 'updateTeamMute':
			this.updateTeamMuteNotification(msg,callback);
			break;
		// case 'updateTeam': //change name
		// 	this.updateTeam(msg, callback);
		//     break;
        default:				// 其他
            if (typeof DEBUG !== "undefined") {
                console.log("type-->" + type);
            }
			// debugger
			cache.addMsgs(msg);
    		callback();
			break;
	}
};


MT.updateTeam = function (msg, callback) {


};
/**
 * 添加成员
 */
MT.addTeamMembersNotification = function(msg,callback) {
	var team = msg.attach.team;
	cache.addTeam(team);
	cache.addTeamMembers(team.teamId, msg.attach.members);
 	var accounts = msg.attach.accounts,
        array=[],
        that=this;
    for(var i=0; i < accounts.length; i++){
        if(!cache.getPersonById(accounts[i])){
            array.push(accounts[i]);
        }
    }
    if(array.length>0){
        mysdk.getUsers(array,function(err,data){
            for (var i = data.length - 1; i >= 0; i--) {
                cache.updatePersonlist(data[i])
            }
            //蛋疼的异步处理，必须确保用户消息缓存在本地，再进行UI展示
            if (typeof DEBUG !== "undefined") {
                console.log("addMsg::addTeamMembersNotification1", msg);
            }
            cache.addMsgs(msg);
            //再次重绘
           	// that.buildSessions();
            that.checkSessionId(msg.sessionId);
            callback();
        })
    }else{
        if (typeof DEBUG !== "undefined") {
            console.log("addMsg::addTeamMembersNotification2", msg);
        }
        cache.addMsgs(msg);
        callback()
    }

};

/**
* 群主/管理员 移除成员
* @param team: 群（普通/高级）对象
* @param msg: 消息对象
*/
MT.removeMembersNotification = function ( msg, callback ) {
	var accounts = msg.attach.accounts,//被踢账号数组
        array = [],//获取未缓存的成员数据
        kickme = false,//被踢成员是否包含自己
        that = this;
    for( var i = 0; i < accounts.length; i++ ) {
        if( !cache.getPersonById( accounts[ i ] ) ) {
            array.push( accounts[ i ] )
        }
        if ( ( accounts[ i ] + "" ) === ( userUID + "" ) ) {
        	kickme = true
        }
    }
    cache.removeTeamMembers( msg.attach.team.teamId, accounts );

    if ( array.length > 0 ) { //加载未缓存的用户数据
        mysdk.getUsers( array, function ( err, data ) {
            for ( var i = data.length - 1; i >= 0; i-- ) {
                cache.updatePersonlist( data[ i ] );
            }
            //蛋疼的异步处理，必须确保用户消息缓存在本地，再进行UI展示
            cache.addMsgs(msg);

            if ( kickme ) {
    			// 被动退群，需要显示通知
    			cache.setTeamInvaild( msg.to );
    		}
    		//再次重绘
            this.buildTeams();
        	callback();
        } )
    } else { //没有未缓存的用户数据
    	if ( kickme ) {
    		// cache.removeTeamById(msg.to);
    		cache.setTeamInvaild( msg.to );
    	}
        cache.addMsgs( msg );
        callback();
    }
};

/**
* 退群
*/
MT.leaveTeamNotification = function(msg,callback) {
    cache.addMsgs( msg );
	var teamId = msg.target;
	// cache.removeTeamById(teamId);
    if( msg.from === userUID ){
        cache.setTeamInvaild( teamId );
    }
	// debugger
	this.buildTeams();
    callback();

	// if(msg.from===userUID){
	// 	// 从漫游消息中删除
	// 	var teamId = msg.to;
	// 	cache.removeTeamById(teamId);
	// 	this.buildTeams();
	// 	if($('#j-chatEditor').data('to') === msg.to) {
	// 		$('#j-chatEditor').data({to:""});
	// 		$('#j-rightPanel').addClass('hide');
	// 	}
    //
	// }
	// cache.addMsgs(msg);
 	// callback()
};

/**
* 更新群名字
*/
MT.updateTeamNotification = function(msg,callback) {
    var team = msg.attach.team,
        name = team.name,
        teamId = msg.attach.team.teamId;
    cache.updateTeam(teamId, {
        name : name
    });
    cache.updateTeam(msg.to,team);
    if (typeof DEBUG !== "undefined") {
        console.log("updateTeam", msg);
    }
    cache.addMsgs(msg);
    if ( !!name ) {
        this.ui.changeTeamName( teamId, name );
    }


	// var team = msg.attach.team;
	// var teamName = team.name;
	// if(teamName){
	// 	if($('#j-chatEditor').data('to') === msg.to){
	// 		$('#j-nickName').text(teamName)
	// 	}
	// }
	// cache.updateTeam(msg.to,team);
	// this.buildTeams();//在最近联系人中显示该群聊
	// cache.addMsgs(msg);
    callback();
};

/**
* 用户接受入群邀请
*/
MT.acceptTeamInviteNotification = function(msg,callback) {
	if(msg.from===userUID){
		cache.addTeam(msg.attach.team);
		this.buildTeams();
		// this.buildSessions();
	}
    cache.addMsgs(msg);
    callback();
};

/**
* 群主/管理员 同意入群邀请
*/
MT.passTeamApplyNotification = function(msg,callback) {
	if(msg.from===msg.attach.account||msg.attach.account===userUID){
		cache.addTeam(msg.attach.team);
		this.buildTeams();
		// this.buildSessions();
	}
 	cache.addMsgs(msg);
    callback();
};

/**
 * 解散群
 */
MT.dismissTeamNotification = function(msg,callback) {
	cache.addMsgs(msg);
	var teamId = msg.target;
	// cache.removeTeamById(teamId);
	cache.setTeamInvaild(teamId);
	// debugger
	this.buildTeams();
    callback();
};
/**
 * 禁言群成员
 */
MT.updateTeamMuteNotification = function(msg,callback) {
	cache.addMsgs(msg);
	cache.updateTeamMemberMute(msg.target,msg.attach.account,msg.attach.mute);
    callback();
};

module.exports = MT
