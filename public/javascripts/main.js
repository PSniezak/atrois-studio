$(document).ready(function() {

	// Global
	var gradientTimeout;


	// Fullpage.js
	$('#fullpage').fullpage({
		scrollBar: false,
		autoScrolling: true,
		fixedElements: '#header, #additional',

		onLeave: function(index, nextIndex, direction) {
			if (index == 1 && direction == "down") {
				$('#additional .social').fadeIn();

				gradientTimeout = setTimeout(function() {
					$('#additional .gradient-reverse').fadeIn();
					$('#header .container').addClass('gradient');
				}, 2000);

			} else if (nextIndex == 1 && direction == "up") {
				clearTimeout(gradientTimeout);

				$('#additional .social').fadeOut();
				$('#additional .gradient-reverse').fadeOut();
				$('#header .container').removeClass('gradient');
			}
		}
	});


	// Menu
	$('nav li').hover(
		function() {
			$(this).find('.highliner').animate({
				width: "100%"
			}, 200);
		},
		function() {
			$(this).find('.highliner').animate({
				width: "0%"
			}, 200);
	});

	// Home
	$('#section-home .arrow-down a').on('click', function() {
		$.fn.fullpage.moveSectionDown();
	});

});