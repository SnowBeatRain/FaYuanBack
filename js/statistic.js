$(function () {
    $.ajax({
        type: "get",
        url: mainurl + "api/Home/Statistic?Token=" + getCookie("token"),
        dataType: "json",
        async: true,
        success: function (data) {
            if (data.Status == 1) {
                var h = `
                        <li class="col-lg-2 col-sm-3">
                            <div class="statisHeader userTitle">
                                <h4>用户数统计</h4>
                            </div>
                            <div class="statisNum">
                                <p>
                                    <span class="userNum">${data.Result.user.count}</span>人</p>
                            </div>
                            <div class="statisFooter">
                                <div>
                                    <p>${data.Result.user.normal}人</p>
                                    <p>已冻结</p>
                                </div>
                                <hr>
                                <div>
                                    <p>${data.Result.user.locked}人</p>
                                    <p>未冻结</p>
                                </div>
                            </div>
                        </li>
                        <li class="col-lg-2 col-sm-3">
                            <div class="statisHeader feedTitle">
                                <h4>建议统计</h4>
                            </div>
                            <div class="statisNum">
                                <p>
                                    <span class="feedNum">${data.Result.feedback.count}</span>条</p>
                            </div>
                            <div class="statisFooter">
                                <div>
                                    <p>${data.Result.feedback.deal}条</p>
                                    <p>已处理</p>
                                </div>
                                <hr>
                                <div>
                                    <p>${data.Result.feedback.dealing}条</p>
                                    <p>未处理</p>
                                </div>
                            </div>
                        </li>
                        <li class="col-lg-2 col-sm-3">
                            <div class="statisHeader activityTitle">
                                <h4>图文统计</h4>
                            </div>
                            <div class="statisNum">
                                <p>
                                    <span class="activityNum">${data.Result.activity.count}</span>条</p>
                            </div>
                            <div class="statisFooter">
                                <div>
                                    <p>${data.Result.activity.view}次</p>
                                    <p>总流量数</p>
                                </div>

                            </div>
                        </li>
                        <li class="col-lg-2 col-sm-3">
                            <div class="statisHeader msgTitle">
                                <h4>已发送短信</h4>
                            </div>
                            <div class="statisNum">
                                <p>
                                    <span class="msgNum">${data.Result.sms.count}</span>人</p>
                            </div>
                            <div class="statisFooter">
                                <div>
                                    <p></p>
                                    <p></p>
                                </div>
                                <div>
                                    <p></p>
                                    <p></p>
                                </div>
                            </div>
                        </li>
                            
                    `
                    $("#allList").html(h)
            } else if (data.Status == 40001) {
                alert(data.Result)
                window.location.href = "login.html"
            } else {
                alert(data.Result)
            }
        }
    });
})