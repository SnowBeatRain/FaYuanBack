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
					setCookie("name",Name,"d30");
					location.href="index.html"
				}else{
					var txt=  data.Result;
			window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
				}
			},
			error: function() {
				var txt=  "服务器异常";
			window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
			},
		});  
	}else{
		var txt=  "请输入账号密码";
			window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
	}
})

