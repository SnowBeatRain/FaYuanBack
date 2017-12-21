var pageindex;
var keyword;
var isEnglish;
var lastPage;

// 上传图片
var SmallImgUrl = ""
function upSmallImg() {
	var formdata = new FormData();
	formdata.append("file", $(".upImg_small")[0].files[0]);//获取文件法二
	var lay = layer.load();
	$.ajax({
		type: 'post',
		url: mainurl + "api/Video/UpdateForImage",
		data: formdata,
		cache: false,
		processData: false,
		contentType: false,
		success: function (data) {
			layer.close(lay)
			if (data.Status == 1) {
				layer.msg("上传图片完成")
				$(".upImg1").attr("src", mainurl + data.Result)
				SmallImgUrl = data.Result
				$(".guanbi1").show()
			}
			else {
				alert(data.Result)
			}
		},
		error: function () {
			layer.close(lay)
			alert("数据异常")
		}
	})
}
$(function () {
	pageindex = 1;
	isEnglish = 0
	fy(pageindex, keyword, isEnglish);
})

function fy(pageindex, keyword, isEnglish) {
	if ($("#orderSearch").val().trim() == "") {
		$.ajax({
			type: "get",
			url: mainurl + "api/Video/ShowVideoIndex?Token=" + token + "&isEnglish=" + isEnglish + "&PageIndex=" + pageindex + "&PageSize=4&sear=" + -1,
			dataType: "json",
			success: function (data) {
				if (data.Status == 1) {
					var li = '';
					var list = data.Result.VideoList;
					var page = data.Result.Page;
					lastPage = data.Result.Page;
					for (var i = 0; i < list.length; i++) {
						li += `
							<tr id="${list[i].vidID}">
								<td><img class="ProImg" src="${mainurl + list[i].Image}" alt=""></td>
								<td>${list[i].Title}</td>
								<td>${list[i].IsEnglish == 0 ? "中文" : "英文"}</td>								
								<td><video width="300" src="${list[i].VideoUrl}" controls="controls">您的浏览器不支持打开该视频，请更换或升级浏览器</video></td>
								<td>
									<img src="image/xiangqing.png" alt=""  onclick="editModal(this)" class="noDeal" data-toggle="modal" data-target="#sendGoods">
									<img src="image/shanchu.png" onclick="DeleteProduct(this)" alt="">
								</td>
							</tr>
							`
					}
					$("tbody").html(li)
					getpage(pageindex, page, keyword, isEnglish);
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
			url: mainurl + "api/Video/ShowVideoIndex?Token=" + token + "&isEnglish=" + isEnglish + "&PageIndex=" + pageindex + "&PageSize=4&sear=" + keyword,
			dataType: "json",
			success: function (data) {
				if (data.Status == 1) {
					var li = '';
					var list = data.Result.Data;
					var page = data.Result.PageCount;
					lastPage = data.Result.PageCount;
					for (var i = 0; i < list.length; i++) {
						li += `
						<tr id="${list[i].vidID}">
						<td><img class="ProImg" src="${mainurl + list[i].Image}" alt=""></td>
						<td>${list[i].Title}</td>
						<td>${list[i].IsEnglish == 0 ? "中文" : "英文"}</td>								
						<td><video width="300" src="${list[i].VideoUrl}" controls="controls">您的浏览器不支持打开该视频，请更换或升级浏览器</video></td>
						<td>
							<img src="image/xiangqing.png" alt=""  onclick="editModal(this)" class="noDeal" data-toggle="modal" data-target="#sendGoods">
							<img src="image/shanchu.png" onclick="DeleteProduct(this)" alt="">
						</td>
					</tr>
							`
					}
					$("tbody").html(li)
					getpage(pageindex, page, keyword, isEnglish);
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
	fy(1, keyword, isEnglish)
}

/*
 * 重置
 */
function ResetOrderIndex() {
	$(".search").val("");
	$(".status option:first").prop("selected", 'selected');
	fy(1, keyword, isEnglish)
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
				url: mainurl + "api/Video/DelVideo?token=" + token + "&videoID=" + id,
				async: false,
				success: function (data) {
					if (data.Status == 1) {
						var txt = data.Result;
						window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
						setTimeout(() => {
							window.location.href = window.location.href
						}, 500);
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
function addModal() {
	$(".blocka1").show()
	$(".blocka2").hide()
	ProductTypeID = ""
	SmallImgUrl = ""
	$(".upImg1").attr("src", "image/tu.png")
	$("#Title").val("")
	$("#SubTitle").val("")
	$("#VideoUrl").val("")
	$(".IsEnglish").val(0)
	// 点击保存
	$(".blocka1").on("click", function () {
		var Image = SmallImgUrl
		var Title = $("#Title").val()
		var SubTitle = $("#SubTitle").val()
		var VideoUrl = $("#VideoUrl").val()
		var IsEnglish = $(".IsEnglish").val()
		if (Image == "" || Image == null || Title == "" || SubTitle == "" || VideoUrl == "" || IsEnglish == "") {
			var txt = "请完善信息";
			window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
		} else {
			$.ajax({
				type: "post",
				url: mainurl + "api/Video/AddVideo",
				data: {
					"token": token,
					"Image": Image,
					"Title": Title,
					"SubTitle": SubTitle,
					"VideoUrl": VideoUrl,
					"IsEnglish": IsEnglish
				},
				dataType: "json",
				success: function (data) {
					if (data.Status == 1) {
						var txt = data.Result;
						window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
						setTimeout(() => {
							window.location.href = window.location.href
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
	})
}
// 修改
function editModal(e) {
	$(".blocka2").show()
	$(".blocka1").hide()
	ProductTypeID = $(e).parents("tr").attr("id")
	$.ajax({
		type: "get",
		url: mainurl + "/api/Video/BackVideoDetial?videoID=" + ProductTypeID,
		dataType: "json",
		success: function (data) {
			if (data.Status == 1) {
				SmallImgUrl = data.Result.Image
				$(".upImg1").attr("src", mainurl + data.Result.Image)
				$("#Title").val(data.Result.Title)
				$("#SubTitle").val(data.Result.SubTitle)
				$("#VideoUrl").val(data.Result.VideoUrl)
				$(".IsEnglish").val(data.Result.IsEnglish)
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
	// 点击处理
	$(".blocka2").on("click", function () {
		var Image = SmallImgUrl
		var Title = $("#Title").val()
		var SubTitle = $("#SubTitle").val()
		var VideoUrl = $("#VideoUrl").val()
		var IsEnglish = $(".IsEnglish").val()
		if (Image == "" || Image == null || Title == "" || SubTitle == "" || VideoUrl == "" || IsEnglish == "") {
			var txt = "请完善信息";
			window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
		} else {
			$.ajax({
				type: "post",
				url: mainurl + "api/Video/EditVideo",
				data: {
					"videoID": ProductTypeID,
					"token": token,
					"Image": Image,
					"Title": Title,
					"SubTitle": SubTitle,
					"VideoUrl": VideoUrl,
					"IsEnglish": IsEnglish
				},
				dataType: "json",
				success: function (data) {
					if (data.Status == 1) {
						var txt = data.Result;
						window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
						setTimeout(() => {
							window.location.href = window.location.href
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

	})
}

