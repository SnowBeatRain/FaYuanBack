var pageindex;
var lastPage = ''
$(function () {
    pageindex = 1;
    if (location.href.indexOf("pageindex") > 0) {
        pageindex = location.href.split('pageindex=')[1];
    }
    hqhf(pageindex);
})

function hqhf(pageindex) {
    $.ajax({
        type: "get",
        url: mainurl + "/api/Feedback/GetFeedBackIndex?Token=" + token + "&PageIndex=" + pageindex + "&PageSize=10",
        dataType: "json",
        success: function (data) {
            if (data.Status == 1) {
                var li = '';
                var list = data.Result.FeedBackList;
                var page = data.Result.Page;
                lastPage = data.Result.Page;
                for (var i = 0; i < list.length; i++) {
                    li += `
                        <tr id="${list[i].ID}">
                            <td>${list[i].Content}</td>
                            <td>${list[i].Phone}</td>
                            <td>${list[i].CreateTime}</td>
                            <td>
                                <img src="${list[i].IsHandle == 1 ? "image/yes.png" : "image/no.png"}" alt="">
                            </td>
                            <td>
                                <button onclick="Detail(this)" class="noDeal" data-toggle="modal" data-target="#sendGoods">详情</button>
                                <button onclick="Delete(this)" class="delete_btn">删除</button>
                            </td>
                        </tr>
                        `
                }
                $("tbody").html(li)
                getpage(pageindex, page);
            } else if (data.Status == 40001) {
                alert(data.Result)
                window.location.href = "login.html"
            } else {
                alert(data.Result)
            }
        },
        error: function () {
            alert("服务器异常")
        }
    });
}

function getpage(a, c) {
    $(".tcdPageCode").createPage({
        pageCount: c,
        current: a,
        backFn: function (p) {
            hqhf(p)
        }
    });
}

// 点击模态框获取详情
function Detail(e) {
    var id = $(e).parents("tr").attr("id");
    $.ajax({
        type: "get",
        url: mainurl + "/api/Feedback/FeedBackDetail?token=" + token + "&feedID=" + id,
        dataType: "json",
        success: function (data) {
            if (data.Status == 1) {
                $("#content").val(data.Result.Content)
                $("#people").val(data.Result.Phone)
                $("input[type='radio']")[data.Result.IsHandle == 0 ? 1 : 0].checked = "checked"

                // 点击处理
                $(".blocka").on("click", function () {
                    var Handle = $("input[type='radio']:checked").val()
                    $.ajax({
                        type: "get",
                        url: mainurl + "/api/Feedback/HandleFeedBack?token=" + token + "&feedID=" + id + "&Handle=" + Handle,
                        dataType: "json",
                        success: function (data) {
                            if (data.Status == 1) {
                                var txt = data.Result;
                                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                                setTimeout(() => {
                                    window.location.href = window.location.href

                                }, 500);
                            } else {
                                var txt = data.Result;
                                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                            }
                        },
                        error: function () {
                            var txt = "服务器异常";
                            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                        }
                    });
                })
            } else {
                var txt = data.Result;
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
            }
        },
        error: function () {
            var txt = "服务器异常";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
        }
    });

}

// 删除
function Delete(e) {
    var id = $(e).parents("tr").attr("id");
    var txt = "确定删除吗？";
    var option = {
        title: "提示",
        btn: parseInt("0011", 2),
        onOk: function () {
            $.ajax({
                type: "get",
                url: mainurl + "/api/Feedback/DelFeed?token=" + token + "&feedID=" + id,
                dataType: "json",
                success: function (data) {
                    if (data.Status == 1) {
                        hqhf(1)
                    } else if (data.Status == 40001) {
                        alert(data.Result)
                        window.location.href = "login.html"
                    } else {
                        var txt = data.Result;
                        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                    }
                },
                error: function () {
                    var txt = "服务器异常";
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                }
            });
        }
    }
    window.wxc.xcConfirm(txt, "custom", option);
}