$(document).ready(function() {

	// Fullpage.js
	$('#fullpage').fullpage({
		scrollBar: false,
		autoScrolling: true,
		fixedElements: '#header, #footer',

		onLeave: function(index, nextIndex, direction) {
			if (index == 1 && direction == "down") {
				setTimeout(function() {
					$('#header .container').addClass('gradient');
				}, 2000);
			} else if (nextIndex == 1 && direction == "up") {
				$('#header .container').removeClass('gradient');
			}
		}
	});

});