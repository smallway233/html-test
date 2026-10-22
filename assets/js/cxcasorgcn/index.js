$(function() {
	
	$('.index_011 .box > ul').slick({
		dots: true,
		arrows: false,
		focusOnSelect: true,
		autoplay: true,
		autoplaySpeed: 4000,
		// vertical:true,
		focusOnSelect: true
	});
	
	$(".mode01 .lf").tab({
	    ev: 'click',
	    til: '.index_title h2',
	    box : '.index_011 .box',
		before: beforeTab1,
		after: afterTab1,
		more : true, 
	    auto: false
	});
	function beforeTab1(iNum,obj){
		$('.index_011 .box > ul').slick('slickPause')
	}
	function afterTab1(iNum,obj){
		$('.index_011 .box.on > ul').slick('refresh')
	}
	
	
	
	
	
});


