namea = decodeURI(location.href.split("namea=")[1]);
RoleID = location.href.split("id=")[1].split("&")[0];
$(".chgty").val(namea);
relog();
function relog() {
  $.ajax({
    url: mainurl + 'api/Role/GetMenuJurisdiction?RoleID='+RoleID,
    type: 'get',
    // data: { "RoleID": RoleID },
    error: function () {
      alert('数据加载错误');
    },
    success: function (data) {
      if (data.Status == 1) {
        li = '';
        for (var i = 0; i < data.Result.length; i++) {
          menu = '';
          var Menu = data.Result[i].Menu;
          var MenuID = data.Result[i].MenuID;
          for (var y = 0; y < data.Result[i].SubMenu.length; y++) {
            var IsSelect = data.Result[i].SubMenu[y].IsSelect;
            var SubMenu = data.Result[i].SubMenu[y].SubMenu;
            var SubMenuID = data.Result[i].SubMenu[y].SubMenuID;
            if (IsSelect == true) {
              sel = "<em class='iconfont icon-jinlingyingcaiwangtubiao58' onclick='huoqu(this)'></em>"
            } else {
              sel = "<em class='iconfont icon-xuanzhong1' onclick='huoqu(this)'></em>"
            }
            menu += "<ul class='seconuntable'><li id=" + SubMenuID + "><div class='relativedfg'><span class='poabout'></span><a>" + SubMenu + "</a>" + sel + "</li></ul>"
          }
          li += "<li id=" + MenuID + "><a onclick='togglemun(this)'><i class='iconfont icon-zhankai'></i>" + Menu + "</a>" + menu + "</li>"
        }
        $(".miantable").html(li)
      } else if (data.Status == 40001) {
        top.location.href = "login.html";
      } else {
        alert(data.Result)
      }
    }
  })
}
function togglemun(event) {
  $(event).children(".icon-zhankai").toggleClass("icon-shouqi");
  $(event).parents("li").children(".seconuntable").toggleClass("seconuntablehide");
}

function huoqu(event) {
  var SubMenuID = $(event).parents("li").attr("id");
  var MenuID = $(event).parents("li").parents("li").attr("id");
  $.ajax({
    url: mainurl + 'api/Role/AddMenuJurisdiction',
    type: 'get',
    async: false,
    data: {
      "SubMenuID": SubMenuID,
      "MenuID": MenuID,
      "token": getCookie("token"),
      "RoleID": RoleID
    },
    error: function () {
      alert('数据加载错误');
    },
    success: function (data) {
      if (data.Status == 1) {
      } else if (data.Status == 40001) {
        top.location.href = "login.html";
      } else {
        alert(data.Result);
        return;
      }
    }
  })
  if ($(event).attr("class") == "iconfont icon-xuanzhong1") {
    $(event).removeClass("icon-xuanzhong1");
    $(event).addClass("icon-jinlingyingcaiwangtubiao58");
  } else {
    $(event).removeClass("icon-jinlingyingcaiwangtubiao58");
    $(event).addClass("icon-xuanzhong1");
  }
}



