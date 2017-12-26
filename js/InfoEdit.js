
var SmallImgUrl = ""

// 上传图片
function upSmallImg() {
    var formdata = new FormData();
    formdata.append("file", $(".upImg_small")[0].files[0]);//获取文件法二
    var lay = layer.load();
    $.ajax({
        type: 'post',
        url: mainurl + "api/Tool/FileUploaderForAdmin?type=0&Token=" + getCookie('token'),
        data: formdata,
        cache: false,
        processData: false,
        contentType: false,
        success: function (data) {
            layer.close(lay)
            if (data.Status == 1) {
                layer.msg("上传图片完成")
                $(".upImg1").attr("src", mainurl + data.Result)
                SmallImgUrl = data.Result
                $(".guanbi1").show()
            }
            else {
                var txt = data.Result;
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
            }
        }
    })
}

// 是否短信推送
var sendMsg = true
function shangjia() {
    $(".shangjia").attr("src", "image/yes.png")
    $(".weishangjia").attr("src", "image/no.png")
    sendMsg = true
}
function weishangjia() {
    $(".weishangjia").attr("src", "image/yes.png")
    $(".shangjia").attr("src", "image/no.png")
    sendMsg = false
}


// 判断是否是点击操作进入
if (getCookie("InfoID")) {
    // 获取详情
    getDetail()
    function getDetail() {
        $.ajax({
            type: "get",
            url: mainurl + "api/Activity/Detail?ID=" + getCookie("InfoID"),
            dataType: "json",
            async: true,
            success: function (data) {
                if (data.Status == 1) {
                    $(".Name").val(data.Result.Title)
                    sendMsg = false
                    // 判断是否短信
                    if (sendMsg) {
                        $(".shangjia").attr("src", "image/yes.png")
                        $(".weishangjia").attr("src", "image/no.png")
                    } else {
                        $(".shangjia").attr("src", "image/no.png")
                        $(".weishangjia").attr("src", "image/yes.png")
                    }
                    // 判断大小图
                    if (data.Result.Url) {
                        $(".upImg1").attr("src", mainurl + data.Result.Url)
                        SmallImgUrl = data.Result.Url
                    }
                    // 编辑器内容
                    if (data.Result.Content != null) {
                        ue1 = UE.getEditor('container1');
                        detail1 = data.Result.Content
                        ue1.ready(function () {
                            this.setContent(decodeURIComponent(data.Result.Content));
                        })
                    } else {
                        ue1 = UE.getEditor('container1');
                        ue1.ready(function () {
                            this.setContent('这里你的初始化内容');
                        })
                    }
                } else if (data.Status == 40001) {
                    var txt = data.Result;
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                    setTimeout(() => {
                        top.location.href = "login.html"
                    }, 500);
                } else {
                    var txt = data.Result;
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                }
            }
        });
    }

    // 编辑提交
    function savePro() {
        var Name = $(".Name").val()
        var Detail = detail1
        var Image = SmallImgUrl
        $.ajax({
            type: "post",
            url: mainurl + "api/Activity/AddOrUpdate?Token=" + getCookie("token"),
            dataType: "json",
            data: {
                "ID": getCookie("InfoID"),
                "Title": Name,
                "Url": SmallImgUrl,
                "IsSend": sendMsg,
                "Content": Detail
            },
            async: true,
            success: function (data) {
                if (data.Status == 1) {

                    delCookie("InfoID")
                    window.location.href = "ActivityList.html"
                } else {
                    var txt = data.Result;
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                }
            }
        });
    }
}
else {
    // 添加提交
    function savePro() {
        var Name = $(".Name").val()
        var Detail = detail1 == "" ? encodeURIComponent("这里你的初始化内容") : detail1
        var Image = SmallImgUrl
        $.ajax({
            type: "post",
            url: mainurl + "api/Activity/AddOrUpdate?Token=" + getCookie("token"),
            dataType: "json",
            data: {
                // "ID": ,
                "Title": Name,
                "Url": SmallImgUrl,
                "IsSend": sendMsg,
                "Content": Detail
            },
            async: true,
            success: function (data) {
                if (data.Status == 1) {
                    window.location.href = "ActivityList.html"
                }
                else if (data.Status == 40001) {
                    var txt = data.Result;
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                    setTimeout(() => {
                        top.location.href = "login.html"
                    }, 500);
                } else {
                    var txt = data.Result;
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                }
            }
        });
    }
}

function guanbi1() {
    SmallImgUrl = ""
    $(".upImg1").attr("src", "./image/tu.png")
    $(".guanbi1").hide()
}
