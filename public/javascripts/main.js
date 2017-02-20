$(document).ready(function() {

  // Global
  var gradientTimeout;
  var anchors = ['accueil', 'projets', 'à-propos', 'contact', 'presse', 'store'];
  var projectsContainers = [0];
  var projectsInterval;
  var containerProjectOffset;
  var highestYear;
  var aditionnalInterval;
  var timer_on = false;
  var isMobile = false;

  if (window.innerWidth < 768) {
    $('html').addClass('mobile');
    isMobile = true;
  }


  // Fullpage.js
  $('#fullpage').fullpage({
    scrollBar: false,
    autoScrolling: true,
    menu: '#menu-desktop',
    normalScrollElements: '.normal-scroll',
    scrollOverflow: true,
    animateAnchor: false,
    keyboardScrolling: false,
    fixedElements: '#header-desktop, #header-mobile, #additional, #additional-mobile, .year-fixed',

    onLeave: function(index, nextIndex, direction) {
      if (index == 1 && direction == "down") {
        $('#additional .social').fadeIn();

        gradientTimeout = setTimeout(function() {
          $('#additional .gradient-reverse, #additional-mobile .gradient-reverse').fadeIn();
          $('#header-desktop .container, #header-mobile .container').addClass('gradient');
        }, 650);

      } else if (nextIndex == 1 && direction == "up") {
        clearTimeout(gradientTimeout);

        $('#additional .social').fadeOut();
        $('#additional .gradient-reverse, #additional-mobile .gradient-reverse').fadeOut();
        $('#header-desktop .container, #header-mobile .container').removeClass('gradient');
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

      if (index == 2) {
        $('.year-fixed').stop().hide();
        $('.year').stop().fadeOut();
        $('.cover').hide();

        clearTimeout(projectsInterval);
      }
    },

    afterLoad: function(anchorLink, index) {
      if (index == 2) {
        $('.year-fixed').fadeIn();

        projectsInterval = setInterval(function() {
          var newContainerProjectOffset = $('#section-projects .container').offset().top - $('#section-projects').offset().top;
          var calculatedHeight = containerProjectOffset - newContainerProjectOffset;

          for (var i = 0; i < projectsContainers.length; i++) {
            var highest;

            if (calculatedHeight + 50 > projectsContainers[i]) {
              highest = i;
            }
          }

          $('.year').each(function() {
            if ($(this).data('year') >= highestYear - highest && $(this).data('year') != highestYear) {
              $(this).fadeOut(100);
            } else {
              $(this).fadeIn('fast');
            }
          });

          $('.year-fixed span').html(highestYear - highest);
        }, 100);
      }
    },

    afterRender: function() {
      var pressHeight = $('#section-press').height();
      var pressOffset = $('#section-press .container .columns').offset().top - $('#section-press').offset().top;

      $('#section-press .container .columns, #section-press .container .columns ul').height(pressHeight - pressOffset);

      if (isMobile) {
        $('#section-press .container').height(pressHeight - pressOffset);
      }

      var yearSectionOffset = $('.year-section').offset().left;
      containerProjectOffset = $('#section-projects .container').offset().top - $('#section-projects').offset().top;
      if (isMobile) {
        $('.year-fixed').css('left', '5%');
      } else {
        $('.year-fixed').css('left', yearSectionOffset - 58);
      }
      $('.year-fixed').css('margin-top', containerProjectOffset - 32);

      $('.year-section').each(function(index) {
        projectsContainers.push($(this).height());
      });

      for (var i = 1; i < projectsContainers.length; i++) {
        projectsContainers[i] += projectsContainers[i - 1];
      }

      highestYear = $('.year-fixed span').html();
    }
  });


  // Menu
  $('nav li a').on('click', function() {
    if ($('.slick-slider.active').length > 0) {
      showAdditionnal();
      $('#header-desktop .container, #header-mobile .container').addClass('gradient');
      $('#projects-sliders').fadeOut('fast', function() {
        $('.slick-slider.active video').trigger('pause');
        $('.slick-slider.active').hide().removeClass('active');
      });
    }

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

  // Projects
  $('.project-link').hover(function() {
    if (!isMobile) {
      var name = $(this).data('name');
      if ($('.cover[data-name="' + name +'"]').length > 0) {
        $('.cover[data-name="' + name +'"]').show();
      }
    }
  }, function() {
    if (!isMobile) {
      var name = $(this).data('name');
      if ($('.cover[data-name="' + name +'"]').length > 0) {
        $('.cover[data-name="' + name +'"]').hide();
      }
    }
  });

  // Desktop slider
  $('.project-link').on('click', function() {
    var id = $(this).data('id');
    var nameId = $(this).data('name');

    if ($('#' + id + ' .slide').length > 1) {
      $('#'+id).addClass('active').show();
      showAdditionnal();
      $('#header-desktop .container, #header-mobile .container').addClass('gradient');
      $('#projects-sliders').show("slide", { direction: "down" }, 500);
      if ($('.slick-slider.active .slick-current video').length > 0) {
        $('.slick-slider.active .slick-current video').get(0).play();
      }
    } else {
      $.ajax({
        url: "/projects/media/" + id + "/all",
        context: document.body
      }).done(function(data) {
        if (data.medias.length > 0) {
          var slides = "";

          for (var media in data.medias) {
            if (data.medias[media].media) {
              slides += '<div class="slide"><div class="overflower"><img src="/uploads/projects/' + data.medias[media].project_id + '/' + data.medias[media].media + '" alt=""></div></div>';
            } else {
              slides += '<div class="slide"><video no-controls><source src="/uploads/projects/' + data.medias[media].project_id + '/' + data.medias[media].video + '"></video></div>';
            }
          }

          $('#projects-sliders #' + id).append(slides).show();

          $('#projects-sliders').show("slide", { direction: "down" }, 500);
          if (isMobile) {
            $('#header-mobile .container').removeClass('gradient');
          } else {
            hideAdditionnal();
          }
          $('#'+id).addClass('active');

          $('#'+id+' .presentation-container .categories').html($('#'+id+' .presentation-container .categories').html().replace(/, /g, '<br>'));
          $('#projects-sliders').imagesLoaded( function() {
            $('#'+id).slick({
              arrows: false,
              fade: true,
              responsive: [
                {
                  breakpoint: 768,
                  settings: {
                  }
                }
              ]
            });
          });
        }
      });
    }
  });
  $('.close-button').on('click', function() {
    showAdditionnal();
    $('#header-desktop .container, #header-mobile .container').addClass('gradient');
    $('#projects-sliders').fadeOut('fast', function() {
      $('.slick-slider.active video').trigger('pause');
      $('.slick-slider.active').hide().removeClass('active');
    });
  });
  $('.right-cover').on('click', function() {
    $('.slick-slider.active').slick('slickNext');
    if ($('.slick-slider.active .slick-current video').length > 0) {
      $('.slick-slider.active .slick-current video').get(0).play();
    } else {
      $('.slick-slider.active video').trigger('pause');
    }
  });
  $('.left-cover').on('click', function() {
    $('.slick-slider.active').slick('slickPrev');
    if ($('.slick-slider.active .slick-current video').length > 0) {
      $('.slick-slider.active .slick-current video').get(0).play();
    } else {
      $('.slick-slider.active video').trigger('pause');
    }
  });
  $('.center-cover').hover(
    function() {
      showAdditionnal();
    },
    function() {
      setTimeout(function() {
        if ($('.slick-slider.active').length > 0) {
          hideAdditionnal();
        }
      }, 3000);
  });
});

var showAdditionnal = function() {
  if ($('.slick-slider.active').length > 0) {
    console.log("salut");
    $('#header-desktop .container, #header-mobile .container').removeClass('gradient');
    $('#header-desktop, #additional').fadeIn('fast');
  } else {
    console.log("salut 2");
    $('#header-desktop .container, #header-mobile .container').addClass('gradient');
    $('#header-desktop, #additional').fadeIn('fast');
  }
};

var hideAdditionnal = function() {
  $('#header-desktop, #additional').fadeOut('fast');
};
