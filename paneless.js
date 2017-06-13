(function($, window, document, undefined) {
  "use strict";
  var pluginName = 'paneless',
    defaults = {
      autoGen: true,
      resizeable: true,
      horizontalClass: 'horizontal',
      verticalClass: 'vertical',
      leftClass: 'left',
      rightClass: 'right',
      upClass: 'up',
      downClass: 'down',
      itemClass: 'item',
      resizeClass: 'resize'
    };

  function Plugin(element, options) {
    this.element = element;
    this.$el = $(element);
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  $.extend(Plugin.prototype, {
    init: function() {
      this._initVars();
      this.generateLayout();
    },
    _initVars: function() {
      var base = this;
      base.$w = $(window);
      base.$html = $('html');
      base.$b = $('body');
      base.$horizontals = $('.' + base.options.horizontalClass);
      base.$verticals = $('.' + base.options.verticalClass);
      base.$resizers = $('.' + base.options.resizeClass);
    },
    _updateVars: function() {
      var base = this;

      base.$horizontals = $('.' + base.options.horizontalClass);
      base.$verticals = $('.' + base.options.verticalClass);
      base.$resizers = $('.' + base.options.resizeClass);
    },
    _attachCallbacks: function() {
      var base = this;

      base.$resizers.bind("mousedown", function(e) {
        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();
        e.cancelBubble = true;
        e.returnValue = false;

        var thisel = $(this);
        $(document).bind({
          mousemove: function(e) {
            if (e.stopPropagation) e.stopPropagation();
            if (e.preventDefault) e.preventDefault();
            e.cancelBubble = true;
            e.returnValue = false;
            var x = e.pageX,
              y = e.pageY,
              prevSibling = thisel.prev(),
              nextSibling = thisel.next();
            var originalS;
            var prevS;
            var nextS;
            if (thisel.parent().hasClass(base.options.verticalClass)) {
              originalS = prevSibling.width() + nextSibling.width();
              prevS = x - prevSibling[0].getBoundingClientRect().left;
              nextS = originalS - prevS;
            } else if (thisel.parent().hasClass(base.options.horizontalClass)) {
              originalS = prevSibling.height() + nextSibling.height();
              prevS = y - prevSibling[0].getBoundingClientRect().top;
              nextS = originalS - prevS;
            } else {
              alert("fucked up a combo");
            }
            var totalScale = parseFloat(prevSibling.css('flex-grow')) + parseFloat(nextSibling.css('flex-grow'));
            prevSibling.css('flex-grow', ((prevS * totalScale) / (prevS + nextS)).toString());
            nextSibling.css('flex-grow', ((nextS * totalScale) / (prevS + nextS)).toString());
            return false;
          },
          mouseup: function(e) {
            if (e.stopPropagation) e.stopPropagation();
            if (e.preventDefault) e.preventDefault();
            e.cancelBubble = true;
            e.returnValue = false;
            $(this).unbind("mousemove");
            $(this).unbind("mouseup");
            return false;
          }
        }, false);
        return false;
      });
    },
    generateLayout: function() {
      var base = this;
      $.each(base.$verticals, function(index, container) {
        var items = $(container).children('.' + base.options.itemClass);
        $.each(items, function(undex, item) {
          if (undex != (items.length - 1)) {
            $("<div class='resize'></div>").insertAfter(item);
          }
        });
      });
      $.each(base.$horizontals, function(index, container) {
        var items = $(container).children('.' + base.options.itemClass);
        $.each(items, function(undex, item) {
          if (undex != (items.length - 1)) {
            $("<div class='resize'></div>").insertAfter(item);
          }
        });
      });
      base._updateVars();
      base._attachCallbacks();
    },
    split: function(obj, direction) {
      var base = this;
      console.log(direction);
      switch (direction) {
        case 'left':
          if($(obj).parent().parent().hasClass(base.options.verticalClass)) {
            $(obj).parent().before(obj);
            $(obj).wrap("<div class='item' />");
          } else {
            $(obj).after($(obj).siblings());
            $(obj).siblings().wrapAll("<div class='item' />");
            $(obj).wrap("<div class='item' />");
            $(obj).parent().siblings().andSelf().wrapAll("<div class='"+base.options.verticalClass+"' />");
          }
          break;
        case 'right':
          if($(obj).parent().parent().hasClass(base.options.verticalClass)) {
            $(obj).parent().after(obj);
            $(obj).wrap("<div class='item' />");
          } else {
            $(obj).before($(obj).siblings());
            $(obj).siblings().wrapAll("<div class='item' />");
            $(obj).wrap("<div class='item' />");
            $(obj).parent().siblings().andSelf().wrapAll("<div class='"+base.options.verticalClass+"' />");
          }
          break;
        case 'down':
          if($(obj).parent().parent().hasClass(base.options.horizontalClass)) {
            $(obj).parent().after(obj);
            $(obj).wrap("<div class='item' />");
          } else {
            $(obj).before($(obj).siblings());
            $(obj).siblings().wrapAll("<div class='item' />");
            $(obj).wrap("<div class='item' />");
            $(obj).parent().siblings().andSelf().wrapAll("<div class='"+base.options.horizontalClass+"' />");
          }
          break;
        case 'up':
          if($(obj).parent().parent().hasClass(base.options.horizontalClass)) {
            $(obj).parent().before(obj);
            $(obj).wrap("<div class='item' />");
          } else {
            $(obj).after($(obj).siblings());
            $(obj).siblings().wrapAll("<div class='item' />");
            $(obj).wrap("<div class='item' />");
            $(obj).parent().siblings().andSelf().wrapAll("<div class='"+base.options.horizontalClass+"' />");
          }
          break;
        default:

          break;
      }
      base._updateVars();
      base.generateLayout();
    }
  });

  $.fn[pluginName] = function(options) {
    var args = arguments;
    if (options === undefined || typeof options === 'object') {
      return this.each(function() {
        if (!$.data(this, 'plugin_' + pluginName)) {
          var plug = new Plugin(this, options);
          $.data(this, 'plugin_' + pluginName, plug);
        }
      });
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
      var returns;
      this.each(function() {
        var instance = $.data(this, 'plugin_' + pluginName);
        if (instance instanceof Plugin && typeof instance[options] === 'function') {
          returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
        }
        if (options === 'destroy') {
          $.data(this, 'plugin_' + pluginName, null);
        }
      });
      return returns !== undefined ? returns : this;
    }
  };
})(jQuery, window, document);

$('.workspace').paneless();
$('.poo').click(function() {
  $('.workspace').paneless('split', this, 'left');
});
$('.poo2').click(function() {
  $('.workspace').paneless('split', this, 'up');
});
