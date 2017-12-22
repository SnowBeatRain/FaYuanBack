var RoleID = "";
//分页操作
var pageNumber;
var lastPage;

$(function () {
  pageNumber = 1;
  hqhf(pageNumber);
})
function hqhf(pageNumber) {
  $.ajax({
    url: mainurl + "api/Admin/GetAdmin?pageIndex=" + pageNumber + "&pageSize=10",
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
          var IsLock = data.Result.data[i]['IsLock'];
          var Name = data.Result.data[i]['Name'];
          var Role = data.Result.data[i]['Role'];
          var ID = data.Result.data[i]['ID'];
          var page = data.Result.PageIndex;
          lastPage = data.Result.PageIndex;
          var Time = CreateTime.substring(0, 10);
          tr += "<tr><td>" + Name + "</td><td>" + Time + "</td><td>" + Role + "</td><td>" +
            "<img src='image/xiangqing.png' class='edit_img' data-toggle='modal' data-target='#myModal' id=" + ID + " /></td></tr>";
        };
        getpage(pageNumber, page);
        $("tbody").html(tr);
        //编辑
        $(".edit_img").each(function () {
          $(this).click(function () {
            $(".blocka").hide();
            $(".none").show();
            RoleID = $(this).attr("id");
            $.ajax({
              url: mainurl + 'api/Admin/GetAdminByID?ID='+RoleID,
              type: 'get',
              error: function () {
                alert('服务器异常');
              },
              success: function (data) {
                if (data.Status == 1) {
                  addmanage();
                  $(".blocka").hide();
                  $(".none").show();
                  var IsLock = data.Result.IsLock;
                  var Name = data.Result.Name;
                  var Password = data.Result.Password;
                  var roleID = data.Result.RoleID;
                  $("#Name").val(Name);
                  $("#Password").val(Password);
                  $("#role").val(roleID);
                  if (IsLock == true) {
                    $("#IsLock").val("true");
                  } else {
                    $("#IsLock").val("false");
                  }
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

function save() {
  $.ajax({
    url: mainurl + 'api/Admin/AddAdmin?Name=' + $("#Name").val() + '&Password=' + $.md5($("#Password").val()) + '&RoleID=' +RoleID + '&Token=' + getCookie("token"),
    type: 'get',
    error: function () {
      alert('服务器异常');
    },
    success: function (data) {
      if (data.Status == 1) {
        alert(data.Result);
        $("#myModal").modal('hide');
        hqhf(1)
      } else if (data.Status == 40001) {
        top.location.href = "login.html";
      } else {
        alert(data.Result)
      }
    }
  })
}

function editsave() {
  console.log($("#IsLock").val())
  $.ajax({
    url: mainurl + 'api/Admin/EditAdmin?ID=' + RoleID + '&Name=' + $("#Name").val() + '&Password=' + $.md5($("#Password").val()) + '&RoleID=' + $("#role").val() + '&IsLock=' + $("#IsLock").val() + '&Token=' + getCookie("token"),
    type: 'get',
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


