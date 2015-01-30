
(function (window, document, $) {

    // http://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
    window.mobilecheck = (function() {
        var check = false;
        (function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    })();

    /* Constants */
    var ACTIVE_CLASS    = 'active',
        SECOND_CLASS    = 'second-class', 
        THIRD_CLASS     = 'third-class',
        THROTTLE_RATE   = 700;

    /* Globals */
    // TODO: Remove these. 
    var $sections,
        $player,
        active = 0; 

    /* 
     * Stops the video playing, covers it, hides the player.
     * This is to keep from having to animate an iframe.
     */
    var killVideo = function() {
        var $video = $('section.video'),
            $playerFrame = $video.find('iframe'),
            $videoCover = $video.find('.video-cover');
        
        $player.api('pause');
        $videoCover.show();
        $playerFrame.hide();
    };


    /* 
     * Makes the @idx-th element active, and adjusts the 
     * surrounding elements appropriately.
     */
    var updateActive = function(idx) {
        var $sections = $('.content section');

        // Sanity check
        if(idx >= $sections.length || idx < 0) {
            console.log($sections);
            console.log($sections.length);
            return console.log('Update index out of bounds', idx);
        }

        // Adjust state
        // TODO: Remove this
        active = idx;

        // Update classes
        // TODO: do we need second/third class anymore? 
        $sections.removeClass(ACTIVE_CLASS + ' ' + SECOND_CLASS + ' ' + THIRD_CLASS);
        var $active = $sections.eq(active).addClass(ACTIVE_CLASS);

        $sections.removeClass('hideme');

        // TODO: find another non-obvious efficient way to get all after/before the immediate 7.
        $active.next().next().next().next().next().next().next().next().next().next().next().next().next().next().nextAll().addClass('hideme');
        $active.prev().prev().prev().prev().prev().prev().prev().prev().prev().prev().prev().prev().prev().prev().prevAll().addClass('hideme');

        // TODO: I think we can remove this
        $active.next().addClass(SECOND_CLASS);
        $active.prev().addClass(SECOND_CLASS);

        var splinterHeight = 0.5,
            headerHeight   = 4,
            activeHeight   = 50,
            hidemeHeight   = 0;

        var activeHeader = $active.hasClass('header'),
            siblingTotal = Math.max($active.next().length + $active.prev().length, 1);

        var $headers = $sections.filter('.header'),
            $hideme = $sections.filter('.hideme:not(.header)'),
            $splinters = $sections.filter(':not(.header, .hideme)'),
            splinterCount = $splinters.length - $headers.length - (activeHeader ? 0 : 1),
            headerCount = $headers.length - (activeHeader ? 1 : 0),
            secondClassHeight = (100 - activeHeight - headerHeight*headerCount - splinterHeight*splinterCount)/2;

        activeHeight = activeHeight + (siblingTotal == 1 ? secondClassHeight : 0);

        // Splinters
        $splinters.height(splinterHeight + '%');
        // Headers
        $headers.height(headerHeight + '%');
        // Active
        $active.height(activeHeight + '%');
        // Second class
        $active.next().height(secondClassHeight + '%');
        $active.prev().height(secondClassHeight + '%');
        // Hideme
        $hideme.height(hidemeHeight + '%');

    };


    /* 
     * Let people navigate with arrow keys.
     * Useful for testing.
     */
    var initializeArrowHandlers = function() {
        var $sections = $('.content section');
        // _.throttle prevents key events happening faster than css animations
        var keyhandler = _.throttle(function(e) {
            
            // Pause the video if we're leaving it.
            if (active === 0) { 
                killVideo();
            }

            switch(e.which) {
                case 37: // left
                case 38: // up
                    if (active > 0) {
                        fixScroll(active-1);
                        updateActive(active - 1);
                    }
                break;

                case 39: // right
                case 40: // down
                    if (active < $sections.length - 1) {
                        fixScroll(active+1);
                        updateActive(active + 1);
                    }
                break;

                // Ignore other keys
                default: return; 
            }
            e.preventDefault(); // prevent the default action
        }, THROTTLE_RATE);

        $(document).keydown(keyhandler);
    };


    /* 
     * Fixes page scroll whenever we jump to another section without scrolling.
     */
     var fixScroll = function(idx) {
        var sectionCount = $('section').length,
            pageHeight = $(document).height(),
            sectionPercent = idx/sectionCount,
            scrollTo = Math.round(pageHeight * sectionPercent);

        $(window).scrollTop(scrollTo);
     };

    /* 
     * Let people set an active element by clicking 
     */
    var initializeClickHandlers = function() {
        $('.content section').click(function() {
            console.log('click', this);
            var idx = $(this).data('index');
            fixScroll(idx);
            updateActive(idx);

        });
    };

    /* 
     * Handle scrolling
     */
    var initializeScrollHandler = function() {
        // We can't help fast scrolling, but we can help fast updating. 
        var updateScroll = _.throttle(updateActive, THROTTLE_RATE);

        $(window).scroll(function() {
            var $sections = $('section');
            // Figure out how far the user has scrolled
            var scrollPercent = ($(window).scrollTop() / $(document).height());

            // Figure out which section should be active
            var newActive = Math.round(scrollPercent * $sections.length);

            // Update the screen
            updateScroll(newActive);
        });
    };

    /* 
     * Handle play/pause video events 
     */
    var initializeVideoHandlers = function() {
        var $video = $('section.video'),
            $playerFrame = $video.find('iframe'),
            $videoCover = $video.find('.video-cover');

        // Make the video appear and play when you click the cover.
        $videoCover.click(function() {
            // Don't do anything if it's not active
            if(!$video.hasClass('active')) {
                return;
            }

            $playerFrame.show();
            $videoCover.fadeOut(1000, function() {
                $player.api('play');
            });
        });
    };

    /* 
     * Initialize on page load 
     */
    $(document).ready(function() {

        // Defer showing body 
        setTimeout(function() {
            $('body').fadeIn(200);    
        }, 50);
        

        // Add 'static' class to page on mobile. 
        if ( window.mobilecheck ) {
            $('body').addClass('static');
            console.log('static site');
            return;
        } else {
            console.log('not static site');
        }

        // Hide all but the initial 14 non-header slides.
        $('section.human').addClass('hideme').slice(0,14).removeClass('hideme');

        // Get all sections
        var $sections = $('.content section');
        $sections.each(function(idx, elem) {
            $(elem).data('index', idx);
        });

        // Initialize vimeo player
        $player = $f( $('.video iframe')[0] );
        window.$player = $player;

        // Starting state
        updateActive(active);

        // Bind handlers
        initializeArrowHandlers();
        initializeClickHandlers();
        initializeVideoHandlers();
        initializeScrollHandler();
       
        // Prevent some of the flash of unloaded content.
        console.log('good to go');
    });

})(window, document, jQuery);