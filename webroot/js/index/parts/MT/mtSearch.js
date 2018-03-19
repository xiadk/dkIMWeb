var MT = {

}
MT.initSearch = function () {
    this.initSearchNode();
    this.addSearchEvent();
};

MT.initSearchNode = function () {
    this.$mainSearch = $('#search');
    this.$searchedList = $('#searched-list');
    this.$ccSearch = $('#cc-search');
    this.$amSearchedList = $('#am-friend-list');
    this.$amSearch = $('#am-search');
    this.$dmSearch = $('#dm-search');
};

MT.addSearchEvent = function () {
    this.$mainSearch.on('keyup', this.showMainSearch.bind(this));
    this.$searchedList.delegate('.searched-item', 'click', this.clickSearchedItemHandler.bind(this));
    // this.$amSearchedList.delegate('.am-friend-item', 'click', this.clickAMSearchedItemHandler.bind(this));
    this.$ccSearch.on('keyup', this.showCCSearch.bind(this));
    this.$amSearch.on('keyup', this.showAMSearch.bind(this));
    this.$dmSearch.on('keyup', this.showDMSearch.bind(this));
};

MT.showCCSearch = function (e) {
    var evt = e || window.event,
        $ele = $(evt.target),
        val = getPinYin($ele.val());
    // debugger
    this.showCCSearchedList(val);
};

MT.showAMSearch = function (e) {
    var evt = e || window.event,
        $ele = $(evt.target),
        val = getPinYin($ele.val());
    // debugger
    this.showAMSearchedList(val);
};

MT.showDMSearch = function (e) {
    var evt = e || window.event,
        $ele = $(evt.target),
        val = getPinYin($ele.val());
    // debugger
    this.showDMSearchedList(val);
};

MT.showCCSearchedList = function (val) {
    if (val === "") {
        this.hideCCSearchedList();
        return;
    }
    if ($('.cc-tab-item.cur').attr("id") === "cc-tab-friend") {//搜好友
        var accounts = searchFriendAccounts(val);
        var $items = $('.cc-tl-friend-item'),
            iLen = $items.length;
        for (var i = 0; i < iLen; ++i) {
            if (!~accounts.indexOf($($items[i]).data("account") + "")) {
                this.addHideClassTo($($items[i]));
            } else {
                $($items[i]).removeClass('hide');
            }
        }
        var $lines = $('.cc-line');
        for (i = 0; i < iLen; ++i) {
            // debugger
            var $el = $($lines[i]).next();
            while ($el.hasClass('cc-tl-friend-item') && $el.hasClass('hide')) {
                $el = $el.next();
            }
            if ($el.hasClass('cc-line') || $el.length === 0) {
                this.addHideClassTo($($lines[i]));
            } else {
                $($lines[i]).removeClass("hide");
            }
        }

    } else {//搜群组
        var accounts = searchTeamAccounts(val);
        var $items = $('.cc-tl-team-item');
        for (var i = 0; i < $items.length; ++i) {
            if (!~accounts.indexOf($($items[i]).data("id").split("-")[1] + "")) {

                this.addHideClassTo($($items[i]));
            } else {
                $($items[i]).removeClass('hide');
            }
        }
    }

};

MT.showAMSearchedList = function (val) {
    if (val === "") {
        this.hideAMSearchedList();
        return;
    }
    var accounts = searchFriendAccounts(val),
        aLen = accounts.length,
        accounts2 = [],
        teamId = $('.session-item.cur').data("account");
    for (var i = 0; i < aLen; ++i) {
        if (!cache.isTeamMember(teamId, accounts[i])) {//非好友且匹配
            accounts2.push(accounts[i]);
        }
    }
    var $items = $('.am-friend-item'),
        iLen = $items.length;
    for (i = 0; i < iLen; ++i) {
        if (!~accounts2.indexOf($($items[i]).data("account") + "")) {
            this.addHideClassTo($($items[i]));
        } else {
            $($items[i]).removeClass('hide');
        }
    }
    var $lines = $('.am-line');
    for (i = 0; i < iLen; ++i) {
        // debugger
        var $el = $($lines[i]).next();
        while ($el.hasClass('am-friend-item') && $el.hasClass('hide')) {
            $el = $el.next();
        }
        if ($el.hasClass('am-line') || $el.length === 0) {
            this.addHideClassTo($($lines[i]));
        } else {
            $($lines[i]).removeClass("hide");
        }
    }
};

MT.showDMSearchedList = function (val) {
    if (val === "") {
        this.hideDMSearchedList();
        return;
    }
    var teamId = $('.session-item.cur').data("account"),
        accounts = getTeamMemberAccounts(teamId),
        that = this;
    var func = (function (teamId, accounts, that){
        return function () {
            var nameMap = getTeamMemberNamesMap(teamId, accounts);
            var resultAccounts = searchTeamMemberMap(val, nameMap);
            if (typeof DEBUG !== "undefined") {
                //console.log(accounts, nameMap, resultAccounts);
            }
            var $items = $('.dm-friend-item'),
                iLen = $items.length;
            for (var i = 0; i < iLen; ++i) {
                if (!~resultAccounts.indexOf($($items[i]).data("account") + "")) {
                    that.addHideClassTo($($items[i]));
                } else {
                    $($items[i]).removeClass('hide');
                }
            }
            var $lines = $('.dm-line');
            for (i = 0; i < iLen; ++i) {
                // debugger
                var $el = $($lines[i]).next();
                while ($el.hasClass('dm-friend-item') && $el.hasClass('hide')) {
                    $el = $el.next();
                }
                if ($el.hasClass('dm-line') || $el.length === 0) {
                    that.addHideClassTo($($lines[i]));
                } else {
                    $($lines[i]).removeClass("hide");
                }
            }
        }
    })(teamId, accounts, this);

    this.checkUserInfo(accounts, func);


};

MT.hideAMSearchedList = function () {
    $('.am-friend-item').removeClass('hide');
    $('.am-line').removeClass('hide');
    this.$amSearch.val("");
};

MT.hideDMSearchedList = function () {
    $('.dm-friend-item').removeClass('hide');
    $('.dm-line').removeClass('hide');
    this.$dmSearch.val("");
};

MT.hideCCSearchedList = function () {
    $('.cc-tl-item').removeClass('hide');
    $('.cc-line').removeClass('hide');
    this.$ccSearch.val("");
};


MT.showMainSearch = function (e) {
    // debugger
    var evt = e || window.event,
        $ele = $(evt.target),
        val = getPinYin($ele.val());
    // debugger
    this.showSearchedList(val);
    // debugger
};

MT.hideSearchedList = function () {
    this.$searchedList.html("");
    this.addHideClassTo(this.$searchedList);
    this.$mainSearch.val("");
};

MT.showSearchedList = function (val) {
    // debugger
    if (val === "") {
        this.hideSearchedList();
        return
    }
    // debugger
    var accounts = searchAccount(val),
        friendAccounts = accounts.friendAccounts,
        teamAccounts = accounts.teamAccounts,
        html = "";

    html += this.ui.initSearchedFriendList(friendAccounts);
    // debugger
    html += this.ui.initSearchedTeamList(teamAccounts);
    // debugger
    this.$searchedList.html(html);
    this.$searchedList.removeClass('hide');
};

MT.clickSearchedItemHandler = function (e) {
    var evt = e || window.event,
        $ele = $(evt.target),
        id;
    if ($ele.hasClass('.searched-item')) {
        id = $ele.data("id")
    } else {
        id = $ele.parents('.searched-item').data("id");
    }
    var arr = id.split('-'),
        scene = arr[0],
        account = arr[1],
        $sessionItems = this.$sessionList.find('.session-item'),
        $tabViewContainer = $('.tab-view-container'),
        isHava = false,
        that = this;

    // debugger
    $.each($sessionItems, function (i, val) {
        //console.log($(val).data('id'));
        var $val = $(val);
        if ($val.data('id') === id) {
            //回到会话面板
            $('#session')[0].click();
            //点击该会话
            $val[0].click();
            //滚动到会话标签的位置
            var conTop = that.$sessionList.offset().top;
            var top1 = parseFloat($val.offset().top - conTop);
            $tabViewContainer.scrollTop(top1);
            isHava = true;
        }
    });
    if (!isHava) {
        //    当前会话列表中无此用户地会话
        mysdk.nim.insertLocalSession({
            scene: scene,
            to: account,
            done: that.insertLocalSessionDone.bind(that)
        });
    }
};

// MT.clickAMSearchedItemHandler = function (e) {
//     this.hideAMSearchedList();
// };

MT.getSessionNames = function () {
    var $items = $('.session-item'),
        len = $items.length,
        sessionNames = [];
    for (var i = 0; i < len; ++i) {
        sessionNames.push({
            scene: $items[i].data("scene"),
            account: $items[i].data("account"),
            namePinYin: getPinYin($items[i].find('.to-name'))
        })
    }
    return sessionNames;
};

MT.searchSessions = function (val) {
    var sessionNames = this.getSessionNames();
};


module.exports = MT



































