var map = {};
var animated = {};

exports.add = function (name, cb) {
  if (!map[name]) map[name] = [];
  map[name].push(cb);
}

exports.start = function (name) {
  if (animated[name] === true) return;
  animated[name] = true;
  function next() {
    var fn = map[name].shift();
    if (!fn) {
     animated[name] = false;
     return;
    }
    fn(function() {
      next();
    })
  }
  next();
}
