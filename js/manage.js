var RoleID = "";
//分页操作
var pageNumber=1;
var FenghuiPage=1;
$(function(){
  hqhf(1);
});
function hqhf(pageNumber){
  $.ajax({
    url:mainurl+'api/Admin/GetAdmin',
    type: 'get',
    async:false,
    data:{ "PageIndex":pageNumber,"PageSize":12},
    error: function(){
      alert('数据加载错误');
    },
    success: function(data){
      if(data.Status == 1) {
        tr="";
        for(var i = 0;i < data.Result.data.length;i++)
        {
          var CreateTime = data.Result.data[i]['CreateTime'];
          var IsLock = data.Result.data[i]['IsLock'];
          var Name = data.Result.data[i]['Name'];
          var Role = data.Result.data[i]['Role'];
          var ID = data.Result.data[i]['ID'];
          FenghuiPage = data.Result.PageIndex;
          var Time = CreateTime.substring(0,10);
          if (IsLock == true) {
            islock = "是"
          }else{
            islock = "否"
          }
          tr+="<tr><td>"+Name+"</td><td>"+islock+"</td><td>"+Time+"</td><td>"+Role+"</td><td><a class='iconfont icon-bianji' data-toggle='modal' data-target='#myModal' id="+ID+"></a></td></tr>"; 
        };
        $("tbody").html(tr);
        //编辑
        $(".icon-bianji").each(function(){
          $(this).click(function(){
            $(".blocka").hide();
            $(".none").show();
            RoleID = $(this).attr("id");
              $.ajax({
                url:mainurl+'api/Admin/GetAdminByID',
                type: 'get',
                data:{ "ID":RoleID},
                error: function(){
                  alert('服务器异常');
                },
                success: function(data){
                  if(data.Status == 1) {
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
                    if (IsLock==true) {
                      $("[id = IsLock]:checkbox").attr("checked", true);
                    }else{
                      $("[id = IsLock]:checkbox").attr("checked", false);
                    }
                  } else if(data.Status == 40001) {
                    top.location.href = "login.html";
                  } else {
                    alert(data.Result)
                  }
                }
              })
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

window.onload=function()
{
  $('#fenghui-pagination').pagination({
    pages: FenghuiPage,
    pageNumber:1,
    displayedPages: 3,
    edges:3,
    currentPage:1,
    prevText: '上一页',
    nextText: '下一页',
    onPageClick:function(pageNumber, event)
    {
      hqhf(pageNumber); 
    }
  });
}

function addmanage(){
  $(".blocka").show();
  $(".none").hide();
  $.ajax({
    url:mainurl+'api/Role/GetRoles',
    type: 'get',
    data:{ "PageIndex":1,"PageSize":50},
    error: function(){
      alert('数据加载错误');
    },
    success: function(data){
      if(data.Status == 1) {
        role="";
        for(var i = 0;i < data.Result.data.length;i++){
          var Name = data.Result.data[i]['Name'];
          var ID = data.Result.data[i]['ID'];
          role += "<option value="+ID+">"+Name+"</option>";
        }
        $("#role").html(role);
      } else if(data.Status == 40001) {
        top.location.href = "login.html";
      } else {
        alert(data.Result)
      }
    }
  })
}

function save(){
  $.ajax({
    url:mainurl+'api/Admin/AddAdmin',
    type: 'get',
    data:{ 
      "Name":$("#Name").val(),
      "Password":$.md5($("#Password").val()),
      "token":getCookie("token"),
      "RoleID":$("#role").val(),
    },
    error: function(){
      alert('服务器异常');
    },
    success: function(data){
      if(data.Status == 1) {
        alert(data.Result);
        $("#myModal").modal('hide');
      } else if(data.Status == 40001) {
        top.location.href = "login.html";
      } else {
        alert(data.Result)
      }
    }
  })
}

function editsave(){
  $.ajax({
    url:mainurl+'api/Admin/EditAdmin',
    type: 'get',
    data:{ 
      "Name":$("#Name").val(),
      "ID":RoleID,
      "Password":$.md5($("#Password").val()),
      "token":getCookie("token"),
      "RoleID":$("#role").val(),
      "IsLock":$("input[type='checkbox']").is(':checked')
    },
    error: function(){
      alert('数据加载错误');
    },
    success: function(data){
      if(data.Status == 1) {
        alert(data.Result);
        $("#myModal").modal('hide');
      } else if(data.Status == 40001) {
        top.location.href = "login.html";
      } else {
        alert(data.Result)
      }
    }
  })
}


