
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
function upBigImg() {
    var formdata = new FormData();
    formdata.append("file", $(".upImg_big")[0].files[0]);//获取文件法二
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
                $(".upImg2").attr("src", mainurl + data.Result)
                BigmgUrl = data.Result
                $(".guanbi2").show()
            }
            else {
                alert(data.Result)
            }

        }
    })
}


// 判断是否是点击操作进入
if (getCookie("LunBoID")) {
    // 获取详情
    getDetail()
    function getDetail() {
        $.ajax({
            type: "get",
            url: mainurl + "api/BannerList/GetLunboMes?lunboID=" + getCookie("LunBoID"),
            dataType: "json",
            async: true,
            success: function (data) {
                if (data.Status == 1) {
                    $(".urlLink").val(data.Result.Url)
                    $(".Name").val(data.Result.where == 1 ? "资讯" : "")
                    $("input[type='radio']")[data.Result.IsJump ? 0 : 1].checked = "checked";
                    // 判断图
                    if (data.Result.Image) {
                        $(".upImg1").attr("src", mainurl + data.Result.Image)
                        SmallImgUrl = data.Result.Image
                    }
                } else if (data.Status == 40001) {
                    var txt = data.Result;
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                    setTimeout(() => {
                        window.location.href = "login.html"
                    }, 700);
                } else {
                    var txt = data.Result;
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                }
            }
        });
    }

    // 编辑提交
    function savePro() {
        var Image = SmallImgUrl
        var ImageLink = $(".urlLink").val()
        var IsJump = $("input[type='radio']:checked").val()
        if (Image == "" || ImageLink == "") {
            alert("请完善信息")
        } else {
            $.ajax({
                type: "post",
                url: mainurl + "api/BannerList/EidtLunbo",
                dataType: "json",
                data: {
                    "lunboID": getCookie("LunBoID"),
                    "token": getCookie("token"),
                    "Image": Image,
                    "Url": ImageLink,
                    "IsJump": IsJump,
                    "where": 1
                },
                // async: true,
                success: function (data) {
                    if (data.Status == 1) {
                        var txt = data.Result;
                        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                        setTimeout(() => {
                            window.location.href = "GetInfoLunboIndex.html"
                        }, 700);
                    }
                    else if (data.Status == 40001) {
                        var txt = data.Result;
                        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                        setTimeout(() => {
                            window.location.href = "login.html"
                        }, 700);

                    } else {
                        var txt = data.Result;
                        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                    }
                }
            });
        }

    }
}
else {
    // 添加提交
    function savePro() {
        var Image = SmallImgUrl
        var ImageLink = $(".urlLink").val()
        var IsJump = $("input[type='radio']:checked").val()
        if (Image == "" || ImageLink == "") {
            alert("请完善信息")
        } else {
            $.ajax({
                type: "post",
                url: mainurl + "api/BannerList/AddLunbo",
                dataType: "json",
                data: {
                    "token": getCookie("token"),
                    "Image": Image,
                    "Url": ImageLink,
                    "IsJump": IsJump,
                    "where": 1
                },
                // async: true,
                success: function (data) {
                    if (data.Status == 1) {
                        var txt = data.Result;
                        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                        setTimeout(() => {
                            window.location.href = "GetInfoLunboIndex.html"
                        }, 700);
                    }
                    else if (data.Status == 40001) {
                        var txt = data.Result;
                        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                        setTimeout(() => {
                            window.location.href = "login.html"
                        }, 700);
                    } else {
                        var txt = data.Result;
                        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                    }
                }
            });
        }

    }
}

function guanbi1() {
    SmallImgUrl = ""
    $(".upImg1").attr("src", "./image/tu.png")
    $(".guanbi1").hide()
}
function guanbi2() {
    BigmgUrl = ""
    $(".upImg2").attr("src", "./image/tu.png")
    $(".guanbi2").hide()
}
