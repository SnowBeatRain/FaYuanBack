
var SmallImgUrl = ""
var BigmgUrl = ""

// 上传图片
function upSmallImg() {
    var formdata = new FormData();
    formdata.append("file", $(".upImg_small")[0].files[0]);//获取文件法二
    var lay = layer.load();
    $.ajax({
        type: 'post',
        url: mainurl + "api/Video/UpdateForImage",
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
                alert(data.Result)
            }
        },
        error: function () {
            layer.close(lay)
            alert("数据异常")
        }
    })
}

// 判断是否是点击操作进入
if (getCookie("InfoIndexID")) {
    // 获取详情
    getDetail()
    function getDetail() {
        $.ajax({
            type: "get",
            url: mainurl + "api/Information/GetInfoDetial?infoID=" + getCookie("InfoIndexID"),
            dataType: "json",
            async: true,
            success: function (data) {
                if (data.Status == 1) {
                    var Name = $(".Name").val(data.Result.Title)
                    $(".languageType").val(data.Result.IsEnglish == "中文" ? 0 : 1)
                    // 判断图
                    if (data.Result.Image) {
                        $(".upImg1").attr("src", mainurl + data.Result.Image)
                        SmallImgUrl = data.Result.Image
                    }
                    // 编辑器内容
                    if (data.Result.Content != null) {
                        ue2 = UE.getEditor('container2');
                        ue2.ready(function () {
                            this.setContent(decodeURIComponent(data.Result.Content));
                        })
                    } else {
                        ue2 = UE.getEditor('container2');
                        ue2.ready(function () {
                            this.setContent('这里你的初始化内容');
                        })
                    }
                } else if (data.Status == 40001) {
                    alert(data.Result)
                    window.location.href = "login.html"
                } else {
                    alert(data.Result)
                }
            }
        });
    }

    // 编辑提交
    function savePro() {
        var Name = $(".Name").val()
        var detail2 = encodeURIComponent(ue2.getContent())
        var EDetail = detail2
        var Discribe = $(decodeURIComponent(detail2)).text().slice(0, 20)
        var Image = SmallImgUrl
        var isEnglish = $(".languageType").val()
        $.ajax({
            type: "post",
            url: mainurl + "api/Information/EditInfo",
            dataType: "json",
            data: {
                "infoID": getCookie("InfoIndexID"),
                "token": getCookie("token"),
                "Title": Name,
                "Image": SmallImgUrl,
                "Discribe": Discribe,
                "Content": EDetail,
                "isEnglish": isEnglish
            },
            async: true,
            success: function (data) {
                if (data.Status == 1) {
                    delCookie("InfoIndexID")
                    var txt = data.Result;
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                    setTimeout(() => {
                        window.location.href = "GetInfoIndex.html"
                    }, 700);
                } else {
                    alert(data.Result)
                }
            }
        });
    }
}
else {
    // 添加提交
    function savePro() {
        var Name = $(".Name").val()
        var detail2 = encodeURIComponent(ue2.getContent())
        var EDetail = detail2
        var Discribe = $(decodeURIComponent(detail2)).text().slice(0, 20)
        var Image = SmallImgUrl
        var isEnglish = $(".languageType").val()
        $.ajax({
            type: "post",
            url: mainurl + "api/Information/CreateInfo",
            dataType: "json",
            data: {
                "token": getCookie("token"),
                "Title": Name,
                "Image": SmallImgUrl,
                "Discribe": Discribe,
                "Content": EDetail,
                "isEnglish": isEnglish
            },
            async: true,
            success: function (data) {
                if (data.Status == 1) {
                    var txt = data.Result;
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                    setTimeout(() => {
                        window.location.href = "GetInfoIndex.html"
                    }, 700);
                }
                else if (data.Status == 40001) {
                    alert(data.Result)
                    window.location.href = "login.html"
                } else {
                    alert(data.Result)
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
