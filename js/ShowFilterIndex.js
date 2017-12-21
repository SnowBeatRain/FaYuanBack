var pageindex;
var keyword;
var type;
var lastPage;
$("#ISRderTable").hide()
$("#NoRderTable").show()
$(function () {
	pageindex = 1;
	// if (location.href.indexOf("pageindex") > 0) {
	// 	pageindex = location.href.split('pageindex=')[1].split("&")[0];
	// }
	type = 0;
	// if (location.href.indexOf("type") > 0) {
	// 	type = location.href.split('&type=')[1];
	// }
	fy(pageindex, keyword, type);
})

function fy(pageindex, keyword, type) {
	if ($("#orderSearch").val().trim() == "") {
		$.ajax({
			type: "get",
			url: mainurl + "api/P_Mall/OrderList?Token=" + token + "&PageIndex=" + pageindex + "&PageSize=10&Status=" + type,
			dataType: "json",
			success: function (data) {
				if (data.Status == 1) {

					if (type == 0) {
						var li = '';
						var list = data.Result.Data;
						var page = data.Result.PageCount;
						lastPage = data.Result.PageCount;
						for (var i = 0; i < list.length; i++) {
							li += `
								<tr id="${list[i].ID}">
									<td><img src="${list[i].Image}" /></td>
									<td>${list[i].Name}</td>
									<td>${list[i].Num}</td>
									<td>${list[i].Price}</td>
									<td>${list[i].Time}</td>
									<td>${list[i].Phone}</td>
									<td>${list[i].Phone}</td>
									<td>${list[i].Address}</td>
									<td><button class="ask-button" data-toggle="modal" onclick="pushGoods(this)" data-target="#sendGoods">发货</button></td>
								</tr>
								`
						}
						$("#NoRderTable tbody").html(li)
						$("#ISRderTable").hide()
						$("#NoRderTable").show()
					} else {
						var li = '';
						var list = data.Result.Data;
						var page = data.Result.PageCount;
						lastPage = data.Result.PageCount;
						for (var i = 0; i < list.length; i++) {
							li += `
								<tr id="${list[i].ID}">
									<td><img src="${list[i].Image}" /></td>
									<td>${list[i].Name}</td>
									<td>${list[i].Num}</td>
									<td>${list[i].Price}</td>
									<td>${list[i].Time}</td>
									<td>${list[i].Phone}</td>
									<td>${list[i].Phone}</td>
									<td>${list[i].Address}</td>
									<td>${list[i].ExpressCompany}</td>
									<td>${list[i].ExpressNum}</td>
									<td>${list[i].Consignee}</td>
								</tr>
								`
						}
						$("#ISRderTable").show()
						$("#ISRderTable tbody").html(li)
						$("#NoRderTable").hide()
					}

					getpage(pageindex, page, keyword, type);
				} else if (data.Status == 40001) {
					alert(data.Result)
					window.location.href = "login.html"
				} else {
					var txt = data.Result;
					window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
					setTimeout('lgAgain()', 1000);
				}
			}
		});
	}
	else {
		$.ajax({
			type: "get",
			url: mainurl + "api/P_Mall/OrderList?Token=" + token + "&PageIndex=" + pageindex + "&PageSize=10&Status=" + type + "&Keyword=" + keyword,
			dataType: "json",
			success: function (data) {
				if (data.Status == 1) {
					if (type == 0) {
						var li = '';
						var list = data.Result.Data;
						var page = data.Result.PageCount;
						lastPage = data.Result.PageCount;
						for (var i = 0; i < list.length; i++) {
							li += `
								<tr id="${list[i].ID}">
									<td><img src="${list[i].Image}" /></td>
									<td>${list[i].Name}</td>
									<td>${list[i].Num}</td>
									<td>${list[i].Price}</td>
									<td>${list[i].Time}</td>
									<td>${list[i].Phone}</td>
									<td>${list[i].Phone}</td>
									<td>${list[i].Address}</td>
									<td><button class="ask-button" data-toggle="modal" onclick="pushGoods(this)" data-target="#sendGoods">发货</button></td>
								</tr>
								`
						}
						$("#NoRderTable tbody").html(li)
						$("#ISRderTable").hide()
						$("#NoRderTable").show()
					} else {
						var li = '';
						var list = data.Result.Data;
						var page = data.Result.PageCount;
						lastPage = data.Result.PageCount;
						for (var i = 0; i < list.length; i++) {
							li += `
								<tr id="${list[i].ID}">
									<td><img src="${list[i].Image}" /></td>
									<td>${list[i].Name}</td>
									<td>${list[i].Num}</td>
									<td>${list[i].Price}</td>
									<td>${list[i].Time}</td>
									<td>${list[i].Phone}</td>
									<td>${list[i].Phone}</td>
									<td>${list[i].Address}</td>
									<td>${list[i].ExpressCompany}</td>
									<td>${list[i].ExpressNum}</td>
									<td>${list[i].Consignee}</td>
								</tr>
								`
						}
						$("#ISRderTable").show()
						$("#ISRderTable tbody").html(li)
						$("#NoRderTable").hide()
					}
					getpage(pageindex, page, keyword, type);
				} else if (data.Status == 40001) {
					alert(data.Result)
					window.location.href = "login.html"
				} else {
					var txt = data.Result;
					window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
					setTimeout('lgAgain()', 1000);
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
	keyword = $(".search").val()
	type = $(".status").val()
	fy(1, keyword, 0)
}

var goodId
function pushGoods(e) {
	goodId = $(e).parents("tr").attr("id");
}
function sendGoods() {
	var ExpressCompany = $("#kuaiDiCom").val()
	var ExpressNum = $("#kuaiDiOdd").val()

	$.ajax({
		type: "get",
		url: mainurl + "api/P_Mall/SendOff?Token=" + token + "&ID=" + goodId + "&ExpressCompany=" + ExpressCompany + "&ExpressNum=" + ExpressNum,
		async: false,
		success: function (data) {
			if (data.Status == 1) {
				fy(1, keyword, type)
				$("#sendGoods").modal("hide")
				alert(data.Result)
			} else if (data.Status == 40001) {
				alert(data.Result)
				window.location.href = "login.html"
			} else {
				var txt = data.Result;
				window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
			}
		}
	});
}

function getpage(a, c, b, e) {
	$(".tcdPageCode").createPage({
		pageCount: c,
		current: a,
		backFn: function (p) {
			fy(p, b, e)
		}
	});
}
