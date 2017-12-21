var mainurl = "http://192.168.1.106/HaiDaFilter/"

/*以下是存储cookie的方法*/
function setCookie(name, value, time) {
    var strsec = getsec(time);
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

$(".centerbox").css({
    "min-height": $(window).height() - 90
});
$("#myiframe").css({
    "min-height": $(window).height() - 120
});

xhmsq=function(xhr){xhr.setRequestHeader('SdkVersion', '1');xhr.setRequestHeader('Authorization',getCookie('token'))};//这里设置header


