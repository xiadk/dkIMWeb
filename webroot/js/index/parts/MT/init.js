/**
* Created by newhuan on 2017/7/4.
*/

import mtAddressBook from "./mtAddressBook";
import mtAjax2 from "./mtAjax2";
import mtFriend from "./mtFriend";
import mtFriendSpace from "./mtFriendSpace";
import mtMenu from "./mtMenu";
import mtMessage from "./mtMessage";
import mtMyTeam from "./mtMyTeam";
import mtNotification from "./mtNotification";
import mtSearch from "./mtSearch";
import mtTeam from "./mtTeam";
import mtCONFIG from "./mtCONFIG";
import mtHack from "./mtHack";
import mtFindBack from "./mtFindBack";

var MT = function ( accid, ui ) {
    window.userUID = this.UserUID = accid;
    this.ui = ui;
    this.initModule();
    window.cache = this.cache = new window.Cache();
    window.mysdk  = this.mysdk = new window.SDKBridge(this, this.cache);
    if ( !!window.nim ) {
        this.netCallsdk = new window.NetCallSDK(this, this.cache);
    }

    //声音提示
    this.soundTip = true;
    //桌面提示
    this.deskTopNoteTip = true;
    this.hiddenProperty = 'hidden' in document ? 'hidden' :
        'webkitHidden' in document ? 'webkitHidden' :
            'mozHidden' in document ? 'mozHidden' :
                null;
    this.validTeamMap = {};
    this.chattingHistoryNumLimit = 20;
    //ajax timeout limit
    this.timeoutDelay = 20000;
    //备注和群名限制长度
    this.nickLimitLen = 16;
    //秘圈评论限制长度
    this.commentLenLimit = 200;
    this.defalutImage = window.imageRoot + "images/default-icon.png";
    //设置默认地理位置
    this.lnglateXY = [116.397428, 39.90923];
    //正在上传文件中的会话
    this.uploadingSessionIds = {};
    this.uploadingFlag = "isuploading";
    this.articleTitleLengthLimit = 40;
    this.maxLengthOfMomentText = 2000;

};

MT.prototype.initModule = function () {
    // this.initBase()
    this.initConfig();
    this.message();
    this.menu();
    this.addressBook();
    this.friend();
    this.myTeam();
    // this.notification()
    // this.personCard()
    // this.sysMsg()
    // this.session()
    // this.friend()
    this.team();
    this.friendSpace();
    this.initSearch();
    // this.cloudMsg()
    this.initScrollbar();
    this.initHack();
    this.findBack();
    this.preventDrop();
    this.initHeartbeat();
};
MT.prototype.preventDrop = function () {
  $("#send-text").on({
      dragleave:function(e){      //拖离
          e.preventDefault();
      },
      drop:function(e){           //拖后放
          e.preventDefault();
      },
      dragenter:function(e){      //拖进
          e.preventDefault();
      },
      dragover:function(e){       //拖来拖去
          e.preventDefault();
      }
  });
};

MT.prototype.initHeartbeat = function () {
    let that = this;
    if ( !this.heartbeatId ) {
        clearInterval( this.heartbeatId )
    }
    this.heartbeatId = setInterval( async function () {
        let res;
        try {
            res = await that.sendHeartbeat();
        } catch ( e ) {
            if ( typeof DEBUG !== "undefined" ) {
                console.error( "heartbeat error: ", e.message );
            }
            that.initHeartbeat();
        }
    }, 1000 * 60 * 60 );

}

MT.prototype.initScrollbar = function () {
    Ps.initialize(this.$friendSpaceContainer.get(0));
    Ps.initialize($('.tab-view-container').get(0));
    Ps.initialize($('.tab-view-container').get(1));
    Ps.initialize($('.tab-view-container').get(2));
    Ps.initialize($('.tab-view-container').get(3));
    Ps.initialize(this.$messageText.get(0));
    Ps.initialize(this.$chatContent.get(0));
    Ps.initialize(this.$chattingHistoryContainer.get(0));
    Ps.initialize($('.fs-my-notation-container').get(0));
    Ps.initialize($('.fsd-wrapper').get(0));
    Ps.initialize($('.ofs-wrapper').get(0));
    Ps.initialize($('#fs-new-item-text').get(0));
    Ps.initialize(this.$searchedList.get(0));
    Ps.initialize(this.$amSearchedList.get(0));
    Ps.initialize(this.$dmFriendList.get(0));
    Ps.initialize($('.cc-tab-layout').get(0));
    Ps.initialize($('.mm-for-position').get(0));
    Ps.initialize($('.m-emoji-picCol').get(0));
    Ps.initialize($('.search-result-container').get(0));
    Ps.initialize($('.team-member-layout').get(0));
    // this.initTextArea();
};

$.extend(MT.prototype, mtAddressBook);
$.extend(MT.prototype, mtAjax2);
$.extend(MT.prototype, mtFriend);
$.extend(MT.prototype, mtFriendSpace);
$.extend(MT.prototype, mtMenu);
$.extend(MT.prototype, mtMessage);
$.extend(MT.prototype, mtMyTeam);
$.extend(MT.prototype, mtNotification);
$.extend(MT.prototype, mtSearch);
$.extend(MT.prototype, mtTeam);
$.extend(MT.prototype, mtCONFIG);
$.extend(MT.prototype, mtHack);
$.extend(MT.prototype, mtFindBack);

module.exports = {
    MT
}