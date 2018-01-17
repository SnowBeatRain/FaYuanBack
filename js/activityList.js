var pageindex,
    keyword,
    starttime,
    endtime;
var lastPage = ''
$(function () {
    pageindex = 1;
    keyword = -1;
    starttime = -1;
    endtime = -1;
    if (location.href.indexOf("pageindex") > 0) {
        pageindex = location.href.split('pageindex=')[1];
    }
    hqhf(pageindex, keyword, starttime, endtime);
})

function hqhf(pageindex, keyword, starttime, endtime) {
    $.ajax({
        type: "get",
        url: mainurl + "/api/Activity/GetListByPage?Token=" + token + "&PageIndex=" + pageindex + "&PageSize=5&Keyword=" + keyword + "&StartTime=" + starttime + "&EndTime=" + endtime,
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
                        <td><img class="ProImg" src="${list[i].Image}" alt="展示图"></td>
                        <td>${list[i].Title}</td>
                        <td>${list[i].CreateTime.split(".")[0].replace("T", " ")}</td>
                        <td>${list[i].ViewCount}</td>
                        <td>
                            <button class='${list[i].IsShow ? ' isShow' : 'noShow'}'} > ${list[i].IsShow ? '是' : '否'} <button>
                        </td >
                    <td><button class="sendMsg" onclick="sendMsg(this)">发送<button></td>
                        <td>
                            <img src="image/xiangqing.png" alt="" onclick="editInfo(this)">
                                <img src="image/shanchu.png" onclick="DeleteInfo(this)" alt="">
                        </td>
                    </tr>
                            `
                }
                $("#feedBacklist tbody").html(li)
                getpage(pageindex, page, keyword, starttime, endtime);
<<<<<<< HEAD
                // 展示
                $(".isShow").on('click', '', function (e) {
                    var id = $(e.target).parents("tr").attr("id")
                    $.ajax({
                        type: "get",
                        url: mainurl + "api/Activity/ShowSwitch?Token=" + getCookie("token") + "&ID=" + id,
                        dataType: "json",
                        async: true,
                        success: function (data) {
                            if (data.Status == 1) {
                                var txt = data.Result;
                                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                                hqhf(pageindex, keyword, starttime, endtime)
                            } else {
                                var txt = data.Result;
                                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                            }
                        }
                    });
                })
                $(".noShow").on('click', '', function (e) {
                    var id = $(e.target).parents("tr").attr("id")
                    $.ajax({
                        type: "get",
                        url: mainurl + "api/Activity/ShowSwitch?Token=" + getCookie("token") + "&ID=" + id,
                        dataType: "json",
                        async: true,
                        success: function (data) {
                            if (data.Status == 1) {
                                var txt = data.Result;
                                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                                hqhf(pageindex, keyword, starttime, endtime)
                            } else {
                                var txt = data.Result;
                                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                            }
                        }
                    });
                })
=======
>>>>>>> 92f8ed945e88f818bd4f7b7253341f9ac2f4ee47
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

/*
* 关键字搜索
*/
function KeySearch() {
    starttime = $("#startTime").val() == "" ? -1 : $("#startTime").val()
    endtime = $("#endTime").val() == "" ? -1 : $("#endTime").val()
    keyword = $("#orderSearch").val() == "" ? -1 : $("#orderSearch").val()
    hqhf(1, keyword, starttime, endtime)
}
/*
* 重置
*/
function ResetOrderIndex() {
    $("#startTime").val("")
    $("#endTime").val("")
    $("#orderSearch").val("")
    hqhf(1, -1, -1, -1)
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

function DeleteInfo(e) {
    var id = $(e).parents("tr").attr("id");
    var txt = "确定删除吗？";
    var option = {
        title: "提示",
        btn: parseInt("0011", 2),
        onOk: function () {
            $.ajax({
                type: "get",
                url: mainurl + "api/Activity/Del?Token=" + token + "&ID=" + id,
                dataType: "json",
                success: function (data) {
                    if (data.Status == 1) {
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

// 添加
function addInfo() {
    delCookie("InfoID")
    window.location.href = "InfoEdit.html"
}
// 修改
function editInfo(e) {

    setCookie("InfoID", $(e).parents("tr").attr("id"), "d30")
    window.location.href = "InfoEdit.html"
}
// 发短信
function sendMsg(e) {
    var id = $(e).parents("tr").attr("id")
    $.ajax({
        type: "post",
        url: mainurl + "api/Activity/SendSMS?Token=" + getCookie("token") + "&ID=" + id,
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