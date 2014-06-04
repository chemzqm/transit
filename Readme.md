# Transit

High performance javascript animation library with simplity in mind.

Inspired by [Velocity.js](http://julian.com/research/velocity/), use that if you use jquery.

## Example

Here is a simple slide in example.

``` js
var transit = require('transit');
transit(el, {
  'translateY': -50,
  'opacity': 0.7
})
.ease('in-quad')
.reverse()
.duration(300)
.end();
```

However, I suppose you use css animation to achieve such simple css animation, use transit when you need handle stateful animation.

## API

### transit(el | els, props)

Set animation with dom(s) and css properties.

`props` could be `translateX` `translateY` `rorate` `scale` `skew` for shorten transform properties.

### .add(el | els , props)

Add the same time-line animation with dom(s) and css properties.

### .ease([name])

Ease function name, default `out-quad` (fast-slow) see [component/ease](https://github.com/component/ease).

### .duration([ms])

Duration of animation, default 300ms.

### .end([fn])

**Must** be called to start animation with optional callback.

### .delay(ms)

Delay animation in `ms` milisecond, default `0`.

### .reverse()

Reverse the animation.

### .queue(name)

Add the animation to queue with `name`.

### .css(props)

Helper method for set default css properties before animation, using [chemzqm/style](https://github.com/chemzqm/style).

### .hide()

Helper method for hide all the el(s) when animation end.

### .disbleHA()

Use this if you want to disable `mobile hardware acceleration`.
