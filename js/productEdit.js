
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
// 上传图片
function upProImg() {
    var formdata = new FormData();
    formdata.append("file", $(".upImg_pro")[0].files[0]);//获取文件法二
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
                var txt = data.Result;
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
            }
        },
        error: function () {
            layer.close(lay)
            var txt = "数据异常";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
        }
    })
}

// 中英文切换
function changeLanguage() {
    getType($(".languageType").val())
}
// 获取产品类型

function getType(e) {
    $.ajax({
        type: "get",
        url: mainurl + "api/ProductList/LangChangeProd?IsEnglish=" + e,
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.Status == 1) {
                var op = ""
                for (let i = 0; i < data.Result.length; i++) {
                    const e = data.Result[i];
                    op += "<option value=" + e.ID + ">" + e.TypeName + "</option>"
                }
                $(".productType").html(op)
            }
            else {
                var txt = data.Result;
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
            }
        }
    });
}

// 判断是否是点击操作进入
if (getCookie("ProductListID")) {
    var urlIsEn = window.location.href.split("isEnglish=")[1]
    getType(urlIsEn)
    // 获取详情
    getDetail()
    function getDetail() {
        $.ajax({
            type: "get",
            url: mainurl + "api/ProductList/GetBackjProdDetail?prodID=" + getCookie("ProductListID"),
            async: true,
            success: function (data) {
                if (data.Status == 1) {
                    $(".Name").val(data.Result.Title)
                    SmallImgUrl = data.Result.Image
                    BigmgUrl = data.Result.SubImage
                    $(".upImg1").attr("src", mainurl + data.Result.Image)
                    $(".upImg2").attr("src", mainurl + data.Result.SubImage)
                    $(".Discribe").val(decodeURIComponent(data.Result.Discribe))
                    $(".languageType").val(data.Result.IsEnglish)                    
                    var valueId = data.Result.TypeID
                    $(".productType option[value="+valueId+"]").attr("selected", "selected");
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
                }
                else {
                    var txt = data.Result;
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                }
            }
        });
    }

    // 编辑提交
    function savePro() {
        var Title = $(".Name").val()
        var Image = SmallImgUrl
        var SubImage = BigmgUrl
        var Discribe = encodeURIComponent($(".Discribe").val())
        var IsEnglish = $(".languageType").val()
        var detail2 = encodeURIComponent(ue2.getContent())
        var Content = detail2
        $.ajax({
            type: "post",
            url: mainurl + "api/ProductList/EditProdList",
            dataType: "json",
            data: {
                "prodListID": getCookie("ProductListID"),
                "token": getCookie("token"),
                "typeID": $(".productType").val(),
                "Title": Title,
                "IsEnglish": IsEnglish,
                "Image": Image,
                "SubImage": SubImage,
                "Content": Content,
                "Discribe": Discribe
            },
            async: true,
            success: function (data) {
                if (data.Status == 1) {
                    delCookie("ProductListID")
                    var txt = data.Result;
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                    setTimeout(() => {
                        window.location.href = "GetProdListIndex.html"
                    }, 700);
                } else {
                    var txt = data.Result;
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                }
            }
        });
    }
}
else {
    getType(0)// 默认中文 0
    // 添加提交
    function savePro() {
        var Title = $(".Name").val()
        var Image = SmallImgUrl
        var SubImage = BigmgUrl
        var Discribe = encodeURIComponent($(".Discribe").val())
        var IsEnglish = $(".languageType").val()
        var detail2 = encodeURIComponent(ue2.getContent())
        var Content = detail2
        $.ajax({
            type: "post",
            url: mainurl + "api/ProductList/AddProdList",
            dataType: "json",
            data: {
                "token": getCookie("token"),
                "typeID": $(".productType").val(),
                "Title": Title,
                "IsEnglish": IsEnglish,
                "Image": Image,
                "SubImage": SubImage,
                "Content": Content,
                "Discribe": Discribe
            },
            async: true,
            success: function (data) {
                if (data.Status == 1) {
                    delCookie("ProductListID")
                    var txt = data.Result;
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                    setTimeout(() => {
                        window.location.href = "GetProdListIndex.html"
                    }, 700);
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
