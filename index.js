var ismobile = require("ismobile");
var style = require('style');
var raf = require('raf');
var Tween = require('tween');

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

Transit.proptotype.add = function (el, props) {
  assertNumbers(props);
  this.map.push({
    el: el,
    props: props
  })
}

Transit.proptotype.ease = function (name) {
  this._ease = name || 'out-quad';
  return this;
}

Transit.proptotype.duration = function (ms) {
  this._duration = ms || 1000;
  return this;
}

Transit.proptotype.end = function (cb) {
  if (this.map.length === 0) return cb ? cb() : null;
  var tweens = [];

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

  var delay = this._delay || 0;
  setTimeout(function() {
    animate();
  }, delay);

  var called = false;
  var self = this;
  function callback() {
    if (called) return;
    animate = function(){};
    called = true;
    cb();
  }
}

Transit.proptotype.createTween = function (els, props, cb) {
  if (els.nodeType) els = [els];
  var el = els[0];
  var styles = Object.keys(props);
  var start = {}, end;
  styles.forEach(function(name) {
    start[name] = style(el).get(name);
  })
  if (this._reverse) {
    end = start;
    start = props;
  } else {
    end = props
  }
  var tween = Tween(start)
    .ease(this._ease)
    .to(end)
    .duration(this._duration);

  tween.update(function(o) {
    els.forEach(function(el) {
      style(el).set(o);
    })
  })
  tween.on('end', cb);
  return tween;
}

Transit.proptotype.delay = function (ms) {
  this._delay = ms;
  return this;
}

Transit.proptotype.reverse = function () {
  this._reverse = true;
  return this;
}

Transit.proptotype.css = function (props) {
  this.map.forEach(function(o) {
    var els = o.el;
    if (els.nodeType) {
      style(els).set(props)
    }
  })
  return this;
}

Transit.proptotype.hide = function () {
  this._hide = true;
  return this;
}

Transit.proptotype.disableHA = function () {
  this._disableHA = true;
  return this;
}

