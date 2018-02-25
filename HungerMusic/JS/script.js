var channelList;
var channel;
var isEnd = false;
var isStart = true;
var l;
//自定义事件中心
var EventCenter = {
    on: function (type, handler) {
        $(document).on(type, handler); //监听事件，type为自定义事件类型，handler为处理函数
    },
    fire: function (type, data) {
        $(document).trigger(type, data); //发布事件，type为自定义事件类型，data为事件的数据
    }
};
EventCenter.on('切换频道', function (e, data) {
    console.log(e.type);
    channel = data;
    console.log(data);
})

function contScroll() {
    var rowCount = Math.floor($('footer .box').outerWidth() / $('footer li').outerWidth(true));
    var itemWidth = $('footer li').outerWidth(true);
    console.log(Math.floor(rowCount * itemWidth))
    return Math.floor(rowCount * itemWidth);
}

//封装一个实现页面Footer功能的对象，里面包含了获取频道数据以及渲染footer区块的功能。
var Footer = {
    init: function () {
        this.$footer = $('footer')
        this.$ul = this.$footer.find('ul');
        this.$li = this.$footer.find('li');
        this.$box = this.$footer.find('.box');
        this.$leftBtn = this.$footer.find('#footerLeft');
        this.$rightBtn = this.$footer.find('#footerRight');
        this.start();
    },
    bind: function () {
        var _this = this;
        this.$footer.find('li').on('click', function () {
            EventCenter.fire('切换频道', $(this).attr("id"))
        });
        //绑定左右滚动
        this.$leftBtn.on('click', function () {
            if (!isStart) {
                $('footer ul').animate({
                    left: '+=' + l
                }, 600, function () {
                    isEnd = false;
                    if (parseFloat(_this.$ul.css('left')) == 0 ) {
                        isStart = true;
                    }
                })
            }
        })
        this.$rightBtn.on('click', function () {
            if (!isEnd) {
                $('footer ul').animate({
                    left: '-=' + l
                }, 600, function () {
                    isStart = false;
                    if (_this.$ul.width() <= (_this.$box.width() - parseFloat(_this.$ul.css('left')))) {
                        isEnd = true;
                    }
                })
            }
        })
    },
    renderFooter: function (data) {
        var _this = this;
        data.forEach(function (item) {
            var html = '';
            html += '<li id="' + item.channel_id + '">';
            html += '  <div class="cover" style="background-image:url(' + item.cover_small + ')"></div>';
            html += '  <h3>' + item.name + '</h3>';
            html += '</li>';
            $('footer .box ul').append(html);
        })
        l = contScroll();
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