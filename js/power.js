var RoleID = "";
//分页操作
var pageNumber = 1;
var FenghuiPage = 1;
$(function() {
	hqhf(1);
});

function hqhf(pageNumber) {
	$.ajax({
		url: mainurl + 'api/Competence/GetCompetences',
		type: 'get',
		async: false,
		data: {
			"PageIndex": pageNumber,
			"PageSize": 12
		},
		error: function() {
			alert('数据加载错误');
		},
		success: function(data) {
			if(data.Status == 1) {
				tr = "";
				for(var i = 0; i < data.Result.data.length; i++) {
					var CreateTime = data.Result.data[i]['CreateTime'];
					var ID = data.Result.data[i]['ID'];
					var Name = data.Result.data[i]['Name'];
					var Controller = data.Result.data[i]['Controller'];
					var Action = data.Result.data[i]['Action'];
					FenghuiPage = data.Result.PageIndex;
					var Time = CreateTime.substring(0, 10);
					tr += "<tr id=" + ID + "><td id='name'>" + Name + "</td><td id='com'>" + Controller + "</td><td id='act'>" + Action + "</td><td>" + Time + "</td><td><a class='iconfont icon-bianji' class='btn editAgent' data-toggle='modal' data-target='#myModal'></a><a class='iconfont icon-delete'></a></td></tr>";
				};
				$("tbody").html(tr);
				//编辑
				$(".icon-bianji").each(function() {
					$(this).click(function() {
						$(".blocka").hide();
						$(".none").show();
						RoleID = $(this).parents("tr").attr("id");
						// alert($(this).parents("tr").children("#name").attr("html"))
						$("#Name").val($(this).parents("tr").children("#name").html());
						$("#Controller").val($(this).parents("tr").children("#com").html());
						$("#Action").val($(this).parents("tr").children("#act").html());
					})
				})
				$(".icon-delete").each(function() {
					$(this).click(function() {
						RoleID = $(this).parents("tr").attr("id");
						if(!confirm("确认要删除？")) {
							return;
						} else {
							$.ajax({
								url: mainurl + 'api/Competence/DelCompetence',
								type: 'get',
								data: {
									"token": getCookie("token"),
									"ID": RoleID,
								},
								error: function() {
									alert('服务器异常');
								},
								success: function(data) {
									if(data.Status == 1) {
										alert(data.Result);
										hqhf(1);
									} else if(data.Status == 40001) {
										top.location.href = "login.html";
									} else {
										alert(data.Result)
									}
								}
							})
						}
					})
				})
			} else if(data.Status == 40001) {
				top.location.href = "login.html";
			} else {
				alert(data.Result)
			}
		}
	})
}

window.onload = function() {
	$('#fenghui-pagination').pagination({
		pages: FenghuiPage,
		pageNumber: 1,
		displayedPages: 3,
		edges: 3,
		currentPage: 1,
		prevText: '上一页',
		nextText: '下一页',
		onPageClick: function(pageNumber, event) {
			hqhf(pageNumber);
		}
	});
}

function addmanage() {
	$(".blocka").show();
	$(".none").hide();
}

function save() {
	var Name = $("#Name").val();
	var Controller = $("#Controller").val();
	var Action = $("#Action").val();
	$.ajax({
		url: mainurl + 'api/Competence/AddCompetence',
		type: 'get',
		data: {
			"token": getCookie("token"),
			"Action": Action,
			"Controller": Controller,
			"Name": Name,
		},
		error: function() {
			alert('服务器异常');
		},
		success: function(data) {
			if(data.Status == 1) {
				alert(data.Result);
				$("#myModal").modal('hide');
				hqhf(1);
			} else if(data.Status == 40001) {
				top.location.href = "login.html";
			} else {
				alert(data.Result)
			}
		}
	})
}

function editsave() {
	var Name = $("#Name").val();
	var Controller = $("#Controller").val();
	var Action = $("#Action").val();
	$.ajax({
		url: mainurl + 'api/Competence/EditCompetence',
		type: 'get',
		data: {
			"ID": RoleID,
			"token": getCookie("token"),
			"Action": Action,
			"Controller": Controller,
			"Name": Name,
		},
		error: function() {
			alert('数据加载错误');
		},
		success: function(data) {
			if(data.Status == 1) {
				alert(data.Result);
				$("#myModal").modal('hide');
				hqhf(1);
			} else if(data.Status == 40001) {
				top.location.href = "login.html";
			} else {
				alert(data.Result)
			}
		}
	})
}