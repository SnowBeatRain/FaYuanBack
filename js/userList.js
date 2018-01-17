var ExcelUrl = "",
    pageindex,
    keyword,
    starttime,
    endtime;
var lastPage = '';
// 选中用户的id数组
var userListID = []
$(function () {
    pageindex = 1;
    keyword = -1;
    starttime = -1;
    endtime = -1;
    pagesize = 10;
    if (location.href.indexOf("pageindex") > 0) {
        pageindex = location.href.split('pageindex=')[1];
    }
    hqhf(pageindex, pagesize, keyword, starttime, endtime);
    $(".downUrl").attr("href", mainurl + "images/%E7%94%A8%E6%88%B7%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xls")
})

function hqhf(pageindex, pagesize, keyword, starttime, endtime, status) {
    $.ajax({
        type: "get",
        url: mainurl + "/api/User/GetListByPage?Token=" + token + "&PageIndex=" + pageindex + "&PageSize=" + pagesize + "&Phone=" + keyword + "&StartTime=" + starttime + "&EndTime=" + endtime,
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
                    <td>
                    <input type="checkbox" name="check">
                    </td>
                    <td>${list[i].NickName}</td>
                    <td>${list[i].Phone}</td>
                    <td>${list[i].CreateTime.split(".")[0].replace("T", " ")}</td>
                    <td>${list[i].IsLock ? "已冻结" : "未冻结"}</td>
                    <td>
                        ${d}
                        <img src='image/xiangqing.png' class='edit_img' data-toggle='modal' data-target='#myModal' name="${i}" id="${list[i].ID}" />
                    </td>
                </tr>
                    `
                }
                $("#feedBacklist tbody").html(li)
                getpage(pageindex, page, pagesize, keyword, starttime, endtime);
                //编辑
                $(".edit_img").each(function () {
                    $(this).click(function () {
                        RoleID = $(this).attr("id");
                        var indexNum = $(this).attr("name");
                        $("#myModalLabel").text("修改管理员")
                        $(".blocka").hide();
                        $(".guanbi").hide()
                        $(".none").show();
                        $(".delete").show()
                        $("#Name").val(list[indexNum].NickName)
                        $("#Phone").val(list[indexNum].Phone)
                    })
                })
                // 全选
                // 全选
                $("#checkAll").click(function () {
                    var isChecked = $("#checkAll").prop("checked");
                    $("#checkList input").prop("checked", isChecked);
                });
                $("input[name = 'check']").click(function () {
                    // 判断选中的数量是否等于全部，从而决定全选是否选中
                    var allLength = $("#checkList input").length;
                    var checkedLength = $("#checkList input:checked").length;
                    if (allLength == checkedLength) {
                        $("#checkAll").prop("checked", true);
                    } else {
                        $("#checkAll").prop("checked", false);
                    }
                });
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
// 改变每页数量
function changePageSize() {
    $("#checkAll").prop("checked", false);
    console.log($("#selectSize").val())
    hqhf(pageindex, $("#selectSize").val(), keyword, starttime, endtime);
}
// 点击发送短信获取用户id
function openMsgModal() {
    userListID = []
    var allLength = $("#checkList tr input");
    for (let m = 0; m < allLength.length; m++) {
        if ($(allLength[m]).is(':checked')) {
            var ID = $(allLength[m]).parents('tr').attr('id');
            userListID.push(ID);
        }
    }
}
// 发送短信
function sendImsg() {
    var users = userListID.join(",")
    var content = $("#msgContent").val().trim()
    if (userListID.length > 0) {
        if (content) {
            $.ajax({
                type: "post",
                url: mainurl + "api/User/SendSMS?Token=" + token,
                data: {
                    "Users": users,
                    "Content": content
                },
                dataType: "json",
                success: function (data) {
                    if (data.Status == 1) {
                        $("#sendMsg").modal("hide")
                        var txt = data.Result;
                        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                        hqhf(pageindex, pagesize, keyword, starttime, endtime);
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
        } else {
            var txt = "请输入信息内容";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
        }

    } else {
        $("#sendMsg").modal("hide")
        var txt = "请选择用户";
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
    }

}
/*
* 关键字搜索
*/
function KeySearch() {
    starttime = $("#startTime").val() == "" ? -1 : $("#startTime").val()
    endtime = $("#endTime").val() == "" ? -1 : $("#endTime").val()
    keyword = $("#orderSearch").val() == "" ? -1 : $("#orderSearch").val()
    hqhf(1, pagesize, keyword, starttime, endtime)
}
/*
* 重置
*/
function ResetOrderIndex() {
    $("#startTime").val("")
    $("#endTime").val("")
    $("#orderSearch").val("")
    hqhf(1, 10, -1, -1, -1)
}
function getpage(a, c, s, k, k, d) {
    $(".tcdPageCode").createPage({
        pageCount: c,
        current: a,
        backFn: function (p) {
            hqhf(p, s, k, k, d)
        }
    });
    $("#checkAll").prop("checked", false);
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
                        hqhf(pageindex, pagesize, keyword, starttime, endtime, status);
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
                        hqhf(pageindex, pagesize, keyword, starttime, endtime);
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

// 点击添加
function addmanage() {
    $(".blocka").show();
    $(".none").hide();
    $(".delete").hide()
    $(".guanbi").show()
    $("#Name").val("")
    $("#Phone").val("")
    $("#myModalLabel").text("新增用户")
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
// 添加保存
function save() {
    var Name = $("#Name").val()
    var Phone = $("#Phone").val()
    var test = /^1[3|4|5|8][0-9]\d{4,8}$/
    if (Name == "" || Phone == "") {
        var txt = "请完善数据";
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
    } else {
        if (test.test(Phone)) {

            $.ajax({
                url: mainurl + 'api/User/Add?Token=' + getCookie("token") + '&Name=' + Name + '&Phone=' + Phone,
                type: 'get',
                error: function () {
                    var txt = "数据加载错误";
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                },
                success: function (data) {
                    if (data.Status == 1) {
                        var txt = data.Result;
                        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                        $("#myModal").modal('hide');
                        hqhf(1, pagesize, keyword, starttime, endtime)
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
            })
        } else {
            var txt = "请检查手机号";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
        }
    }
}

function editsave() {
    var Name = $("#Name").val()
    var Phone = $("#Phone").val()
    var test = /^1[3|4|5|8][0-9]\d{4,8}$/
    if (Name == "" || Phone == "") {
        var txt = "请完善数据";
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
    } else {
        if (test.test(Phone)) {
            $.ajax({
                url: mainurl + 'api/User/Edit?ID=' + RoleID + '&Name=' + Name + '&Phone=' + Phone + '&Token=' + getCookie("token"),
                type: 'get',
                error: function () {
                    var txt = "数据加载异常";
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                },
                success: function (data) {
                    if (data.Status == 1) {
                        var txt = data.Result;
                        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                        $("#myModal").modal('hide');
                        hqhf(1, pagesize, keyword, starttime, endtime)
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
            })
        } else {
            var txt = "请检查手机号";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
        }
    }

}
// 点击删除
function delBtn() {
    $.ajax({
        url: mainurl + 'api/User/Delete?Token=' + getCookie("token") + '&ID=' + RoleID,
        type: 'get',
        error: function () {
            var txt = "数据加载异常";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
        },
        success: function (data) {
            if (data.Status == 1) {
                var txt = data.Result;
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                $("#myModal").modal('hide');
                hqhf(1, pagesize, keyword, starttime, endtime)
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
    })
}

