var pageindex,
    keyword,
    starttime,
    endtime,
    status;
// 总列表 方便获取详情
var AllList = []
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
        url: mainurl + "/api/Feedback/GetListByPage?Token=" + token + "&PageIndex=" + pageindex + "&PageSize=10&Keyword=" + keyword + "&StartTime=" + starttime + "&EndTime=" + endtime + "&Status=" + status,
        dataType: "json",
        success: function (data) {
            if (data.Status == 1) {
                var li = '';
                AllList = data.Result.Data;
                var list = data.Result.Data;
                var page = data.Result.PageIndex;
                lastPage = data.Result.PageIndex;
                for (var i = 0; i < list.length; i++) {
                    // 判断是否处理
                    var s = ""
                    if (list[i].Status == 0) {
                        s = `<span>未处理</span>`
                    } else {
                        s = `<a>
                        <span class="alreadyDeal" style="color:#0161BB;" onclick="alreadyDeal(this)" data-toggle="modal" data-target="#isDeal">已处理></span>    
                        </a>`
                    }
                    // 操作
                    var d = ""
                    if (list[i].Status == 0) {
                        d = `<span class="dealBtn" onclick="dealBtn(this)" data-toggle="modal" data-target="#noDeal">处理</span>`
                    } else {
                        d = ``
                    }
                    li += `
                        <tr id="${list[i].ID}" name="${i}">
                            <td>${list[i].UserName}</td>
                            <td>${list[i].UserPhone}</td>
                            <td>${list[i].ContactName}</td>
                            <td>${list[i].ContactPhone}</td>
                            <td>${list[i].CreateTime.split(".")[0].replace("T", " ")}</td>
                            <td>${list[i].Title}</td>
                            <td>
                                ${s}
                            </td>
                            <td>
                                ${d}
                            </td>
                        </tr>
                        `
                }
                $("#feedBacklist tbody").html(li)
                getpage(pageindex, page, keyword, starttime, endtime, status);
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
    endtime = $("#endTime").val() == "" ? -1 : $("#endTime").val()
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
function getpage(a, c, b, d, e, f) {
    $(".tcdPageCode").createPage({
        pageCount: c,
        current: a,
        backFn: function (p) {
            hqhf(p, b, d, e, f)
        }
    });
}

// 关闭模态框
$(".closeBtn").click(function () {
    $("#noDeal").modal("hide")
    $("#isDeal").modal("hide")
})
// 点击处理
var dealId = ""
function dealBtn(e) {
    dealId = $(e).parents("tr").attr("id");
    var name = $(e).parents("tr").attr("name");
    $(".noFeedPeople").html(AllList[name].UserName)
    $(".noFeedPhone").html(AllList[name].UserPhone)
    $(".noFeedText").html(AllList[name].Title)

}
$(".Deal").on("click", function () {
    var DealTime = $("#DealTime").val()
    var DealWay = $("#DealWay").val()
    var DealNote = $("#DealNote").val()
    if (DealTime == "" || DealWay == "") {
        var txt = "请完善信息";
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
    } else {
        var txt = "确定处理吗？";
        var option = {
            title: "提示",
            btn: parseInt("0011", 2),
            onOk: function () {
                $.ajax({
                    type: "post",
                    url: mainurl + "/api/Feedback/Deal?Token=" + token,
                    data: {
                        "ID": dealId,
                        "DealTime": DealTime,
                        "DealWay": DealWay,
                        "DealNote": DealNote == "" ? -1 : DealNote,
                    },
                    dataType: "json",
                    success: function (data) {
                        if (data.Status == 1) {
                            // 处理成功 清空数据
                            $("#DealTime").val("")
                            $("#DealWay").val("")
                            $("#DealNote").val("")
                            $("#noDeal").modal("hide")
                            var txt = data.Result;
                            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                            hqhf(1, -1, -1, -1, -1)
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


})
// 查看已处理信息
function alreadyDeal(e) {
    var id = $(e).parents("tr").attr("id");
    var name = $(e).parents("tr").attr("name");
    $(".isFeedPeople").html(AllList[name].UserName)
    $(".isFeedPhone").html(AllList[name].UserPhone)
    $(".isFeedText").html(AllList[name].Title)
    $(".DealTime").html(AllList[name].DealTime.split("T")[0])
    $(".DealWay").html(AllList[name].DealWay)
    $(".DealNote").html(AllList[name].DealNote)
}