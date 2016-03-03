var Swipe = require('./swipe');

function flip3d(elements, opts) {
    var self = this;
    opts = opts || {};
    self.beforeCb = opts.beforeCb ? opts.beforeCb : function(){};
    self.afterCb = opts.afterCb ?opts.afterCb : function(){};

    var items = document.querySelectorAll('.item');
    self.items = Array.prototype.slice.apply(items);
    self.swipe = new Swipe('.flip3d');
    self.init();
    self.el = document.querySelector('.flip3d');
    //self.timer = self.autoslide(2000);
}


/**
 * @param {varType} n Description
 * @return {void} description
 */
flip3d.prototype.init = function() {
    var self = this;

    self.swipe.element.addEventListener('fliptrigger', function(ev) {
        if(ev.el != self.swipe.element)return;
        self.slide(ev.moveDistX);
    }, false);

    self.swipeList = [];
    self.swipeList[0] = new Swipe('.current');
    self.swipeList[1] = new Swipe('.next');
    self.swipeList[2] = new Swipe('.last');

    for (var i = 0; i < self.swipeList.length; i++) {
        self.swipeList[i].element.addEventListener('flipmove', (function(i) {
            return function(ev) {
                if (classMani(self.swipeList[i].element, 'current', 'contains')) {
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


/**
 * @param {varType} time Description
 * @return {void} description
 */
flip3d.prototype.autoslide = function(time) {
    var self = this;
    return setInterval(function() {
        self.slide(100);
    }, time);
}


/**
 * slide
 * @param {varType} dir Description
 * @return {void} description
 */
flip3d.prototype.slide = function(dir) {
    var self = this;
    if (dir < 0) {
        self.beforeCb && self.beforeCb(dir);
        left();
        self.afterCb && self.afterCb(dir);
    } else {
        self.beforeCb && self.beforeCb(dir);
        right();
        self.afterCb && self.afterCb(dir);
    }

    /**
     * Right direction Class toggle
     * @return {void} description
     */
    function right() {
        for (var i = 0; i < self.items.length; i++) {
            var _item = document.querySelector('.item'+ i);
            if (classMani(_item, 'current', 'contains')) {
                classMani(_item, 'last', 'add');
                classMani(_item, 'current', 'remove');
            } else if (classMani(_item, 'next', 'contains')) {
                classMani(_item, 'current', 'add');
                classMani(_item, 'next', 'remove');
            } else if (classMani(_item, 'last', 'contains')) {
                classMani(_item, 'next', 'add');
                classMani(_item, 'last', 'remove');
            }
        }

    }

    /**
     * Left direction Class toggle
     * @return {void} description
     */
    function left() {
        for (var i = 0; i < self.items.length; i++) {
            var _item = document.querySelector('.item' + i);
            if (classMani(_item, 'current', 'contains')) {
                classMani(_item, 'next', 'add');
                classMani(_item, 'current', 'remove');
            } else if (classMani(_item, 'next', 'contains')) {
                classMani(_item, 'last', 'add');
                classMani(_item, 'next', 'remove');
            } else if (classMani(_item, 'last', 'contains')) {
                classMani(_item, 'current', 'add');
                classMani(_item, 'last', 'remove');
            }
        }

    }
}

/**
 * @param {varType} element Description
 * @param {varType} className Description
 * @param {varType} mani Description
 * @return {void} description
 */
function classMani(element, className, mani) {
    return element.classList[mani](className);
}

/**
 * @param {varType} x Description
 * @param {varType} log Description
 * @param {varType} max Description
 * @return {void} description
 */
function damping(x, log, max) {
    var logV = Math.pow(x, log);
    if (x < 0) {
        x = -x;
        logV = Math.pow(x, log);
        return -(logV > 100 ? 100 : logV);
    };
    return logV > 100 ? 100 : logV;
}

/**
 * @param {varType} el Description
 * @param {varType} prop Description
 * @param {varType} val Description
 * @return {void} description
 */
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

module.exports = flip3d;
window.flip3d = flip3d;
