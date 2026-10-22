(function (global) {
  // 锁定加载本文件时的 jQuery（已挂 qrcode 插件），避免页脚再引入 jQuery 覆盖后失效
  var $qr = global.jQuery;

  function buildSignatoryHtml(list) {
    if (!list || !list.length) return "";
    return list
      .map(function (s) {
        var label = s.numberLabel || "会员编号";
        return (
          "<span class='qname'>" +
          (s.name || "") +
          "</span><span class='qtype'>（" +
          (s.type || "资产评估师") +
          "）</span><span class='qnumber'>" +
          label +
          "：" +
          (s.number || "") +
          "</span></br>"
        );
      })
      .join("");
  }

  function resolveQrText(qr) {
    qr = qr || {};
    if (qr.mode === "custom" && qr.customUrl) return qr.customUrl;
    return window.location.href;
  }

  function paintQr($box, text, size, logo) {
    if (!$qr || typeof $qr.fn.qrcode !== "function") {
      $box.html('<span style="color:#b42318;font-size:12px;">二维码插件未加载</span>');
      return;
    }
    $box.empty();
    var opts = {
      render: "canvas",
      text: text || window.location.href,
      width: size,
      height: size,
      background: "#ffffff",
      foreground: "#000000",
    };
    // 有 logo 时再带上；跨域 logo 可能导致 toDataURL 失败，下面会兜底
    if (logo) opts.src = logo;

    try {
      $qr($box).qrcode(opts);
    } catch (e) {
      console.error(e);
      $box.html('<span style="color:#b42318;font-size:12px;">二维码生成失败</span>');
      return;
    }

    // 等 logo 画完再转图片；失败则保留 canvas
    setTimeout(function () {
      var canvas = $box.find("canvas")[0];
      if (!canvas) return;
      try {
        var img = new Image();
        img.width = size;
        img.height = size;
        img.alt = "二维码";
        img.src = canvas.toDataURL("image/png");
        $box.empty().append(img);
      } catch (err) {
        // 跨域污染 canvas 时保留原 canvas 显示
        console.warn("二维码转图片失败，保留 canvas", err);
      }
    }, 600);
  }

  function renderReceipt(data) {
    if (!data) return;
    // 文本字段用当前页面的 jQuery 即可
    var $ = global.jQuery || $qr;
    $(".CreateDateclass").html("备案回执生成日期：" + (data.ApplyTime || ""));
    $(".ReportCode").html(data.ReportCode || "");

    if (data.ReportStatus === "作废") {
      $(".specialhide").show().find("td").empty().append("此报告已作废");
      $(".specialshow").hide();
    } else if (Number(data.IsSecurity) === 1) {
      $(".specialhide").show().find("td").empty().append("此报告涉密");
      $(".specialshow").hide();
    } else {
      $(".specialhide").hide();
      $(".specialshow").show();
      $(".ContractCode").html(data.ContractCode || "");
      $(".ReportType").html(data.ReportType || "");
      $(".ReportNumber").html(data.ReportNumber || "");
      $(".ReportData").html(data.ReportTime || "");
      $(".ReportName").html(data.ReportName || "");
      var ec = data.EvaluationConclusion || "";
      $(".EvaluationConclusion").html(
        ec.length > 100 ? ec.substring(0, 100) + "...(详细内容见评估报告)" : ec
      );
      $(".OrgName").html(data.OrgName || "");
      $(".ReportSignatory").html(buildSignatoryHtml(data.signatories));
    }

    var qr = data.qr || {};
    var size = Number(qr.size) || 130;
    var text = resolveQrText(qr);
    paintQr($("#qrcode"), text, size, qr.logo || "");
  }

  function loadReport(url) {
    url = url || "data/report.json?_=" + Date.now();
    return fetch(url, { cache: "no-store" }).then(function (res) {
      if (!res.ok) throw new Error("加载 data/report.json 失败");
      return res.json();
    });
  }

  global.ReceiptApp = {
    buildSignatoryHtml: buildSignatoryHtml,
    resolveQrText: resolveQrText,
    renderReceipt: renderReceipt,
    loadReport: loadReport,
    paintQr: paintQr,
  };
})(window);
