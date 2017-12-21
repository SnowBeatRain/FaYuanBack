var pageindex;
var keyword;
var type;
var lastPage;

$(function () {
    pageindex = 1;
    type = 1;
    fy(pageindex, keyword, type);
})

function fy(pageindex, keyword, type) {
    $.ajax({
        type: "get",
        url: mainurl + "api/BannerList/GetInfoLunboIndex?token=" + token + "&PageIndex=" + pageindex + "&PageSize=4&forwhere=" + type,
        dataType: "json",
        success: function (data) {
            if (data.Status == 1) {
                var li = '';
                var list = data.Result.BannerEntity;
                var page = data.Result.Page;
                lastPage = data.Result.Page;
                for (var i = 0; i < list.length; i++) {
                    li += `
							<tr id="${list[i].LunboID}">
								<td><img class="ProImg" src="${mainurl + list[i].Image}" alt=""></td>
								<td>${list[i].nana == 1 ? "资讯" : ""}</td>
                                <td>${list[i].IsJump ? "是" : "否"}</td>
								<td>${list[i].Url}</td>
								<td>
									<img src="image/xiangqing.png" alt=""  onclick="editLunBo(this)">
									<img src="image/shanchu.png" onclick="DeleteLunBo(this)" alt="">
								</td>
							</tr>
							`
                }
                $("tbody").html(li)
                getpage(pageindex, page, keyword, type);
            }
            else if (data.Status == 40001) {
                alert(data.Result)
                window.location.href = "login.html"
            } else {
                alert(data.Result)
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
                url: mainurl + "api/BannerList/DelLunbo?Token=" + token + "&lunboID=" + id,
                async: false,
                success: function (data) {
                    if (data.Status == 1) {
                        window.location.href = window.location.href
                    }
                    else if (data.Status == 40001) {
                        alert(data.Result)
                        window.location.href = "login.html"
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

function getpage(a, c, b, d, e) {
    $(".tcdPageCode").createPage({
        pageCount: c,
        current: a,
        backFn: function (p) {
            fy(p, b, d, e)
        }
    });
}


// 添加
function addLunBo() {
    delCookie("LunBoID")
    window.location.href = "ProLunBoEdit.html"
}
// 修改
function editLunBo(e) {
    var id = $(e).parents("tr").attr("id")
    // console.log(id)
    setCookie("LunBoID", $(e).parents("tr").attr("id"), "d30")
    window.location.href = "ProLunBoEdit.html"

}
