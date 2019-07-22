+function(){"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var o,r,n,s,a=function(){function e(e,t){for(var i=0;i<t.length;i++){var o=t[i];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,i,o){return i&&e(t.prototype,i),o&&e(t,o),t}}(),f=JParticles,l=f.utils,c=f.Base,u=Math.random,h=Math.PI,p=Math.sin,y=2*h,v=l.limitRandom,d=l.scaleValue,b=l.randomColor,m=l.isArray,k=l.isPlainObject,g=l.isUndefined,w=l.resize,C=l.mount,L=["fill","fillColor","line","lineColor","lineWidth","offsetLeft","offsetTop","crestHeight","speed"];(o=C("Wave"))((s=n=function(o){function r(i,o){return e(this,r),t(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,r,i,o))}return i(r,o),a(r,[{key:"init",value:function(){this.rippleLength=[],this.attrNormalize(),this.createDots(),this.draw()}},{key:"attrNormalize",value:function(){var e=this;["fill","fillColor","line","lineColor","lineWidth","offsetLeft","offsetTop","crestHeight","rippleNum","speed"].forEach(function(t){return e.attrProcessor(t)})}},{key:"attrProcessor",value:function(e){var t=this.set.num,i=this.set[e],o=i,r="offsetLeft"===e?this.cw:this.ch;for(m(i)||(o=this.set[e]=[]);t--;){var n=m(i)?i[t]:i;o[t]=g(n)?this.generateDefaultValue(e):this.scaleValue(e,n,r),"rippleNum"===e&&(this.rippleLength[t]=this.cw/o[t])}}},{key:"generateDefaultValue",value:function(e){var t=this.cw,i=this.ch;switch(e){case"lineColor":case"fillColor":e=b();break;case"lineWidth":e=v(2,.2);break;case"offsetLeft":e=u()*t;break;case"offsetTop":case"crestHeight":e=u()*i;break;case"rippleNum":e=v(t/2,1);break;case"speed":e=v(.4,.1);break;case"fill":e=!1;break;case"line":e=!0}return e}},{key:"scaleValue",value:function(e,t,i){return"offsetTop"===e||"offsetLeft"===e||"crestHeight"===e?d(t,i):t}},{key:"dynamicProcessor",value:function(e,t){var i=this,o="offsetLeft"===e?this.cw:this.ch,r=m(t);this.set[e].forEach(function(n,s,a){var f=r?t[s]:t;f=i.scaleValue(e,f,o),g(f)&&(f=n),a[s]=f})}},{key:"setOptions",value:function(e){if(this.set&&k(e))for(var t in e)"opacity"===t?this.set.opacity=e[t]:-1!==L.indexOf(t)&&this.dynamicProcessor(t,e[t])}},{key:"createDots",value:function(){for(var e=this.cw,t=this.rippleLength,i=this.set.num,o=this.dots=[];i--;)for(var r=o[i]=[],n=y/t[i],s=0;s<=e;s++)r.push({x:s,y:s*n})}},{key:"draw",value:function(){var e=this.ctx,t=this.cw,i=this.ch,o=this.paused,r=this.set,n=r.opacity;e.clearRect(0,0,t,i),e.globalAlpha=n,this.dots.forEach(function(n,s){var a=r.crestHeight[s],f=r.offsetLeft[s],l=r.offsetTop[s],c=r.speed[s];e.save(),e.beginPath(),n.forEach(function(t,i){e[i?"lineTo":"moveTo"](t.x,a*p(t.y+f)+l),!o&&(t.y-=c)}),r.fill[s]&&(e.lineTo(t,i),e.lineTo(0,i),e.closePath(),e.fillStyle=r.fillColor[s],e.fill()),r.line[s]&&(e.lineWidth=r.lineWidth[s],e.strokeStyle=r.lineColor[s],e.stroke()),e.restore()}),this.requestAnimationFrame()}},{key:"resize",value:function(){var e=this;w(this,function(t,i){["offsetLeft","offsetTop","crestHeight"].forEach(function(o){var r="offsetLeft"===o?t:i;e.set[o].forEach(function(e,t,i){i[t]=e*r})}),e.dots.forEach(function(e){e.forEach(function(e){e.x*=t,e.y*=i})})})}}]),r}(c),n.defaultConfig={num:3,fill:!1,fillColor:[],line:!0,lineColor:[],lineWidth:[],offsetLeft:[],offsetTop:[],crestHeight:[],rippleNum:[],speed:[]},r=s))}();