var pageindex;
var type;
var lastPage;
var ProductTypeID = ""
$(function () {
	pageindex = 1;
	type = "-1";
	fy(pageindex, type);
})

function fy(pageindex, type) {
	$.ajax({
		type: "get",
		url: mainurl + "api/ProductList/GetProdTypeIndex?Token=" + token + "&PageIndex=" + pageindex + "&PageSize=10&isEngLish=" + type,
		dataType: "json",
		success: function (data) {
			if (data.Status == 1) {
				var li = '';
				var list = data.Result.ProdTypeList;
				var page = data.Result.Page;
				lastPage = data.Result.Page;
				for (var i = 0; i < list.length; i++) {
					li += `
							<tr id="${list[i].ID}">
								<td>${list[i].TypeName.split(",")[0]}</td>
								<td>${list[i].TypeName.split(",")[1]}</td>
								<td>
									<img style="width:20px" src="image/detail.png" onclick="detailList(this)" alt="">
									<img src="image/xiangqing.png" onclick="editModal(this)" data-toggle="modal" data-target="#sendGoods" alt="">
									<img src="image/shanchu.png" onclick="DeleteProduct(this)" alt="">
								</td>
							</tr>
							`
				}
				$("tbody").html(li)
				getpage(pageindex, page, type);
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
	$(".blocka1").show()
	$(".blocka2").hide()
	ProductTypeID = ""
}
// 详情
function detailList(e) {
	setCookie("ProductType_ListID", $(e).parents("tr").attr("id"))
	window.location.href = "GetProdListIndex.html"
}
// 点击修改
function editModal(e) {
	$(".blocka2").show()
	$(".blocka1").hide()
	ProductTypeID = $(e).parents("tr").attr("id")
	$.ajax({
		type: "get",
		url: mainurl + "api/ProductList/GetProdTypeDetail?typeID=" + $(e).parents("tr").attr("id"),
		async: true,
		success: function (data) {
			if (data.Status == 1) {
				$("#chineseTitle").val(data.Result.TypeName)
				$("#englistTitle").val(data.Result.SubTypeName)
			}
			else {
				var txt = data.Result;
				window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
			}
		}
	});
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
				url: mainurl + "api/ProductList/DelProdType?token=" + token + "&prodTypeID=" + id,
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
function addSave() {
	var TypeName = $("#chineseTitle").val()
	var SecTypeName = $("#englistTitle").val()
	$.ajax({
		type: "post",
		url: mainurl + "api/ProductList/AddProdType",
		data: {
			"token": token,
			"IsEnglish": 0,
			"TypeName": TypeName,
			"SecIsEnglish": 1,
			"SecTypeName": SecTypeName,
		},
		async: false,
		success: function (data) {
			if (data.Status == 1) {
				window.location.href = window.location.href
			}
			else if (data.Status == 40001) {
				alert(data.Result)
				setTimeout(() => {
					window.location.href = "login.html"
				}, 500);

			}
			else {
				var txt = data.Result;
				window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
			}
		}
	});

}
// 修改
function editSave(e) {
	var TypeName = $("#chineseTitle").val()
	var SecTypeName = $("#englistTitle").val()
	$.ajax({
		type: "post",
		url: mainurl + "api/ProductList/EditProdType",
		data: {
			"PordTypeID": ProductTypeID,
			"token": token,
			"IsEnglish": 0,
			"TypeName": TypeName,
			"SecIsEnglish": 1,
			"SecTypeName": SecTypeName,
		},
		async: false,
		success: function (data) {
			if (data.Status == 1) {
				var txt = data.Result;
				window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
				setTimeout(() => {
					window.location.href = window.location.href
				}, 700);
			}
			else if (data.Status == 40001) {
				var txt = data.Result;
				window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
				setTimeout(() => {
					window.location.href = "login.html"
				}, 700);
			}
			else {
				var txt = data.Result;
				window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
			}
		}
	});
}