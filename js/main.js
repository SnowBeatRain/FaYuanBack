
$("#login").click(function(){
	var Name = $("#username").val();
	var Password = $.md5($("#pasword").val());
	if(Name&&Password){
		$.ajax({
			type: 'Post',
			url: mainurl+"api/Admin/Login",
			data:{"Name":Name,"Password":Password},
			success: function(data) {
				if (data.Status == 1) {
					setCookie("token", data.Result, "d30");
					location.href="index.html"
				}else{
					alert(data.Result)
				}
			},
			error: function() {
				alert("服务器异常")
			},
		});  
	}else{
		alert("请输入账号密码")
	}
})