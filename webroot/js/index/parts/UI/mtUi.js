/**
* Created by xox on 2017/7/5.
*/
import mtUISearch from "./mtSearchUi";
import mtUIMessage from "./mtUiMessage";
import mtUIFS from "./mtUiFriendSpace";

function UI() {
    //通用alert确定按钮
    this.$alertsButton = [];
    this.alertHideDelay = 0;//alert消失延迟，防止太快消失
    this.init();
    this.initFriendSpaceNode();
    this.initSearchNode();
    this.nameLen = 16;
    this.maxLastMsgLen = 8;
    this.webpReg = /webp/i;
    this.ossConvertType = "?x-oss-process=webroot.image/format,jpg";

}

/**
 * show DIY confirm
 * @param {Object} params params for confirm
 * @returns {}
*/
UI.prototype.showConfirm = function ( params ) {
    var emptyFunc = function () {

    };
    if ( !params.title && !params.msg ) {
        return;
    }
    var html = "";
    html += [
        "    <div class='alert-container common-confirm' >\n" ,
        "        <div class='tab-inner2'>\n" ,
        "            <div class='tb-title'>" ,
        !!params.title ? params.title : "", "</div>\n" ,
        "            <div class='tb-text'>",
        !!params.msg ? params.msg : "",
        "</div>\n" ,
        "\n" ,
        "            <div class='tb-tbn-container'>\n" ,
        "                <button class='tb-submit tb-concel'>取消</button>\n" ,
        "                <button class='tb-submit tb-sure' >确定</button>\n" ,
        "            </div>\n" ,
        "\n" ,
        "        </div>\n" ,
        "    </div>"].join( "" );
    var $confirm = $( html ),
        $concel = $confirm.find( ".tb-concel" ),
        $submit = $confirm.find( ".tb-sure" );

    $concel.on( 'click', function () {
        var concelFunc = !!params.concelHandler ? params.concelHandler : emptyFunc;
        concelFunc();
        $confirm.remove();
    } );

    $submit.on( 'click', function () {
        var submitFunc = !!params.submitCallback ? params.submitCallback : emptyFunc;
        submitFunc();
        $confirm.remove();
    } );
    $('body').prepend( $confirm );
}

/**
 * common choose friends tab
 * @param {}
 * @returns {}
*/
UI.prototype.showChooseFriendsTab = function ( param ) {
    if ( !param ) {
        return;
    }
    let that = this,
        title = param.title || "选择好友",
        deletedIds = param.deletedIds || [],
        choosedIds = param.choosedIds || [],
        aliasList = getAliasList(),
        aLen = aliasList.length,
        $element = $( '<div class="alert-container" id="common-choose-friend-tab" style="z-index: 99999!important;">\n' +
            '        <div class="tab-inner tab-common">\n' +
            '            <div class="tb-header common-header">\n' +
            '                <div class="tb-title common-title">' + title + ' <span class="tb-close common-close" id="common-close"></span></div>\n' +
            '            </div>\n' +
            '\n' +
            '            <div class="tb-search-layout common-search-layout" id="common-search-layout">\n' +
            '                <input type="text" id="common-search" class="tb-search common-search" placeholder="搜索">\n' +
            '            </div>\n' +
            '\n' +
            '            <div class="tb-list common-list" id="common-friend-list"></div>\n' +
            '\n' +
            '            <button class="tb-submit" id="common-submit">确定</button>\n' +
            '        </div>\n' +
            '\n' +
            '    </div>' );
    let $friendList = $element.find( "#common-friend-list" );
    //close
    let $closeItem = $element.find( "#common-close" );
    $closeItem.on( "click", function () {
        $element.remove();
        if ( !!param.concelCallback && typeof param.concelCallback === "function" ) {
            param.concelCallback();
        }
    } );
    //submit
    let $submitItem = $element.find( "#common-submit" );
    $submitItem.on( "click", function () {
        $element.remove();
        if ( !param.sureCallback || typeof param.sureCallback !== "function" ) {
            return;
        }
        var $eles = $friendList.find('.selected').parent('.am-friend-item'),
            len = $eles.length;
        if(len <= 0){
            $closeItem.click();
            return false;
        } else {
            var accounts = [];
            for(var i = 0; i < len; ++i){
                accounts.push( $( $eles[ i ] ).data( 'account' ) );
            }
            param.sureCallback( accounts );

        }
    } );
    //select
    $friendList.delegate( ".am-friend-item", "click", function ( e ) {
        var evt = e || window.event,
            $ele = $(evt.target),
            $this;
        if( $ele.hasClass( 'am-friend-item' ) ) {
            $this = $ele;
        } else {
            $this = $ele.parents( ".am-friend-item" );
        }
        // debugger
        var $circle = $this.find( '.am-item-circle' );
        if ( !$circle.hasClass( 'selected' ) ) {
            $circle.addClass( 'selected' );
        } else {
            $circle.removeClass( 'selected' );
        }
        that.hideCommonChooseFriendSearchedList( $element );
    } );
    //search
    let $searchInput = $element.find( "#common-search" );
    $searchInput.on( "keyup", function ( e ) {
        var val = getPinYin( $searchInput.val() );
        that.showCommonChooseFriendSearchedList( val, $element, deletedIds );
    } );
    //init
    for( let i = 0; i < aLen; ++i ){
        if( !!aliasList[i] ){
            this.addChoosedFriendGroupItem( aliasList[ i ], deletedIds, choosedIds, $friendList );
        }
    }
    $('body').prepend( $element );
}

UI.prototype.hideCommonChooseFriendSearchedList = function ( $element ) {
    $element.find( '.am-friend-item' ).removeClass( 'hide' );
    $element.find( '.am-line' ).removeClass( 'hide' );
    $element.find( "#common-search" ).val("");
}

UI.prototype.showCommonChooseFriendSearchedList = function ( val, $element, deletedIds ) {
    if (val === "") {
        this.hideCommonChooseFriendSearchedList( $element );
        return;
    }
    var accounts = searchFriendAccounts(val),
        aLen = accounts.length,
        accounts2 = [],
        teamId = $('.session-item.cur').data("account");
    for (var i = 0; i < aLen; ++i) {
        if ( !~deletedIds.indexOf( accounts[ i ] ) ) {//符合搜索结果且不再被删除数组中的id
            accounts2.push(accounts[i]);
        }
    }
    var $items = $element.find('.am-friend-item'),
        iLen = $items.length;
    for (i = 0; i < iLen; ++i) {
        if ( !~accounts2.indexOf( $($items[ i ] ).data( "account" ) + "" ) ) {
            this.addHideClassTo( $( $items[ i ] ) );
        } else {
            $( $items[ i ] ).removeClass( 'hide' );
        }
    }
    var $lines = $element.find( '.am-line' );
    for ( i = 0; i < iLen; ++i ) {
        // debugger
        var $el = $( $lines[ i ] ).next();
        while ( $el.hasClass( 'am-friend-item' ) && $el.hasClass( 'hide' ) ) {
            $el = $el.next();
        }
        if ( $el.hasClass( 'am-line' ) || $el.length === 0 ) {
            this.addHideClassTo( $( $lines[ i ] ) );
        } else {
            $( $lines[ i ] ).removeClass( "hide" );
        }
    }
}

/**
 * 添加A-Z分组
 * @param {}
 * @returns {}
*/
UI.prototype.addChoosedFriendGroupItem = function ( data, deletedIds, choosedIds, $element ) {
    deletedIds.forEach( function ( v, i ) {
        deletedIds[ i ] = v + "";
    } );
    if ( !!data.key ) { //a-z
        var flag = false;
        //如果此列所有帐号都在被删除id的数组里，就不显示这一列
        if ( deletedIds.length > 0 ) {
            for( let j = 0; j < data.group.length; ++j ) {
                if( !~deletedIds.indexOf( data.group[ j ] ) ){
                    //这一列存在一个帐号不在被删除数组里
                    flag = true;
                    break;
                }
            }
        } else {
            if ( data.group.length > 0 ) {
                flag = true;
            }
        }

        if( flag ) {
            $element.append( "<div class='am-line'>" + data.key.toUpperCase() + "</div>" );
            for ( j = 0; j < data.group.length; ++j ) {
                if ( !~deletedIds.indexOf(  data.group[ j ] ) ) {
                    this.addChoosedFriendItem( cache.getPersonById( data.group[ j ] ), $element, choosedIds );
                }
            }
        }

    }else {//others
        var groups = [];
        for( var j = 0; j < data.length; ++j ) {
            groups = groups.concat( data[ j ].group );
        }
        if( groups.length === 0 ) {
            return;
        }
        var flag = false;
        for( j = 0; j < groups.length; ++j ) {
            if(  !~deletedIds.indexOf( groups[j] ) ){
                flag = true;
                break;
            }
        }
        if(flag){
            $element.append("<div class='am-line'>" + "其它" + "</div>");
            for( j = 0; j < groups.length; ++j ) {
                if ( !~deletedIds.indexOf(  groups[ j ] ) ) {
                    this.addChoosedFriendItem( cache.getPersonById( groups[ j ] ), $element, choosedIds );
                }

            }
        }

    }
}

UI.prototype.addChoosedFriendItem = function ( data, $element, choosedIds ) {
    var useData = getUserData( data ),
        account = useData.account,
        alias = useData.alias,
        name = useData.name,
        avatar = useData.avatar,
        html = "";

    name = sliceName(name === alias ? name : alias, this.nameLen);
    // debugger
    html += '<div class="tb-item am-friend-item" data-account="' + account  + '">';
    html +=   `<span class="tb-item-circle am-item-circle ${~choosedIds.indexOf( +account ) ? 'selected' : "" }"></span>`;
    // debugger
    html +=   '<img src="' +  avatar + '" alt="' + name + '" title="' + name + '" class="tb-item-avatar am-item-avatar">';
    html +=   '<div class="tb-item-alias am-item-alias">' + name + '</div>';
    html +=   '</div>';
    $element.append(html);
};

UI.prototype.showCommonPrompt = function ( param ) {
    if ( !param ) {
        return;
    }
    let sureCallbackData = param.sureCallbackData || null,
        inputType = param.inputType || "text",
        placeholder = param.placeholder;
    let $element = $( '<div class="alert-container" id="common-prompt-tab">\n' +
        '        <div class="tab-inner2">\n' +
        '            <span class="tb-close common-prompt-close" id="common-prompt-close"></span>\n' +
        '            <div class="tb-search-layout" style="background-webroot.image: none;">\n' +
        '                <input type="' + inputType + '" class="tb-search" id="common-prompt-input" placeholder="' + placeholder + '">\n' +
        '            </div>\n' +
        '\n' +
        '            <button class="tb-submit" id="common-prompt-submit" data-sessionid="">确定</button>\n' +
        '        </div>\n' +
        '    </div>' );
    //sure
    let $submitBtn = $element.find( "#common-prompt-submit" );
    $submitBtn.on( "click", function () {
        let value = $element.find( "#common-prompt-input" ).val();
        if ( !!param.sureCallback && typeof param.sureCallback === "function" ) {
            param.sureCallback( value );
        }
        param.notDeleteTabAfterSbumit || $element.remove();
    } );
    //close
    let $closeBtn = $element.find( "#common-prompt-close" );
    $closeBtn.on( "click", function () {
        $element.remove();
        if ( !!param.concelCallback && typeof param.concelCallback === "function" ) {
            param.concelCallback();
        }
    } );
    $( "body" ).prepend( $element );
}

$.extend(UI.prototype, mtUIMessage);
$.extend(UI.prototype, mtUISearch);
$.extend(UI.prototype, mtUIFS);

module.exports = {
    UI
}


