[![npm version](https://badge.fury.io/js/jparticles.svg)](https://badge.fury.io/js/jparticles)
[![dependencies](https://img.shields.io/badge/dependencies-none-brightgreen.svg)](https://www.npmjs.com/package/jparticles)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Barrior/JParticles/blob/master/LICENSE)


### Install

```bash
npm install jparticles --save
```

### Usage

```javascript
import JParticles from 'jparticles'
new JParticles.Particle('#demo')
```

### On-Demand Usage (Tree-shaking required, recommended)

```javascript
import { Particle, Snow } from 'jparticles'

new Particle('#demo')
new Snow('#demo-snow')
```

### On-Demand Usage

```javascript
import Particle from 'jparticles/lib/particle'
import Snow from 'jparticles/lib/snow'

new Particle('#demo')
new Snow('#demo-snow')
```

### Use in Vue project

```vue
<template>
  <div id="demo"></div>
</template>

<script>
import { Particle } from 'jparticles'

export default {
  mounted() {
    new Particle('#demo')
  }
}
</script>
```

### Use in React project

```jsx
import { Particle } from 'jparticles'

class Example extends React.Component {
  componentDidMount() {
    new Particle('#demo')
  }

  render() {
    return <div id="demo"></div>
  }
}
```

### Documentation
[See more details via the API documentation.](https://jparticles.js.org/)


### Intro

- JParticles(abbreviation for JavaScript particles) is a lightweight JavaScript library for build some cool particle effects in WEB page base on the Canvas.

- JParticles effects are mostly shared by others, but it collect them together like a porter and improve some details or functions. Thanks for the original author's ideas or codes.


### Concept

- API design concepts: `"The Write Less, Do More"` and `"Keep It Simple And Stupid"`. I hope the library is easy to use because a tool is to help peoples achieve their desired functions more quickly, rather than spend too much time to know and learn. In short, it should be both powerful and easy to extend and simple.

- I hope that codes are succinct and high performance. Thanks for colorful open source projects and something else, because JParticles has been referenced(standing on the shoulders of giants) your excellent codes or thoughts.


### Compatibility

The library should work fine on the following browsers (because of [this compatibility table](./docs/compatibility_table.md)) :

- IE 9+
- Safari 6+
- Opera 15+
- Firefox 21+
- Chrome 23+

For not support browsers it will failed quietly.


### Communication

If you have any questions or ideas to help JParticles make progress, you are welcome to put forward your views to [issues](https://github.com/Barrior/JParticles/issues) or tell us via [QQ group](http://shang.qq.com/wpa/qunwpa?idkey=f548e3f94e0040a2ac5adfe4fec6915ef67c8c1b6ba5784ff6d5049c6135a759). Thanks.


### Changelog

Detailed changes for each release are documented in the [release notes](https://github.com/Barrior/JParticles/releases).


### License

[MIT](./LICENSE)

Copyright (c) 2016-present, Barrior Wei
