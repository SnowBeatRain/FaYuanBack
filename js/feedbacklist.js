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
        url: mainurl + "/api/P_Plat/FeedBackList?Token=" + token + "&PageIndex=" + pageindex + "&PageSize=1",
        dataType: "json",
        success: function (data) {
            if (data.Status == 1) {
                var li = '';
                var list = data.Result.Data;
                var page = data.Result.PageCount;
                lastPage = data.Result.PageCount;
                for (var i = 0; i < list.length; i++) {
                    li += `
                        <tr id="${list[i].ID}">
                            <td>${list[i].Contact}</td>
                            <td>${list[i].Content}</td>
                            <td>${list[i].Time}</td>
                            <td>
                                <img src="${list[i].IsDeal ? "image/yes.png" : "image/no.png"}" alt="">
                            </td>
                            <td>
                                <button class="${list[i].IsDeal ? 'isDeal' : 'noDeal'}">处理</button>
                                <button onclick="Delete(this)" class="delete_btn" onclick="Delete()">删除</button>
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

$(".noDeal").on("click", function (e) {
    var id = $(e.target).parents("tr").attr("id");
    var txt = "确定处理吗？";
    var option = {
        title: "提示",
        btn: parseInt("0011", 2),
        onOk: function () {
            $.ajax({
                type: "get",
                url: mainurl + "/api/P_Plat/Deal?Token=" + token + "&ID=" + id,
                dataType: "json",
                success: function (data) {
                    if (data.Status == 1) {
                        alert(data.Result)
                        hqhf(1)
                        $(e.target).removeClass("noDeal")
                        $(e.target).addClass("isDeal")
                        
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
})
// function Deal(e) {

// }
function Delete(e) {
    var id = $(e).parents("tr").attr("id");
    var txt = "确定删除吗？";
    var option = {
        title: "提示",
        btn: parseInt("0011", 2),
        onOk: function () {
            $.ajax({
                type: "get",
                url: mainurl + "/api/P_Plat/Delete?Token=" + token + "&ID=" + id,
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