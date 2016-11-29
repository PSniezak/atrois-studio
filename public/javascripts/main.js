$(document).ready(function() {

	// Global
	var gradientTimeout;

	// Fullpage.js
	$('#fullpage').fullpage({
		scrollBar: false,
		autoScrolling: true,
		fixedElements: '#header, #footer',

		onLeave: function(index, nextIndex, direction) {
			if (index == 1 && direction == "down") {
				gradientTimeout = setTimeout(function() {
					$('#header .container').addClass('gradient');
				}, 2000);
			} else if (nextIndex == 1 && direction == "up") {
				clearTimeout(gradientTimeout);
				$('#header .container').removeClass('gradient');
			}
		}
	});

});