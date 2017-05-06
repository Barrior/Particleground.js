+function(){"use strict";function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function s(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var i=function(){function t(t,e){for(var s=0;s<e.length;s++){var i=e[s];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,s,i){return s&&t(e.prototype,s),i&&t(e,i),e}}(),r=JParticles,o=r.utils,n=r.Base,a=(Math.random,Math.abs,Math.PI),l=Math.sin,h=Math.ceil,f=2*a,c=(o.pInt,o.limitRandom,o.calcSpeed,o.scaleValue),u=(o.randomColor,o.isArray,o.isFunction,o.isPlainObject),p=o.isUndefined,y=o.resize,d=o.defineReadOnlyProperty,m=o.registerListener,v=function(r){function o(s,i){return t(this,o),e(this,(o.__proto__||Object.getPrototypeOf(o)).call(this,o,s,i))}return s(o,r),i(o,[{key:"version",get:function(){return"2.0.0"}}]),i(o,[{key:"init",value:function(){this.c.style.borderRadius="50%",this.progress=0,this.set.offsetTop=this.ch,this.halfCH=this.ch/2,this.progressListeners=[],this.finishedListeners=[],this.attrNormalize(),this.createDots(),this.draw()}},{key:"attrNormalize",value:function(){var t=this;["offsetLeft","crestHeight"].forEach(function(e){t.set[e]=c(t.set[e],"offsetLeft"===e?t.cw:t.ch)})}},{key:"createDots",value:function(){for(var t=this.cw,e=this.dots=[],s=t/this.set.rippleNum,i=f/s,r=0;r<=t;r++)e.push({x:r,y:r*i})}},{key:"draw",value:function(){this.calcOffsetTop(),this.drawWave(),this.drawText(),this.calcProgress(),this.progress<=100?this.requestAnimationFrame():(this.progress=100,this.calcOffsetTop(),this.drawWave(),this.drawText(),this.finishedListeners.forEach(function(t){return t()}))}},{key:"drawWave",value:function(){var t=this.cxt,e=this.cw,s=this.ch,i=this.set,r=i.opacity,o=i.crestHeight,n=i.offsetLeft,a=i.offsetTop,h=i.fillColor,f=i.speed;t.clearRect(0,0,e,s),t.globalAlpha=r,t.save(),t.beginPath(),this.dots.forEach(function(e,s){t[s?"lineTo":"moveTo"](e.x,o*l(e.y+n)+a),e.y-=f}),t.lineTo(e,s),t.lineTo(0,s),t.closePath(),t.fillStyle=h,t.fill(),t.restore()}},{key:"drawText",value:function(){var t=this,e=this.cxt,s=this.cw,i=this.halfCH,r=this.progress,o=this.set,n=o.font,a=o.smallFont,l=o.color,f=o.smallFontOffsetTop,c="%",y=h(r);this.progressListeners.forEach(function(e){var s=e(t.progress);p(s)||(u(s)?(y=s.text,c=s.smallText||""):(y=s,c=""))}),e.font=n;var d=e.measureText(y).width;e.font=a;var m=e.measureText(c).width,v=(s-d-m)/2;e.textBaseline="middle",e.fillStyle=l,e.font=n,e.fillText(y,v,i),e.font=a,e.fillText(c,v+d,i+f)}},{key:"calcProgress",value:function(){if(this.immediatelyComplete)return this.progress+=this.immediatelyComplete,void(this.immediatelyComplete+=.5);if(!(this.progress>=99)){var t=this.set,e=t.easing,s=t.duration;this.startTime||(this.startTime=Date.now());var i=Date.now()-this.startTime,r=i/s;r<=1&&(this.progress=JParticles.easing[e](r,i,0,100,s),this.progress>=99&&(this.progress=99))}}},{key:"calcOffsetTop",value:function(){(this.immediatelyComplete||99!==this.progress)&&(100===this.progress?this.set.offsetTop=-this.set.crestHeight:this.set.offsetTop=h((100-this.progress)/100*this.ch+this.set.crestHeight))}},{key:"resize",value:function(){var t=this;y(this,function(){t.halfCH=t.ch/2})}},{key:"setOptions",value:function(t){if(this.set&&u(t))for(var e in t)"offsetTop"!==e&&e in this.set&&(this.set[e]=t[e])}},{key:"done",value:function(){this.set&&!this.immediatelyComplete&&(this.immediatelyComplete=1)}},{key:"onProgress",value:function(){return m.apply(void 0,[this,this.progressListeners].concat(Array.prototype.slice.call(arguments)))}},{key:"onFinished",value:function(){return m.apply(void 0,[this,this.finishedListeners].concat(Array.prototype.slice.call(arguments)))}}]),o}(n);v.defaultConfig={font:"normal 900 20px Arial",smallFont:"normal 900 14px Arial",smallFontOffsetTop:1,color:"#333",fillColor:"#27C9E5",offsetLeft:0,crestHeight:4,rippleNum:1,speed:.3,duration:5e3,easing:"swing"},delete v.prototype.pause,delete v.prototype.open,d(v,"waveLoading")}();