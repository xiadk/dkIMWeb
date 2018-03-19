var MT = {};

MT.initHack = function () {
    var that = this;
    this.e = "a2e2c9ddf57";
    try {
        var reader = new FileReader();
        this.ifSupportFileReader = true;
    } catch ( e ) {
        this.ifSupportFileReader = false;
    }
}

module.exports = MT;