// 管理员id
var RoleID = "";
// 管理员角色id  = 为数据返回，不可设置
var roleID = "";
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
        var page = data.Result.PageIndex;
        lastPage = data.Result.PageIndex;
        for (var i = 0; i < data.Result.data.length; i++) {
          var CreateTime = data.Result.data[i]['CreateTime'];
          var IsLock = data.Result.data[i]['IsLock'];
          var Name = data.Result.data[i]['Name'];
          var Role = data.Result.data[i]['Role'];
          var ID = data.Result.data[i]['ID'];

          var Time = CreateTime.split(".")[0].replace("T", " ");
          tr += "<tr><td>" + Name + "</td><td>" + Time + "</td><td>" + Role + "</td><td>" +
            "<img src='image/xiangqing.png' class='edit_img' data-toggle='modal' data-target='#myModal' id=" + ID + " /></td></tr>";
        };
        getpage(pageNumber, page);
        $("tbody").html(tr);
        //编辑
        $(".edit_img").each(function () {
          $(this).click(function () {
            $(".blocka").hide();
            $(".guanbi").hide()
            $(".none").show();
            $(".delete").show()
            RoleID = $(this).attr("id");
            $.ajax({
              url: mainurl + 'api/Admin/GetAdminByID?ID=' + RoleID,
              type: 'get',
              error: function () {
                var txt = "服务器异常";
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);

              },
              success: function (data) {
                if (data.Status == 1) {
                  addmanage();
                  $("#myModalLabel").text("修改管理员")
                  $(".blocka").hide();
                  $(".guanbi").hide()
                  $(".none").show();
                  $(".delete").show()
                  var IsLock = data.Result.IsLock;
                  var Name = data.Result.Name;
                  var Password = data.Result.Password;
                  roleID = data.Result.RoleID;
                  $("#Name").val(Name);
                  $("#Password").val(Password);
                  if (IsLock == true) {
                    $("#IsLock").val("true");
                  } else {
                    $("#IsLock").val("false");
                  }
                } else if (data.Status == 40001) {
                  var txt = data.Result;
                  window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                  setTimeout(() => {
                    top.location.href = "login.html"
                  }, 500);
                } else {
                  var txt = data.Result;
                  window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                }
              }
            })
          })
        })
      } else if (data.Status == 40001) {
        var txt = data.Result;
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
      } else {
        var txt = data.Result;
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
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

// 点击添加
function addmanage() {
  $(".blocka").show();
  $(".none").hide();
  $(".delete").hide()
  $(".guanbi").show()
  $("#Name").val("")
  $("#Password").val("")
  $("#myModalLabel").text("新增管理员")
}

// 添加保存
function save() {
  $.ajax({
    url: mainurl + 'api/Admin/Add?Name=' + $("#Name").val() + '&Password=' + $.md5($("#Password").val()) + '&Token=' + getCookie("token"),
    type: 'get',
    error: function () {
      alert('服务器异常');
    },
    success: function (data) {
      if (data.Status == 1) {
        var txt = data.Result;
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
        $("#myModal").modal('hide');
        hqhf(1)
      } else if (data.Status == 40001) {
        var txt = data.Result;
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
        setTimeout(() => {
          top.location.href = "login.html"
        }, 500);
      } else {
        var txt = data.Result;
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
      }
    }
  })
}

function editsave() {
  $.ajax({
    url: mainurl + 'api/Admin/EditAdmin?ID=' + RoleID + '&Name=' + $("#Name").val() + '&Password=' + $.md5($("#Password").val()) + '&RoleID=' + IsLock + '&IsLock=false&Token=' + getCookie("token"),
    type: 'get',
    error: function () {
      var txt = "数据加载异常";
      window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
    },
    success: function (data) {
      if (data.Status == 1) {
        var txt = data.Result;
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
        $("#myModal").modal('hide');
      } else if (data.Status == 40001) {
        var txt = data.Result;
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
        setTimeout(() => {
          top.location.href = "login.html"
        }, 500);
      } else {
        var txt = data.Result;
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
      }
    }
  })
}
// 点击删除
function delBtn() {
  $.ajax({
    url: mainurl + 'api/Admin/Del?Token=' + getCookie("token") + '&ID=' + RoleID,
    type: 'get',
    error: function () {
      var txt = "数据加载异常";
      window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
    },
    success: function (data) {
      if (data.Status == 1) {
        var txt = data.Result;
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
        $("#myModal").modal('hide');
        hqhf(1)
      } else if (data.Status == 40001) {
        var txt = data.Result;
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
        setTimeout(() => {
          top.location.href = "login.html"
        }, 500);
      } else {
        var txt = data.Result;
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
      }
    }
  })
}


