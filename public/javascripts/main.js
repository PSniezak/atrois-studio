$(document).ready(function() {

  $('#loader .container svg').fadeIn();

  // Languages
  $('.languages').on('click', function(e) {
    e.stopPropagation();
    e.preventDefault();

    var hash = window.location.hash.substr(1);
    var href = $(this).attr('href') + "#" + hash;

    if ($('.slick-slider.active').length > 0) {
      var currentId = $('.unique-slider.active').attr('id');
      sessionStorage.setItem('project', currentId);
    }

    $(location).attr('href', href);
  });

  // Lazy Load
  $('.project-cover').Lazy();


  // Year margin
  if (!isMobile) {
    var offsetLogo = parseInt($('#additional .logo').offset().top) - 120;
    $('.year-section:first-child').css('margin-top', offsetLogo+'px');
  }

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
  var isMenuActive = false;
  var language = window.location.pathname;
  var lazier;

  if (window.innerWidth < 768) {
    $('html').addClass('mobile');
    isMobile = true;
  }

  // Additional
  if (language == "/jp") {
    var offsetSocial = $('#header-desktop .container .middle li:last').offset().left;
    $('#additional .social').css('left', offsetSocial - 18);
  } else {
    var offsetSocial = $('#header-desktop .container .middle li:last').offset().left;
    $('#additional .social').css('left', offsetSocial - 51);
  }

  // Fullpage.js
  $('#fullpage').fullpage({
    scrollBar: false,
    autoScrolling: true,
    menu: '#menu-desktop, #menu-mobile',
    normalScrollElements: '.normal-scroll',
    normalScrollElementTouchThreshold: 10,
    scrollOverflow: true,
    animateAnchor: false,
    keyboardScrolling: false,
    fixedElements: '#header-desktop, #header-mobile, #additional, #additional-mobile, .year-fixed',

    onLeave: function(index, nextIndex, direction) {
      if (nextIndex == 2) {
        $('.fp-scroller, .iScrollIndicator').css('transform', 'translate(0px, 0px)');
        $('.fp-section').find('.fp-scrollable').data('iscrollInstance').y = 0;
      }

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

      if (nextIndex == 5 && isMobile) {
        $('#section-press .left ul').scrollTop(0)
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
      var newHeight = pressHeight - pressOffset;

      $('#section-press .container .columns, #section-press .container .columns ul, #section-press .container .columns .left').height(newHeight);
      $('#section-press .container .columns, #section-press .container .columns ul, #section-press .container .columns .left').css('max-height', newHeight+'px');

      if (isMobile) {
        $('#section-press .container').height(pressHeight - pressOffset - 20);
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
  $('#header-mobile .logo a').on('click', function() {
    isMenuActive = false;
    $('.hamb-menu').removeClass('is-clicked');

    $('#menu-container-mobile .container, #menu-container-mobile .copyright').fadeOut("fast", function() {
      $('#menu-container-mobile').hide("slide", { direction: "down" }, 500);

      if ($('.slick-slider.active').length > 0) {
        setTimeout(function() {
          $('#additional, #header-desktop, #header-mobile').removeClass('blending');
        }, 500);
        $('#projects-sliders').fadeOut('fast', function() {
          $('.slick-slider.active video').trigger('pause');
          $('.slick-slider.active').hide().removeClass('active');
        });
      }
    });
  });
  $('nav li a').on('click', function() {
    if (isMobile) {
      if ($('.slick-slider.active').length > 0) {
        setTimeout(function() {
          $('#header-desktop .container, #header-mobile .container').addClass('gradient');
          $('#additional, #header-desktop, #header-mobile').removeClass('blending');
        }, 500);
        $('#projects-sliders').fadeOut('fast', function() {
          $('.slick-slider.active video').trigger('pause');
          $('.slick-slider.active').hide().removeClass('active');
        });
      }

      isMenuActive = false;
      $('.hamb-menu').removeClass('is-clicked');

      $('#menu-container-mobile .container, #menu-container-mobile .copyright').fadeOut("fast", function() {
        $('#menu-container-mobile').hide("slide", { direction: "down" }, 500);
        $('.mobile-close-button').hide();
      });
    } else {
      if ($('.slick-slider.active').length > 0) {
        showAdditionnal();
        setTimeout(function() {
          $('#header-desktop .container, #header-mobile .container').addClass('gradient');
          $('#additional, #header-desktop, #header-mobile').removeClass('blending');
        }, 500);
        $('#projects-sliders').fadeOut('fast', function() {
          $('.slick-slider.active video').trigger('pause');
          $('.slick-slider.active').hide().removeClass('active');
        });
      }

      $(this).next().css('width', '100%');
    }
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
  // Menu mobile
  $('.hamb-menu').on('click', function() {
    if (isMenuActive) {
      isMenuActive = false;
      $(this).removeClass('is-clicked');
      if ($('.slick-slider.active').length > 0) {
        $('#header-mobile').addClass('blending');
      }

      $('#menu-container-mobile .container, #menu-container-mobile .copyright').fadeOut("fast", function() {
        $('#menu-container-mobile').hide("slide", { direction: "down" }, 500);
        if ($('.slick-slider.active').length > 0) {
          $('.mobile-close-button').show();
        }
      });
    } else {
      if ($('.slick-slider.active').length > 0) {
        $('#header-mobile').removeClass('blending');
      }
      isMenuActive = true;
      $(this).addClass('is-clicked');

      $('#menu-container-mobile').show("slide", { direction: "down" }, 500, function() {
        $('#menu-container-mobile .container, #menu-container-mobile .copyright').fadeIn();
        $('.mobile-close-button').hide();
      });
    }
  });

  // Home
  $('#section-home .arrow-down a').on('click', function() {
    $.fn.fullpage.moveSectionDown();
  });

  if (isMobile) {
    $('#section-home .background-slider').hide();
    $('#section-home .background-slider-mobile').show();

    $('#section-home .background-slider-mobile').slick({
      slidesToShow: 1,
  	  autoplay: false,
  	  autoplaySpeed: 2600,
      speed: 700,
      infinite: true,
      fade: true,
      arrows: false,
      swipe: false,
      pauseOnFocus: false,
      pauseOnHover: false
    });
  } else {
    $('#section-home .background-slider').slick({
      slidesToShow: 1,
  	  autoplay: false,
  	  autoplaySpeed: 2600,
      speed: 700,
      infinite: true,
      fade: true,
      arrows: false,
      swipe: false,
      pauseOnFocus: false,
      pauseOnHover: false
    });

    if ($('#section-home .background-slider video').length > 0) {
      $('#section-home .background-slider video').get(0).play();
    }
  }

  // Covers
  $('.covers-container .cover').each(function(i) {
    var posy = parseInt(Math.floor(Math.random()*(($(window).height() - 120 - $(this).find('img').height())-120+1)+120) - 120);
    var posx = parseInt(Math.floor(Math.random()*(($(window).width() - $(this).find('img').width())-60+1)+60));

    $(this).find('img').css('top', posy+"px");
    $(this).find('img').css('left', posx+"px");
    $(this).css('display', "none");
    $(this).css('visibility', "visible");
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
  $('.project-link, .background-slide').on('click', function() {
    var id = $(this).data('id');
    var nameId = $(this).data('name');


    if ($('#' + id + ' .slide').length > 2) {
      $('#'+id).slick('slickGoTo', 0, false);
      $('#'+id).addClass('active').show();
      $('#additional, #header-mobile, #header-desktop').addClass('blending');
      if (!isMobile) {
        hideAdditionnal();
      } else {
        $('.mobile-close-button').show();
      }
      $('#header-desktop .container, #header-mobile .container').removeClass('gradient');
      $('#projects-sliders').show("slide", { direction: "down" }, 500);
      if ($('.slick-slider.active .slick-current video').length > 0) {
        $('.slick-slider.active .slick-current video').get(0).play();

        $('.slick-slider.active .slick-current video').on('timeupdate', function() {
          var $current = $('.slick-slider.active .slick-current'),
              $video = $('.slick-slider.active .slick-current video');

          if ($video[0]) {
            $current.find('.video-current').text(formatTime($video[0].currentTime));
            $current.find('.video-duration').text(formatTime($video[0].duration));

            var percent = $video[0].currentTime / $video[0].duration;
            $current.find('.video-progress').width((percent * 100) + "%");
          }
        });
      }
    } else {
      if (isMobile) {
        var fetchUrl = "/projects/media_mobile/" + id + "/all";
      } else {
        var fetchUrl = "/projects/media/" + id + "/all";
      }
      $.ajax({
        url: fetchUrl,
        context: document.body
      }).done(function(data) {
        if (data.medias.length > 0) {
          var slides = "";

          if (isMobile) {
            for (var media in data.medias) {
              if (data.medias[media].media) {
                slides += '<div class="slide"><div class="left-cover"></div><div class="right-cover"></div><div class="center-cover"></div><div class="overflower background-image-container" data-src="/uploads/projects/' + data.medias[media].project_id + '/' + data.medias[media].media + '"></div></div>';
              } else {
                slides += '<div class="slide"><div class="left-cover"></div><div class="right-cover"></div><div class="custom-controls"> <div class="play-pause pause">Pause</div> <div class="video-scrubber-container"><div class="video-scrubber"> <div class="video-progress"></div> </div></div> <div class="video-timer"><span class="video-current">00:00</span><span>/</span><span class="video-duration">00:00</span></div> </div><div class="overflower overflower-video"><video no-controls><source src="/uploads/projects/' + data.medias[media].project_id + '/' + data.medias[media].video + '"></video></div></div>';
              }
            }
          } else {
            for (var media in data.medias) {
              if (data.medias[media].media) {
                slides += '<div class="slide"><div class="left-cover"></div><div class="right-cover"></div><div class="center-cover"></div><div class="overflower background-image-container" style="background-image: url(\'/uploads/projects/' + data.medias[media].project_id + '/' + data.medias[media].media + '\');"></div></div>';
              } else {
                slides += '<div class="slide"><div class="left-cover"></div><div class="right-cover"></div><div class="custom-controls"> <div class="play-pause pause">Pause</div> <div class="video-scrubber-container"><div class="video-scrubber"> <div class="video-progress"></div> </div></div> <div class="video-timer"><span class="video-current">00:00</span><span>/</span><span class="video-duration">00:00</span></div> </div><div class="overflower overflower-video"><video no-controls><source src="/uploads/projects/' + data.medias[media].project_id + '/' + data.medias[media].video + '"></video></div></div>';
              }
            }
          }

          $('#projects-sliders #' + id).append(slides).show();
          $('.background-image-container').Lazy();
          lazier = $('.background-image-container').data("plugin_lazy");

          if (isMobile) {
            $('#'+id).on('init', function(){
              $('#projects-sliders').show("slide", { direction: "down" }, 500);
              lazier.loadAll();
              lazier.update();
            });

            $('#'+id).on('afterChange', function(event, slick, currentSlide, nextSlide){
              lazier.force($('.slick-current .background-image-container'));
              lazier.update();
            });

            $('#'+id).slick({
              arrows: false,
              fade: true
            });
          } else {
            $('#projects-sliders').imagesLoaded( function() {
              $('#'+id).slick({
                arrows: false,
                fade: true,
                lazyLoad: 'progressive',
                responsive: [
                  {
                    breakpoint: 768,
                    settings: {
                      verticalSwiping: false,
                    }
                  }
                ]
              });
            });

            $('#projects-sliders').show("slide", { direction: "down" }, 500);
          }

          if (isMobile) {
            $('.mobile-close-button').show();
            $('#header-mobile .container').removeClass('gradient');
          } else {
            hideAdditionnal();
          }
          $('#'+id).addClass('active');
          $('#additional, #header-mobile, #header-desktop').addClass('blending');

          if (!isMobile) {
            $('#'+id+' .presentation-container .categories').html($('#'+id+' .presentation-container .categories').html().replace(/, /g, '<br>'));
          }

          // More on description
          if ($('#'+id+' .presentation-container .left').height() < $('#'+id+' .presentation-container .right .overflower p').height()) {
            $('#'+id+' .presentation-container .right .toggle-more').show();
          }

          $('#'+id+' .presentation-container .right .toggle-more').on('click', function() {
            if ($(this).html() == "Fermer" || $(this).html() == "Close" || $(this).html() == "닫기" || $(this).html() == "閉じる") {
              if (language == "/kor") {
                $('#'+id+' .presentation-container .right .toggle-more').html('+ 이 프로젝트에 대한 정보');
              } else if (language == "/jp") {
                $('#'+id+' .presentation-container .right .toggle-more').html('このプロジェクトの詳細について');
              } else if (language == "/en") {
                $('#'+id+' .presentation-container .right .toggle-more').html('+ informations about this project');
              } else {
                $('#'+id+' .presentation-container .right .toggle-more').html('+ d\'informations sur ce projet');
              }

              $('#'+id+' .presentation-container .right .overflower').removeClass('longer');
              $('#'+id+' .presentation-container .right .overflower-container').removeClass('normal-scroll');
              $('#'+id+' .presentation-container .right .overflower').css('max-height', 120);
            } else {
              if (language == "/kor") {
                $('#'+id+' .presentation-container .right .toggle-more').html('닫기');
              } else if (language == "/jp") {
                $('#'+id+' .presentation-container .right .toggle-more').html('閉じる');
              } else if (language == "/en") {
                $('#'+id+' .presentation-container .right .toggle-more').html('Close');
              } else {
                $('#'+id+' .presentation-container .right .toggle-more').html('Fermer');
              }

              if ($('#'+id+' .presentation-container .right .overflower p').height() > 100) {
                $('#'+id+' .presentation-container .right .overflower').css('max-height', 248);
                $('#'+id+' .presentation-container .overflower-container .overflower').addClass('longer');
                $('#'+id+' .presentation-container .right .overflower-container').addClass('normal-scroll');
              } else {
                $('#'+id+' .presentation-container .right .overflower').css('max-height', $('#'+id+' .presentation-container .right .overflower p').height() + 20);
              }
            }
          });
        }
      });
    }
  });
  $('.close-button, .mobile-close-button').on('click', function() {
    if (isMobile) {
      lazier.destroy();
    }
    $('#projects-sliders').fadeOut('fast', function() {
      $('.slick-slider.active video').trigger('pause');
      $('.slick-slider.active').hide().removeClass('active');
    });

    if (!isMobile) {
      showAdditionnal();
    }
    $('#additional, #header-mobile, #header-desktop').removeClass('blending');

    $('.mobile-close-button').hide();

    if (!$('#section-home').hasClass('active')) {
      setTimeout(function() {
        $('#header-desktop .container, #header-mobile .container').addClass('gradient');
      }, 500);
    }
  });
  $('#projects-sliders').on('click', '.right-cover, .mobile-arrow-right', function() {
    $('.slick-slider.active').slick('slickNext');
    if ($('.slick-slider.active .slick-current video').length > 0) {
      $('.slick-slider.active .slick-current video').get(0).play();

      $('.slick-slider.active .slick-current video').on('timeupdate', function() {
        var $current = $('.slick-slider.active .slick-current'),
            $video = $('.slick-slider.active .slick-current video');

        if ($video[0]) {
          $current.find('.video-current').text(formatTime($video[0].currentTime));
          $current.find('.video-duration').text(formatTime($video[0].duration));

          var percent = $video[0].currentTime / $video[0].duration;
          $current.find('.video-progress').width((percent * 100) + "%");
        }
      });
    } else {
      $('.slick-slider.active video').trigger('pause');
    }
  });
  $('#projects-sliders').on('click', '.left-cover, .mobile-arrow-left', function() {
    $('.slick-slider.active').slick('slickPrev');
    if ($('.slick-slider.active .slick-current video').length > 0) {
      $('.slick-slider.active .slick-current video').get(0).play();

      $('.slick-slider.active .slick-current video').on('timeupdate', function() {
        var $current = $('.slick-slider.active .slick-current'),
            $video = $('.slick-slider.active .slick-current video');

        if ($video[0]) {
          $current.find('.video-current').text(formatTime($video[0].currentTime));
          $current.find('.video-duration').text(formatTime($video[0].duration));

          var percent = $video[0].currentTime / $video[0].duration;
          $current.find('.video-progress').width((percent * 100) + "%");
        }
      });
    } else {
      $('.slick-slider.active video').trigger('pause');
    }
  });
  if (!isMobile) {
    $('.presentation-container').hover(
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
    $(document).on("mouseenter", ".center-cover", function() {
      showAdditionnal();
    });
    $(document).on("mouseleave", ".center-cover", function() {
      setTimeout(function() {
        if ($('.slick-slider.active').length > 0) {
          hideAdditionnal();
        }
      }, 3000);
    });
  }
  // Video custom controls
  $(document).on('click', '.custom-controls .play-pause', function() {
    var $this = $(this),
        video = $('.slick-slider.active .slick-current video')[0];

    if (video.paused) {
      video.play();
      $this.addClass("pause");
      $this.text('Pause');
    } else {
      video.pause();
      $this.removeClass("pause");
      $this.text('Play');
    }
  });
  // Video custom controls
  $(document).on('click', '.custom-controls .video-scrubber-container', function() {
    var $current = $('.slick-slider.active .slick-current'),
        $video = $('.slick-slider.active .slick-current video');

    var positionX = (event.pageX - $current.find('.video-scrubber-container').offset().left);
    var newTime = $video[0].duration * positionX / $current.find('.video-scrubber-container').width();

    $video[0].currentTime = newTime;
  });
});

var showAdditionnal = function() {
  if ($('.slick-slider.active').length > 0) {
    $('#header-desktop .container, #header-mobile .container').removeClass('gradient');
    $('#additional > *, #header-desktop').fadeIn('fast');
  } else {
    if (!$('#section-home').hasClass('active')) {
      setTimeout(function() {
        $('#header-desktop .container, #header-mobile .container').addClass('gradient');
      }, 500);
    }
    $('#additional > *, #header-desktop').fadeIn('fast');
  }
};

var hideAdditionnal = function() {
  $('#additional > *, #header-desktop').fadeOut('fast');
};

function formatTime(seconds) {
  var minutes = Math.floor(seconds / 60),
   seconds = Math.floor(seconds % 60);

  seconds = (seconds >= 10) ? seconds : "0" + seconds;
  minutes = (minutes >= 10) ? minutes : minutes;

  return minutes + ":" + seconds;
}

window.onresize = function() {
  if (window.innerWidth < 768) {
    $('html').addClass('mobile');
    isMobile = true;
  } else {
    $('html').removeClass('mobile');
    isMobile = false;
  }

  var yearSectionOffset = $('.year-section').offset().left;
  containerProjectOffset = $('#section-projects .container').offset().top - $('#section-projects').offset().top;

  if (isMobile) {
    $('.year-fixed').css('left', '5%');
  } else {
    $('.year-fixed').css('left', yearSectionOffset - 58);
  }
  $('.year-fixed').css('margin-top', containerProjectOffset - 32);
}
