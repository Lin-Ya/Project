$(window).on('load', function () {
    waterfall();
    $(window).on('scroll',function () {
        var $bottomBox = $('#main>div').last();
        if(cheackScrollSlide){
            for(var i=0; i<5; i++){
                loadBox();
                waterfall();
            }
        }
        $bottomBox = $('#main>div').last();
    })
})

function waterfall() {
    var $boxs = $('#main>div');
    var w = $boxs.eq(0).outerWidth(); //列宽等于box 的宽度
    var colCount = Math.floor($(window).width()/w);//计算有多少列
    $('#main').width(w*colCount).css('margin','0 auto');
    var colHeightArray = [];
    $boxs.each(function (index,value) {
        var h=$boxs.eq(index).outerHeight();
        if(index<colCount){
            colHeightArray[index]=h;
        }else{ //这里的else是指在拍完前面第一行以后剩下的box，假如有3列，就先排了3个，这里就是剩下的哪些。
            var minH=Math.min.apply(null,colHeightArray);
            var miniHIndex=$.inArray(minH,colHeightArray);
            $(value).css({
                'position': 'absolute',
                'top': minH+'px',
                'left': miniHIndex*w +'px'
            })
            colHeightArray[miniHIndex] +=$boxs.eq(index).outerHeight(); //注意，这里要对每一列的高度进行更新。
        }
    })
}

function cheackScrollSlide() {
    return $bottomBox.offset().top = $(window).scrollTop() + $(window).height() + 20;
}

function loadBox() {
    var html = '';
    var randNumber = Math.floor((Math.random()*98))
    html += '<div class="box"><div class="card">';
    html += '<img src="../瀑布流/images/' + randNumber + '.jpg" alt=" "';
    html += '<span>' + randNumber + '.jpg' ;
    html += '</span>';
    html += '</div></div>';
    $('#main').append(html);
    console.log(1);
}