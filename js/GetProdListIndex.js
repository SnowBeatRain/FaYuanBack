var pageindex;
var keyword;
var type;
var lastPage;
var ProductListID = ""
$(function () {
	pageindex = 1;
	type = "-1";
	fy(pageindex, keyword, type);
})

function fy(pageindex, keyword, type) {
	if ($("#orderSearch").val().trim() == "") {
		$.ajax({
			type: "get",
			url: mainurl + "api/ProductList/GetProdListIndex?token=" + token + "&typeID=" + getCookie("ProductType_ListID") + "&pageIndex=" + pageindex + "&pageSize=10&sear=-1",
			dataType: "json",
			success: function (data) {
				if (data.Status == 1) {
					var li = '';
					var list = data.Result.ProdList;
					var page = data.Result.PAGE;
					lastPage = data.Result.PAGE;
					for (var i = 0; i < list.length; i++) {
						li += `
							<tr id="${list[i].ID}">
								<td>${list[i].Title}</td>
								<td><img class="ProImg" src="${mainurl + list[i].Image}" alt=""></td>
								<td><img class="ProImg" src="${mainurl + list[i].SubImage}" alt=""></td>
								<td>${list[i].IsEngLish == 0 ? "中文" : "英文"}</td>
								<td style="max-width:500px">${decodeURIComponent(list[i].Discribe) == null ? "" : decodeURIComponent(list[i].Discribe)}</td>
								<td>
								<img src="image/xiangqing.png" onclick="editModal(this,${list[i].IsEngLish})">
								<img src="image/shanchu.png" onclick="DeleteProduct(this)" alt="">
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
	} else {
		$.ajax({
			type: "get",
			url: mainurl + "api/ProductList/GetProdListIndex?token=" + token + "&typeID=" + getCookie("ProductType_ListID") + "&pageIndex=" + pageindex + "&pageSize=10&sear=" + keyword,
			dataType: "json",
			success: function (data) {
				if (data.Status == 1) {
					var li = '';
					var list = data.Result.ProdList;
					var page = data.Result.PAGE;
					lastPage = data.Result.PAGE;
					for (var i = 0; i < list.length; i++) {
						li += `
							<tr id="${list[i].ID}">
							<td>${list[i].Title}</td>
							<td><img class="ProImg" src="${mainurl + list[i].Image}" alt=""></td>
							<td><img class="ProImg" src="${mainurl + list[i].SubImage}" alt=""></td>
							<td>${list[i].IsEngLish == 0 ? "中文" : "英文"}</td>
							<td style="max-width:500px">${decodeURIComponent(list[i].Discribe) == null ? "" : decodeURIComponent(list[i].Discribe)}</td>
								<td>
									<img src="image/xiangqing.png" onclick="editModal(this,${list[i].IsEngLish})">
									<img src="image/shanchu.png" onclick="DeleteProduct(this)" alt="">
								</td>
							</tr>
							`
					}
					$("tbody").html(li)
					getpage(pageindex, page, keyword, type);
				} else if (data.Status == 40001) {
					alert(data.Result)
					window.location.href = "login.html"
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
	type = $(".status").val()
	keyword = $(".search").val()
	fy(1, keyword, type)
}

/*
 * 重置
 */
function ResetOrderIndex() {
	$(".search").val("");
	$(".status option:first").prop("selected", 'selected');
	fy(1, keyword, -1)
}
// 添加
function addModal() {
	delCookie("ProductListID")
	window.location.href = "ProductEdit.html"
}
// 修改
function editModal(e, ee) {
	setCookie("ProductListID", $(e).parents("tr").attr("id"))
	window.location.href = "ProductEdit.html?isEnglish=" + ee
}
// 删除
function DeleteProduct(e) {
	var id = $(e).parents("tr").attr("id");
	var txt = "确定删除吗？";
	var option = {
		title: "提示",
		btn: parseInt("0011", 2),
		onOk: function () {
			$.ajax({
				type: "get",
				url: mainurl + "api/ProductList/DelProdList?token=" + token + "&prodListID=" + id,
				async: false,
				success: function (data) {
					if (data.Status == 1) {
						window.location.href = window.location.href
					}
					else if (data.Status == 40001) {
						var txt = data.Result;
						window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
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