
var SmallImgUrl = ""

// 上传图片
function upSmallImg() {
    var formdata = new FormData();
    formdata.append("file", $(".upImg_small")[0].files[0]);//获取文件法二
    var lay = layer.load();
    $.ajax({
        type: 'post',
        url: mainurl + "api/Tool/FileUploader?type=0&Token=" + getCookie('token'),
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
            type: "post",
            url: mainurl + "api/P_Mall/ProductDetail?ID=" + getCookie("InfoID"),
            dataType: "json",
            async: true,
            success: function (data) {
                if (data.Status == 1) {
                    var Name = $(".Name").val(data.Result.Name)
                    var EName = $(".EName").val(data.Result.EName)
                    var Intro = $(".Intro").val(data.Result.Intro)
                    var EIntro = $(".EIntro").val(data.Result.EIntro)
                    var Price = $(".Price").val(data.Result.Price)
                    var Stock = $(".Stock").val(data.Result.Stock)
                    // 判断是否短信
                    if (data.Result.IsOnSale) {
                        $(".shangjia").attr("src", "image/yes.png")
                        $(".weishangjia").attr("src", "image/no.png")
                    } else {
                        $(".shangjia").attr("src", "image/no.png")
                        $(".weishangjia").attr("src", "image/yes.png")
                    }
                    // 判断大小图
                    if (data.Result.Image) {
                        $(".upImg1").attr("src", mainurl + data.Result.Image)
                        SmallImgUrl = data.Result.Image
                    }
                    // 编辑器内容
                    if (data.Result.Detail != null) {
                        ue1 = UE.getEditor('container1');
                        detail1 = data.Result.Detail
                        ue1.ready(function () {
                            this.setContent(decodeURIComponent(data.Result.Detail));
                        })
                    } else {
                        ue1 = UE.getEditor('container1');
                        ue1.ready(function () {
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
        var EName = $(".EName").val()
        var Intro = $(".Intro").val()
        var EIntro = $(".EIntro").val()
        var Price = $(".Price").val()
        var Stock = $(".Stock").val()
        var Detail = detail1
        var EDetail = detail2
        var Image = SmallImgUrl
        var Image2 = BigmgUrl
        $.ajax({
            type: "post",
            url: mainurl + "api/P_Mall/AddOrEditProduct?Token=" + getCookie("token"),
            dataType: "json",
            data: {
                "ID": getCookie("InfoID"),
                "Name": Name,
                "EName": EName,
                "Image": Image,
                "Image2": Image2,
                "Intro": Intro,
                "EIntro": EIntro,
                "Price": Price,
                "Stock": Stock,
                "IsOnSale": sendMsg,
                "Detail": Detail,
                "EDetail": EDetail,
            },
            async: true,
            success: function (data) {
                if (data.Status == 1) {

                    delCookie("InfoID")
                    window.location.href = "ProductList.html"
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
        var EName = $(".EName").val()
        var Intro = $(".Intro").val()
        var EIntro = $(".EIntro").val()
        var Price = $(".Price").val()
        var Stock = $(".Stock").val()
        var Detail = detail1
        var EDetail = detail2
        var Image = SmallImgUrl
        var Image2 = BigmgUrl
        $.ajax({
            type: "post",
            url: mainurl + "api/P_Mall/AddOrEditProduct?Token=" + getCookie("token"),
            dataType: "json",
            data: {
                "Name": Name,
                "EName": EName,
                "Image": Image,
                "Image2": Image2,
                "Intro": Intro,
                "EIntro": EIntro,
                "Price": Price,
                "Stock": Stock,
                "IsOnSale": sendMsg,
                "Detail": Detail,
                "EDetail": EDetail,
            },
            async: true,
            success: function (data) {
                if (data.Status == 1) {
                    window.location.href = "ProductList.html"
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

function guanbi1(){
    SmallImgUrl = ""
    $(".upImg1").attr("src", "./image/tu.png")
    $(".guanbi1").hide()
}
