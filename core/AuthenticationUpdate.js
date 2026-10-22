var _json = JSON.parse($("#ReportQRCode").val());
    debugger
    var newdate = new Date();
    //$(".CreateDateclass").html("生成日期：" + newdate.getFullYear() + "年" + (newdate.getMonth() + 1) + "月" + newdate.getDate() + "日");
    $(".CreateDateclass").html("备案回执生成日期：" + _json.data.ApplyTime);
    //作废
    $(".ReportCode").html(_json.data.ReportCode)
    if (_json.data.ReportStatus == "作废") {
        $(".specialhide").show();
        $(".specialhide").find("td").append("此报告已作废")
        $(".specialshow").hide();
    }
        //涉密
    else if (_json.data.IsSecurity == 1) {
        $(".specialhide").show();
        $(".specialhide").find("td").append("此报告涉密")
        $(".specialshow").hide();
    }
        //正常
    else {
        $(".ReportCode").html(_json.data.ReportCode)
        $(".ContractCode").html(_json.data.ContractCode)
        $(".ReportType").html(_json.data.ReportType)
        $(".ReportNumber").html(_json.data.ReportNumber)
        $(".ReportData").html(_json.data.ReportTime)
        $(".ReportName").html(_json.data.ReportName)
        $(".EvaluationConclusion").html(_json.data.EvaluationConclusion.length > 100 ? _json.data.EvaluationConclusion.substring(0, 100) + "...(详细内容见评估报告)" : _json.data.EvaluationConclusion)
        $(".OrgName").html(_json.data.OrgName)
        if (_json.data.ReportSignatory && _json.data.ReportSignatory.indexOf("</br>") == 0) {
            $(".ReportSignatory").html(_json.data.ReportSignatory.substring(5, _json.data.ReportSignatory.length))
        } else {
            $(".ReportSignatory").html(_json.data.ReportSignatory)
        }
    }
    // 二维码内容 = 当前页面地址
    jQuery('#qrcode').qrcode({
        render: "canvas",
        text: window.location.href,
        width: "130",
        height: "130",
        background: "#ffffff",
        foreground: "#000000",
        src: '/info/Content/Img/logo.jpg'
    });
    setTimeout(function () {
        var img = new Image();
        img.src = $("#qrcode").find("canvas")[0].toDataURL("image/png");
        $('#qrcode').empty();
        $('#qrcode').append(img);
    }, 500);
