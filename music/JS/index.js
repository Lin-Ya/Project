
var currentIndex = 0;//用于定位音乐列表中的那首歌。
var musicList;
var audioObj = new Audio();
var cover = document.querySelector('.cover');
var bgImage = window.getComputedStyle(cover).backgroundImage;
var title;
var auther;

getMusicList(function (list) {
    //console.log(list);//这里通过回调函数的获取到了music.json，即音乐列表，是个数组
    musicList = list;
});


// 事件绑定
//播放、暂停
$('#playBtn').addEventListener('click' ,function(e) {
    if (e.target.classList.contains('fa-pause')) {
        e.target.classList.value = 'fa fa-play';
        audioObj.pause();
    } else {
        e.target.classList.value = 'fa fa-pause';
        audioObj.play();
    }
})

//上下一首
$('#lastSong').addEventListener('click', function () {
    audioObj.pause();
    if (currentIndex === 0) {
        currentIndex = (musicList.length - 1);
        loadMusic();
    } else {
        currentIndex = -- currentIndex;
        loadMusic();
    }
})
$('#nextSong').addEventListener('click', function(){
    audioObj.pause();
    if (currentIndex === (musicList.length - 1)) {
        currentIndex = 0;
        loadMusic();
    } else {
        currentIndex = ++currentIndex;
        loadMusic();
    }
})

//歌曲列表切换歌曲
$('.list').addEventListener('click', function (e) {
    $$('p')[currentIndex].style.color = '#000';
    if (e.target.tagName === 'P') {
        audioObj.pause();
        currentIndex = e.target.id;
        loadMusic();
        e.target.style.color = 'rgb(103, 9, 191)';
    }
})


// 进度条和时间
audioObj.ontimeupdate = function () {
    var duration =  Math.floor(this.duration);
    var currentTime = Math.floor(this.currentTime);
    $('.timetotal').innerText = Math.floor((this.duration) / 60) + ':' + (((duration % 60)+'').length === 2? Math.floor(duration % 60):'0'+Math.floor(duration % 60));
    $('.progerss-now').style.width = (this.currentTime/this.duration)*100 + '%';//进度条的自动改变
    $('.timenow').innerText = Math.floor(currentTime / 60) + ':' + (((currentTime % 60) + '').length === 2 ? Math.floor(currentTime % 60) : '0' + Math.floor(currentTime % 60));
}
audioObj.onended = function () {
    if (currentIndex == musicList.length - 1 ){
        currentIndex = 0;
        loadMusic();
    } else {
        currentIndex = ++ currentIndex;
        loadMusic();
    }
}
//函数
function $(selector) {
    return document.querySelector(selector);
}
function $$(selector) {
    return document.querySelectorAll(selector);
}

function getMusicList(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'Project/music/MUSIC/music.jscon', 'true')
    xhr.onload = function () {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
            callback(JSON.parse(this.responseText)) //表示数据获取成功
            loadMusic();// 加载音乐数据
            loadMusicList();
        } else {
            console.log('获取数据失败')
        }
    }
    xhr.onerror = function () {
        console.log('网络异常')
    }
    xhr.send();
}

function loadMusic() {
    $('#playBtn').classList.value = 'fa fa-pause';
    audioObj.src = musicList[currentIndex].src;
    $('title').innerText = '正在播放：' + musicList[currentIndex].title;
    $('.title').innerText = musicList[currentIndex].title;
    $('.auther').innerText = musicList[currentIndex].auther;
    cover.style.backgroundImage = "url(" + musicList[currentIndex].img + ")";
    audioObj.autoplay = true;
    audioObj.volume = 0.2;
    
}

function loadMusicList() {
    let i;
    for (i=0; i<musicList.length; i++) {
        auther = musicList[i].auther;
        title = musicList[i].title;
        let p = document.createElement('p');
        p.innerText = title + ' -- ' + auther;
        p.id = i;
        $('.list').appendChild(p);
    }
    $('p').style.color = 'rgb(103, 9, 191)';
}


