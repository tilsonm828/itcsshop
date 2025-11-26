
  (function ($) {
  
  "use strict";

    // MENU
    $('.navbar-collapse a').on('click',function(){
      $(".navbar-collapse").collapse('hide');
    });
    
    // CUSTOM LINK
    $('.smoothscroll').click(function(){
      var el = $(this).attr('href');
      var elWrapped = $(el);
      var header_height = $('.navbar').height();
  
      scrollToDiv(elWrapped,header_height);
      return false;
  
      function scrollToDiv(element,navheight){
        var offset = element.offset();
        var offsetTop = offset.top;
        var totalScroll = offsetTop-navheight;
  
        $('body,html').animate({
        scrollTop: totalScroll
        }, 300);
      }
    });

    $(window).on('scroll', function(){
      function isScrollIntoView(elem, index) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(window).height()*.5;
        if(elemBottom <= docViewBottom && elemTop >= docViewTop) {
          $(elem).addClass('active');
        }
        if(!(elemBottom <= docViewBottom)) {
          $(elem).removeClass('active');
        }
        var MainTimelineContainer = $('#vertical-scrollable-timeline')[0];
        var MainTimelineContainerBottom = MainTimelineContainer.getBoundingClientRect().bottom - $(window).height()*.5;
        $(MainTimelineContainer).find('.inner').css('height',MainTimelineContainerBottom+'px');
      }
      var timeline = $('#vertical-scrollable-timeline li');
      Array.from(timeline).forEach(isScrollIntoView);
    });

    // Auto-update elements for weekday dates (Mon–Fri)
    function startDateUpdater() {
      var ids = ['date-of-monday','date-of-tuesday','date-of-wednesday','date-of-thursday','date-of-friday'];

      function formatDate(d) {
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      }

      function getCurrentMonday(fromDate) {
        var m = new Date(fromDate);
        var day = m.getDay(); // 0 (Sun) .. 6 (Sat)
        var daysSinceMonday = (day + 6) % 7; // 0 if Monday, 1 if Tuesday, ..., 6 if Sunday
        m.setDate(m.getDate() - daysSinceMonday);
        m.setHours(0,0,0,0);
        return m;
      }

      function update() {
        var now = new Date();
        var monday = getCurrentMonday(now);

        // For each weekday id, if element exists, set its date to monday + offset
        for (var i = 0; i < ids.length; i++) {
          var id = ids[i];
          var $el = $('#' + id);
          if ($el.length === 0) continue;
          var d = new Date(monday);
          d.setDate(monday.getDate() + i); // 0 => Monday, 1 => Tuesday, ...
          $el.text(formatDate(d));
        }

        // Also set the active tab pane and tab button according to current weekday.
        // Map: Monday (1) -> index 0, ... Friday (5) -> index 4. Default to Monday for weekends.
        var paneIds = ['design-tab-pane','marketing-tab-pane','finance-tab-pane','music-tab-pane','education-tab-pane'];
        var tabIds = ['design-tab','marketing-tab','finance-tab','music-tab','education-tab'];

        function setActiveTabForWeekday(nowDate) {
          var day = nowDate.getDay(); // 0 (Sun) .. 6 (Sat)
          var index = (day >= 1 && day <= 5) ? (day - 1) : 0; // default Monday on weekends

          for (var j = 0; j < paneIds.length; j++) {
            var $pane = $('#' + paneIds[j]);
            if ($pane.length === 0) continue;
            if (j === index) $pane.attr('class', 'tab-pane fade show active');
            else $pane.attr('class', 'tab-pane fade');
          }

          for (var k = 0; k < tabIds.length; k++) {
            var $tab = $('#' + tabIds[k]);
            if ($tab.length === 0) continue;
            if (k === index) $tab.addClass('active'); else $tab.removeClass('active');
          }
        }

        setActiveTabForWeekday(now);
      }

      update();

      // Schedule updates at local midnight only.
      // We compute milliseconds until the next local midnight and set a timeout.
      // After running at midnight we schedule the next midnight again (recursive)
      // so this works across DST changes.
      function msUntilNextMidnight() {
        var now = new Date();
        var next = new Date(now);
        next.setDate(now.getDate() + 1);
        next.setHours(0,0,0,0);
        return next - now;
      }

      function scheduleNextMidnight() {
        var ms = msUntilNextMidnight();
        setTimeout(function() {
          try { update(); } catch (e) { /* keep scheduling even if update throws */ }
          scheduleNextMidnight();
        }, ms);
      }

      scheduleNextMidnight();
    }

    $(startDateUpdater);
  
  })(window.jQuery);

