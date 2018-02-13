// tab面板的切换。
$('.tab').on('click', function () {
    var indexTab = $(this).index();
    $(this).addClass('active').siblings().removeClass('active');
    $('section').eq(indexTab).slideDown(300).siblings().hide();
    $('section').eq(indexTab).addClass('active').siblings().removeClass('active');
});

//发送请求获取toplist电影
var moveDate;
$.ajax({
    url: 'https://api.douban.com/v2/movie/top250',
    type: 'GET',
    data: {
        start: 0,
        count: 20
    },
    dataType: 'jsonp'
}).done(function (ret) {
    moveDate = ret;
}).fail(function () {
    console.log('获取失败');
});


//生成item（生成带有数据的node节点？）
function createItem(obj) {
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
    $('section').eq(0).append(html);//把生成好的html字符串添加到节点中。
}


