$('.tab').on('click', function () {
    var indexTab = $(this).index();
    $(this).addClass('active').siblings().removeClass('active');
    $('section').eq(indexTab).slideDown(300).siblings().hide();
    $('section').eq(indexTab).addClass('active').siblings().removeClass('active');
});