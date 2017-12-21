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
	if ($("#orderSearch").val().trim() == "") {
		$.ajax({
			type: "get",
			url: mainurl + "api/P_Mall/ProductList?Token=" + token + "&PageIndex=" + pageindex + "&PageSize=4&Status=" + type,
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
								<td><img class="ProImg" src="${list[i].Image}" alt=""></td>
								<td>${list[i].Name}</td>
								<td>${list[i].EName}</td>								
								<td>${list[i].Intro}</td>
								<td>${list[i].EIntro}</td>								
								<td>${list[i].Price}</td>
								<td>${list[i].Stock}</td>
								<td>${list[i].IsOnSale ? "已上架" : "未上架"}</td>
								<td>
									<img src="image/xiangqing.png" alt=""  onclick="editProduct(this)">
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
			url: mainurl + "api/P_Mall/ProductList?Token=" + token + "&PageIndex=" + pageindex + "&PageSize=4&Status=" + type + "&Keyword=" + keyword,
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
								<td><img class="ProImg" src="${list[i].Image}" alt=""></td>
								<td>${list[i].Name}</td>
								<td>${list[i].EName}</td>								
								<td>${list[i].Intro}</td>
								<td>${list[i].EIntro}</td>	
								<td>${list[i].Price}</td>
								<td>${list[i].Stock}</td>
								<td>${list[i].IsOnSale ? "已上架" : "未上架"}</td>
								<td>
									<img src="image/xiangqing.png" alt=""  onclick="editProduct(this)">
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

function DeleteProduct(e) {
	var id = $(e).parents("tr").attr("id");
	var txt = "确定删除吗？";
	var option = {
		title: "提示",
		btn: parseInt("0011", 2),
		onOk: function () {
			$.ajax({
				type: "get",
				url: mainurl + "api/P_Mall/DelProduct?Token=" + token + "&ID=" + id,
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
function addProduct() {
	delCookie("ProductID")
	window.location.href = "ProductEdit.html"
}
// 修改
function editProduct(e) {
	var id = $(e).parents("tr").attr("id")
	setCookie("ProductID", $(e).parents("tr").attr("id"), "d30")
	window.location.href = "ProductEdit.html"

}
