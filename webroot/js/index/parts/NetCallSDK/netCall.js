var Push = require("push.webroot.js");
var NetCallSDK = function (mt, cache) {//ctr,
    this.mt = mt;
    this.cache = cache;
    this.init();
}

/**
 * init NetCallSDK
 * @param {}
 * @returns {}
*/
NetCallSDK.prototype.init = function () {
    this.onMeetingCalling( {msg: 1} );
    this.nameLen = 12;
};

/**
 * handler netCallMeeting coming
 * @param {Object} message
 * @returns {undefined}
*/
NetCallSDK.prototype.onMeetingCalling = function ( message ) {
    if (typeof DEBUG !== "undefined") {
        console.log("onMeetingCalling", message);
    }
    this.initNetCall();

};

/**
 *
 * @param {}
 * @returns {}
*/
NetCallSDK.prototype.initNetCall = function (  ) {
    var NIM = window.NIM;
    var Netcall = window.Netcall;
    var that = this;
    NIM.use(Netcall);
    var netcall = window.testNetCall = this.netcall = Netcall.getInstance({
        nim: window.nim,
        mirror: false,
        mirrorRemote: false,
        /*kickLast: true,*/
        container: $(".netcall-video-local")[0],
        remoteContainer: $(".netcall-video-remote")[0]
    });
    if (typeof DEBUG !== "undefined") {
        console.log("initNetCall", netcall);
    };
    netcall.on("beCalling", this.onBeCalling.bind(this));
};
/**
 * 收到音视频邀请
 * @param {object} obj 主叫信息
 * @param {string} scene 是否是群视频，默认值p2p
 * @returns {}
*/
NetCallSDK.prototype.onBeCalling = function ( obj, scene ) {
    if (typeof DEBUG !== "undefined") {
        console.log("onBeCalling", obj, scene);
    }
    var account = obj.account,
        sessionId = (!!scene ? "team-" : "p2p-") + account,
        alias = sliceName(getUserData(this.cache.getPersonById(account)).alias, this.nameLen),
        tipStr = "来自" + alias + "的视频邀请，请在手机上查看";
    Push.create("音视频邀请", {
                    body: tipStr,
                    icon:  window.imageRoot + '/images/logo.png',
                    timeout: 4000,
                    onClick: function () {
                        window.focus();
                        this.close();
                    }
                });




}

module.exports = {
    NetCallSDK
}