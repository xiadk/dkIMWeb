var UI = {

};
UI.initFriendSpaceNode = function () {
    this.$fsendNewItem = $('.fs-send-new-item');
    this.$photoArea = $('.fs-photo-area');
    this.$textArea = $('.fs-new-item-text');
    this.$fsList = $('.fs-list');
    this.$fsMyNotationList = $('.fs-my-notation-list');
    this.$ofsList = $('.ofs-container');//好友空间
    this.$fsdContainer = $('.fsd-container');//说说详情
};
//friend space
//send new item
UI.showNewPhotoItem = function (dataUrl) {
    if ($('.fs-send-photo-wrapper').length > 4) {
        // this.$fsList.webroot.css({
        //     "marginTop": "268px"
        // });
    }
    var html = this.getNewPhotoItem(dataUrl);
    this.$photoArea.append(html);
    this.$photoArea.append($('#fs-add-photo'));

};

UI.getNewPhotoItem = function (dataUrl) {
    var html = "";
    html += '<div class="fs-send-photo-wrapper">';
    html += '<img src="' + dataUrl + '" class="fs-photo-for-send" >';
    html += '<div class="fs-photo-hover"></div></div>';
    return html;
};

UI.clearSendNewItemArea = function () {
    this.$photoArea.html('<div class="fs-send-photo-wrapper" id="fs-add-photo">\n' +
        '                                   <img src="' + window.imageRoot + '/images/friend_space/button_photo.png" class="fs-photo-for-send">\n' +
        '                               </div>');
    this.$textArea.val("");
    $( ".mai-option[data-value$=0]" ).click();
    if ( $( ".mai-down-arrow" ).hasClass( "mai-down-arrow-select" ) ) {
        $( ".mai-down-arrow" ).click();
    }

};

UI.initFriendSpaceList = function (data) {
    var moments = data || cache.getFriendSpaceList(),
        len = moments.length,
        html = "";
    for (var i = 0; i < len; i++) {
        html += '<div class="fs-item-line"></div>';
        html += this.getFriendSpaceItem(moments[i]);
    }
    html += '<div class="fs-get-more-wrapper"><em class="fs-get-more" id="fs-get-more">加载更多</em></div>';
    this.$fsList.find( ".fs-item-line,.fs-get-more-wrapper,.fs-item" ).remove();
    this.$fsList.append( $( html ) );
    this.$fsList.find('.fs-item-photo-layout').lightGallery();
    // this.initTextArea();
};


UI.initFriendsFriendSpaceList = function (data) {
    var len = data.length,
        html = "";
    // html += '<div id="ofs-close" class="ofs-close"></div>';
    for (var i = 0; i < len; i++) {
        html += '<div class="fs-item-line"></div>';
        html += this.getFriendSpaceItem(data[i]);
    }
    html += '<div class="ofs-get-more-wrapper"><em class="ofs-get-more" id="ofs-get-more">加载更多</em></div>';
    this.$ofsList.html(html);
    this.$ofsList.find('.fs-item-photo-layout').lightGallery();
    // $('.ofs-wrapper').scrollTop(0);
};

UI.addMoreFSItem = function (data) {
    var moments = data,
        len = moments.length,
        html = "";
    if(len === 0){
        $('#fs-get-more').html("没有更多了");
        // alert("没有更多了！");
        return;
    }
    $('.fs-get-more-wrapper').remove();
    cache.addFriednSpaceList(data);
    for (var i = 0; i < len; i++) {
        html += '<div class="fs-item-line"></div>';
        html += this.getFriendSpaceItem(moments[i]);
    }
    html += '<div class="fs-get-more-wrapper"><em class="fs-get-more" id="fs-get-more">加载更多</em></div>';
    this.$fsList.append(html);
    this.$fsList.find('.fs-item-photo-layout').lightGallery();

};

UI.addMoreFriendsFSItem = function (data) {
    var moments = data,
        len = moments.length,
        html = "";
    if(len === 0){
        $('#ofs-get-more').html("没有更多了");
        return;
    }
    $('.ofs-get-more-wrapper').remove();
    // cache.addFriednSpaceList(data);
    for (var i = 0; i < len; i++) {
        html += '<div class="fs-item-line"></div>';
        html += this.getFriendSpaceItem(moments[i]);
    }
    html += '<div class="ofs-get-more-wrapper"><em class="ofs-get-more" id="ofs-get-more">加载更多</em></div>';
    this.$ofsList.append(html);
    //plugin
    this.$ofsList.find('.fs-item-photo-layout').lightGallery();
    // Ps.initialize($('.ofs-wrapper').get(0));
};

UI.initFSDetail = function (moment) {
    var html;
    try {
        html = this.getFriendSpaceItem(moment);
    } catch ( e ) {
        if (typeof DEBUG !== "undefined") {
            console.error( "getHTML of FriendSpaceItem Error", e );
        }
        html = '<div><strong>数据异常</strong></div>';
    }
    this.$fsdContainer.html(html);
    this.$fsdContainer.find('.fs-item-photo-layout').lightGallery();
    // Ps.initialize($('.fsd-wrapper').get(0));
    $('.fsd-wrapper').scrollTop(0);
};

UI.getFriendSpaceItem = function (data) {
    //所有的确认 写在最开始？
    if(!data || typeof data !== 'object' || !data.mid){
        return "";
    }
    var id = !!data.uuid ? data.uuid : "0";
    var avatar,
        name;
    // debugger
    if(id === "0"){
        avatar = data.avatar;
        name = data.name;
    }else {
        var userData = getUserData(cache.getPersonById(id));
        avatar = userData.avatar;
        name = userData.alias !== id ? userData.alias : userData.name;
    }
    if ( this.webpReg.test( avatar ) ) {
        avatar += this.ossConvertType;
    }
    // debugger
    var html = "",
        time = data.moment_time;


    html += '<div class="fs-item" data-uid="' + id + '" data-time="' + time + '" data-mid="' + data.mid + '" data-type = "' + data.type + '">';
    html += '<div class="fs-item-header clear"><div class="fs-item-avatar-container clear">';
    html += '<img src="' + avatar + '"></div>';
    html += '<em class="fs-item-alias">' + name + '</em>';
    html += '<span class="fs-item-release-time">' + ( !!data.before_time ? data.before_time : transTime(time) ) + '</span></div>';
    html += '<div class="fs-item-main-layout">';
    //below is fs-item-main-layout
    //图片处理
    if ( !data.type ) {
        return "";
    }
    //转发时，直接取res_json的内容
    //先判断是否是转发的说说（ 所有被转发的说说的res_json里面的type不能为5 ）
    var transpondedMomentData,
        words,
        isTranspondedMoment,
        transportedMomentHasBeenDeleted = false,
        realType,
        res_json = "";

    if ( data.type === 5 ) {
        transpondedMomentData = checkJSON( data.res_json );
        if ( !transpondedMomentData ) {
            return "";
        }
        html += this.getTransportedMomentAreaHtml( transpondedMomentData );
        words = data.words;
        //其余部分作为纯文字说说处理
        realType = 1;
    } else {
        isTranspondedMoment = false;
        res_json = data.res_json;
        words = data.words;
        realType = data.type;
    }

     //文字处理
    if ( realType == 4 ) {
        html += '<div class="fs-item-text-layout">';
        html += '<p class="fs-item-text">' + words + '</p></div>';
         //文章处理
        html += this.getArticleHtml( res_json );
    } else {
        if( realType == 2 ){//1 纯文字 2 图片 3 视频 4 文章 5 被转发的秘圈 6 游戏分享
            html += this.getPhotosHtml( res_json );
        } else if( realType == 3 ){
            html += this.getVideoHtml( res_json );
        } else {

        }
        html += '<div class="fs-item-text-layout">';
        html += '<p class="fs-item-text">' + words.replace(/[\r\n]/ig,"<br>") + '</p></div>';
    }


    html += "</div>";

    if ( isTranspondedMoment ) {
        // add author tip
        html +=
            `
            <div class="fs-item-transpond-from-layout clear">
                <img class="sign-transpond-from-icon" src="${window.imageRoot + "/images/icon_forward.png" }" alt="转发">
                <p>原文：${getAliasByAccount( fromAccount )}</p>
            </div>
            `
    }

    //fs-item-main-layout over
    if(!!data.star){
        //icons 处理
        html += this.getIconsHtml(data);
        //已赞用户列出
        html += this.getUpedUserHtml(data.star);
    }
    if(!!data.comments){
        //评论处理
        html += this.getCommentHtml(data);
    }

    //回复ui
    html += '<div class="fs-item-add-comment-layout">';
    html += '<input type="text" class="add-comment-ipt" placeholder="添加评论..."/>';
    html += ' <div class = "add-comment-view" >';
    html += '<textarea class="fs-item-ta" placeholder="" class="" rows="3" cols="10"></textarea>';
    html += '<div class="fs-item-bottom-line">';
    html += '<button class="fs-item-comment-btn" data-tocid="" data-touser="' + id + '" data-mid="' + data.mid + '">发送</button>';
    html += '</div>';

    html += '</div>';
    html += '</div>';
    html += '</div>';
    return html;
};

UI.getTransportedMomentAreaHtml = function ( transportedMomentData ) {
    //被转发的说说必然不会是[被转发的说说]
    let transportedMomentHasBeenDeleted = false,
        transportedMomentAreaHtml = "";

    if ( transportedMomentData.is_del === 1 ) {
    //    moment has been deleted
        transportedMomentHasBeenDeleted = true;
        transportedMomentAreaHtml += `<div class="transported-fs-item"><p class="moment-be-deleted-tip">该内容已经被删除！</p></div>`;
        return transportedMomentAreaHtml;
    }

    let words = transportedMomentData.words,
        res_json = transportedMomentData.res_json,
        realType = transportedMomentData.type,
        fromAccount = transportedMomentData.uuid;
    if ( typeof words === "undefined" ) {
        return "";
    }

    transportedMomentAreaHtml = "";

    let data = transportedMomentData;
    let id = !!data.uuid ? data.uuid : "0",
        avatar,
        name;
    if( id === "0" ) {
        avatar = data.avatar;
        name = data.name;
    }else {
        var userData = getUserData( cache.getPersonById(id) );
        avatar = userData.avatar;
        name = userData.alias !== id ? userData.alias : userData.name;
    }
    if ( this.webpReg.test( avatar ) ) {
        avatar += this.ossConvertType;
    }
    // debugger
    var html = "",
        time = data.moment_time;
    html += `<div class="transported-fs-item">`;
    html += '<div class="fs-item" data-uid="' + id + '" data-time="' + time + '" data-mid="' + data.mid + '" data-type = "' + data.type + '">';
    html += '<div class="fs-item-header clear"><div class="fs-item-avatar-container clear">';
    html += '<img src="' + avatar + '"></div>';
    html += '<em class="fs-item-alias">' + name + '</em>';
    html += '<span class="fs-item-release-time">' + ( !!data.before_time ? data.before_time : transTime(time) ) + '</span></div>';
    html += '<div class="fs-item-main-layout">';
     //文字处理
    if ( realType == 4 ) {
        html += '<div class="fs-item-text-layout">';
        html += '<p class="fs-item-text">' + words + '</p></div>';
         //文章处理
        html += this.getArticleHtml( res_json );
    } else {
        if( realType == 2 ){//1 纯文字 2 图片 3 视频 4 文章 5 被转发的秘圈 6 游戏分享
            html += this.getPhotosHtml( res_json );
        } else if( realType == 3 ){
            html += this.getVideoHtml( res_json );
        } else {

        }
        html += '<div class="fs-item-text-layout">';
        html += '<p class="fs-item-text">' + words.replace(/[\r\n]/ig,"<br>") + '</p></div>';
    }


    html += '</div></div></div>';
    return html;
}

UI.getVideoHtml = function (data) {
    // return "";
    data = checkJSON(data);
    if(!data){
        return "";
    }
    var html = "",
        len = data.length;
    if(len === 0){
        return html;
    }else if(len === 2){
        html = '<video class="fs-item-video" src= "' + checkHost( data[0] ) + '" controls>您的浏览器不支持视频播放，为了更好地体验秘图网页版，建议您使用IE10、Chrome、FireFox、Safari、360等主流浏览器。</video>';
        return html;
    }else {
        html = "";
        return html;
    }
};

UI.getArticleHtml = function ( resJson ) {
    var data = checkJSON( resJson );
    if ( !data ) {
        return "";
    }
    var html = "",
        title = data.title || "",
        url = data.url || "",
        avatar = data.avatar || window.imageRoot + "/images/wenzhang.png";
    // if ( this.webpReg.test( avatar ) ) {
    //     avatar += this.ossConvertType;
    // }
    avatar = convertWebp( avatar );
    html  = [
        `<a href="${ url }" target="_blank">
        <div class = "fs-item-article-layout">
            <div class="fs-item-article-main clear">
                <div class="fs-item-article-avatar-wrapper">
                <img src="${ avatar }" alt="${ title.slice( 0, 3 ) }" class="fs-item-article-avatar">          
                <span class="line-for-verticle"></span>
</div>
                <div class="fs-item-msg-wrapper clear">
                    <p class="fs-item-msg-title"> 
                        <!--<a href="${ url }" target="_blank">-->
                            ${ !!title ? 
                                    ( title.length < this.articleTitleLengthLimit ? 
                                                                                    title : 
                                                                                    title.slice( 0, this.articleTitleLengthLimit - 3 ) + "..." ) 
                                        : "文章详情" }
                        <!--</a>-->
                    </p>
                </div> 
            </div>
            
        </div>
        </a>
        `
    ].join( "" );
    return html;

}

UI.getPhotosHtml = function (data) {
    if(!!data && typeof data === 'string'){
        data = JSON.parse(data);
    }
    var html = "",
        len = data.length;
    if(len === 0){
        return html;
    }else if(len === 1){
        let src = data[ 0 ];
        // if ( typeof DEBUG !== "undefined" ) {
        //     console.log( this.webpReg.test( src ) );
        // }
        // if ( this.webpReg.test( src ) ) {
        //     src += this.ossConvertType;
        // }
        src = convertWebp( src );
        html = '<div class="fs-item-photo-layout clear">' + '<div class="fs-item-img-wrapper fs-item-img-single-wrapper"  data-src="' + src + '">' +
            '<img class="img-single" src="' + src + '"><span></span>' +
            '</div>' +
            '</div>';
        return html;
    }else {
        html = '<div class="fs-item-photo-layout clear">';
        for(var i = 0; i < len; i++){
            // if ( this.webpReg.test( data[ i ] ) ) {
            //     data[ i ] += this.ossConvertType;
            // }
            data[ i ] = convertWebp( data[ i ] );
            html += '<div class="fs-item-img-wrapper fs-item-img-mult-wrapper"   data-src="' + data[i] + '"><img class="img-mult" src="' + data[i] + '"><span></span></div>';
        }
        html +='</div>';
        return html;
    }
};

UI.getIconsHtml = function (data) {
    // if(!!data && typeof data === 'string'){
    //     data = JSON.parse(data);
    // }
    // if(!!data.star && typeof data.star === 'string'){
    //     data.star = JSON.parse(data.star);
    // }
    // if(!!data.star && typeof data.star === 'string'){
    //     data.star = JSON.parse(data.star);
    // }
// debugger
    var html = "",
        starLen = data.star.length,
        comLen = data.comments.length,
        flagUp = false,

        flagDelShow = data.uuid + "" === userUID + "";
    // debugger
    for(var i = 0; i < starLen; i++){
       if(data.star[i].uid + "" === userUID + ""){
           flagUp = true;
           break;
       }
    }
    html += '<div class="fs-item-icon-layout clear">';
    html += '<div class="fs-item-icon-group"><span data-mid="' + data.mid + '" class="fs-item-icon icon-hot  ' + (flagUp ? 'cur' : '') + '"></span>';
    html += '<span class="fs-item-icon-describe"><em>' + starLen + '</em>热度</span></div>';
    html += '<div class="fs-item-icon-group"><span class="fs-item-icon icon-comment"></span>';
    html += '<span class="fs-item-icon-describe"><em>' + comLen + '</em>条评论</span></div>';
    if ( !!data.allow_repost ) {
        html += '<div class="fs-item-icon-group"><span class="fs-item-icon icon-transpond"></span>';
        html += '<span class="fs-item-icon-describe">转发</span></div>';
    }
    if(!flagDelShow){
        html += '</div>';
        return html;
    }
    else{
        html += '<div class="fs-item-icon-group"><span class="fs-item-icon icon-delete"></span>';
        html += '<span class="fs-item-icon-delete">删除</span></div>';
        html += '</div>';
        return html;
    }


};

UI.getUpedUserHtml = function (data) {
    var len = data.length,
        html = "";
    if(len === 0){
        return html;
    }
    html += '<div class="fs-item-praised-users-layout"><p>';
    for(var i = 0; i < len; i++) {
        var alias = sliceName(getUserData(cache.getPersonById(data[i].uid)).alias, this.nameLen);
        html += ' <em class="fs-item-user fs-item-praised-user" data-account="' + data[i].uid + '">' + alias + '</em>';
        if(i !== len - 1){
            html += "、"
        }
    }
    html += '</p></div>';
    return html;
};

UI.getCommentHtml = function (data) {
    var comments = data.comments,
        len = comments.length;
    if(len === 0){
        return "";
    }
    var html = "";
    html += '<div class="fs-item-comments-layout"><div class="fs-item-comment-list">';
    for(var i = 0; i < len; i++){
        var alias = sliceName(getUserData(cache.getPersonById(comments[i].uid)).alias, this.nameLen),
            toUserAlias = sliceName(getUserData(cache.getPersonById(comments[i].to_user)).alias, this.nameLen);
        // var commentUserData = cache.getPersonById();
        html += '<div class="fs-item-comment-item clear"><span class="fs-item-comment-from">';
        // debugger
        if(comments[i].to_cid + "" === "0" || (comments[i].to_user == comments[i].uid)){
            html += '<em class="fs-item-user fs-item-commentted-user" data-account="' + comments[i].uid + '">' + alias + '：</em>';
        }else {
            html += '<em class="fs-item-user fs-item-commentted-user" data-account="' + comments[i].uid + '">' + alias + '</em>回复';
            html += '<em class="fs-item-user fs-item-commentted-user" data-tocmid = "' + comments[i].cid + '" data-account="' + comments[i].to_user + '">' + toUserAlias + '</em>：';
        }
        html += '</span><em class="fs-item-commen-text" data-uid="' + comments[i].uid + '" data-cid="' + comments[i].cid + '" data-ctime = "' + comments[i].comment_time + '">' + comments[i].comment +'</em></div>';
    }
    html += '</div></div>';
    return html;
};

UI.appendNotationItem = function (msg) {
    if(!msg.type){
       return false;
    }
    switch (msg.type){
        case 1:
            this.addNewFSNotationItem(msg);
            break;
        case 2:
            var html = this.getUpNotationItem(msg);
            if(!!html){
                this.$fsMyNotationList.append(html);
            }
            break;
        case 5:
            var html = this.addNewComNotationItem(msg);
            if(!!html){
                this.$fsMyNotationList.append(html);
            }
            break;
    }
    this.addFSTip();
};

UI.getUpNotationItem = function (msg) {
    var data = checkJSON(msg);
    if(!data){
        return false;
    }
    var id = !!data.user ? (!!data.user.uid ? data.user.uid : "") : "",
        moment = !!data.moment ? data.moment : "",
        type = moment.type;
    if(id === "" || moment === ""){
        return false;
    }
    var cacheData = cache.getPersonById(id);
    if(!cacheData){
        mysdk.getUsers([id], function (error, data) {
            if (!error) {
                cache.setPersonlist(data);
                this.appendNotationItem(msg);
            } else {
                alert("获取用户信息失败")
            }
        }.bind(this));
        return false;
    }
    var userData = getUserData(cache.getPersonById(id)),
        avatar = userData.avatar,
        alias = sliceName(userData.alias, this.nameLen),
        time = !!moment.moment_time ? moment.moment_time : Date.now(),
        timeTag = transTime(time);
    // var moment = !!data.moment ? data.moment : {};
    var html = '<div class="fsn-item fsn-up" data-uid="' + moment.uid + '" data-mid="' + moment.mid + '">\n' +
    '                            <div class="fsni-avater-wrapper">\n' +
    '                                <img src="' + avatar + '" class="fsni-avatar">\n' +
    '                            </div>\n' +
    '                            <div class="fsni-main-wrapper">\n' +
    '                                <div class="fsni-main-line fsni-line1">\n' +
    '                                    <div class="fsni-alias">' + alias + '</div>\n' +
    '                                    赞了你\n' +
    '                                </div>\n' +
    '                                <div class="fsni-main-line fsni-line2">\n' +
    '                                    <img src="https://mituresprd.oss-cn-hangzhou.aliyuncs.com/web/1f6f5924c1f4c65f2663a590cf5cfcda/images/friend_space/icon_dianzan2.png">\n' +
    '                                </div>\n' +
    '                                <div class="fsni-main-line fsni-line3">\n' +
    '                                    <div class="fsni-timetag">' + timeTag + '</div>\n' +
    '                                </div>\n' +
    '                            </div>\n';
    var str = !!moment.res_json ? moment.res_json : "",
        urls = [];
    if(str === " " || str === ""){
        html += '                        </div>';
        return html;
    }
    if(typeof str === 'string'){
        urls = JSON.parse(str);
    }else {
        urls = str;
    }
    if(!urls.length || urls.length === 0){
        html += '                        </div>';
        return html;
    }else {
        html += '                            <div class="fsni-img-wrapper">\n' +
                '                                <img class="fsni-img" src="' + ( type === 3 ? convertWebp( urls[ 1 ] ) : convertWebp( urls[ 0 ] ) ) + '">\n' +
                '                            </div>\n' +
                '                        </div>';
        return html;
    }

};

UI.addNewFSNotationItem = function (msg) {
    var data = checkJSON(msg);
    if(!data){
        return false;
    }
    var id = !!data.user ? (!!data.user.uid ? data.user.uid : "") : "",
        moment = !!data.moment ? data.moment : "",
        type = moment.type;
    if( id === "" || moment === "" ){
        return false;
    }
    var cacheData = cache.getPersonById(id);
    if(!cacheData){
        mysdk.getUsers([id], function (error, data) {
            if (!error) {
                cache.setPersonlist(data);
                this.appendNotationItem(msg);
            } else {
                alert("获取用户信息失败")
            }
        }.bind(this));
        return false;
    }
    var userData = getUserData(cache.getPersonById(id)),
        avatar = userData.avatar,
        alias = sliceName(userData.alias, this.nameLen),
        time = !!moment.moment_time ? moment.moment_time : Date.now(),
        timeTag = transTime(time),
        words = moment.words;
    // var moment = !!data.moment ? data.moment : {};
    var html = '<div class="fsn-item fsn-comment" data-uid="' + moment.uid + '" data-mid="' + moment.mid + '">\n' +
    '                            <div class="fsni-avater-wrapper">\n' +
    '                                <img src="' + avatar + '" class="fsni-avatar">\n' +
    '                            </div>\n' +
    '                            <div class="fsni-main-wrapper">\n' +
    '                                <div class="fsni-main-line fsni-line1">\n' +
    '                                    <div class="fsni-alias">' + alias + '</div>\n' +
    '                                    发布了一条新的说说\n' +
    '                                </div>\n' +
    '                                <div class="fsni-main-line fsni-line2">\n' +
    '<div class="fsni-comment-words">\n' +
        '                                        ' + sliceName(words, 20) + '\n' +
        '                                    </div>' +
    '                                </div>\n' +
    '                                <div class="fsni-main-line fsni-line3">\n' +
    '                                    <div class="fsni-timetag">' + timeTag + '</div>\n' +
    '                                </div>\n' +
    '                            </div>\n';
    var str = !!moment.res_json ? moment.res_json : "",
        urls = [];
    if(str === " " || str === ""){
        html += '                        </div>';
        return html;
    }
    if(typeof str === 'string'){
        urls = JSON.parse(str);
    }else {
        urls = str;
    }
    if(!urls.length || urls.length === 0){
        html += '                        </div>';
        return html;
    }else {
        html += '                            <div class="fsni-img-wrapper">\n' +
                '                                <img class="fsni-img" src="' + ( type === 3 ? convertWebp( urls[ 1 ] ) : convertWebp( urls[ 0 ] ) ) + '">\n' +
                '                            </div>\n' +
                '                        </div>';
        return html;
    }

};

UI.addTransportFSNotationItem = function ( msg ) {
    var data = checkJSON(msg);
    if(!data){
        return false;
    }
    var id = !!data.user ? (!!data.user.uid ? data.user.uid : "") : "",
        moment = !!data.moment ? data.moment : "",
        type = moment.type;
    if( id === "" || moment === "" ){
        return false;
    }
    var cacheData = cache.getPersonById(id);
    if(!cacheData){
        mysdk.getUsers([id], function (error, data) {
            if (!error) {
                cache.setPersonlist(data);
                this.appendNotationItem(msg);
            } else {
                alert("获取用户信息失败")
            }
        }.bind(this));
        return false;
    }
    var userData = getUserData(cache.getPersonById(id)),
        avatar = userData.avatar,
        alias = sliceName(userData.alias, this.nameLen),
        time = !!moment.moment_time ? moment.moment_time : Date.now(),
        timeTag = transTime(time),
        words = moment.words;
    // var moment = !!data.moment ? data.moment : {};
    var html = '<div class="fsn-item fsn-comment" data-uid="' + moment.uid + '" data-mid="' + moment.mid + '">\n' +
    '                            <div class="fsni-avater-wrapper">\n' +
    '                                <img src="' + avatar + '" class="fsni-avatar">\n' +
    '                            </div>\n' +
    '                            <div class="fsni-main-wrapper">\n' +
    '                                <div class="fsni-main-line fsni-line1">\n' +
    '                                    <div class="fsni-alias">' + alias + '</div>\n' +
    '                                    的说说被转发了\n' +
    '                                </div>\n' +
    '                                <div class="fsni-main-line fsni-line2">\n' +
    '<div class="fsni-comment-words">\n' +
        '                                        ' + sliceName(words, 20) + '\n' +
        '                                    </div>' +
    '                                </div>\n' +
    '                                <div class="fsni-main-line fsni-line3">\n' +
    '                                    <div class="fsni-timetag">' + timeTag + '</div>\n' +
    '                                </div>\n' +
    '                            </div>\n';
    var str = !!moment.res_json ? moment.res_json : "",
        urls = [];
    if(str === " " || str === ""){
        html += '                        </div>';
        return html;
    }
    if(typeof str === 'string'){
        urls = JSON.parse(str);
    }else {
        urls = str;
    }
    if(!urls.length || urls.length === 0){
        html += '                        </div>';
        return html;
    }else {
        html += '                            <div class="fsni-img-wrapper">\n' +
                '                                <img class="fsni-img" src="' + ( type === 3 ? convertWebp( urls[ 1 ] ) : convertWebp( urls[ 0 ] ) ) + '">\n' +
                '                            </div>\n' +
                '                        </div>';
        return html;
    }
}

UI.addNewComNotationItem = function (msg) {
    var data = checkJSON(msg);
    if(!data){
        return false;
    }
    var id = !!data.user ? (!!data.user.uid ? data.user.uid : "") : "",
        moment = !!data.moment ? data.moment : "",
        comment = !!data.comment ? data.comment : "",
        type = moment.type;
    if(id === "" || moment === "" || comment === ""){
        return false;
    }
    var cacheData = cache.getPersonById(id);
    if(!cacheData){
        mysdk.getUsers([id], function (error, data) {
            if (!error) {
                cache.setPersonlist(data);
                this.appendNotationItem(msg);
            } else {
                alert("获取用户信息失败")
            }
        }.bind(this));
        return false;
    }
    var userData = getUserData(cache.getPersonById(id)),
        avatar = userData.avatar,
        alias = sliceName(userData.alias, this.nameLen),
        time = !!moment.moment_time ? moment.moment_time : Date.now(),
        timeTag = transTime(time),
        words = comment || "";
    // var moment = !!data.moment ? data.moment : {};
    var html = '<div class="fsn-item fsn-comment" data-uid="' + moment.uid + '" data-mid="' + moment.mid + '">\n' +
    '                            <div class="fsni-avater-wrapper">\n' +
    '                                <img src="' + avatar + '" class="fsni-avatar">\n' +
    '                            </div>\n' +
    '                            <div class="fsni-main-wrapper">\n' +
    '                                <div class="fsni-main-line fsni-line1">\n' +
    '                                    <div class="fsni-alias">' + alias + '</div>\n' +
    '                                    评论了你\n' +
    '                                </div>\n' +
    '                                <div class="fsni-main-line fsni-line2">\n' +
    '<div class="fsni-comment-words">\n' +
        '                                        ' + sliceName(words, 20) + '\n' +
        '                                    </div>' +
    '                                </div>\n' +
    '                                <div class="fsni-main-line fsni-line3">\n' +
    '                                    <div class="fsni-timetag">' + timeTag + '</div>\n' +
    '                                </div>\n' +
    '                            </div>\n';
    var str = !!moment.res_json ? moment.res_json : "",
        urls = [];
    if(str === " " || str === ""){
        html += '                        </div>';
        return html;
    }
    if(typeof str === 'string'){
        urls = JSON.parse(str);
    }else {
        urls = str;
    }
    if(!urls.length || urls.length === 0){
        html += '                        </div>';
        return html;
    }else {
        html += '                            <div class="fsni-img-wrapper">\n' +
                '                                <img class="fsni-img" src="' + ( type === 3 ? convertWebp( urls[ 1 ] ) : convertWebp( urls[ 0 ] ) ) + '">\n' +
                '                            </div>\n' +
                '                        </div>';
        return html;
    }
};

UI.showDeleteCommentVerify = function ( mid, cid, scene, id ) {
    if( !this.$deletecommentVerifyTab ) {
        this.$deletecommentVerifyTab = $( '#delete-comment-tab' );
    }
    var $submitBtn = this.$deletecommentVerifyTab.find("#dc-submit");
    $submitBtn.data( "mid", mid );
    $submitBtn.data( "cid", cid );
    $submitBtn.data( "scene", scene );
    $submitBtn.data( "id", id );
    this.$deletecommentVerifyTab.removeClass( 'hide' );
};

UI.hideDeleteCommentVerify = function () {
    this.addHideClassTo( !!this.$deletecommentVerifyTab ? this.$deletecommentVerifyTab : $( '#delete-comment-tab' ) );
};

UI.addHideClassTo = function ( $ele ) {
    if ( !$ele.hasClass( "hide" ) ) {
        $ele.addClass( "hide" );
    }
}

UI.addFSTip = function () {//红点提醒

};

UI.removeFSTip = function () {

};

/**
 * show transpond verify tab
 * @param { Function } sureCallback callback when sure btn clicked
 * @param { Object } momentData transponded moment data
 * @returns {}
*/
UI.showTranspondVerifyTab = function ( momentData, sureCallback ) {
    if ( !momentData ) {
        return false;
    }
    var wordsLengthLimit = 20,
        transportedMomentId = momentData.mid,
        realMomentData = momentData,
        type = momentData.type,
        //文章说说不显示原文标识
        fromAccount = type === 4 ? "" : momentData.uuid;
    if ( type === 5 ) {
        var originMomentData = checkJSON( momentData.res_json );
        transportedMomentId = originMomentData.mid;
        if ( !originMomentData ) {
            return false;
        }
        type = originMomentData.type;
        fromAccount = type === 4 ? "" : originMomentData.uuid;
        realMomentData = originMomentData;
    }
    function renderTextMoment( data ) {
        var html;
        html  = [
            `<div class="transponded-tab-moment-container clear">
                <p class="transpond-tab-text-container">${ data.words }</p>
                <div class="transpond-tab-from-container">原文：${ getAliasByAccount( fromAccount ) }</div>
            </div>`
        ].join( "" );
        return html;
    }

    function renderVideoMoment( data ) {
        var resData = checkJSON( data.res_json ),
            videoPreviewimageUrl = resData && resData[ 1 ];
        videoPreviewimageUrl = convertWebp( videoPreviewimageUrl );
        var html = `
        <div class="transponded-tab-moment-container clear" >
            <div class="transponded-tab-image-wrapper"><img class="transponded-tab-image" src="${videoPreviewimageUrl}" alt=""><span class="line-for-vertical"></span></div>
            ${ data.words === "" ? "" : `<p class="transpond-tab-text-with-image-container">${ data.words }</p>` }
            <div class="transpond-tab-from-container">原文：${ getAliasByAccount( fromAccount ) }</div>
        </div>
        `;
        return html;
    }

    function renderImageMoment( data ) {
        var resData = checkJSON( data.res_json ),
            imageUrl = resData && resData[ 0 ];
        imageUrl = convertWebp( imageUrl );
        var html = `
        <div class="transponded-tab-moment-container clear" >
            <div class="transponded-tab-image-wrapper"><img class="transponded-tab-image"  src="${imageUrl}" alt=""><span class="line-for-vertical"></span> </div>
            ${ data.words === "" ? "" : `<p class="transpond-tab-text-with-image-container">${ data.words }</p>` }
            <div class="transpond-tab-from-container">原文：${ getAliasByAccount( fromAccount ) }</div>
        </div>
        `;
        return html;
    }

    function renderArticleMoment( data ) {
        var resData = checkJSON( data.res_json );
        if ( !resData ) {
            return "";
        }
        var imageUrl = resData.avatar || window.imageRoot + "/images/wenzhang.png",
            title = resData.title,
            url = resData.url,
            html = `
        <div class="transponded-tab-moment-container clear" >
            <div class="transponded-tab-image-wrapper"><img  class="transponded-tab-image"  src="${ convertWebp( imageUrl ) }" alt=""><span class="line-for-vertical"></span></div>
            ${ `<p class="transpond-tab-text-with-image-container"><a href="${url}" target="_blank">${ !!title ? 
                ( title.length < this.articleTitleLengthLimit ? 
                    title : 
                    title.slice( 0, this.articleTitleLengthLimit - 3 ) + "..." ) 
                : "文章详情" }</a></p>` }
        </div>
        `;
        return html;
    }

    var htmlOfMoment = "";
    switch( type ) {
        case 1:
            htmlOfMoment = renderTextMoment( realMomentData );
            break;
        case 2:
            htmlOfMoment = renderImageMoment( realMomentData );
            break;
        case 3:
            htmlOfMoment = renderVideoMoment( realMomentData );
            break;
        case 4:
            htmlOfMoment = renderArticleMoment.apply( this, [ realMomentData ] );
            break;
    }
    $( "#transported-moment-layout" ).html( htmlOfMoment ).show();
    $( "#transported-moment-layout" ).find( ".transponded-tab-moment-container" ).data( "mid", transportedMomentId );
    $( "#fs-send-text" ).click();
    $('.friend-space-container').scrollTop(0);
    let notInFriendsFS = $( '#other-fs-tab' ).hasClass( "hide" );
    if ( !notInFriendsFS ) {
        $( "#ofs-close" ).click();
        $( "#friend-space" ).click();
    }


    //
    // var html = [
    //     '<div class="alert-container" id="transpond-moment-tab">\n' ,
    //     '        <div class="tm-inner absolute-center" id="tm-inner">\n' ,
    //     '            <div class="tm-title">\n' ,
    //     '                转发\n' ,
    //     '                <div id="tm-close" class="tm-close"></div>\n' ,
    //     '            </div>\n' ,
    //     '<div class="tm-main">\n',
    //     '            <textarea name="tm-ipt-area" id="" cols="30" rows="10" class="tm-ipt-area" placeholder="说点什么把..."></textarea>\n' ,
    //     '        <!-- moment-area -->\n' ,
    //     htmlOfMoment,
    //     '            <div class="tm-btn-area clear">\n' ,
    //     '                <button id="tm-send-btn">发送</button>\n' ,
    //     '            </div>\n' ,
    //     '        </div>\n' ,
    //     '        </div>\n' ,
    //     '    </div>'
    // ].join( "" );
    // var $tab = $( html ),
    //     $ipt = $tab.find( ".tm-ipt-area" ),
    //     $sureBtn = $tab.find( "#tm-send-btn" ),
    //     $concelBtn = $tab.find( "#tm-close" );
    //
    // $sureBtn.on( "click", function ( e ) {
    //     sureCallback( $ipt.val() );
    //     $tab.remove();
    // } );
    // $concelBtn.on( "click", function () {
    //     $tab.remove();
    // } );
    // $( "body" ).prepend( $tab );
}

UI.initLabel = function ( $labelContainer, labelData ) {
    if (typeof DEBUG !== "undefined") {
        console.log( "initLabel" );
    }
    let $documentFragment = $( document.createDocumentFragment() ),
        len = labelData.length;
    for ( let i = 0; i < len; ++i ) {
        $documentFragment.append( this.addLabelGroupItem( labelData[ i ] ) );
    }
    $labelContainer.html( $documentFragment );
}

UI.addLabelGroupItem = function ( groupData ) {
    let html = "",
        aliasString = "",
        name = groupData.name,
        members = groupData.members,
        mLen = members.length;
    for ( let i = 0; i < mLen - 1; ++i ) {
        aliasString += ( getUserData( cache.getPersonById( members[ i ] ) ).alias + "、" );
    }
    if ( mLen > 0 ) {
        aliasString += getUserData( cache.getPersonById( members[ mLen - 1 ] ) ).alias;
    }
    html = `<div class="mai-group-item" data-labelname="${name}" data-members="${members}" >
                                                <div class="mgi-check-item"></div>
                                                <div class="mgi-group-main">
                      <div class="mgi-group-title">${name}</div>
                                                    <div class="mgi-group-members">${aliasString}</div>
                                                </div>
                                                <div class="mgi-add-member">

                                                </div>
                                            </div>`;
    let $html = $( html );
    $html.data( {
        name,
        members
    } )
    return $html;
}

UI.showEditLabelTab = function ( currentGroupData, callbacks, MT ) {
    let that = this,
        title = "标签编辑";
    let oldName = currentGroupData.name,
        oldMembers = currentGroupData.members;
    let $element = $( '<div class="alert-container" id="edit-label-tab">\n' +
            '        <div class="tab-inner tab-el">\n' +
            '            <div class="tb-header el-header">\n' +
            '                <div class="tb-title el-title">' + title + ' <span class="tb-close el-close" id="el-close"></span></div>\n' +
            '            </div>\n' +
            '\n' +
            '            <div class="tb-search-layout el-name-layout" id="el-name-layout">\n' +
            '                <input type="text" id="el-name" class="tb-search el-name" placeholder="标签名" value="' + currentGroupData.name + '" >\n' +
            '       <div class="el-add-new-member" id="el-add-new-member"></div>     </div>\n' +
            '\n' +
            '            <div class="tb-list el-list" id="el-friend-list"></div>\n' +
            '\n' +
            ' <div class="el-button-container">           <button class="tb-submit" id="el-submit">确定</button>\n' +
        '            <button class="tb-submit" id="el-delete">删除</button></div>\n' +
            '        </div>\n' +
            '\n' +
            '    </div>' );
    let html = "",
        members = currentGroupData.members,
        newMembers = [ ...members ];
    let $elFriendList = $element.find( "#el-friend-list" );
    this.refreshLabelGroupMemberList( $elFriendList, members );

    let signals = {
        deleteMemberCompleted: true,
        addMembersCompleted: true,
        deleteLabelCompleted: true,
        updateLabelCompleted: true
    };

    function isSignalsAllClear() {
        return signals.deleteMemberCompleted && signals.addMembersCompleted
            && signals.deleteLabelCompleted && signals.updateLabelCompleted;
    }

    //close
    let $close = $element.find( "#el-close" );
    $close.on( "click", function () {
        $element.remove();
    } );

    //delete member
    $elFriendList.delegate( ".lmi-del-btn", "click", function ( evt ) {
        signals.deleteMemberCompleted = false;
        let e = evt || window.event,
            $ele = $( e.target ),
            $item = $ele.parents( ".label-member-item" ),
            deletedUid = !!$item ? +$item.data( "uid" ) : 0;
        if ( !deletedUid ) {
            that.showAlert( "数据异常，请稍候再试！" );
            return;
        }
        //bind only run one time
        callbacks.deleteLabelMemberCallback( oldName, [ deletedUid ], signals, $elFriendList, newMembers );
    } );

    //delete label
    let $deleteLabelBtn = $element.find( "#el-delete" );
    if ( !!callbacks && typeof callbacks.deleteLabelCallback === "function" ) {
        $deleteLabelBtn.on( "click", function () {
            signals.deleteLabelCompleted = false;
            callbacks.deleteLabelCallback.call( MT, oldName, signals )
            $element.remove();
        } );
    }

    //update label
    let $updateLabelBtn = $element.find( "#el-submit" ),
        $labelNameInput = $element.find( "#el-name" );

    $updateLabelBtn.on( "click", function ( evt ) {
        let e = evt || window.event,
            $ele = $( e.target ),
            name = $labelNameInput.val();
        let updateLabelId = setInterval( function () {
            if ( !isSignalsAllClear() ) {
                return;
            }
            clearInterval( updateLabelId );
            callbacks.updateLabelCallback.call( MT, name, oldName );
            $element.remove();
        }, 200 );
    } );

    //add member
    let $elAddNewMemberBtn = $element.find( "#el-add-new-member" );
    $elAddNewMemberBtn.on( "click", function () {
        console.log( "$elAddNewMemberBtn" );
        let addNewMemberBtnId = setInterval( function () {
            if ( !signals.deleteMemberCompleted ) {
                return;
            }
            clearInterval( addNewMemberBtnId );
            callbacks.addNewMemberCallback.call( MT, newMembers, oldName, $elFriendList, newMembers );


        }, 200 );

    } );

    $( "body" ).prepend( $element );
}

//
UI.updateGroupMemberList = function ( currentGroupData, $elFriendList ) {
    this.refreshLabelGroupMemberList( $elFriendList, currentGroupData.members );
}

UI.addLabelGroupMemberItem = function ( uid ) {
    let html = "",
        userData = getUserData( cache.getPersonById( uid ) );
    html += `    <div class="label-member-item" data-uid="${uid}" >
        <div class="lmi-avatar"><img src="${ userData.avatar }" alt="${ userData.alias }"> </div>
        <div class="lmi-alias">${ sliceName( userData.alias, this.nameLen ) }</div>
        <div class="lmi-del-btn"></div>
    </div>`;
    return html;

}

UI.refreshLabelGroupMemberList = function ( $elFriendList, members ) {
    let html = "",
        mLen = members.length;
    for ( let i = 0; i < mLen; ++i ) {
        html += this.addLabelGroupMemberItem( members[ i ] );
    }
    $elFriendList.html( html );
}

module.exports = UI;

