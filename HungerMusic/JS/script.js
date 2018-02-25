var channelList;
var channel;

//自定义事件中心
var EventCenter = {
    on: function (type, handler) {
        $(document).on(type, handler);    //监听事件，type为自定义事件类型，handler为处理函数
    },
    fire: function (type, data) {
        $(document).trigger(type, data);  //发布事件，type为自定义事件类型，data为事件的数据
    }
};
EventCenter.on('切换频道', function (e, data) {
    console.log(e.type);
    channel = data;
    console.log(data);
})

//封装一个实现页面Footer功能的对象，里面包含了获取频道数据以及渲染footer区块的功能。
var Footer = {
    init: function () {
        this.start();
        this.bind();
    },
    bind: function () {
        $('footer .box ul li').on('click', function () {
            EventCenter.fire('切换频道', $(this).attr("id"))
        })
    },
    renderFooter: function (data) {
        var _this = this;
        data.forEach(function (item) {
            var html = '';
            html += '<li id="' + item.channel_id+ '">';
            html += '<div class="cover" style="background-image:url(' + item.cover_small + ')"></div>';
            html += '<h3>' + item.name + '</h3>';
            html += '</li>';
            $('footer .box ul').append(html);
        })
        _this.bind();
    },
    getData: function () {
        var _this = this;
        $.getJSON('//jirenguapi.applinzi.com/fm/getChannels.php')
        .done(function (ret) {
            channelList = ret.channels;
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