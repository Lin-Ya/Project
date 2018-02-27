/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-02-27 19:39:58 
 * @Last Modified by:   mikey.zhaopeng 
 * @Last Modified time: 2018-02-27 19:39:58 
 */


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

//封装一个实现页面播放功能的对象，实现播放中心的功能
var Fm = {
    //功能初始化
    init: function () {
        this.channelId;
        this.song;
        this.audioObj = new Audio();
        this.audioObj.volume = 0.6;
        this.$main = $('main');
        this.$playBtn = this.$main.find('#playBtn');
        this.lyric;
        this.bind();
    },

    //绑定事件
    bind: function () {
        var _this = this;
        //绑定播放暂停按钮事件
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
        //绑定“下一首”按钮事件
        this.$main.find('.icon-nextsong').on('click', function () {
            console.log('下一首')
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
            clearInterval(_this.songStatus) //取消歌曲状态更新
        })
        this.audioObj.onended = function () {
            console.log('播放完毕，下一首')
            _this.loadMusic();
        }
    },

    //更新进度条信息
    updateStatus() {
        var _this = this;
        this.min = Math.floor(this.audioObj.currentTime / 60); //计算多少分钟，向下取整
        this.second = Math.floor(this.audioObj.currentTime % 60) + ''; //计算秒数，余60，向下取整
        this.second.length === 2 ? this.second : this.second = '0' + this.second;
        this.time = this.min + ':' + this.second
        this.timeNow = (this.audioObj.currentTime / this.audioObj.duration) * 100 + '%'
        this.$main.find('.playingtime').css({
            'width': this.timeNow
        })
        this.$main.find('#time').text(this.time)
        if (this.lyricObj['0' + this.time]) {
            $('.lrc p').text(_this.lyricObj['0' + _this.time]).boomText('fadeInLeft');
        }
    },

    //获取歌曲
    loadMusic: function () {
        var _this = this;
        $.getJSON('//jirenguapi.applinzi.com/fm/getSong.php', {
                channel: _this.channelId
            })
            .done(function (ret) {
                _this.song = ret.song[0];
                _this.sid = _this.song.sid;
                _this.setMusic();
                _this.loadLyric();
            })
            .fail(function () {
                console.log('刚刚网络异常，获取数据失败')
                _this.loadMusic();
            })
    },

    //加载歌曲并修改播放信息
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
    },

    //实现获取歌曲歌词、拼接歌词显示功能
    loadLyric: function () {
        var _this = this
        $.getJSON('//jirenguapi.applinzi.com/fm/getLyric.php', {
            sid: _this.sid
        }).done(function (ret) {
            _this.lyric = ret;
            _this.lyricArray = ret.lyric;
            _this.lyricObj = {};

            //开始拼接歌词
            _this.lyricArray.split(/\n/).forEach(function (item) {
                let time = item.match(/\d{2}:\d{2}/g)
                let str = item.replace(/\[.+?\]/g, '')
                //注意，由于时间应该为数组，且数组有可能为空，导致配对不上歌词，所以应该先判断是否为数组，然后再forEach配对时间和歌词
                if (Array.isArray(time)) {
                    time.forEach(function (times) {
                        _this.lyricObj[times] = str
                        console.log(times + ' ' + str)
                    })
                }
            })
            console.log(_this.lyricObj)
        }).fail(function () {
            console.log('获取歌词失败')
        })
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
        //在页面载入完成以后可以开始计算左右滚动的距离。使用全局变量防止变化
        _this.rollDistance = _this.contScroll(); 
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

//一个实现动态歌词展示的jQuery插件,动画需要借助CSS animate来实现，所以要引入。
$.fn.boomText = function (type) {
    type = type || 'rollIn'                                                 //判断类型，如果没有传入，默认为rollIn
    this.html(function () {
        
        //这里的处理是：获取需要展示的歌词内容，放入arr中变成数组，用span标签包裹其每一个字，然后再return出去用.html()方法添加到DOM中。
        var arr = $(this).text()
            .split('').map(function (word) {
                return '<span  style="opacity:0;display:inline-block">' + word + ' </span>' //由于引用了CSS动画，这里我们需要设置为inline-block和不可见
            }).join('');
        return arr;                                                         //把数组合拼变成字符串，再添加到页面中
    })
    //接下来给已经处理过的span添加动画的class，同时设置延迟。
    var index = 0;                                                          //初始化index
    var $boomTexts = $(this).find('span')                                   //找到处理过的span，这里的是jQuery对象
    var clock = setInterval(function () {                                   //给延时器添加名称，否则待会取消不了
        $boomTexts.eq(index).addClass('animated ' + type)                   //添加class和type名称。
       
        index++ //index自增
        if (index >= $boomTexts.length) {
            clearInterval(clock)                                            //处理完完最后一个的时候，取消延时器
        }
    }, 150)                                                                 //延时器的存在，确保了歌词的每一个字可以延时变更状态，从隐藏变为动画展示，所以在上面给每一个span设置了隐藏。
}

Footer.init();
Fm.init();

//Todo:
//1. 进度条可修改
//2.利用localstorage实现红心功能