(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Swipe = __webpack_require__(1);

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


/***/ },
/* 1 */
/***/ function(module, exports) {

	function Swipe(element) {
	  var self = this;
	  self.element = typeof element == 'string' ? document.querySelector(element) : element;
	  eventTypes.forEach(function(type) {
	    self.element.addEventListener(events.start[type], self, false);
	  });
	}


	var eventTypes = ['touch', 'mouse'];
	var events = {
	  start: {
	    touch: 'touchstart',
	    mouse: 'mousedown'
	  },
	  move: {
	    touch: 'touchmove',
	    mouse: 'mousemove'
	  },
	  end: {
	    touch: 'touchend',
	    mouse: 'mouseup'
	  }
	};



	Swipe.prototype.handleEvent = function(event) {
	  var self = this;

	  switch (event.type) {
	    // start
	    case events.start.touch:
	      self._touchStart(event, 'touch');
	      break;
	    case events.start.mouse:
	      self._touchStart(event, 'mouse');
	      break;

	      // move
	    case events.move.touch:
	      self._touchMove(event, 'touch');
	      break;
	    case events.move.mouse:
	      self._touchMove(event, 'mouse');
	      break;

	      // end
	    case events.end.touch:
	      self._touchEnd(event, 'touch');
	      break;
	    case events.end.mouse:
	      self._touchEnd(event, 'mouse');
	      break;

	      // click
	    case 'click':
	      self._click(event);
	      break;
	  }
	};

	Swipe.prototype._touchStart = function(event, type) {
	  var self = this;

	  console.log('touch start');
	  if (self.scrolling) {
	    return;
	  }

	  self.element.addEventListener(events.move[type], self, false);
	  document.addEventListener(events.end[type], self, false);

	  var tagName = event.target.tagName;
	  if (type === 'mouse' && tagName !== 'SELECT' && tagName !== 'INPUT' && tagName !== 'TEXTAREA' && tagName !== 'BUTTON') {
	    event.preventDefault();
	  }

	  /* if (support.cssAnimation) {
	     self._setStyle({ transitionDuration: '0ms' });
	   }*/
	  else {
	    self.animation = false;
	  }
	  self.scrolling = true;
	  self.moveReady = false;
	  self.startPageX = getPage(event, 'pageX');
	  self.startPageY = getPage(event, 'pageY');
	  self.basePageX = self.startPageX;

	  self.baseX = getPos(event,'clientX');

	  self.directionX = 0;
	  self.startTime = event.timeStamp;
	  self._triggerEvent('flipstart', true, false);
	};

	Swipe.prototype._touchMove = function(event, type) {
	  var self = this;

	  if (!self.scrolling) {
	    return;
	  }

	  var pageX = getPage(event, 'pageX');
	  var pageY = getPage(event, 'pageY');
	  var distX;
	  var newX;

	  var nowX = getPos(event,'clientX');;

	  var moveDistX;

	  if (self.moveReady) {
	    event.preventDefault();

	    self.distX = pageX - self.basePageX;

	    self.moveDistX = nowX - self.baseX;


	    newX = self.currentX + distX;
	    if (newX >= 0 || newX < self._maxX) {
	      newX = Math.round(self.currentX + distX / 3);
	    }

	    // When distX is 0, use one previous value.
	    // For android firefox. When touchend fired, touchmove also
	    // fired and distX is certainly set to 0. 
	    self.directionX =
	      distX === 0 ? self.directionX :
	      distX > 0 ? -1 : 1;

	    // if they prevent us then stop it
	    var isPrevent = !self._triggerEvent('flipmove', true, true, {
	      delta: self.distX,
	      moveDelta: self.moveDistX,
	      direction: self.directionX,
		  moveDistX:self.moveDistX
	    });

	    if (isPrevent) {
	      self._touchAfter({
	        el:self.element,
	        moved: false,
	        originalPoint: self.currentPoint,
	        newPoint: self.currentPoint,
	        cancelled: true
	      });
	    } else {
	      //self._setX(newX);
	    }
	  } else {
		  console.log('tri');
	    // https://github.com/hokaccha/js-flipsnap/pull/36
	    var triangle = getTriangleSide(self.startPageX, self.startPageY, pageX, pageY);
	    if (triangle.z > DISTANCE_THRESHOLD) {
	      if (getAngle(triangle) > ANGLE_THREHOLD) {
	        event.preventDefault();
	        self.moveReady = true;
	        self.element.addEventListener('click', self, true);
	      } else {
	        self.scrolling = false;
	      }
	    }
	  }

	  self.basePageX = pageX;
	};

	Swipe.prototype._touchEnd = function(event, type) {
	  var self = this;

	  self.element.removeEventListener(events.move[type], self, false);
	  document.removeEventListener(events.end[type], self, false);

	  if (!self.scrolling) {
	    return;
	  }

	  var newPoint = -self.currentX / self._distance;
	  newPoint =
	    (self.directionX > 0) ? Math.ceil(newPoint) :
	    (self.directionX < 0) ? Math.floor(newPoint) :
	    Math.round(newPoint);

	  if (newPoint < 0) {
	    newPoint = 0;
	  } else if (newPoint > self._maxPoint) {
	    newPoint = self._maxPoint;
	  }

	  if (Math.abs(self.startPageX - self.basePageX) < self.threshold) {
	    newPoint = self.currentPoint;
	  }

	  self._touchAfter({
	    el:self.element,
	    moved: newPoint !== self.currentPoint,
		moveDistX: self.moveDistX,
		 directionX: self.directionX, 
	    originalPoint: self.currentPoint,
	    newPoint: newPoint,
	    cancelled: false
	  });

	};

	Swipe.prototype._click = function(event) {
	  var self = this;

	  event.stopPropagation();
	  event.preventDefault();
	};


	Swipe.prototype._touchAfter = function(params) {
	  var self = this;

	  self.scrolling = false;
	  self.moveReady = false;

	  setTimeout(function() {
	    self.element.removeEventListener('click', self, true);
	  }, 200);

	  self._triggerEvent('flipend', true, false, params);
	  if(self.moveDistX>30 || self.moveDistX<-30){
	  self._triggerEvent('fliptrigger', true, false, params);
	  }
	};

	Swipe.prototype._triggerEvent = function(type, bubbles, cancelable, data) {
	  var self = this;

	  var ev = document.createEvent('Event');
	  ev.initEvent(type, bubbles, cancelable);

	  if (data) {
	    for (var d in data) {
	      if (data.hasOwnProperty(d)) {
	        ev[d] = data[d];
	      }
	    }
	  }

	  return self.element.dispatchEvent(ev);
	};

	function getTriangleSide(x1, y1, x2, y2) {
	  var x = Math.abs(x1 - x2);
	  var y = Math.abs(y1 - y2);
	  var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

	  return {
	    x: x,
	    y: y,
	    z: z
	  };
	}

	function getAngle(triangle) {
	  var cos = triangle.y / triangle.z;
	  var radian = Math.acos(cos);

	  return 180 / (Math.PI / radian);
	}

	function getPage(event, page) {
	  return event.changedTouches ? event.changedTouches[0][page] : event[page];
	}

	function getPos(event, client) {
	  return event.touches ? event.touches[0][client] : event[client];
	}

	var DISTANCE_THRESHOLD = 5;
	var ANGLE_THREHOLD = 55;


	module.exports = Swipe;


/***/ }
/******/ ])
});
;