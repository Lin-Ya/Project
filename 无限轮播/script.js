function carousel($node) {
    this.init($node)
}

carousel.prototype = {
    //初始化
    init: function ($node) {
        this.$carousel = $node;                                 //选择需要创建轮播功能的jQuery节点
        this.$img_ct = this.$carousel.find('.img_ct');          //选择轮播窗口
        this.$img_li = this.$carousel.find('.img_ct li')        //选择轮播内容
        this.$preBtn = this.$carousel.find('.pre');             //上一页
        this.$nextBtn = this.$carousel.find('.next');           //下一页
        this.$indicator = this.$carousel.find('.indicator');    //轮播位置指示器
        this.$indicatorBtn = this.$indicator.find('span');      //指示器按钮
        this.indexNow = 0;                                      //当前展示的轮播内容的下标
        this.itemCount = this.$img_li.length;                   //总共有多少轮播内容（页数）来源于原先在HTML页面上添加了多少页，不允许执行过程中进行更改。
        this.itemWidth = this.$img_li.outerWidth()              //单页的宽度，即轮播翻滚的距离
        console.log(this.itemWidth * (this.itemCount+2))
        this.$img_ct.css({
            left: -this.itemWidth,                              //设置初始显示的位置
            width: this.itemWidth * (this.itemCount + 2)        //总宽度为（轮播页数+2）*单页宽度
        })
        this.$clone_Last_Item = this.$img_li.eq(this.itemCount - 1).clone().addClass('cloneLast').prependTo(this.$img_ct);  //把最后一页克隆到第一页的前面，用于过度
        this.$clone_First_Item = this.$img_li.eq(0).clone().addClass('cloneFirst').appendTo(this.$img_ct);                  //把第一页克隆到最后一页后面。
        this.switching = false;                                 //用于节流
        this.bind();                                            //实现绑定
    },
    //绑定事件
    bind: function () {
        console.log('一共有 ' + this.itemCount + '页')
        var _this = this;
        //绑定上下页切换事件
        this.$preBtn.on('click', function () {
            if (_this.switching) {                                                   //函数节流
                console.log('节流')
                return;
            }
            _this.pre();
        });
        this.$nextBtn.on('click', function () {
            if (_this.switching) {                                                   //函数节流
                console.log('节流')
                return;
            }
            _this.next();
        })

        //绑定轮播指示器的切换按钮功能
        this.$indicatorBtn.on('click', function (e) {
            var toThis = $(e.target).index()                                        //获取所点击的指示器按钮的下标
            console.log(_this.switching)
            if (_this.switching) {                                                   //函数节流
                console.log('节流')
                return;
            }
            _this.switching = true;                                                 //锁住状态                             
            function updateStatus() {
                console.log('ok')
                _this.indexNow = toThis
                _this.indicatorSwitch();                                            //对指示器进行更新  
            }
            if(toThis > _this.indexNow) {                                           //判断目标下标距离当前下标的关系
                _this.$img_ct.animate({
                    left: '-=' + _this.itemWidth * (toThis - _this.indexNow)        //如果目标下标>当前下标，表示想左滚动。   计算出来的值应该>0,方向由‘-=’来控制
                }, 350, updateStatus(),function () {
                    _this.switching = false;
                })
            }else {
                _this.$img_ct.animate({
                    left: '+=' + _this.itemWidth * (_this.indexNow - toThis)        //如果目标下标<当前下标，表示想左滚动。   计算出来的值应该>0,方向由‘-=’来控制
                }, 350, updateStatus(), function () {
                    _this.switching = false;
                })
            }
        })
    },

    //实现上下一页
    pre: function () {
        var _this = this;
        _this.switching = true;
        this.$img_ct.animate({
            left: '+=' + this.itemWidth
        },400,function () {
            _this.switching = false;
            _this.indexNow --;
            if (_this.indexNow === -1) {                //-1表示，当前转到了克隆对象为最后一页的时候，表示来到了轮播队列的首位，这时候就是切换轮播到被克隆的最后一页。
                _this.$img_ct.css({
                    left: 0 - _this.itemWidth*_this.itemCount   //回到轮播队列的最后一页（不包括克隆对象）
                })
                _this.indexNow = _this.itemCount-1;
            }            
            _this.indicatorSwitch();                      //对指示器进行更新  
            console.log(_this.indexNow)
        })
    },
    next: function () {
        var _this = this;
        _this.switching = true;
        this.$img_ct.animate({
            left: '-=' + this.itemWidth
        },400,function () {
            _this.switching = false;
            _this.indexNow++;
            if (_this.indexNow === _this.itemCount) {     //这里表示，当前转到了克隆对象为第一页的时候，表示来到了轮播队列的尾部，这时候就是切换轮播到被克隆的最后一页。
                _this.$img_ct.css({
                    left: 0 - _this.itemWidth             //回到轮播队列的第一页（不包括克隆对象）  
                })
                _this.indexNow = 0;
            }
            _this.indicatorSwitch();                      //对指示器进行更新  
            console.log(_this.indexNow)
        })
    },
    
    //更新轮播指示器的状态
    indicatorSwitch: function () {
        this.$indicatorBtn.eq(this.indexNow).addClass('active').siblings().removeClass('active')
    }
}

var a = new carousel($('.carousel').eq(0))
var b = new carousel($('.carousel').eq(1))