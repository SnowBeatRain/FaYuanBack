
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

// 是否内链
var linkType = 0   //内链
function shangjia() {
    $(".shangjia").attr("src", "image/yes.png")
    $(".weishangjia").attr("src", "image/no.png")
    $(".linkIn").show()
    $(".linkOut").hide()
    linkType = 0
}
function weishangjia() {
    $(".weishangjia").attr("src", "image/yes.png")
    $(".shangjia").attr("src", "image/no.png")
    linkType = 1
    $(".linkOut").show()
    $(".linkIn").hide()
}

// 判断是否是点击操作进入
if (getCookie("InfoID")) {
    $(".sendMsg").show()
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
                    $(".Link").val(data.Result.Link)
                    
                    // 判断是否短信
                    if (data.Result.Type == 0) {  //内链
                        $(".shangjia").attr("src", "image/yes.png")
                        $(".weishangjia").attr("src", "image/no.png")
                        $(".linkOut").hide()
                        $(".linkIn").show()
                    } else {
                        $(".shangjia").attr("src", "image/no.png")
                        $(".weishangjia").attr("src", "image/yes.png")
                        $(".linkOut").show()
                        $(".linkIn").hide()
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
        var Link = $(".Link").val().trim()
        var Detail = detail1
        var Image = SmallImgUrl
        if (linkType == 1) {
            if (Name && SmallImgUrl && Link) {
                var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
                if (!reg.test(Link)) {
                    var txt = "请检查外链是否正确";
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                } else {
                    $.ajax({
                        type: "post",
                        url: mainurl + "api/Activity/AddOrUpdate?Token=" + getCookie("token"),
                        dataType: "json",
                        data: {
                            "ID": getCookie("InfoID"),
                            "Title": Name,
                            "Url": SmallImgUrl,
                            "Type": linkType,
                            "Link": Link,
                            "IsSend": false,
                            "Content": ""
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

            } else {
                var txt = "请检查是否填写完整";
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
            }
        } else {
            if (Name && SmallImgUrl && Detail) {
                $.ajax({
                    type: "post",
                    url: mainurl + "api/Activity/AddOrUpdate?Token=" + getCookie("token"),
                    dataType: "json",
                    data: {
                        "ID": getCookie("InfoID"),
                        "Title": Name,
                        "Url": SmallImgUrl,
                        "Type": linkType,
                        "Link": "",
                        "IsSend": false,
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
            } else {
                var txt = "请检查是否填写完整";
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
            }
        }

    }
    function sendMsg() {
        $.ajax({
            type: "post",
            url: mainurl + "api/Activity/SendSMS?Token=" + getCookie("token") + "&ID=" + getCookie("InfoID"),
            dataType: "json",
            async: true,
            success: function (data) {
                if (data.Status == 1) {
                    var txt = data.Result;
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                } else {
                    var txt = data.Result;
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                }
            }
        });
    }
}
else {
    $(".sendMsg").hide()
    // 添加提交
    function savePro() {
        var Name = $(".Name").val()
        var Detail = detail1 == "" ? encodeURIComponent("这里你的初始化内容") : detail1
        var Link = $(".Link").val().trim()
        var Image = SmallImgUrl
        if (linkType == 1) {
            if (Name && SmallImgUrl && Link) {
                var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
                if (!reg.test(Link)) {
                    var txt = "请检查外链是否正确";
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                } else {
                    $.ajax({
                        type: "post",
                        url: mainurl + "api/Activity/AddOrUpdate?Token=" + getCookie("token"),
                        dataType: "json",
                        data: {
                            "Title": Name,
                            "Url": SmallImgUrl,
                            "Type": linkType,
                            "Link": Link,
                            "IsSend": false,
                            "Content": ""
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
            } else {
                var txt = "请检查是否填写完整";
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
            }
        } else {
            if (Name && SmallImgUrl && Detail) {
                $.ajax({
                    type: "post",
                    url: mainurl + "api/Activity/AddOrUpdate?Token=" + getCookie("token"),
                    dataType: "json",
                    data: {
                        "Title": Name,
                        "Url": SmallImgUrl,
                        "Type": linkType,
                        "Link": "",
                        "IsSend": false,
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
            } else {
                var txt = "请检查是否填写完整";
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
            }
        }
    }
}

function guanbi1() {
    SmallImgUrl = ""
    $(".upImg1").attr("src", "./image/tu.png")
    $(".guanbi1").hide()
}
