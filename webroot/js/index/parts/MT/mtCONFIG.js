var MT = {

}
MT.initConfig = async function () {
    this.env = "pro";
    // this.env = "dev";
    this.CONFIG = {
        yunxin: {
            appkey: "ttyd2c5yhgjiktlhienihgelwuuf6dmr",//fack
            url: 'https://app.netease.im'
        },
        gaode: {
            url: "https://webapi.amap.com/maps",
            key: "0bc9a80586a664ba833f590ff8aec0d2",
            plugin: "AMap.Geocoder",
            version: "1.3"
        },
        oss: {
            bucket: "mituresprd",
            region: "oss-cn-hangzhou"
        },
        //2版接口
        mitures: {
            // root : 'https://api.mitures.com:8001/',
            root : 'https://api.mitures.com/',
            lv: readCookie( "lv" ),
            urls: {
                vipDeadline: "pay/deadline",//会员到期时间
                getKeys: "app/config",
                getConfig: "app/config",
                findUser: "user/phone/",
                findUsers: "user/find/", //模糊查找 t
                findUserByMTId: "user/number/",
                sendNewFsItem: "friends/new_moment", //t
                getMyFriendSpaceData: "friends/moment",//t
                up: "friends/moment/up",//t
                down: "friends/moment/up",//t
                deleteSpaceItem: "friends/moment",//t
                addComment: "friends/moment/comment",//t
                getOssKey: "resource/oss",//t
                getMomentDetail: "friends/moment/friend/",//friends/moment/
                getMore: "friends/moment",// t
                getFriendsSpaceData: "friends/moment/detail/",//t
                getMoreFriendsSpaceData: "friends/moment/detail/",//t
                deleteComment: "friends/moment/comment/",//t
                getMeTrust: "vip/user/trust/me_trust",//t
                getTrustMe: "vip/user/trust/trust_me",//t
                getLocation: 'location',
                alarm: "vip/safe/alarm",//手机响铃 t
                sendMessage: 'vip/safe/SMS',//发送短信给紧急联系人 t
                safe: "vip/safe",// t
                checkCHPwd: "pay/passwd/check",//t
            //    label
                createLabel: "label",//post t
                getAllLabels: "label",//get t
                deleteLabel:  "label/name",//delete t
                deleteLabelMembers: "label/name/members",// t
                updateLabel: "label/name", // t
                addLabelMember: "label/name/members", // t
                uploadDebugInfo : "debug",
                getWhitelist: "vip/user/trust/me_trust",
                signOut: "sign_out",
                deleteFriend: "user/friend/"

            },
            defaultLocation: "不显示位置",
            mttoken: readCookie( 'mttoken' )
        },

    };
    if ( this.env === "pro" ) {

    } else if ( this.env = "dev" ) {
        this.CONFIG.mitures.root = "https://api.mitures.com:8001/";
    }
    this.aeskeyLength = 16;
    this.initAesKey();
    await this.getServerConfig();
    this.initWhitelist();
    //check lastmodifytime
    this.checkLastModifyTime();
    // $(window).on('unload', this.beforeCloseWindow.bind(this));
};

MT.getServerConfig = async function () {
    let config,
        configFile;
    try {
        configFile = checkJSON( await this.getCONFIGFile() );
    } catch ( e ) {
        if ( typeof DEBUG !== "undefined" ) {
            console.error( "getConfigFileError: ", e.message, config );
        }
        this.isCanUploadImg = false;
        // this.getServerConfig();
        alert( "获取配置失败！" );
        this.signOut();
        return false;
    }
    if ( configFile.msgId !== "0200" ) {
        alert( "获取配置失败！" );
        this.signOut();
        return false;
    }
    config = checkJSON( this.decryptAES( this.aesKey, configFile.config ).slice( 0, configFile.size ) );
    this.$config = $( "<div></div>" );
    for ( let key in config ) {
        this.$config.data( key, config[ key ] );
    }
    this.initOss();
}

MT.initAesKey = function () {
    this.aesKey = this.getRandomKey( this.aeskeyLength );
}

MT.checkLastModifyTime = function () {
    if ( !readCookie( "lastModifyTime" ) ) {
        setCookie( "lastModifyTime", Date.now() );
        if ( !!this.modifyIntervalId ) {
            clearInterval( this.modifyIntervalId );
        }
        this.modifyIntervalId = setInterval( function () {
            setCookie( "lastModifyTime", Date.now() );
        }, 1000 * 60 );
    } else {
        let lastModifyTime = readCookie( "lastModifyTime" ),
            now = Date.now(),
            duration = now - lastModifyTime;
        if ( duration / 1000 / 60 > 5 ) {
            delCookie( "uid" );
            delCookie( "sdktoken" );
            delCookie( "lastModifyTime" );
            window.location.href = "../../../../webroot/login.html";
        } else {
            if ( !!this.modifyIntervalId ) {
                clearInterval( this.modifyIntervalId );
            }
            this.modifyIntervalId = setInterval( function () {
                setCookie( "lastModifyTime", Date.now() );
            }, 1000 * 60 );
        }
    }
}

MT.initWhitelist = async function () {
    if ( !this.userIsVip() ) {
        return;
    }
    let MTres, TMres, ress = [];
    try {
        ress = await Promise.all( [ this.getMeTrustlist(), this.getTrustMelist() ] );
    } catch ( e ) {
        if ( typeof DEBUG !== "undefined" ) {
            console.error( "getWhitelistError: ", e );
        }
        return;
    }
    let MTdata = checkJSON( ress[ 0 ] ),
        TMdata = checkJSON( ress[ 1 ] );
    //MT handler
    if ( !MTdata || !MTdata.msgId || MTdata.msgId !== "0200" ) {
        if ( MTdata.msgId === "0500" ) {
            this.isVip = false;
        }
    } else {
        this.isVip = true;
        cache.setMeTrustlist( MTdata.users );
    }
    //TM handler
    if ( !TMdata || !TMdata.msgId || TMdata.msgId !== "0200" ) {
        if ( TMdata.msgId === "0500" ) {
            this.isVip = false;
        }
    } else {
        this.isVip = true;
        cache.setTrusrMelist( TMdata.users );
    }
}

MT.userIsVip = function () {
    if ( typeof this.isVip !== "undefined" ) {
        return this.isVip
    }
    let lv = this.CONFIG.mitures.lv;
    return ( typeof lv !== "undefined" && lv != 0);
}

MT.initOss = function () {
    //todo: 耦合度太高, server config接口配置修改后改成根据参数初始化
    let oss = this.$config.data( "oss" );
    // this.CONFIG.oss.assessKey = oss.oss_key;
    // this.CONFIG.oss.secretKey = oss.oss_secret;
    if ( !!oss.oss_host ) {
        localStorage.setItem( "oss_host", oss.oss_host );
    }
    // localStorage.setItem( "oss_bucket", this.CONFIG.oss.bucket );
    try{
        this.client = new OSS.Wrapper({
             // region: this.CONFIG.oss.region,
            accessKeyId: oss.oss_key,
            accessKeySecret: oss.oss_secret,
            endpoint: "https://oss.mitures.com",
            cname: true,
            secure: true,
            bucket: this.CONFIG.oss.bucket
        });
        this.isCanUploadImg = true;
     }catch (e){
         if (typeof DEBUG !== "undefined") {
             console.error("set client error", e);
         }
         this.isCanUploadImg = false;
     }
}

MT.getRandomKey = function ( num ) {
    let array = [],
        aNum = "a".charCodeAt( 0 ),
        ANum = "A".charCodeAt( 0 );
    for ( let i = 0; i < 26; ++i ) {
        if ( i < 10 ) {
            array.push( i );
        }
        array.push( String.fromCharCode( aNum + i ) );
        array.push( String.fromCharCode( ANum + i ) );
    }
    let len = array.length,
        key = "";
    for ( let i = 0; i < num; ++i ) {
        key += array[ getRandomNum( len ) ];
    }
    return key;
    function getRandomNum( range ) {
        return parseInt( Math.random() * range, 10 );
    }
}

MT.getGaodeScript = function () {
    let gaode = this.CONFIG.gaode,
        url = gaode.url + "?";
    url += ( "v=" + gaode.version + "&" );
    url += ( "key=" + gaode.key + "&" );
    url += ( "plugin=" + gaode.plugin );
    let $gaodeScript = $( "<script></script>" ).attr( "src", url );
    $gaodeScript.appendTo( $( "body" ) );
}

MT.checkToken = function () {

};

MT.updateToken = function () {

};

MT.decryptAES = function ( key, miwen ) {
    let realKey = MD5( key ).slice( 8, 24 );
    realKey = CryptoJS.enc.Utf8.parse( realKey )
    var ss = CryptoJS.enc.Hex.parse( miwen )
    var sss = CryptoJS.enc.Base64.stringify( ss )
    var mingwen = CryptoJS.AES.decrypt( sss, realKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.NoPadding
    }).toString( CryptoJS.enc.Utf8 );
    return mingwen;
}

module.exports = MT