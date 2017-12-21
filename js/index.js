var beactive = 0;
var activehtml = '管理员管理';
var myVar = 'manage.html';
var coloer = 0;
$.ajax({
	type: 'Get',
	url: mainurl+"api/Menu/GetMenus",
	data:{"Token":getCookie("token")},
	success: function(data) {
		menu = "";
		snippe = "";
		if (data.Status == 1) {
			for (var i = 0; i < data.Result.length; i++) {
				snippe = "";
				var name = data.Result[i].name;
				for (var y = 0; y < data.Result[i].snippet.length; y++) {
					var title = data.Result[i].snippet[y].title;
					var urlf = data.Result[i].snippet[y].urlf;
					snippe += "<li class='activeli'><a href="+urlf+" target='ifrmname' onclick='add(this)'>"+title+"</a></li>"
				}
				allsnippe = "<ul>"+snippe+"</ul>";
				menu += "<li role='presentation' class='dropdown'><a class='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>"+name+"<span class='caret'></span></a>"+allsnippe+"";
			}
			$(".nav-stacked").html(menu);
			$(".dropdown").each(function(){
				$(this).click(function(){
					var index = $(this).index();
					beactive = index;
					$(".dropdown>ul").removeClass("inactivety");
					$(this).children("ul").addClass("inactivety"); 
				})
			})
		}else{
			alert(data.Result)
		}
	},
	error: function() {
		alert("服务器异常")
	},
});  

ulnav = [];
appendli = "";
var delet = "";
function add(event){
	text = $(event).html();
	$(".activeli").removeClass("bluebgss");
	$(event).parent("li").addClass("bluebgss");
	activehtml = text;
	parentinde = $(event).parent("li").parent("ul").parent("li").index();
	httrf = $(event).attr("href");
	if(ulnav.length != 0) {
		for(var i = 0; i < ulnav.length; i++) {
			if(ulnav[i].title == text) {
				myVar = ulnav[i].urlf;
				coloer = i;
				return;
			}
		}
	}
	bgh = {
		"parentinde": parentinde,
		"urlf": httrf,
		"title": text
	};
	ulnav.push(bgh);
	coloer = ulnav.length - 1;
	myVar = ulnav[coloer].urlf;
	append();
}
function append(){
	appendli = "<li class='activea' context-menu target='a'><a href="+bgh.urlf+" onclick='background(this)' target='ifrmname'>"+bgh.title+"</a><i onclick='del(this,bgh)'></i></li>";
	$("#apendli").append(appendli);
	$(".activea").removeClass("nvbar li white");
	$(".activea:last").addClass("nvbar li white");
}

function del(event,bgh) {
	var delindex = $(event).parent("li").index();
	ulnav.splice(delindex, 1)
	appendli = "";
	for (var x = 0; x < ulnav.length; x++) {
		appendli += "<li class='activea' context-menu target='a'><a href="+ulnav[x].urlf+" onclick='background(this)' target='ifrmname'>"+ulnav[x].title+"</a><i onclick='del(this,bgh)'></i></li>";
	}
	$("#apendli").html(appendli)
	href = $(".activea:last").children("a").attr("href");
	if (href == undefined) {
		ifrmname.location.href = "manage.html";
	}else{
		ifrmname.location.href = href;
	}
	$(".activea").removeClass("nvbar li white");
	$("[href='"+href+"']").parent(".activea").addClass("nvbar li white");
}

function background(event){
	href = $(event).attr("href")
	$(".activea").removeClass("nvbar li white");
	$("[href='"+href+"']").parent(".activea").addClass("nvbar li white");
}