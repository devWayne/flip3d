function flip3d(elements, opts) {
  var self = this;
  var items = document.querySelectorAll('.item');
  self.items = Array.prototype.slice.apply(items);
  self.swipe = new Swipe('.flip3d');
}

flip3d.prototype.slide = function(dir) {
  var self = this;
  if (dir < 0) {
    self.items.forEach(function(item, idx) {
      if (classMani(item, 'middle', 'contains')) {
        classMani(item, 'first', 'add');
        classMani(item, 'middle', 'remove');
      } else if (classMani(item, 'first', 'contains')) {
        classMani(item, 'last', 'add');
        classMani(item, 'first', 'remove');
      } else if (classMani(item, 'last', 'contains')) {
        classMani(item, 'middle', 'add');
        classMani(item, 'last', 'remove');
      }
    });
  } else {
    self.items.forEach(function(item, idx) {
      if (classMani(item, 'middle', 'contains')) {
        classMani(item, 'last', 'add');
        classMani(item, 'middle', 'remove');
      } else if (classMani(item, 'first', 'contains')) {
        classMani(item, 'middle', 'add');
        classMani(item, 'first', 'remove');
      } else if (classMani(item, 'last', 'contains')) {
        classMani(item, 'first', 'add');
        classMani(item, 'last', 'remove');
      }
    });
  }
}


flip3d.prototype.init = function(n) {
var self = this;
  self.swipe.element.addEventListener('fliptrigger', function(ev) {
    self.slide(ev.moveDistX);
  }, false);

  self.swipeList = [];
  for (var i = 0; i < n; i++) {
    self.swipeList[i] = new Swipe('.item' + i);
    self.swipeList[i].element.addEventListener('flipmove', (function(i) {
      return function(ev) {
        if (classMani(self.swipeList[i].element, 'middle', 'contains')) {
          var dv = damping(ev.moveDistX, 0.75);
          console.log(dv);
          Css(self.swipeList[i].element, '-webkit-transform', 'translate3d(' + parseInt(dv) + 'px,0,1px)');
          Css(self.swipeList[i].element, '-webkit-transition', 'none');
        }
      }
    })(i), false);
    self.swipeList[i].element.addEventListener('flipend', (function(i) {
      return function(ev) {
        self.swipeList[i].element.style.cssText = '';
      }
    })(i), false);
  }
}

function classMani(element, className, mani) {
  return element.classList[mani](className);
}

function damping(x, log, max) {
  var logV = Math.pow(x, log);
  if (x < 0) {
    x = -x;
    logV = Math.pow(x, log);
    return -(logV > 100 ? 100 : logV);
  };
  return logV > 100 ? 100 : logV;
}

function Css(el, prop, val) {
  if (!el) return;
  else if (arguments.length == 2) {
    if (typeof prop == 'object') {
      setCssObj(el, prop)
    } else {
      return getCss(el, prop)
    }
  } else {
    setCss(el, prop, val)
  }
}

/**
 * @param {Element} el Description
 * @param {String} prop Description
 * @return {void} description
 */
function getCss(el, prop) {
  return getComputedStyle ? getComputedStyle(el).getPropertyValue(prop) : false;
}

/**
 * @param {Element} el Description
 * @param {String} prop Description
 * @param {String} val Description
 * @return {void} description
 */
function setCss(el, prop, val) {
  if (typeof(val) == 'string') {
    var css = prop + ":" + val + ';';
    el.style.cssText += css;
  }
}

/**
 * @param {Element} el Description
 * @param {Object} obj Description
 * @return {void} description
 */
function setCssObj(el, obj) {
  for (var key in obj) {
    setCss(el, key, obj[key]);
  }
}
