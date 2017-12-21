
var SmallImgUrl = ""
var BigmgUrl = ""
var Introurl = ""
var VideoUrl = ""
var VideoCoverImage = ""
// 上传图片
function upSmallImg() {
    var formdata = new FormData();
    formdata.append("file", $(".upImg_small")[0].files[0]);//获取文件法二
    var lay = layer.load();
    $.ajax({
        type: 'post',
        url: mainurl + "api/P_Tool/FileUploader?type=0&Token=" + getCookie('token'),
        // beforeSend: function(xhr) {
        //     xhr.setRequestHeader("Authorization", );
        // },
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
        }
    })
}
function upBigImg() {
    var formdata = new FormData();
    formdata.append("file", $(".upImg_big")[0].files[0]);//获取文件法二
    var lay = layer.load();
    $.ajax({
        type: 'post',
        url: mainurl + "api/P_Tool/FileUploader?type=0&Token=" + getCookie('token'),
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
function upIntro() {
    var formdata = new FormData();
    formdata.append("file", $(".upIntro")[0].files[0]);//获取文件法二
    var lay = layer.load();
    $.ajax({
        type: 'post',
        url: mainurl + "api/P_Tool/FileUploader?type=0&Token=" + getCookie('token'),
        data: formdata,
        cache: false,
        processData: false,
        contentType: false,
        success: function (data) {
            layer.close(lay)
            if (data.Status == 1) {
                layer.msg("上传图片完成")
                $(".upImg3").attr("src", mainurl + data.Result)
                Introurl = data.Result
            }
            else {
                alert(data.Result)
            }

        }
    })
}
function upVideoUrl() {
    var formdata = new FormData();
    formdata.append("file", $(".upVideoUrl")[0].files[0]);//获取文件法二
    var lay = layer.load();
    $.ajax({
        type: 'post',
        url: mainurl + "api/P_Tool/FileUploader?type=0&Token=" + getCookie('token'),
        data: formdata,
        cache: false,
        processData: false,
        contentType: false,
        success: function (data) {
            layer.close(lay)
            if (data.Status == 1) {
                layer.msg("上传视频完成")
                $(".upImg4").attr("src", mainurl + data.Result)
                VideoUrl = data.Result
            }
            else {
                alert(data.Result)
            }

        }
    })
}
function upVideoCoverImage() {
    var formdata = new FormData();
    formdata.append("file", $(".upVideoCoverImage")[0].files[0]);//获取文件法二
    var lay = layer.load();
    $.ajax({
        type: 'post',
        url: mainurl + "api/P_Tool/FileUploader?type=0&Token=" + getCookie('token'),
        data: formdata,
        cache: false,
        processData: false,
        contentType: false,
        success: function (data) {
            layer.close(lay)
            if (data.Status == 1) {
                layer.msg("上传图片完成")
                $(".upImg5").attr("src", mainurl + data.Result)
                VideoCoverImage = data.Result
                $(".guanbi5").show()
            }
            else {
                alert(data.Result)
            }

        }
    })
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
function guanbi3() {
    VideoCoverImage = ""
    $(".upImg5").attr("src", "./image/tu.png")
    $(".guanbi5").hide()
}
// 判断是否是点击操作进入
$(".showIntro").hide()
$(".showVideoUrl").hide()
if (getCookie("equipmentID")) {
    // 获取详情
    getDetail()
    function getDetail() {
        $.ajax({
            type: "get",
            url: mainurl + "api/P_Equipment/EquipmentDetail?ID=" + getCookie("equipmentID") + "&Token=" + getCookie("token"),
            dataType: "json",
            async: true,
            success: function (data) {
                if (data.Status == 1) {
                    $(".FullName").val(data.Result.FullName)
                    $(".Name").val(data.Result.Name)
                    $(".Batch").val(data.Result.Batch)
                    // 判断大小图
                    if (data.Result.Image) {
                        $(".upImg1").attr("src", mainurl + data.Result.Image)
                        SmallImgUrl = data.Result.Image
                    }
                    if (data.Result.Image2) {
                        $(".upImg2").attr("src", mainurl + data.Result.Image2)
                        BigmgUrl = data.Result.Image2
                    }
                    if (data.Result.VideoCoverImage) {
                        $(".upImg5").attr("src", mainurl + data.Result.VideoCoverImage)
                        VideoCoverImage = data.Result.VideoCoverImage
                    }
                    if (data.Result.VideoUrl) {
                        $(".showVideoUrl").show()
                        $(".showVideoUrl").attr("href", mainurl + data.Result.VideoUrl)
                        VideoUrl = data.Result.VideoUrl
                    }
                    if (data.Result.Intro) {
                        $(".showIntro").show()
                        $(".showIntro").attr("href", mainurl + data.Result.Intro)
                        Introurl = data.Result.Intro
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
        var FullName = $(".FullName").val()
        var Name = $(".Name").val()
        var Batch = $(".Batch").val()
        var Image = SmallImgUrl
        var Image2 = BigmgUrl
        var Intro = Introurl
        var video = VideoUrl
        var videoImg = VideoCoverImage
        $.ajax({
            type: "post",
            url: mainurl + "api/P_Equipment/EquipmentEdit?Token=" + getCookie("token") + "&ID=" + getCookie("equipmentID"),
            dataType: "json",
            data: {
                "FullName": FullName,
                "Name": Name,
                "Batch": Batch,
                "Image": Image,
                "Image2": Image2,
                "Intro": Intro,
                "VideoUrl": video,
                "VideoCoverImage": videoImg,
            },
            async: true,
            success: function (data) {
                if (data.Status == 1) {
                    window.location.href = "equipmentlist.html"
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
else {
    // 添加提交
    function savePro() {
        var FullName = $(".FullName").val()
        var Name = $(".Name").val()
        var Batch = $(".Batch").val()
        var Image = SmallImgUrl
        var Image2 = BigmgUrl
        var Intro = Introurl
        var video = VideoUrl
        var videoImg = VideoCoverImage
        $.ajax({
            type: "post",
            url: mainurl + "api/P_Equipment/EquipmentAdd?Token=" + getCookie("token"),
            dataType: "json",
            data: {
                "FullName": FullName,
                "Name": Name,
                "Batch": Batch,
                "Image": Image,
                "Image2": Image2,
                "Intro": Intro,
                "VideoUrl": video,
                "VideoCoverImage": videoImg,
            },
            async: true,
            success: function (data) {
                if (data.Status == 1) {
                    window.location.href = "equipmentlist.html"
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


