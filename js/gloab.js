// var mainurl = "http://192.168.1.132/Court/"
var mainurl = "http://nbfyapi.webuynb.com/"
/*以下是存储cookie的方法*/
function setCookie(name, value, time) {
    var strsec = getsec(name);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getsec(str) {
    var str1 = str.substring(1, str.length) * 1;
    var str2 = str.substring(0, 1);
    if (str2 == "s") {
        return str1 * 1000;
    } else if (str2 == "h") {
        return str1 * 60 * 60 * 1000;
    } else if (str2 == "d") {
        return str1 * 24 * 60 * 60 * 1000;
    }
}
//这是有设定过期时间的使用示例：
//s20是代表20秒
//h是指小时，如12小时则是：h12
//d是天数，30天则：d30
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
/*存储结束*/
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}


$(".centerbox").css({
    "min-height": $(window).height() - 90
});
$("#myiframe").css({
    "min-height": $(window).height() - 120
});

xhmsq = function (xhr) { xhr.setRequestHeader('SdkVersion', '1'); xhr.setRequestHeader('Authorization', getCookie('token')) };//这里设置header

var token = getCookie("token");
function Click(e) {
    var id = $(e).parents("tr").attr("id");
    setCookie("ID", id, "d30");
}
var id = getCookie("ID");

if (location.href.indexOf("login.html") < 0) {
    if (token == null) {
        window.parent.location.href = "login.html";
    }
}

function lgAgain() {
    window.parent.location.href = "login.html";
}


// 百度编辑器内容
var detail1 = ""
var detail2 = ""
