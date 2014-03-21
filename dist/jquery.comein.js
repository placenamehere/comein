/*
 *  jQuery Comein - v0.5
 *  A jQuery plugin to fade objects out at the edtes of the screen
 *  https://github.com/placenamehere/comein
 *
 *  Made by Chris Casciano
 *  Under MIT License
 */
;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "comein",
        dataPlugin = "plugin_" + pluginName,
        defaults = {
          fromTop: 50,
          fromBottom: 50,
          completeIn: 100,
          startOpacity: 0.3,
          startScale: 0.98
        };

    // The actual plugin constructor
    function Plugin ( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this._updateElement = function($elms,opts) {
          var opacity = 1,
              scale = 1,
              winH = $(window).height(),
              scrollTop = window.pageYOffset || document.documentElement.scrollTop,
              scrollBottom = winH + scrollTop;

          $elms.each(function() {
            var $elm = $(this);

            // decide if we're closer to the top or bottom
            if ((scrollBottom - $elm.offset().top - opts.fromBottom) < ($elm.offset().top + $elm.height() - opts.fromTop - scrollTop)) {
              opacity = (scrollBottom - $elm.offset().top - opts.fromBottom) / opts.completeIn;
              scale = (scrollBottom - $elm.offset().top - opts.fromBottom) / opts.completeIn;
            } else {
              opacity = ($elm.offset().top + $elm.height() - opts.fromTop - scrollTop) / opts.completeIn;
              scale = ($elm.offset().top + $elm.height() - opts.fromTop - scrollTop) / opts.completeIn;
            }

            if (opacity < opts.startOpacity) {
              opacity = opts.startOpacity;
            }
            if (opacity > 1) {
              opacity = 1;
            }

            if (scale < opts.startScale) {
              scale = opts.startScale;
            }
            if (scale > 1) {
              scale = 1;
            }

            $elm.css({
              "opacity": opacity,
              "transform": "scale("+scale+")"
            });

          });

        };
        this.init();
    }

    Plugin.prototype = {
        init: function () {
          var _this = this,
              $els = $(_this.element);

          console.log(_this);
          console.log($els);


          // set elements to starting display state
          _this._updateElement($els,_this.options);

          // attach events to scroll debounce
          $(window).on("scroll",function(){
              _this._updateElement($els,_this.options);
          });

        },
        destroy: function () {
          var _this = this,
              $els = $(_this.element);

          console.log(_this);
          console.log($els);

          // set all elements to normal
          // remove events

        }
    };

    /*
     * Plugin wrapper, preventing against multiple instantiations and
     * allowing any public function to be called via the jQuery plugin,
     * e.g. $(element).pluginName('functionName', arg1, arg2, ...)
     */
    $.fn[ pluginName ] = function ( arg ) {

        var args, instance;

        // only allow the plugin to be instantiated once
        if (!( this.data( dataPlugin ) instanceof Plugin )) {

            // if no instance, create one
            this.data( dataPlugin, new Plugin( this ) );
        }

        instance = this.data( dataPlugin );

        instance.element = this;

        // Is the first parameter an object (arg), or was omitted,
        // call Plugin.init( arg )
        if (typeof arg === "undefined" || typeof arg === "object") {

            if ( typeof instance.init === "function" ) {
                instance.init( arg );
            }

        // checks that the requested public method exists
        } else if ( typeof arg === "string" && typeof instance[arg] === "function" ) {

            // copy arguments & remove function name
            args = Array.prototype.slice.call( arguments, 1 );

            // call the method
            return instance[arg].apply( instance, args );

        } else {

            $.error("Method " + arg + " does not exist on jQuery." + pluginName);

        }
    };

})( jQuery, window, document );
