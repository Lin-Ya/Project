function createHTML() {
    let rand = Math.floor(Math.random() * 100)
    let html = '';
    html += '<div class="cell">';
    html += '<div class="contant">';
    html += '<img src="https://picsum.photos/200/200/?image='+ rand+ '" alt="预览">';
    html += '<div class="title">我没去过的地方</div>';
    html += '<div class="prices"> ￥'+ rand + '</div>';
    html += '</div>';
    html += '<button class="hidden" id="delete">删除</button>';
    html += '</div>'
    return html;
}


$('.btnPenal #add').on('click', function () {
    if($('.contant').hasClass('to-edit') && $('.hidden').hasClass('active')) {
        $('.contant').removeClass('to-edit');
        $('.hidden').removeClass('active');
    }
    for (let i = 0; i < 3; i++) {
        let html = createHTML()
        $('.ct').append(html)
    }
})

$('.btnPenal #edit').on('click', function () {
    $('.cell .contant').toggleClass('to-edit');
    $('.hidden').toggleClass('active');
})

$('.ct').on('click','#delete',function () {
    $(this).parent('.cell').remove();
})