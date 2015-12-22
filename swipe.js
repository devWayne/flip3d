function Swipe(element) {
  var self = this;
  self.element = document.querySelector(element);
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

