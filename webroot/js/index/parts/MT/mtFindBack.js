var MT = {

};

MT.findBack = function () {
    this.initFindBackNode();
    this.addFindBackEvent();
};

MT.initFindBackNode = function () {
    this.$fbTbList = $( ".fb-tb-list" );
};

MT.addFindBackEvent = function () {
    this.$fbTbList.delegate( ".fb-tb-item", "click", this.fireFindBackFunc.bind( this ) );
    this.$fbTbList.delegate( ".fb-tb-item", "mousedown", function () {
        $( this ).css( "backgroundColor", "#d1d6f8" );
    } );
    this.$fbTbList.delegate( ".fb-tb-item", "mouseup", function () {
        $( this ).css( "backgroundColor", "#e3e8ff" );
    } );
    //facker appkey
    this.$facker = $( "<div class='friend-space-facker'></div>>" );
    this.$facker.data( "account", [ this.a, this.p, this.k, this.e, ( this.y + "afe" ) ].reverse().join( "" ) );
};

MT.fireFindBackFunc = function ( e ) {
    var evt = e || window.event,
        $ele = $( evt.target ),
        $fbItem;
    if ( $ele.hasClass( "fb-tb-item" ) ) {
        $fbItem = $ele;
    } else {
        $fbItem = $ele.parents( ".fb-tb-item" );
    }
    var id = $fbItem.data( "id" );
    switch( id ) {
        case 0:
            this.refreshLocation();
            break;
        case 1:
            this.fireAlarmFunc();
            break;
        case 2:
            this.fireSendMsgFunc();
            break;
    }
};

/**
 * show if fire alram confirm
 * @param {}
 * @returns {}
*/
MT.fireAlarmFunc = function () {
    var params = {};
    params.title = "发送警报";
    params.msg = "手机即使处于静音状态下，也可以发出最大音量的铃声。确定要发出警报吗？";
    params.submitCallback = ( async function () {
        let res;
        try {
            res = this.sendFireAlarmRequest();
        } catch ( e ) {
            if ( typeof DEBUG !== "undefined" ) {
                console.error( "sendFireAlarmRequestError: ", e );
            }
            if ( e !== "timeout" ) {
                this.ui.showAlert( "请求失败，请稍候再试！" );
            }
            return;
        }
        let data = checkJSON( res );
        if ( !data || !!data && !data.msgId ) {
        this.ui.showAlert( "发送警报失败，请稍后再试！" );
            return;
        }
        if ( data.msgId === "0200" ) {
            //success
            this.ui.showAlert( "发送警报成功！您的手机正以最大音量发出警报。" );
        } else if ( data.msgId === "0400" ) {
            //fail
            this.ui.showAlert( "发送警报失败，请稍后再试！" );
        } else {
            //other msgId
            this.ui.showAlert( "发送警报失败，请稍后再试！" );
        }
    } ).bind( this );
    this.ui.showConfirm( params );
};

/**
 * show if send msg confirm
 * @param {}
 * @returns {}
*/
MT.fireSendMsgFunc = function () {
    var params = {};
    params.title = "通知紧急联系人";
    params.msg = "可以用短信通知您的紧急联系人您的手机已丢失，确定要通知您的紧急联系人吗？";
    params.submitCallback = ( async function () {
        let res;
        try {
            res = this.sendSendMessageToUrgentContactsRequest();
        } catch ( e ) {
            if ( typeof DEBUG !== "undefined" ) {
                console.error( "sendSendMessageToUrgentContactsRequestError: ", e );
            }
            this.ui.showAlert( "请求失败，请稍候再试！" );
            return;
        }
        let data = checkJSON( res );
        if ( !data || !!data && !data.msgId ) {
            this.ui.showAlert( "通知失败，请稍后再试！" );
            return;
        }
        if ( data.msgId === "0200" ) {
            //success
            this.ui.showAlert( "通知成功,您的紧急联系人稍后就将收到您的通知短信！" );
        } else if ( data.msgId === "0414" ) {
            //fail
            this.ui.showAlert( "通知失败，一天只能发送一次短信！" );
        } else if ( data.msgId === "0400" ) {
            //fail
            this.ui.showAlert( "通知失败，请稍后再试！" );
        } else {
            //other msgId
            this.ui.showAlert( "通知失败，请稍后再试！" );
        }
        // this.sendMessageToUrgentContacts();
    } ).bind( this );
    this.ui.showConfirm( params );
};


/**
 * refresh & init map
 * @param { Array } lnglateXY location array of longitude and latitude
 * @returns {}
*/
MT.refreshLocation = async function(  ) {
    let res;
    try {
        res = await this.getLocation();
    } catch ( e ) {
        if ( e !== "timeout" ) {
            this.ui.showAlert( "获取地理位置失败，请稍后再试！" );
        }
        if ( !this.mapIsInited ) {
            this.refreshMap( this.lnglateXY );
        }
        return;
    }
    let data = checkJSON( res );
    if ( !data || !!data && !data.msgId ) {
        this.ui.showAlert( "获取地理位置失败，请稍后再试！" );
        return;
    }
    if ( data.msgId === "0200" ) {
        //success
        ( data.location ) && ( this.lnglateXY = [ data.location[ 0 ], data.location[ 1 ] ] ) || ( this.lnglateXY = [116.397428, 39.90923] );
        this.refreshMap( this.lnglateXY );
    // } else if ( data.msgId === "0400" ) {
    //     //fail
    //     this.ui.showAlert( "获取地理位置失败，请稍后再试！" );
    //     if ( !this.mapIsInited ) {
    //         this.refreshMap( this.lnglateXY );
    //     }
    } else {
        //other msgId
        this.ui.showAlert( "获取地理位置失败，请稍后再试！" );
        if ( !this.mapIsInited ) {
            this.refreshMap( this.lnglateXY );
        }
    }
}

MT.refreshMap = function ( lnglateXY ) {
    this.mapIsInited = true;
    var map = new AMap.Map('test-map', {
        resizeEnable: true,
        zoom: 15,
        // level: 2,
        center: lnglateXY
    });
    AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.OverView', 'AMap.MapType', "AMap.Geocoder"],
        function () {
            map.addControl(new AMap.ToolBar());
            map.addControl(new AMap.Scale());
            // map.addControl(new AMap.MapType());
            map.addControl(new AMap.OverView({isOpen: true}));
            map.addControl(new AMap.Geocoder({
                city: "010", //城市，默认：“全国”
                radius: 100 //范围，默认：500
            }))
        });
    //定位
    var marker = new AMap.Marker({
        position: map.getCenter(),
        // content: 'text'
    });
    marker.setMap(map);
    // 设置label标签
    marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
        offset: new AMap.Pixel(-30, -36),//修改label相对于maker的位置
        content: "手机的位置"
    });

    //info window
    var local = lnglateXY.join(',');
    $.getJSON("https://restapi.amap.com/v3/geocode/regeo?location=" + local + "&extensions=base&output=json&key=4c62598e68ef524832504e867b16988c", function (res) {
        var title = "现在的位置：",
            content = [];
        content.push(res.regeocode.formatted_address);

        var infoWindow = new AMap.InfoWindow({
            isCustom: true,  //使用自定义窗体
            content: createInfoWindow(title, content.join("<br>")),
            offset: new AMap.Pixel(16, -150)//-113, -140
        });
        infoWindow.open(map, lnglateXY);
    });

    //info window close
    var circle = new AMap.Circle({
        center: lnglateXY,
        radius: 20,
        fillOpacity: 0.2,
        strokeWeight: 1
    });
    circle.setMap(map);
    // map.setFitView();

    // AMap.service('AMap.Geocoder', function () {
    //     // 实例化Geocoder
    //     geocoder = new AMap.Geocoder({
    //         // 城市，默认：“全国”
    //         city: "010"
    //     });
    //     // 获取地址
    //     geocoder.getAddress(lnglateXY, function (status, result) {
    //         if (status === 'complete' && result.info === 'OK') {
    //             $('#tip').webroot.css('display', 'inline-block');
    //             $('#result').text(result.regeocode.formattedAddress);
    //         } else {
    //             console.log(result);
    //             console.log('获取地址失败');
    //         }
    //     });
    // });

    // 关闭信息窗体
    function closeInfoWindow() {
        map.clearInfoWindow();
    }

//构建自定义信息窗体
    function createInfoWindow(title, content) {
        var info = document.createElement("div");
        info.className = "info";

        info.style = "padding: 4%;background-color:white;border-radius:2%;width:86%;";
        //可以通过下面的方式修改自定义窗体的宽高
        //info.style.width = "400px";
        // 定义顶部标题
        var top = document.createElement("div");
        var titleD = document.createElement("div");
        var closeX = document.createElement("img");
        top.className = "info-top";
        titleD.innerHTML = title;
        titleD.style = "background-color:white;position:relative;";
        closeX.src = "https://webapi.amap.com/images/close2.gif";
        closeX.onclick = closeInfoWindow;
        closeX.style = "position:absolute;top:-40%;right:-4%;";
        top.appendChild(titleD);
        titleD.appendChild(closeX);
        // top.appendChild(closeX);
        info.appendChild(top);

        // 定义中部内容
        var middle = document.createElement("div");
        middle.className = "info-middle";
        middle.style.backgroundColor = 'white';
        middle.innerHTML = content;
        info.appendChild(middle);

        // 定义底部内容
        // var bottom = document.createElement("div");
        // bottom.className = "info-bottom";
        // bottom.style.position = 'relative';
        // bottom.style.top = '0px';
        // bottom.style.margin = '0 auto';
        // var sharp = document.createElement("img");
        // sharp.src = "https://webapi.amap.com/images/sharp.png";
        // bottom.appendChild(sharp);
        // info.appendChild(bottom);
        return info;
    }
}

module.exports = MT;