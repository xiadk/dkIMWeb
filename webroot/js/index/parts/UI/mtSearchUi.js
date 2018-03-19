var UI = {};
UI.initSearchNode = function () {
    this.$searchedList = $('#searched-list');

};

UI.initSearchedFriendList = function (accounts) {
    var len = accounts.length;
    if (len === 0) {
        return "";
    }
    var html = '<div class="searched-line">好友</div>';
    for(var i = 0; i < len; ++i){
        html += this.getSearchedFriendItem(accounts[i]);
    }
    return html;

};

UI.getSearchedFriendItem = function (account) {
    var data = cache.getPersonById(account),
        userData = getUserData(data),
        avatar = userData.avatar,
        name = userData.name,
        alias = userData.alias;
    alias = sliceName( alias, this.nameLen);
    var html = '<div class="searched-item" data-scene="p2p" data-account="' + account + '" data-id="p2p-' + account + '">\n' +
    '                        <div class="img-layout">\n' +
    '                            <img src="' + avatar + '" alt="" class="searched-item-avatar">\n' +
    '                        </div>\n' +
    '\n' +
    '                        <div class="to-name">' + alias + '</div>\n' +
    '                    </div>';
    return html;

};

UI.initSearchedTeamList = function (accounts) {
    var len = accounts.length;
    if (len === 0) {
        return "";
    }
    var html = '<div class="searched-line">群组</div>';
    for(var i = 0; i < len; ++i){
        html += this.getSearchedTeamItem(accounts[i]);
    }
    return html;


};

UI.getSearchedTeamItem = function (account) {
    var data = cache.getTeamById(account);
    var html = '<div class="searched-item" data-type="team" data-account="' + account + '" data-id="team-' + account + '" data-gtype="advanced">\n' +
        '                        <div class="sit-avatar">' + data.name.slice(0, 1) + '</div>\n' +
        '                        <div class="to-name">' +  data.name.slice(0, this.nameLen) + '</div>\n' +
        '                    </div>';
    return html;
};

module.exports = UI;










