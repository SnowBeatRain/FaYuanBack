var pageindex;
var lastPage;

$(function () {
    pageindex = 1;
    type = 1;
    fy(pageindex);
})

function fy(pageindex) {
    $.ajax({
        type: "get",
        url: mainurl + "api/Banner/GetBannerByPage?Token=" + token + "&PageIndex=" + pageindex + "&PageSize=5",
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
								<td><img style="width:480px" src="${mainurl + list[i].Url}" alt=""></td>
								<td>
									<img src="image/shanchu.png" onclick="DeleteLunBo(this)" alt="">
								</td>
							</tr>
							`
                }
                $("tbody").html(li)
                getpage(pageindex, page);
            }
            else if (data.Status == 40001) {
                var txt = data.Result;
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                setTimeout(() => {
                    top.location = "login.html"
                }, 500);
            } else {
                var txt = data.Result;
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
            }
        }
    });

}

function DeleteLunBo(e) {
    var id = $(e).parents("tr").attr("id");
    var txt = "确定删除吗？";
    var option = {
        title: "提示",
        btn: parseInt("0011", 2),
        onOk: function () {
            $.ajax({
                type: "get",
                url: mainurl + "api/Banner/DelBanner?Token=" + token + "&ID=" + id,
                async: false,
                success: function (data) {
                    if (data.Status == 1) {
                        window.location.href = window.location.href
                    }
                    else if (data.Status == 40001) {
                        var txt = data.Result;
                        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                        setTimeout(() => {
                            top.location = "login.html"
                        }, 500);
                    }
                    else {
                        var txt = data.Result;
                        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                    }
                }
            });
        }
    }
    window.wxc.xcConfirm(txt, "custom", option);
}

function getpage(a, c) {
    $(".tcdPageCode").createPage({
        pageCount: c,
        current: a,
        backFn: function (p) {
            fy(p)
        }
    });
}


// 添加
function addLunBo() {
    delCookie("LunBoID")
    window.location.href = "LunBoEdit.html"
}

