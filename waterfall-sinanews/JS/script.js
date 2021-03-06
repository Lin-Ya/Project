var newsList;
var perPageCount = 10;
var curPage = 1;
var app = {
    init: function () {
        this.isLoading = false
        this.start();
        this.bind();
    },
    bind: function () {
        $('.box img').on('load', function () {
            app.waterfall();//这里绑定的是当图片载入完成以后再进行瀑布流布局，否则会获取不了box的准确高度
            app.isToBottom();
        });
        $(window).on('scroll', function () {
            if(app.isToBottom()){    //判断是否到达底部，结果为true则进行请求新的数据。
                app.start();
            }
        })
        $(window).on('resize',function () {
            $('.box').removeAttr('style'); //去除原来样式，防止样式重叠，实现响应
            app.waterfall();
        })
    },
    getData: function (callback) {
        var _this = this;
        if(_this.isLoading) return;
        _this.isLoading = true;
        $.ajax({
            url: 'https://platform.sina.com.cn/slide/album_tech',
            dataType: 'jsonp',
            jsonp: "jsoncallback",
            data: {
                app_key: '1271687855',
                num: perPageCount,
                page: curPage
            }
        })
        .done(function (ret) {
            if (ret && ret.status && ret.status.code === "0") {
                newsList = ret.data;//回调请求的数据
                ret.data.forEach(_this.createItem)
                _this.bind();
                curPage++
                console.log('curPage' + curPage)
            } else {
                console.log('get error data')
            }
        })
        .always(function () {
            _this.isLoading = false;
        })
    },
    createItem: function (data) {
        var _this = this;
        var html = '';
        html += '<div class="box"><div class="card">';
        html += '<a href="' + data.url + '"><img src="' + data.img_url + '" alt=""></a>';
        html += '<h4>' + data.name + '</h4>';
        html += '<p>' + data.short_intro + '</p>';
        html += '</div></div>';
        $('#main').append($(html))
    },
    waterfall: function ($node) {
        var $boxs = $('#main>div');
        var w = $boxs.eq(0).outerWidth(); //列宽等于box 的宽度
        var colCount = Math.floor($(window).width() / w);//计算有多少列
        $('#main').width(w * colCount).css('margin', '0 auto');
        var colHeightArray = [];
        $boxs.each(function (index, value) {
            var h = $boxs.eq(index).outerHeight();
            if (index < colCount) {
                colHeightArray[index] = h;
            } else { //这里的else是指在拍完前面第一行以后剩下的box，假如有3列，就先排了3个，这里就是剩下的哪些。
                var minH = Math.min.apply(null, colHeightArray);
                var miniHIndex = $.inArray(minH, colHeightArray);
                $(value).css({
                    'position': 'absolute',
                    'top': minH + 'px',
                    'left': miniHIndex * w + 'px',
                    'float': 'left'
                })
                colHeightArray[miniHIndex] += $boxs.eq(index).outerHeight(); //注意，这里要对每一列的高度进行更新。
            }
        })
    },
    isToBottom: function () {
        if ($('.box').last().offset().top + 200 < $(window).height()) {  //判断最后一个区块是否完全显示在浏览器（因为浏览器太宽不出现滚动条）
            app.start();
        }
        return ($('.box').last().offset().top <= $(window).height() + $(window).scrollTop()) ? true:false;
    },
    start: function () {
        var _this = this;
        this.getData();
    }
}
app.init();