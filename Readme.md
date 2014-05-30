# Transit

High performance javascript animation library with simplity in mind.

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

`props` could be `translateX` `translateY` `rorate` `skew` for shrten transform properties.

### .add(el | els , props)

Add the same time-line animation with dom(s) and css properties.

### .ease([name])

Ease function name, see [component/ease](https://github.com/component/ease).

### .duration([ms])

Duration of animation, default 300ms.

### .end([fn])

**Must** be called to start animation with optional callback.

### .loop([number])

Loop the animation, default 0.

### .delay(ms)

Delay animation in `ms` milisecond, default `0`.

### .reverse()

Reverse the animation.

### .css(props)

Helper method for set default css properties before animation.

### .hide()

Helper method for hide all the el(s) when animation end.

### .disbleHA()

Use this if you want to disable `mobile hardware acceleration`.
