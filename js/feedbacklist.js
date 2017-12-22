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
        url: mainurl + "/api/Feedback/GetListByPage?Token=" + token + "&PageIndex=" + pageindex + "&PageSize=10&Keyword=" + keyword + "&StartTime=" + starttime + "&EndTime=" + endtime + "&Status=" + status,
        dataType: "json",
        success: function (data) {
            if (data.Status == 1) {
                var li = '';
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
                        <tr id="${list[i].ID}">
                            <td>${list[i].UserName}</td>
                            <td>${list[i].UserPhone}</td>
                            <td>${list[i].ContactName}</td>
                            <td>${list[i].ContactPhone}</td>
                            <td>${list[i].CreateTime}</td>
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

// 关闭模态框
$(".closeBtn").click(function () {
    $("#noDeal").modal("hide")
    $("#isDeal").modal("hide")
})
// 点击处理
function dealBtn(e) {
    var id = $(e).parents("tr").attr("id");
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
                            "ID": id,
                            "DealTime": DealTime,
                            "DealWay": DealWay,
                            "DealNote": DealNote == "" ? -1 : DealNote,
                        },
                        dataType: "json",
                        success: function (data) {
                            if (data.Status == 1) {
                                var txt = data.Result;
                                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                                hqhf(1, -1, -1, -1, -1)
                            } else if (data.Status == 40001) {
                                var txt = data.Result;
                                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
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


    })
}

// 查看已处理信息
function alreadyDeal(e) {
    var id = $(e).parents("tr").attr("id");
}