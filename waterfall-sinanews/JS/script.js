
var curPage = 1
var perPageCount = 10

function getData(callback) {
    $.ajax({
        url: 'http://platform.sina.com.cn/slide/album_tech',
        dataType: 'jsonp',
        jsonp: "jsoncallback",
        data: {
            app_key: '1271687855',
            num: perPageCount,
            page: curPage
        }
    }).done(function (ret) {
        if(ret && ret.status && ret.status.code === "0") {
            callback(ret.data);//回调请求的数据
            curPage++
        }else{
            console.log('get error data')
        }
    })
}

function createNode(data) {
    var html = '';
    html += '<div class="box"><div class="card">';
    html += '<a href="' + data.url + '"><img src="' + data.img_url +'" alt=""></a>';
    html += '<h4>' + data.name + '</h4>';
    html += '<p>' + data.hort_intro + '</p>';
    html += '</div></div>';
    return $(html);
} 


var colHeightArray = [];
var nodeWidth = $('.box').outerWidth(true)
var colNum = Math.floor($(window).width()/nodeWidth)
for(var i=0; i<colNum; i++){
    colHeightArray[i] = 0;
}

function waterfall($node) {
    var miniIndex = 0;
    var miniValue = colHeightArray[0];
    for (var i=0; i<colHeightArray.length; i++) {
        if(colHeightArray[i] < miniValue){
            miniIndex = i;
            miniValue = colHeightArray[i];
        }
    }
    $node.css({
        left: nodeWidth * miniIndex,
        top: miniValue,
        opacity: 1
    })
    colHeightArray[miniIndex] += $node.outerHeight(true);
}

getData(function (newsList) {
    console.log(newsList)
    newsList.forEach(function (news) {
        var $node = createNode(news); //创建一个node节点，返回的是jQuery对象
        $node.find('img').load(function () { //当里面的img载入的时候，执行函数，把这个node节点插入到main里面。
            $('#main').append($node);
            waterfall($node);//对这个jQuery对象进行瀑布流布局
        })
    })
});