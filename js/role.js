var RoleID = "";
//分页操作
var pageNumber=1;
var FenghuiPage=1;
$(function(){
  hqhf(1);
});
function hqhf(pageNumber){
  $.ajax({
    url:mainurl+'api/Role/GetRoles',
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
          var ID = data.Result.data[i]['ID'];
          var Name = data.Result.data[i]['Name'];
          FenghuiPage = data.Result.PageIndex;
          var Time = CreateTime.substring(0,10);
          tr+="<tr id="+ID+"><td width='33.3333333%'>"+Name+"</td><td width='33.3333333%'>"+Time+"</td><td class='cazing'><a class='iconfont icon-quanxianguanli'></a><a class='jueedit' data-toggle='modal' data-target='#myModal' name="+Name+">编辑角色</a><a class='domuy'>详情</a></td></tr>"; 
        };
        $("tbody").html(tr);
        //编辑
        $(".jueedit").each(function(){
          $(this).click(function(){
            $(".blocka").hide();
            $(".none").show();
            RoleID = $(this).parents("tr").attr("id");
            $("#Name").val($(this).attr("name"));
          })
        })
        $(".icon-quanxianguanli").each(function(){
          $(this).click(function(){
            RoleID = $(this).parents("tr").attr("id");
            location.href = "zationList.html?id=" + RoleID;
          })
        })
        $(".domuy").each(function(){
          $(this).click(function(){
            RoleID = $(this).parents("tr").attr("id");
            namea = $(this).parents("tr").children(".cazing").children(".jueedit").attr("name");
            location.href = "roledetail.html?id="+RoleID+"&namea="+namea;
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
}

function save(){
  $.ajax({
    url:mainurl+'api/Role/AddRole',
    type: 'get',
    data:{ 
      "token":getCookie("token"),
      "Role":$("#Name").val(),
    },
    error: function(){
      alert('服务器异常');
    },
    success: function(data){
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

function editsave(){
  $.ajax({
    url:mainurl+'api/Role/EditRole',
    type: 'get',
    data:{ 
      "Role":$("#Name").val(),
      "ID":RoleID,
      "token":getCookie("token"),
    },
    error: function(){
      alert('数据加载错误');
    },
    success: function(data){
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


