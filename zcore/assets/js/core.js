//********************
// js helpers
//********************

//mobile detection
var isMobile = false;
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    isMobile = true;
}



//********************
// generic functions
//********************


// Initialize Parallax Scrolling
function initSkrollr(){
	if(skrollr == 'undefined') return;
	
    if(!isMobile) skrollr.init({
        forceHeight: false,
        smoothScrolling: false
    });
}


// Initilize Menuzord
function initMenuzord(){
	$("#menuzord").menuzord();
}


//On page scroll for #id targets
function onPageScroll(){

	$('a[href*=\\#]:not([href=\\#])').click(function() {

		if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
		    var target = $(this.hash);
		    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
		    if (target.length) {
		        $('html,body').animate({
		            scrollTop: target.offset().top
		        }, 400, 'swing', function(){
		          
		        });
		        return false;
		    }
		}
	});
}



// Calling functions above after document ready
$(document).ready(function($){

	initSkrollr();
	initMenuzord();
	onPageScroll();

});