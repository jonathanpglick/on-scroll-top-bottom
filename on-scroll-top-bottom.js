/**
 * Fires callback functions when an element is scrolled to or away from the top
 * or bottom. The boolean passed to the callback function denotes whether it is
 * at the top/bottom or not.
 *
 * onScrollTopAndBottom(domNode,
 *   function (isAtTop) {
 *     $(domNode).toggleClass('at-top', isAtTop);
 *   },
 *   function (isAtBottom) {
 *     $(domNode).toggleClass('at-bottom', isAtBottom);
 *   }
 * );
 */
function onScrollTopAndBottom(el, fnTop, fnBottom) {

  var MutationObserver = (function () {
    var prefixes = ['WebKit', 'Moz', 'O', 'Ms', '']
    for(var i=0; i < prefixes.length; i++) {
      if(prefixes[i] + 'MutationObserver' in window) {
        return window[prefixes[i] + 'MutationObserver'];
      }
    }
    return false;
  }());

  var AT_TOP = true;
  var AT_BOTTOM = false;
  var $el = $(el);
  var elHeight = $el.outerHeight();
  var scrollHeight = $el[0].scrollHeight;

  $(window).on('resize', onSizeChange);

  // Watch for DOM changes to recalculate element height.
  if (MutationObserver) {
    new MutationObserver(onSizeChange).observe(el, {
      childList: true,
      subtree: true
    });
  }

  // Watch for images loaded to recalculate element height.
  // @see https://stackoverflow.com/a/24611104
  document.body.addEventListener('load', onSizeChange, true);

  $el.on('scroll', onScroll)

  function onSizeChange() {
    elHeight = $el.outerHeight();
    scrollHeight = $el[0].scrollHeight;
    onScroll();
  }

  function onScroll() {
    var scrollTop = $el[0].scrollTop;

    if (AT_TOP && scrollTop > 0) {
      AT_TOP = false;
      fnTop(AT_TOP);
    }
    else if (!AT_TOP && scrollTop == 0) {
      AT_TOP = true;
      fnTop(AT_TOP);
    }

    if (!AT_BOTTOM && (scrollTop + elHeight >= scrollHeight)) {
      AT_BOTTOM = true;
      fnBottom(AT_BOTTOM);
    }
    if (AT_BOTTOM && (scrollTop + elHeight < scrollHeight)) {
      AT_BOTTOM = false;
      fnBottom(AT_BOTTOM);
    }

  }

  // Initialize.
  if ($el.scrollTop() !== 0) {
    AT_TOP = true;
  }
  fnTop(AT_TOP);

  if ($el.scrollTop() + elHeight >= scrollHeight) {
    AT_BOTTOM = true;
  }
  else {
    AT_BOTTOM = false;
  }
  fnBottom(AT_BOTTOM);
}
