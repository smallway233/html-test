// var t = window.devicePixelRatio;
// console.log(t)
// if( $(window).width() > 1024 ){
// 	document.body.style.zoom = $(window).width() / 1920 * .7 ;
// 	// $('.right_side .box').css('zoom', 1 )
// 	$('.right_side iframe').css('zoom', 1.64   )
// 	// $('.right_side .box').css('transform',' scale( ' + 1.1 / ( 1920 / $(window).width() * 0.75 ) + ')' )
// 	$('.right_side').css('width', 360 )
// }



Nav('.nav');//导航
mobideMenu();// 移动端主导航
// fixNav();

$(document).ready(function(){
	menuMiddle();
	
})
$(window).resize(function(){
	var resizeTimer = null;
	if (resizeTimer) clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function(){
		menuMiddle();
		// fixNav();
	},50);
});

// 设置为主页,js代码
function SetHome(obj,vrl){
	try{
		obj.style.behavior='url(#default#homepage)';obj.setHomePage(vrl);
	}
	catch(e){
		if(window.netscape) {
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			}
			catch (e) {
				alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");
			}
			var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
				prefs.setCharPref('browser.startup.homepage',vrl);
		}else{
			alert("您的浏览器不支持，请按照下面步骤操作：1.打开浏览器设置。2.点击设置网页。3.输入："+vrl+"点击确定。"); 
		}
	}
}

// 加入收藏 兼容360和IE6
function shoucang(sTitle,sURL){       
	try{
		window.external.addFavorite(sURL, sTitle);
	}
	catch (e){
		try{
			window.sidebar.addPanel(sTitle, sURL, "");
		}
		catch (e){
			alert("加入收藏失败，请使用Ctrl+D进行添加");
		}
	}
}

function showLocale(obj){
	var str,colorhead,colorfoot;
	var yy = obj.getYear();//获取的年份
	if(yy<1900) {yy=yy+1900;}
	var MM = obj.getMonth()+1;//获取的月份，加1我初步认为月份是从零开始的
	if(MM<10){MM="0"+MM;}
	var dd = obj.getDate();//获取的日期数
	if(dd<10){dd="0"+dd;}
	var hh = obj.getHours();//获取的小时数
	if(hh<10){hh="0"+hh;}
	if(hh < 6){hol="凌晨好!"} 
	else if (hh < 9){hol="早上好！"} 
	else if (hh < 12){hol="上午好！"} 
	else if (hh < 14){hol="中午好！"} 
	else if (hh < 17){hol="下午好！"} 
	else if (hh < 19){hol="傍晚好！"} 
	else if (hh < 22){hol="晚上好！"} 
	else {hol="夜里好!"} 

	var mm = obj.getMinutes();//获取的是分钟数
	if(mm<10){mm="0"+mm;}
	var ss = obj.getSeconds();//这是秒
	if(ss<10){ss="0"+ss;}
	var ww = obj.getDay();
	if  ( ww==0 )  colorhead="<font color=\"#FF0000\">";
	if  ( ww > 0 && ww < 6 )  colorhead="<font color=\"#373737\">";
	if  ( ww==6 )  colorhead="<font color=\"#008000\">";
	if(ww==0) ww="星期日";
	if(ww==1) ww="星期一";
	if(ww==2) ww="星期二";
	if(ww==3) ww="星期三";
	if(ww==4) ww="星期四";
	if(ww==5) ww="星期五";
	if(ww==6) ww="星期六";
	colorfoot="<font>";
	//alert(ww);
	str = hol+"今天是："+ '<font>' + yy + "年" + MM + "月" + dd + "日" +" "+ hh + ":" + mm + ":" + ss + "  " + ww + colorfoot;
	return(str);
}
function tick(){
	var today; 
	today=new Date();
	//alert(today);
	document.getElementById("shijian").innerHTML=showLocale(today);
	setTimeout("tick()",1000);
}
tick();
function chg(obj){
$(obj).parent().siblings("ul").toggle();
		$(obj).toggleClass("biope");
}  
     

//电脑端主导航 例调用：Nav('#nav');
function Nav(id){
	var oNav = $(id);
	var aLi = oNav.find('li');
	aLi.hover(function (){
		$(this).addClass('on');
		$(this).find('.subNav').addClass('flipInY');
	},function (){
		$(this).removeClass('on');
		$(this).find('.subNav').removeClass('flipInY');
	})
};

//移动端主导航 
function mobideMenu(){
	$(".mobile-inner-header .mobile-inner-header-icon").click(function(){
	  	$(this).toggleClass("mobile-inner-header-icon-click mobile-inner-header-icon-out");

	  	$(".mobile-inner-nav").slideToggle(250);
	  	// if($(this).hasClass('mobile-inner-header-icon-click')){
	  	// 	$(this).html('&times;')
	  	// }else{
	  	// 	$(this).html('+')
	  	// }
	  });
	  $(".mobile-inner-nav a").each(function( index ) {
	  	$( this ).css({'animation-delay': (index/20)+'s'});
	  });
	  $('.mobile-inner-nav li strong').click(function(){
	  	$(this).next('dl').slideToggle(500);
	  	$(this).toggleClass('on');
	  	if($(this).hasClass('on')){
	  		$(this).html("&times;")
	  	}else{
	  		$(this).html("+")
	  	}
	})
};

// 电脑端主导航固定顶部
// function fixNav(){
// 	var sWSon = document.documentElement.clientWidth;
// 	var sHeight = document.documentElement.clientHeight;
// 	var bodyHeight = document.body.scrollHeight;
// 	var headerHeight = $('.header').outerHeight(true);
// 	if( (bodyHeight > sHeight+headerHeight) && (sWSon>1024) ){
// 		$(window).scroll(function(){
// 			var scrollTop = $(window).scrollTop();
// 			if(scrollTop > headerHeight){
// 				$('.header').css('position','fixed');
// 				$('.header').addClass('currents');
// 				$('body').css('padding-top',headerHeight);
// 				$('.top').slideUp(0);
// 			}else{
// 				$('.header').css('position','relative');
// 				$('.header').removeClass('currents');
// 				$('body').css('padding-top',0);
// 				$('.top').slideDown(0);
// 			}
// 		});
// 	}else{
// 		$('.header').css('position','relative');
// 		$('.header').removeClass('currents');
// 		$('body').css('padding-top',0);
// 		$('.top').slideDown(0);
// 	};
// };

function fixNav(){
	var iWSon = document.documentElement.clientWidth;
	var $windowHeight = $(window).height();
	var bodyHeight = $(document.body).height();
	var headerHeight = $('.header').outerHeight(true);
	if(iWSon > 1020){
		$(document).on("mousewheel DOMMouseScroll", function (e) {
			var scrollTop = $(window).scrollTop();
			if(scrollTop >= headerHeight*2 && bodyHeight > $windowHeight+headerHeight*2){
				$('.header,body').addClass('currents');
				$('body').css('padding-top',headerHeight);
				var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
					(e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox
				if (delta > 0) {
					// 向上滚
					$('header,body').addClass('currentsOn');
				} else if (delta < 0) {
					// 向下滚
					$('header,body').removeClass('currentsOn');
				}
			}else{
				
				$('.header').removeClass('currents');
				$('body').css('padding-top',0);
				$('.top').slideDown(0);
			}
		});
	}else{
		
		$('.header').removeClass('currents');
		$('body').css('padding-top',0);
		$('.top').slideDown(0);
	}
}

// 手机端菜单位置定位
function menuMiddle(){
	var sWSon = document.documentElement.clientWidth;
	if(sWSon <= 992){
			var LogoH = $('.header').height();
			var LogoLink = $('.mobile-inner-header-icon').height();
			$('.mobile-inner-header-icon').css('top',(( LogoH - LogoLink ) /2) +'px');
			$('.mobile-inner-nav').css('top',LogoH);
	}
};

// 鼠标滚动渐渐出现
$('.effect1,.effect2,.effect3,.effect4').each(function() {
	$(this).find("li").each(function(index){
		var len = $(this).parent().find("li").length;
		$( this ).css({'transition-delay': (index*0.5/len)+'s'});
	})
});
$(document).ready(function(){
	enterEffects();
})
$(window).resize(function(){
	var resizeTimer = null;
	if (resizeTimer) clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function(){
		enterEffects();
	},50);
});
$(window).scroll(function(){
	enterEffects();
});
function enterEffects(){
	var sWSon = document.documentElement.clientWidth;
	if(sWSon >= 992){
		$(".effect").each(function(index, element) {
			var e = $(this);
			var c = $(window).height();
			if($(window).scrollTop()>=$(e).offset().top - 0.9 * c){
				$(e).addClass("isView");
			}else{
				$(e).removeClass("isView");
			}
		});
	}
}

$('.select_link').click(function(){
	$(this).find('.arrow').toggleClass('on');
	$(this).find('.alert_box').toggleClass('on');
	$(this).toggleClass('on');
})
$('.select_link').mouseleave(function(){
	$(this).find('.arrow').removeClass('on');
	$(this).find('.alert_box').removeClass('on');
	$(this).removeClass('on');
})


// tab切换
$.fn.extend({
	tab: function (options){
		var defaults = {             //默认参数
			ev : 'mouseover',        //默认事件'mouseover','click'
			til : 'h2',              //默认标签
			box : '.tab_list',       //默认列表
			defaultNum : 0,          //默认展示第几个
			eachPage : 1,            //每次切换的个数
			delay : 100,             //延迟时间
			auto : true,             //是否自动切换 true,false
			speed : 4000,            //自动切换间隔时间(毫秒)
			init : function(){},     //首次加载时触发时间
			before : function (){},  //切换前触发事件
			after : function (){},   //切换后触发事件
			more : true              //是否有more,false,true
		};
		var options = $.extend(defaults, options);  //用户设置参数覆盖默认参数
		
		return this.each(function (){
			var o = options;
			var obj = $(this);
			var oTil = obj.find(o.til);
			var oBox = obj.find(o.box);
			var oMore = null;
			var iNum = o.defaultNum;
			var iLen = oTil.length;
			var iBefore = o.before;
			var iAfter = o.after;
			var iEach = o.eachPage;
						
			// 默认选中第一个
			o.init();
			change( oTil.eq(iNum) );
			
			//鼠标事件绑定
			oTil.bind(o.ev , function (){
				var _this = this;
				if(o.ev == 'mouseover' && o.delay){
					_this.timer = setTimeout(function (){
						change(_this);
					},o.delay);
				}else{
					change(_this);
				}; 
			})

			oTil.bind('mouseout',function (){
				var _this = this;
				clearTimeout(_this.timer);
			});
			
			//自动切换效果
			(function autoPlay(){
				var timer2 = null;
				if(o.auto){
					function play(){
						iNum++;
						if(iNum >= iLen){
							iNum =0;
						};
						change(oTil.eq(iNum));
					};
					timer2 = setInterval(play,o.speed);
					obj.on('mouseover',function (){
						clearInterval(timer2);
					})
					obj.on('mouseout',function (){
						timer2 = setInterval(play,o.speed);
					})
				};
			})();
			
			function change(box){
				iBefore(iNum,obj);
				// console.log(1);
				iNum = $(box).index() - obj.find(o.til).eq(0).index();
				
				oTil.removeClass('on').addClass('off');
				oBox.removeClass('on').addClass('off');
				if(o.more){
					oMore = obj.find('.more');
					oMore.removeClass('on').addClass('off');
					oMore.eq(iNum).addClass('on').removeClass('off');
				};
				oTil.eq(iNum).addClass('on').removeClass('off');
				oBox.slice( iEach * iNum , iEach * (iNum + 1) ).addClass('on').removeClass('off');
				iAfter(iNum,obj);
			}
			
		});
	}
})

// 二级页侧栏
$('.subLeftTitle').click(function(){
	$('.subMenu').toggleClass('on')
})

// 点击回到页面顶部
$('.gotop').click(function(){
	$('body,html').stop().animate({scrollTop:0});
	// $('.header').removeClass('currents');
	// $('body').css('padding-top',0);
	// $('.top').slideDown(0);
	return false;
});