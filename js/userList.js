
var pageindex;
var keyword;
var type;
var lastPage;
$(function () {
    pageindex = 1;
    // if (location.href.indexOf("pageindex") > 0) {
    // 	pageindex = location.href.split('pageindex=')[1].split("&")[0];
    // }

    fy(pageindex, keyword);
})

function fy(pageindex, keyword) {
    if ($("#orderSearch").val().trim() == "") {
        $.ajax({
            type: "get",
            url: mainurl + "api/P_User/List?Token=" + token + "&PageIndex=" + pageindex + "&PageSize=10",
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
                                <td>${list[i].NickName}</td>
                                <td>${list[i].Email}</td>
                                <td>${list[i].Phone}</td>
                                <td>${list[i].OfficeAddress}</td>
                                <td>${list[i].HomeAddress}</td>
                                <td>${list[i].SocialAccount}</td>
                                <td>${list[i].SocialAccount2}</td>
                                <td>
                                <button class="ask-button" onclick="getHistory(this)">查看</button>
                                </td>
                                <td>
                                <button class="ask-button" onclick="getPain(this)">查看</button>
                                </td>
    
                            </tr>
							`
                    }
                    $("#userList tbody").html(li)
                    getpage(pageindex, page);
                } else {
                    alert(data.Result)
                }
            }
        });
    } else {
        $.ajax({
            type: "get",
            url: mainurl + "api/P_User/List?Token=" + token + "&PageIndex=" + pageindex + "&PageSize=10&Keyword=" + keyword,
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
								<td>${list[i].NickName}</td>
								<td>${list[i].Email}</td>
								<td>${list[i].Phone}</td>
								<td>${list[i].OfficeAddress}</td>
								<td>${list[i].HomeAddress}</td>
								<td>${list[i].SocialAccount}</td>
                                <td>${list[i].SocialAccount2}</td>
							    <td>
                                <button class="ask-button" onclick="getHistory(this)">查看</button>
                                </td>
                                <td>
                                <button class="ask-button" onclick="getPain(this)">查看</button>
                                </td>
							</tr>
							`
                    }
                    $("#userList tbody").html(li)
                    getpage(pageindex, page, keyword);
                } else {
                    alert(data.Result)
                }
            }
        });
    }

}

/*
 * 关键字搜索
 */
function KeySearch() {
    keyword = $(".search").val()
    fy(1, keyword)
}

/*
 * 重置
 */
function ResetOrderIndex() {
    $(".search").val("");
    fy(1, keyword)
}

function getpage(a, c, b) {
    $(".tcdPageCode0").createPage({
        pageCount: c,
        current: a,
        backFn: function (p) {
            fy(p, b)
        }
    });
}
// 疼痛历史
var id = "";
function getHistory(e) {
    id = $(e).parents("tr").attr("id")
    setCookie("MedicalID", id)
    window.location.href = "history.html"
}
// 疼痛部位
function getPain(e) {
    id = $(e).parents("tr").attr("id")
    setCookie("MedicalID", id)
    window.location.href = "painnotes.html"

}