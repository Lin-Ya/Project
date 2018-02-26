var channelList;
var isEnd = false;
var isStart = true;
//自定义事件中心
var EventCenter = {
    on: function (type, handler) {
        $(document).on(type, handler); //监听事件，type为自定义事件类型，handler为处理函数
    },
    fire: function (type, data) {
        $(document).trigger(type, data); //发布事件，type为自定义事件类型，data为事件的数据
    }
};
var Fm = {
    init: function () {
        this.channelId;
        this.song;
        this.audioObj = new Audio();
        this.audioObj.volume = 0.6;
        this.$main = $('main');
        this.$playBtn = this.$main.find('#playBtn');
        this.bind();
    },
    bind: function () {
        var _this = this;
        this.$playBtn.on('click', function () {
            if ($(this).hasClass('icon-play')) {
                $(this).removeClass('icon-play').addClass('icon-stop');
                _this.audioObj.play()
                console.log('开始播放')
            } else {
                $(this).removeClass('icon-stop').addClass('icon-play');
                _this.audioObj.pause()
                console.log('暂停播放')
            }
        })
        // this.$main.find('.icon-like').on('click', function () {
        //     $(this).addClass('active');
        // })
        this.$main.find('.icon-nextsong').on('click', function () {
            _this.loadMusic();
        })
        EventCenter.on('切换了频道', function (e, channelId) {
            _this.audioObj.pause();
            _this.channelId = channelId;
            _this.loadMusic();
        })

        //播放暂停时候的状态更新
        this.audioObj.addEventListener('play', function () {
            _this.songStatus = setInterval(function () {
                _this.updateStatus();
            }, 500)
        })
        this.audioObj.addEventListener('pause', function () {
            clearInterval(_this.songStatus)//取消歌曲状态更新
        })
        this.audioObj.onended = function () {
            _this.loadMusic();
        }
    },
    updateStatus() {
        this.min = Math.floor(this.audioObj.currentTime / 60);//计算多少分钟，向下取整
        this.second = Math.floor(this.audioObj.currentTime % 60) + '';//计算秒数，余60，向下取整
        this.second.length === 2 ? this.second : this.second = '0' + this.second;
        this.time = this.min + ':' + this.second
        this.timeNow = (this.audioObj.currentTime / this.audioObj.duration) * 100 + '%'
        this.$main.find('.playingtime').css({
            'width': this.timeNow
        })
        this.$main.find('#time').text(this.time)
    },
    loadMusic: function () {
        var _this = this;
        $.getJSON('//api.jirengu.com/fm/getSong.php', {
            channel: _this.channelId
        })
            .done(function (ret) {
                console.log(ret)
                _this.song = ret.song[0];
                _this.setMusic();
            })
            .fail(function () {
                console.log('网络异常，获取数据失败')
            })
    },
    setMusic: function () {
        $('body .bg').css({
            background: 'url(' + this.song.picture + ') no-repeat',
            backgroundSize: 'cover'
        });
        $('main figure').css({
            background: 'url(' + this.song.picture + ') no-repeat',
            backgroundSize: '45vh 45vh',
        });
        $('main .detail .title').text(this.song.title);
        $('main .detail .author').text(this.song.artist);
        $('main .detail .icon-erji span').text(Math.floor(this.song.sid / 4560 + 88))
        $('main .detail .icon-like span').text(Math.floor(this.song.sid / 25000 + 67))
        $('main .detail .icon-zan span').text(Math.floor(this.song.sid / 27555 + 41))
        this.audioObj.autoplay = true;
        this.audioObj.src = this.song.url;
        this.$playBtn.removeClass('icon-play').addClass('icon-stop');
        $('head title').text('正在播放：' + $('main .author').text() + '-' + $('main .title').text())
        console.log($('main .author').text() + '-' + $('main .title').text());
    }
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
        this.rollDistance = 0;
        this.isAnimate = false;
        this.start();
        console.log(2)
    },
    bind: function () {
        var _this = this;
        this.$footer.find('li').on('click', function () {
            EventCenter.fire('切换了频道', $(this).attr("data-id"))
            $(this).addClass('active').siblings().removeClass('active')
            $('main .detail .tag').text($(this).attr("data-name"))
            console.log('切换至 ' + $(this).attr("data-name") + ' 频道')
        });
        //绑定左右滚动，这里的左右滚动距离一开始完成页面载入的时候计算好并且左右的距离都固定
        this.$leftBtn.on('click', function () {
            if (_this.isAnimate) return;
            if (!isStart) {
                _this.isAnimate = true;
                $('footer ul').animate({
                    left: '+=' + _this.rollDistance
                }, 450, function () {
                    isEnd = false;
                    _this.isAnimate = false;
                    if (parseFloat(_this.$ul.css('left')) == 0) {
                        isStart = true;
                    }
                })
            }
        })
        this.$rightBtn.on('click', function () {
            if (_this.isAnimate) return;
            if (!isEnd) {
                _this.isAnimate = true;
                $('footer ul').animate({
                    left: '-=' + _this.rollDistance
                }, 450, function () {
                    isStart = false;
                    _this.isAnimate = false;
                    if (_this.$ul.width() <= (_this.$box.width() - parseFloat(_this.$ul.css('left')))) {
                        isEnd = true;
                    }
                })
            }
        })
        $('footer .box li').eq(0).trigger('click')
    },
    contScroll: function () {
        var rowCount = Math.floor($('footer .box').outerWidth() / $('footer li').outerWidth(true));
        var itemWidth = $('footer li').outerWidth(true);
        console.log(Math.floor(rowCount * itemWidth))
        return Math.floor(rowCount * itemWidth);
    },
    renderFooter: function (data) {
        var _this = this;
        data.forEach(function (item) {
            var html = '';
            html += '<li data-id="' + item.channel_id + '" data-name="' + item.name + '">';
            html += '  <div class="cover" style="background-image:url(' + item.cover_small + ')"></div>';
            html += '  <h3>' + item.name + '</h3>';
            html += '</li>';
            $('footer .box ul').append(html);
        })
        _this.rollDistance = _this.contScroll(); //在页面载入完成以后可以开始计算左右滚动的距离。使用全局变量防止变化
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
Fm.init();