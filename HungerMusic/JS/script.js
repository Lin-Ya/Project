var channels;

//封装一个实现页面Footer功能的对象，里面包含了获取频道数据以及渲染footer区块的功能。
var Footer = {
    init: function () {
        this.start();
    },
    bind: function () {
        
    },
    renderFooter: function (data) {
        var _this = this;
        data.forEach(function (item) {
            var html = '';
            html += '<li><div class="cover" style="background-image:url(' + item.cover_small + ')"></div>';
            html += '<h3>' + item.name + '</h3>';
            html += '</li>';
            $('footer .box ul').append(html);
        })
    },
    getData: function () {
        var _this = this;
        $.getJSON('//jirenguapi.applinzi.com/fm/getChannels.php')
        .done(function (ret) {
            channels = ret.channels;
            _this.renderFooter(ret.channels);
        })
        .fail(function () {
            console.log('获取专辑失败')
        })
    },
    start: function () {
        var _this = this;
        this.getData();
    }
}

Footer.init();