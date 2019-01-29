$(function(){
    components.firstInit();

    

    slider.init('.owl-carousel');
});


$(window).load(function(){
    components.animateOnView('.reveal-js');
});


//Global function
var app = (function(){

    var ismobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
        },
        any: function () {
            return (ismobile.Android() || ismobile.BlackBerry() || ismobile.iOS() || ismobile.Opera() || ismobile.Windows());
        }
    };

    return{
        ismobile    : ismobile
    }

})();




var components = (function(){
    // cached

    function responsiveCheck(){
        if($(window).width() < 1300 && app.ismobile.any()) {
            $('html').addClass('is-mobile');

            if($(window).height() > $(window).width()){
                $('html')
                    .removeClass('orient-landscape')
                    .addClass('orient-portrait');

            } else {
                $('html')
                    .removeClass('orient-portrait')
                    .addClass('orient-landscape');
            }
        } else {
            $('html').removeClass('is-mobile orient-portrait orient-landscape');
        }
    };

    function setHeroHeight(){
        var $el = $('#hero');
        var wHeight = $(window).height();

        $el.css({
            'height' : (wHeight * 0.8) + 'px'
        })
    }

    function headerInit(){
        var $header = $('#header');

    };

    function animateOnView(elem){
        var $window = $(window);

        var $animation_elements = $(elem);

        function check_if_in_view() {
            var window_height = $window.height();
            var window_top_position = $window.scrollTop();
            var window_bottom_position = (window_top_position + window_height);

            $.each($animation_elements, function() {
                var $element = $(this);
                
                var element_height = $element.outerHeight();
                var element_top_position = $element.offset().top + 200;
                var element_bottom_position = (element_top_position + element_height);
                

                //check to see if this current container is within viewport
                if ((element_bottom_position >= window_top_position) && (element_top_position <= window_bottom_position)) {
                    $element.addClass('in-view');
                }
            });
        }

        $window.on('scroll resize', check_if_in_view);
        $window.trigger('scroll');
    };

    function firstInit(){

        $(window).on('ready resize',function(e){
            responsiveCheck();
            setHeroHeight();
            headerInit();
            
        });
        
    };

    return {
        animateOnView: animateOnView,
        firstInit: firstInit
    }
})();




var slider = (function(){
    // cache function
    function init(elem){
        var $owlSelector = $(elem);
        var values = {};

        $owlSelector.each(function() {
            var $this = $(this);

            values['items'] = 1;
            values['fade'] = false;
            values['margin'] = 0;
            values['center'] = false;
            values['width'] = false;
            values['autoplay'] = false;
            values['timeout'] = 3000;
            values['loop'] = false;
            values['speed'] = 500;
            values['nav'] = false;
            values['navskin'] = 'light';
            values['dots'] = false;
            values['drag'] = true;
            values['stagepadding'] = 0;
            
            
            values['lg'] = 1; // items on lg
            values['md'] = 1; // items on md
            values['sm'] = 1; // items on sm

            $.each($this.data(), function(i, v) {
                values[i] = v;
            });

            $(this).owlCarousel({
                items              : values['items'],
                slideBy            : 1,
                animatein          : (values['fade'] == true) ? 'fadeIn' : null,
                animateOut         : (values['fade'] == true) ? 'fadeOut' : null,
                margin             : values['margin'],
                center             : values['center'],
                autoWidth          : values['width'],
                autoplay           : values['autoplay'],
                autoplayTimeout    : values['timeout'],
                loop               : values['loop'],
                autoplaySpeed      : values['speed'],
                slideSpeed         : values['speed'],
                navSpeed           : values['speed'],
                dotsSpeed          : values['speed'],
                dragEndSpeed       : values['speed'],
                nav                : values['nav'],
                dots               : values['dots'],
                stagePadding       : values['stagepadding'],
                touchDrag          : values['drag'],
                mouseDrag          : values['drag'],
                navClass           : [ 'owl-prev ' + values['navskin'] + '-nav', 'owl-next ' + values['navskin'] + '-nav' ],
                navText: [
                    '<span class="s_nav prev"><i class="icon-left-open-big"></i></span>',
                    '<span class="s_nav next"><i class="icon-right-open-big"></i></span>'
                ],
                responsive: {
                    0: {
                        items: values['sm'],
                        margin: values['margin'] / 2,
                        stagePadding : values['stagepadding'] / 3
                    },
                    768: {
                        items: values['md'],
                        margin: values['margin'] / 2,
                        stagePadding : values['stagepadding'] / 2
                        
                    },
                    1200: {
                        items: values['lg'],
                        margin: values['margin'],
                        stagePadding : values['stagepadding']
                    }
                }
            });
        });
    }

    return {

        init : init
    }
})();
















