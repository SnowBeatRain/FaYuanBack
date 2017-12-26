var ExcelUrl = "",
    pageindex,
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
        url: mainurl + "/api/User/GetListByPage?Token=" + token + "&PageIndex=" + pageindex + "&PageSize=10&Phone=" + keyword + "&StartTime=" + starttime + "&EndTime=" + endtime,
        dataType: "json",
        success: function (data) {
            if (data.Status == 1) {
                var li = '';
                var list = data.Result.Data;
                var page = data.Result.PageIndex;
                lastPage = data.Result.PageIndex;
                for (var i = 0; i < list.length; i++) {
                    // 操作
                    var d = ""
                    if (list[i].IsLock) {
                        d = `<span class="noFreez" onclick="noFreez(this)">解除冻结</span>`
                    } else {
                        d = `<span class="dealBtn" onclick="isFreez(this)">冻结</span>`
                    }
                    li += `
                    <tr id="${list[i].ID}">
                    <td>${list[i].NickName}</td>
                    <td>${list[i].Phone}</td>
                    <td>${list[i].CreateTime.split(".")[0].replace("T", " ")}</td>
                    <td>${list[i].IsLock ? "已冻结" : "未冻结"}</td>
                    <td>
                        ${d}
                    </td>
                </tr>
                    `
                }
                $("#feedBacklist tbody").html(li)
                getpage(pageindex, page, keyword, starttime, endtime);
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
function getpage(a, c, b, d) {
    $(".tcdPageCode").createPage({
        pageCount: c,
        current: a,
        backFn: function (p) {
            hqhf(p, b, d)
        }
    });
}

// 关闭模态框
$(".closeBtn").click(function () {
    $("#noDeal").modal("hide")
    $("#isDeal").modal("hide")
})
// 点击处理

function isFreez(e) {
    var id = $(e).parents("tr").attr("id");
    var txt = "确定冻结吗？";
    var option = {
        title: "提示",
        btn: parseInt("0011", 2),
        onOk: function () {
            $.ajax({
                type: "get",
                url: mainurl + "api/User/LockOrCancel?Token=" + token + "&ID=" + id,
                dataType: "json",
                success: function (data) {
                    if (data.Status == 1) {
                        var txt = data.Result;
                        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                        hqhf(pageindex, keyword, starttime, endtime, status);
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
// 解除冻结
function noFreez(e) {
    var id = $(e).parents("tr").attr("id");
    var txt = "确定解除冻结吗？";
    var option = {
        title: "提示",
        btn: parseInt("0011", 2),
        onOk: function () {
            $.ajax({
                type: "get",
                url: mainurl + "api/User/LockOrCancel?Token=" + token + "&ID=" + id,
                dataType: "json",
                success: function (data) {
                    if (data.Status == 1) {
                        var txt = data.Result;
                        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                        hqhf(pageindex, keyword, starttime, endtime, status);
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

// 查看已处理信息
function alreadyDeal(e) {
    var id = $(e).parents("tr").attr("id");
}

/*
 * 导入excel
 */
function FileIn() {
    var formdata = new FormData();
    formdata.append("file", $("#file")[0].files[0]);//获取文件法二
    // var lay = layer.load();
    $.ajax({
        type: 'post',
        url: mainurl + "api/Tool/FileUploaderForAdmin?type=1&Token=" + getCookie('token'),
        data: formdata,
        cache: false,
        processData: false,
        contentType: false,
        success: function (data) {
            // layer.close(lay)
            if (data.Status == 1) {
                // layer.msg("上传Excel表成功")
                ExcelUrl = data.Result[0]
                $.ajax({
                    type: 'get',
                    url: mainurl + 'api/User/ImportByExcel?Token=' + getCookie("token") + '&uri=' + ExcelUrl,
                    data: formdata,
                    cache: false,
                    processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
                    contentType: false, // 不设置Content-type请求头
                    success: function (data) {
                        if (data.Status == 1) {
                            var txt = data.Result;
                            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                            setTimeout('later()', 1000);
                        } else {
                            var txt = data.Result;
                            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                        }
                    }
                })
            }
            else {
                var txt = data.Result;
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
            }
        }
    })
}
function later() {
    location.href = "userlist.html";
}