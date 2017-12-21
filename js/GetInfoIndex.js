var pageindex;
var keyword;
var type;
var lastPage;

$(function () {
    pageindex = 1;
    type = "-1";
    fy(pageindex, keyword, type);
})

function fy(pageindex, keyword, type) {
    $.ajax({
        type: "get",
        url: mainurl + "api/Information/GetInfoIndex?Token=" + token + "&PageIndex=" + pageindex + "&PageSize=4",
        dataType: "json",
        success: function (data) {
            if (data.Status == 1) {
                var li = '';
                var list = data.Result.InfoList;
                var page = data.Result.Page;
                lastPage = data.Result.Page;
                for (var i = 0; i < list.length; i++) {
                    li += `
							<tr id="${list[i].ID}">
								<td><img class="ProImg" src="${mainurl+list[i].Image}" alt=""></td>
								<td>${list[i].Title}</td>
								<td>${list[i].IsEnglish}</td>
								<td>${list[i].Discribe}</td>								
								<td>
									<img src="image/xiangqing.png" alt=""  onclick="editInfoIndex(this)">
									<img src="image/shanchu.png" onclick="DeleteInfoIndex(this)" alt="">
								</td>
							</tr>
							`
                }
                $("tbody").html(li)
                getpage(pageindex, page);
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


function DeleteInfoIndex(e) {
    var id = $(e).parents("tr").attr("id");
    var txt = "确定删除吗？";
    var option = {
        title: "提示",
        btn: parseInt("0011", 2),
        onOk: function () {
            $.ajax({
                type: "get",
                url: mainurl + "api/Information/DelInfo?token=" + token + "&infoID=" + id,
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

function getpage(a, c, b) {
    $(".tcdPageCode").createPage({
        pageCount: c,
        current: a,
        backFn: function (p) {
            fy(p, b)
        }
    });
}


// 添加
function addInfoIndex() {
    delCookie("InfoIndexID")
    window.location.href = "InfoIndexEdit.html"
}
// 修改
function editInfoIndex(e) {
    var id = $(e).parents("tr").attr("id")
    setCookie("InfoIndexID", $(e).parents("tr").attr("id"), "d30")
    window.location.href = "InfoIndexEdit.html"

}
