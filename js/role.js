var RoleID = "";
//分页操作
var pageNumber;
var lastPage;

$(function () {
  pageNumber = 1;
  hqhf(pageNumber);
})
//获取列表数据 
function hqhf(pageNumber) {
  $.ajax({
    url: mainurl + "api/Role/GetRoles?pageIndex="+pageNumber+"&pageSize=10",
    type: 'get',
    async: false,
    error: function () {
      alert('数据加载错误');
    },
    success: function (data) {
      if (data.Status == 1) {
        tr = "";
        for (var i = 0; i < data.Result.data.length; i++) {
          var CreateTime = data.Result.data[i]['CreateTime'];
          var ID = data.Result.data[i]['ID'];
          var Name = data.Result.data[i]['Name'];
          var page = data.Result.PageIndex;
          lastPage = data.Result.PageIndex;
          var Time = CreateTime.substring(0, 10);
          tr += "<tr id=" + ID + "><td width='33.3333333%'>" + Name + "</td><td width='33.3333333%'>" + Time + "</td><td class='cazing'><a class='iconfont icon-quanxianguanli'></a><a class='jueedit' data-toggle='modal' data-target='#myModal' name=" + Name + ">编辑角色</a></tr>";
        };
        $("tbody").html(tr);
        getpage(pageNumber,page);
        //编辑
        $(".jueedit").each(function () {
          $(this).click(function () {
            $(".blocka").hide();
            $(".none").show();
            RoleID = $(this).parents("tr").attr("id");
            $("#Name").val($(this).attr("name"));
          })
        })
        $(".icon-quanxianguanli").each(function () {
          $(this).click(function () {
            RoleID = $(this).parents("tr").attr("id");
            location.href = "zationList.html?id=" + RoleID;
          })
        })
        $(".domuy").each(function () {
          $(this).click(function () {
            RoleID = $(this).parents("tr").attr("id");
            namea = $(this).parents("tr").children(".cazing").children(".jueedit").attr("name");
            location.href = "roledetail.html?id=" + RoleID + "&namea=" + namea;
          })
        })
      } else if (data.Status == 40001) {
        top.location.href = "login.html";
      } else {
        alert(data.Result)
      }
    }
  })
}
function getpage(a, c) {
  $(".tcdPageCode").createPage({
    pageCount: c,
    current: a,
    backFn: function (p) {
      hqhf(p)
    }
  });
}
function addmanage() {
  $(".blocka").show();
  $(".none").hide();
}

function save() {
  $.ajax({
    url: mainurl + 'api/Role/AddRole?Role=' + $("#Name").val() + '&Token=' + getCookie("token"),
    type: 'get',
    error: function () {
      alert('服务器异常');
    },
    success: function (data) {
      if (data.Status == 1) {
        alert(data.Result);
        $("#myModal").modal('hide');
        hqhf(1);
      } else if (data.Status == 40001) {
        top.location.href = "login.html";
      } else {
        alert(data.Result)
      }
    }
  })
}

function editsave() {
  $.ajax({
    url: mainurl + 'api/Role/EditRole?ID=' + RoleID + '&Role=' + $("#Name").val() + '&Token=' + getCookie("token"),
    type: 'get',
    error: function () {
      alert('数据加载错误');
    },
    success: function (data) {
      if (data.Status == 1) {
        alert(data.Result);
        $("#myModal").modal('hide');
        hqhf(1);
      } else if (data.Status == 40001) {
        top.location.href = "login.html";
      } else {
        alert(data.Result)
      }
    }
  })
}


