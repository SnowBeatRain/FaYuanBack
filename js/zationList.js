RoleID = location.href.split("id=")[1];
//分页操作
var pageNumber = 1;
var lastPage;
$(function () {
  hqhf(pageNumber);
})
function hqhf(pageNumber) {
  $.ajax({
    url: mainurl + 'api/Role/GetActionJurisdiction?RoleID='+RoleID+'&pageIndex='+pageNumber+'&pageSize=15',
    type: 'get',
    async: false,
    // data: { "PageIndex": pageNumber, "PageSize": 12, "RoleID": RoleID },
    error: function () {
      alert('数据加载错误');
    },
    success: function (data) {
      if (data.Status == 1) {
        tr = "";
        var page = data.Result.PageIndex;
        lastPage = data.Result.PageIndex;
        for (var i = 0; i < data.Result.Data.length; i++) {
          var Action = data.Result.Data[i]['Action'];
          var ID = data.Result.Data[i]['ID'];
          var Name = data.Result.Data[i]['Name'];
          var Controller = data.Result.Data[i]['Controller'];
          var IsSelect = data.Result.Data[i]['IsSelect'];
          if (IsSelect == true) {
            quanxian = "<td><a class='iconfont icon-xuanzhong'></a></td>";
          } else {
            quanxian = "<td><a class='iconfont icon-weixuanzhong'></a></td>";
          }
          tr += "<tr id=" + ID + "><td>" + Name + "</td><td>" + Controller + "</td><td>" + Action + "</td>" + quanxian + "</tr>";
        };
        $("tbody").html(tr);
        getpage(pageNumber,page);
        //编辑
        $(".iconfont").each(function () {
          $(this).click(function () {
            CompetenceID = $(this).parents("tr").attr("id");
            $.ajax({
              url: mainurl + 'api/Role/AddActionJurisdiction',
              type: 'get',
              data: {
                "token": getCookie("token"),
                "RoleID": RoleID,
                "CompetenceID": CompetenceID
              },
              error: function () {
                alert('服务器异常');
              },
              success: function (data) {
                if (data.Status == 1) {
                  hqhf(1);
                } else if (data.Status == 40001) {
                  top.location.href = "login.html";
                } else {
                  alert(data.Result)
                }
              }
            })
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

function editsave() {
  $.ajax({
    url: mainurl + 'api/Role/EditRole',
    type: 'get',
    data: {
      "Role": $("#Name").val(),
      "ID": RoleID,
      "token": getCookie("token"),
    },
    error: function () {
      alert('数据加载错误');
    },
    success: function (data) {
      if (data.Status == 1) {
        alert(data.Result);
        $("#myModal").modal('hide');
      } else if (data.Status == 40001) {
        top.location.href = "login.html";
      } else {
        alert(data.Result)
      }
    }
  })
}


