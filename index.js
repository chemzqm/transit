var ismobile = require("ismobile");
var style = require('style');
var raf = require('raf');
var Tween = require('tween');
var queues = require('./queue')

function assertNumbers(o) {
  Object.keys(o).forEach(function(key) {
    if (typeof o[key] !== 'number') throw new Error(key + ' is not a number field');
  });
}

function Transit(el, props) {
  if (!(this instanceof Transit)) return new Transit(el, props);
  this.map = [];
  this.add(el, props);
}


Transit.prototype.add = function (el, props) {
  assertNumbers(props);
  this.map.push({
    el: el,
    props: props
  })
  return this;
}

Transit.prototype.ease = function (name) {
  this._ease = name;
  return this;
}

Transit.prototype.duration = function (ms) {
  this._duration = ms;
  return this;
}

Transit.prototype.end = function (cb) {
  cb = cb || function() {}
  if (!this._queue) return this.start(cb);
  var self = this;
  queues.add(this._queue, function(next) {
    self.start(function() {
      cb();
      next();
    })
  });
  queues.start(this._queue);
}

Transit.prototype.queue = function (name) {
  this._queue = name;
  return this;
}

Transit.prototype.start = function (cb) {
  if (this.map.length === 0) return cb ? cb() : null;
  var tweens = [];

  var delay = this._delay || 0;
  setTimeout(function() {
    if (this._css) this._css();
    this.map.forEach(function(obj) {
      var tween = this.createTween(obj.el, obj.props, callback);
      tweens.push(tween);
    }.bind(this));

    function animate() {
      raf(animate);
      tweens.forEach(function(tween) {
        tween.update();
      })
    }
    animate();
  }.bind(this), delay);

  var called = false;
  var self = this;
  function callback() {
    if (called) return;
    if (self._hide) self._hide();
    delete self._hide;
    animate = function(){};
    called = true;
    cb();
  }
}

Transit.prototype.createTween = function (els, props, cb) {
  if (els.nodeType) els = [els];
  var styles = Object.keys(props);
  var ha = ismobile && !this._disableHA;
  var start = {}, end;
  styles.forEach(function(name) {
    start[name] = style(els).get(name);
    if (!start[name]) {
      if (/^(opacity|scale)$/.test(name)) {
        start[name] = 1;
      } else {
        start[name] = 0;
      }
    }
  })
  if (this._reverse) {
    end = start;
    start = props;
  } else {
    end = props;
  }
  var tween = Tween(start)
    .ease(this._ease || 'out-quad')
    .to(end)
    .duration(this._duration || 1000);

  //In Chrome and Safari we might see a flickering effect when using CSS transforms or animations.
  if (ha) {
    style(els).set({
      'backface-visibility': 'hidden',
      'perspective': 1000
    });
  }
  tween.update(function(o) {
    if (ha) o['translateZ'] = 0;
    style(els).set(o);
  });
  tween.on('end', cb);
  return tween;
}

Transit.prototype.delay = function (ms) {
  this._delay = ms;
  return this;
}

Transit.prototype.reverse = function () {
  this._reverse = true;
  return this;
}

Transit.prototype.css = function (props) {
  var self = this;
  this._css = function () {
    self.each(function(o) {
      style(o.el).set(props);
    })
  }
  return this;
}

Transit.prototype.each = function (fn) {
  this.map.forEach(function(o) {
    fn(o);
  })
}

Transit.prototype.hide = function () {
  var self = this;
  this._hide = function () {
    self.each(function(o) {
      var el = o.el;
      if (el.nodeType) {
        el.classList.add('hide');
      } else {
        for (var i = 0, len = el.length; i < len; i++) {
          el[i].classList.add('hide');
        }
      }
    })
  }
  return this;
}

Transit.prototype.disableHA = function () {
  this._disableHA = true;
  return this;
}

module.exports = Transit;
