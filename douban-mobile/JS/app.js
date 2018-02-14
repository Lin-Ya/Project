var app = {
    init: function(){
        this.$tab = $('.tab');
        this.$section = $('section')
        this.bind()
        top250.init();
        us.init();
        search.init();
    },
    bind: function() {
        let _this = this
        this.$tab.on('click', function() {
            $(this).addClass('active').siblings().removeClass('active');
            _this.$section.eq($(this).index()).addClass('active').fadeIn(500).siblings().removeClass('active').hide();
        })
    },
    start: function() {
        
    }
}

var top250 = {
    init: function() {
        this.$element = $('#top250')
        this.getData()
        this.bind()
        this.start()
        this.index = 0
        this.isLoading = false
        let moveDate
    },
    bind: function () {
        let _this = this
        this.$element.scroll(function() {
            if (_this.isToBottom() === true){
                _this.start();
            } 
        })
    },
    start: function() {
        let _this = this
        this.getData()
    },
    getData: function() {
        let _this = this
        if (_this.isLoading) return
        _this.isLoading = true
        _this.$element.find('.loading').show();
        $.ajax({
            url: 'https://api.douban.com/v2/movie/top250',
            type: 'GET',
            data: {
                start: _this.index,
                count: 20
            },
            dataType: 'jsonp'
        })
        .done(function (ret) {
            _this.index += 20;
            _this.moveDate = ret;
            console.log(_this.index);
            ret.subjects.forEach(_this.createItem)
        })
        .fail(function () {
            console.log('获取失败')
        })
        .always(function () {
            _this.isLoading = false;
            _this.$element.find('.loading').hide();
        })
    },
    createItem: function(obj) {
        let imgsrc, link, title, rating, collectCount, year, genres, directors, casts;
        let html = '';
        link = obj.alt;
        title = obj.title;
        rating = obj.rating.average;
        year = obj.year;
        imgsrc = obj.images.large;
        collectCount = obj.collect_count;
        if (obj.genres.length > 1) {
            genres = obj.genres.join('/');
        } else {
            genres = obj.genres;
        };
        if (obj.directors.length > 1) {
            let arr = [];
            for (let i = 0; i < obj.directors.length; i++) {
                arr.push(obj.directors[i].name);
            }
            directors = arr.join('、');
        } else {
            directors = obj.directors[0].name;
        }
        if (obj.casts.length > 1) {
            let arr = [];
            for (let i = 0; i < obj.casts.length; i++) {
                arr.push(obj.casts[i].name);
            }
            casts = arr.join('、');
        } else {
            casts = obj.casts[0].name;
        }
        html += '<div class="item">';
        html += '<a href="' + link + '">';
        html += '<div class="cover">';
        html += '<img src="' + imgsrc + '" alt="封面">';
        html += '</div>';
        html += '<h1 id="tittle">' + title + '</h1>';
        html += '<div>';
        html += '<span id="rating">' + rating + '</span><span>分</span>';
        html += '<span id="collect_count">' + collectCount + '  收藏</span>';
        html += '</div>';
        html += '<div>';
        html += '<span id="year">' + year + '</span>';
        html += '<span id="genres ">' + genres + '</span>';
        html += '</div>        ';
        html += '<p id="directors">导演：' + directors + '</p>';
        html += '<p id="casts">主演：' + casts + '</p>';
        html += '</a>';
        html += '</div>';
        $('#top250').find('.container').append(html);  
    },
    isToBottom: function () {
        if(this.$element.find('.container').height() - 20 <= this.$element.height() + this.$element.scrollTop()){
            return true;
        }else {
            return false;
        }
    }
}

var us = {
    init: function () {
        this.$element = $('#us')
        this.getData()
        this.bind()
        this.start()
        this.isLoading = false
        let moveDate
    },
    bind: function () {
        let _this = this
    },
    start: function () {
        let _this = this
        this.getData()
    },
    getData: function () {
        let _this = this
        _this.$element.find('.loading').show();
        $.ajax({
            url: 'https://api.douban.com/v2/movie/us_box',
            type: 'GET',
            dataType: 'jsonp'
        })
            .done(function (ret) {
                _this.moveDate = ret;
                ret.subjects.forEach(_this.createItem)
            })
            .fail(function () {
                console.log('获取失败')
            })
            .always(function () {
                _this.$element.find('.loading').hide();
            })
    },
    createItem: function (ret) {
        let obj = ret.subject
        let imgsrc, link, title, rating, collectCount, year, genres, directors, casts;
        let html = '';
        link = obj.alt;
        title = obj.title;
        rating = obj.rating.average;
        year = obj.year;
        imgsrc = obj.images.large;
        collectCount = obj.collect_count;
        if (obj.genres.length > 1) {
            genres = obj.genres.join('/');
        } else {
            genres = obj.genres;
        };
        if (obj.directors.length > 1) {
            let arr = [];
            for (let i = 0; i < obj.directors.length; i++) {
                arr.push(obj.directors[i].name);
            }
            directors = arr.join('、');
        } else {
            directors = obj.directors[0].name;
        }
        if (obj.casts.length > 1) {
            let arr = [];
            for (let i = 0; i < obj.casts.length; i++) {
                arr.push(obj.casts[i].name);
            }
            casts = arr.join('、');
        } else {
            casts = obj.casts[0].name;
        }
        html += '<div class="item">';
        html += '<a href="' + link + '">';
        html += '<div class="cover">';
        html += '<img src="' + imgsrc + '" alt="封面">';
        html += '</div>';
        html += '<h1 id="tittle">' + title + '</h1>';
        html += '<div>';
        html += '<span id="rating">' + rating + '</span><span>分</span>';
        html += '<span id="collect_count">' + collectCount + '  收藏</span>';
        html += '</div>';
        html += '<div>';
        html += '<span id="year">' + year + '</span>';
        html += '<span id="genres ">' + genres + '</span>';
        html += '</div>        ';
        html += '<p id="directors">导演：' + directors + '</p>';
        html += '<p id="casts">主演：' + casts + '</p>';
        html += '</a>';
        html += '</div>';
        $('#us').find('.container').append(html);
    },
    isToBottom: function () {
        if (this.$element.find('.container').height() - 20 <= this.$element.height() + this.$element.scrollTop()) {
            return true;
        } else {
            return false;
        }
    }
}

var search = {
    init: function () {
        this.$element = $('.search-header')
        this.getData()
        this.bind()
        this.start()
        this.index = 0
        this.keyword = '';
        this.keyword2 = '';
        this.isLoading = false
        let moveDate
    },
    bind: function () {
        let _this = this
        this.$element.scroll(function () {
            if (_this.isToBottom() === true) {
                _this.start();
            }
        })
        this.$element.find('button').on('click', function() {
            if(_this.keyword !== _this.keyword2) {
                _this.$element.find('.container').empty();
            }
            _this.keyword = _this.$element.find('input').val();
            _this.start()
            console.log(_this.keyword)
        })
    },
    start: function () {
        let _this = this
        this.getData()
    },
    getData: function () {
        let _this = this
        if (_this.isLoading) return
        _this.isLoading = true
        _this.$element.find('.loading').show();
        $.ajax({
            url: 'https://api.douban.com/v2/movie/search',
            type: 'GET',
            data: {
                q: _this.keyword,
                start: _this.index,
                count: 20
            },
            dataType: 'jsonp'
        })
            .done(function (ret) {
                _this.index += 20;
                _this.moveDate = ret;
                console.log(_this.index);
                console.log(ret)
                ret.subjects.forEach(_this.createItem)
            })
            .fail(function () {
                console.log('获取失败')
            })
            .always(function () {
                _this.isLoading = false;
                _this.$element.find('.loading').hide();
            })
    },
    createItem: function (obj) {
        console.log(this.index)
        let imgsrc, link, title, rating, collectCount, year, genres, directors, casts;
        let html = '';
        link = obj.alt;
        title = obj.title;
        rating = obj.rating.average;
        year = obj.year;
        imgsrc = obj.images.large;
        collectCount = obj.collect_count;
        if (obj.genres.length > 1) {
            genres = obj.genres.join('/');
        } else {
            genres = obj.genres;
        };
        if (obj.directors.length > 1) {
            let arr = [];
            for (let i = 0; i < obj.directors.length; i++) {
                arr.push(obj.directors[i].name);
            }
            directors = arr.join('、');
        } else {
            directors = obj.directors.name;
        }
        if (obj.casts.length > 1) {
            let arr = [];
            for (let i = 0; i < obj.casts.length; i++) {
                arr.push(obj.casts[i].name);
            }
            casts = arr.join('、');
        } else {
            casts = obj.casts.name;
        }
        html += '<div class="item">';
        html += '<a href="' + link + '">';
        html += '<div class="cover">';
        html += '<img src="' + imgsrc + '" alt="封面">';
        html += '</div>';
        html += '<h1 id="tittle">' + title + '</h1>';
        html += '<div>';
        html += '<span id="rating">' + rating + '</span><span>分</span>';
        html += '<span id="collect_count">' + collectCount + '  收藏</span>';
        html += '</div>';
        html += '<div>';
        html += '<span id="year">' + year + '</span>';
        html += '<span id="genres ">' + genres + '</span>';
        html += '</div>        ';
        html += '<p id="directors">导演：' + directors + '</p>';
        html += '<p id="casts">主演：' + casts + '</p>';
        html += '</a>';
        html += '</div>';
        $('.search-header').find('.container').append(html);
    },
    isToBottom: function () {
        if (this.$element.find('.container').height() - 20 <= this.$element.height() + this.$element.scrollTop()) {
            return true;
        } else {
            return false;
        }
    }
}
app.init();