var pageindex;
var keyword;
var type;
var lastPage;

$(function () {
    pageindex = 1;
    type = "-1";
    fy(pageindex, keyword, type);
})
// $('#addCreateTime').datetimepicker({
//     format: 'Y.d.m H:i',
//     step: 5,
//     timepickerScrollbar: false,
// });
function fy(pageindex, keyword, type) {
    $.ajax({
        type: "get",
        url: mainurl + "api/P_Equipment/EquipmentList?Token=" + token + "&PageIndex=" + pageindex + "&PageSize=4&Status=" + type,
        dataType: "json",
        success: function (data) {
            if (data.Status == 1) {
                var li = '';
                var list = data.Result.Data;
                var page = data.Result.PageCount;
                lastPage = data.Result.PageCount;
                for (var i = 0; i < list.length; i++) {
                    li += `
							<tr id="${list[i].ID}">
								<td><img class="ProImg" src="${mainurl + list[i].Image}" alt=""></td>
								<td>${list[i].FullName}</td>
								<td>${list[i].Name}</td>								
								<td>${list[i].QRcode}</td>
								<td>${list[i].CreateTime}</td>								
                                <td>
                                    <span onclick="editProduct(this)">编辑</span>
                                    <span onclick="DeleteProduct(this)">删除</span>
                                </td>
							</tr>
							`
                }
                $("tbody").html(li)
                getpage(pageindex, page, keyword, type);
            }
            else if (data.Status == 40001) {
                alert(data.Result)
                window.location.href = "login.html"
            } else {
                alert(data.Result)
            }
        }
    });


}

function DeleteProduct(e) {
    var id = $(e).parents("tr").attr("id");
    var txt = "确定删除吗？";
    var option = {
        title: "提示",
        btn: parseInt("0011", 2),
        onOk: function () {
            $.ajax({
                type: "get",
                url: mainurl + "api/P_Equipment/EquipmentDel?Token=" + token + "&ID=" + id,
                async: false,
                success: function (data) {
                    if (data.Status == 1) {
                        window.location.href = window.location.href
                    }
                    else if (data.Status == 40001) {
                        alert(data.Result)
                        window.location.href = "login.html"
                    }
                    else {
                        var txt = data.Result;
                        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                    }
                }
            });
        }
    }
    window.wxc.xcConfirm(txt, "custom", option);
}

function getpage(a, c, b, d, e) {
    $(".tcdPageCode").createPage({
        pageCount: c,
        current: a,
        backFn: function (p) {
            fy(p, b, d, e)
        }
    });
}


// 添加
function addProduct() {
    delCookie("equipmentID")
    window.location.href = "equipmentEdit.html"
}
// 修改编辑
function editProduct(e) {
    var id = $(e).parents("tr").attr("id")
	setCookie("equipmentID", $(e).parents("tr").attr("id"), "d30")
	window.location.href = "equipmentEdit.html"

}
