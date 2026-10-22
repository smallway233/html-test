function fade() {
//    alert("aa");
    var con = document.getElementById("span_ipt1");
    if (con.value == "检索搜索") {
        con.value = "";
    }
}
function show() {
    var con = document.getElementById("span_ipt1");
    if (con.value == "") {
        con.value = "检索搜索";
    }
}

var start = true;
var obj = null;
function move(id, tag) {
    var id = document.getElementById(id),
		tag = id.getElementsByTagName(tag),
		w = tag[0].offsetHeight,
		timer = null;

    id.innerHTML += id.innerHTML;
    id.style.height = tag.length * w + 'px';

    timer = setInterval(function () {
        if (obj == null || id != obj) {
            if (id.offsetTop <= -tag.length * w / 2) {
                id.style.top = 0 + 'px';
            }
            id.style.top = id.offsetTop - 3 + 'px';
        }
    }, 250)
}

function stop(objs) {
    obj = objs;
}
function star(objs) {
    obj = null;
}



function showLocale(obj) {
    var str, colorhead, colorfoot;
    var yy = obj.getYear();
    if (yy < 1900) { yy = yy + 1900; }
    var MM = obj.getMonth() + 1;
    if (MM < 10) { MM = "0" + MM; }
    var dd = obj.getDate();
    if (dd < 10) { dd = "0" + dd; }
    var hh = obj.getHours();
    if (hh < 10) { hh = "0" + hh; }
    if (hh < 6) { hol = "凌晨好!" }
    else if (hh < 9) { hol = "早上好！" }
    else if (hh < 12) { hol = "上午好！" }
    else if (hh < 14) { hol = "中午好！" }
    else if (hh < 17) { hol = "下午好！" }
    else if (hh < 19) { hol = "傍晚好！" }
    else if (hh < 22) { hol = "晚上好！" }
    else { hol = "夜里好!" }
    var mm = obj.getMinutes();
    if (mm < 10) { mm = "0" + mm; }
    var ss = obj.getSeconds();
    if (ss < 10) { ss = "0" + ss; }
    var ww = obj.getDay();
    if (ww == 0) colorhead = "<font color=\"#FF0000\">";
    if (ww > 0 && ww < 6) colorhead = "<font color=\"#373737\">";
    if (ww == 6) colorhead = "<font color=\"#008000\">";
    if (ww == 0) ww = "星期日";
    if (ww == 1) ww = "星期一";
    if (ww == 2) ww = "星期二";
    if (ww == 3) ww = "星期三";
    if (ww == 4) ww = "星期四";
    if (ww == 5) ww = "星期五";
    if (ww == 6) ww = "星期六";
    colorfoot = "<font>";
    str = hol + "今天是：" + colorhead + yy + "年" + MM + "月" + dd + "日" + " " + hh + ":" + mm + ":" + ss + "  " + ww + colorfoot;
    return (str);
}
function tick() {
    var today; today = new Date();
    $("#shijian").html(showLocale(today));
    setTimeout("tick()", 1000);
}

