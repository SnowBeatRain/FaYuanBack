var pageindex,
    keyword,
    starttime,
    endtime,
    status;
var lastPage = ''
$(function () {
    pageindex = 1;
    keyword = -1;
    starttime = -1;
    endtime = -1;
    status = -1;
    if (location.href.indexOf("pageindex") > 0) {
        pageindex = location.href.split('pageindex=')[1];
    }
    hqhf(pageindex, keyword, starttime, endtime, status);
})

function hqhf(pageindex, keyword, starttime, endtime, status) {
    $.ajax({
        type: "get",
        url: mainurl + "/api/Activity/GetListByPage?Token=" + token + "&PageIndex=" + pageindex + "&PageSize=10&Keyword=" + keyword + "&StartTime=" + starttime + "&EndTime=" + endtime + "&Status=" + status,
        dataType: "json",
        success: function (data) {
            if (data.Status == 1) {
                var li = '';
                var list = data.Result.Data;
                var page = data.Result.PageIndex;
                lastPage = data.Result.PageIndex;
                for (var i = 0; i < list.length; i++) {
                    li += `
                    <tr id="${list[i].ID}">
                        <td>${list[i].ContactName}</td>
                        <td>${list[i].ContactPhone}</td>
                        <td>${list[i].CreateTime}</td>
                        <td>${list[i].Title}</td>
                        <td>
                            <img src="image/xiangqing.png" alt=""  onclick="editInfo(this)">
                            <img src="image/shanchu.png" onclick="DeleteInfo(this)" alt="">
                        </td>
                    </tr>
                    `
                }
                $("#feedBacklist tbody").html(li)
                getpage(pageindex, page, keyword, starttime, endtime, status);
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

/*
* 关键字搜索
*/
function KeySearch() {
    starttime = $("#startTime").val() == "" ? -1 : $("#startTime").val()
    endtime = $("#endtime").val() == "" ? -1 : $("#endtime").val()
    status = $(".status").val()
    keyword = $("#orderSearch").val() == "" ? -1 : $("#orderSearch").val()
    hqhf(1, keyword, starttime, endtime, status)
}
/*
* 重置
*/
function ResetOrderIndex() {
    $("#startTime").val("")
    $("#endTime").val("")
    $(".status").val(-1)
    $("#orderSearch").val("")
    hqhf(1, -1, -1, -1, -1)
}
function getpage(a, c, b, d, e) {
    $(".tcdPageCode").createPage({
        pageCount: c,
        current: a,
        backFn: function (p) {
            hqhf(p, b, d, e)
        }
    });
}

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

// 添加
function addInfo() {
    delCookie("InfoID")
    window.location.href = "InfoEdit.html"
}
// 修改
function editInfo(e) {
    var id = $(e).parents("tr").attr("id")
    setCookie("InfoID", $(e).parents("tr").attr("id"), "d30")
    window.location.href = "InfoEdit.html"
}