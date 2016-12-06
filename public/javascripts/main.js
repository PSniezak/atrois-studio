$(document).ready(function() {

  // Global
  var gradientTimeout;
  var anchors = ['accueil', 'projets', 'à-propos', 'contact', 'presse', 'store'];


  // Fullpage.js
  $('#fullpage').fullpage({
    scrollBar: false,
    autoScrolling: true,
    menu: '#menu-desktop',
    normalScrollElements: '.normal-scroll',
    fixedElements: '#header-desktop, #header-mobile, #additional',

    onLeave: function(index, nextIndex, direction) {
      if (index == 1 && direction == "down") {
        $('#additional .social').fadeIn();

        gradientTimeout = setTimeout(function() {
          $('#additional .gradient-reverse').fadeIn();
          $('#header-desktop .container').addClass('gradient');
        }, 2000);

      } else if (nextIndex == 1 && direction == "up") {
        clearTimeout(gradientTimeout);

        $('#additional .social').fadeOut();
        $('#additional .gradient-reverse').fadeOut();
        $('#header-desktop .container').removeClass('gradient');
      }

      // Menu
      if (direction == "up") {
        $("nav li[data-menuanchor='" + anchors[nextIndex - 1] +"']").find('.highliner').css({'right': 0, 'left': 'auto'});
        $("nav li[data-menuanchor='" + anchors[nextIndex - 1] +"']").find('.highliner').animate({
          width: "100%"
        }, 200);
        $('nav li.active').find('.highliner').css({'left': 0, 'right': 'auto'});
        $('nav li.active').find('.highliner').animate({
          width: "0%"
        }, 200);
      } else {
        $("nav li[data-menuanchor='" + anchors[nextIndex - 1] +"']").find('.highliner').css({'left': 0, 'right': 'auto'});
        $("nav li[data-menuanchor='" + anchors[nextIndex - 1] +"']").find('.highliner').animate({
          width: "100%"
        }, 200);
        $('nav li.active').find('.highliner').css({'right': 0, 'left': 'auto'});
        $('nav li.active').find('.highliner').animate({
          width: "0%"
        }, 200);
      }
    },

    afterRender: function() {
      var pressHeight = $('#section-press').height();
      var pressOffset = $('#section-press .container .columns').offset().top - $('#section-press').offset().top;
      $('#section-press .container .columns, #section-press .container .columns ul').height(pressHeight - pressOffset);
    }
  });


  // Menu
  $('nav li a').on('click', function() {
    $(this).next().css('width', '100%');
  });
  $('nav li').hover(
    function() {
      $(this).find('.highliner').animate({
        width: "100%"
      }, 200);
    },
    function() {
      if (!$(this).hasClass('active')) {
        $(this).find('.highliner').animate({
          width: "0%"
        }, 200);
      }
    });


  // Home
  $('#section-home .arrow-down a').on('click', function() {
    $.fn.fullpage.moveSectionDown();
  });

});