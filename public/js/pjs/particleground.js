!function(e){"function"==typeof define&&define.amd?define([],e):"object"==typeof module&&module.exports?module.exports=e():e()}(function(){"use strict";function e(e){return parseInt(e,10)}function t(){return"#"+g().toString(16).slice(-6)}function n(e,t){return g()*(e-t)+t}function o(){var e,t,n=arguments,r=n[0]||{},c=!1,a=n.length,u=1;for("boolean"==typeof r&&(c=r,r=n[1]||{},u++);a>u;u++)for(t in n[u])e=n[u][t],c&&(i(e)||b(e))?r[t]=o(c,b(e)?[]:{},e):r[t]=e;return r}function r(e,t){return Object.prototype.toString.call(e)===t}function i(e){return r(e,"[object Object]")}function c(e){return e&&"object"==typeof e&&(1===e.nodeType||9===e.nodeType)}function a(t,n){var o=v.getComputedStyle(t)[n];return C.test(o)?e(o):o}function u(e){for(var t=e.offsetLeft||0,n=e.offsetTop||0;e=e.offsetParent;)t+=e.offsetLeft,n+=e.offsetTop;return{left:t,top:n}}function f(e,t,n){e.addEventListener(t,n)}function s(e,t,n){e.removeEventListener(t,n)}function d(e){var n=e instanceof Array?e.length:!1,o=function(){return e[y(g()*n)]};return n?o:t}function h(e,t){if(!A)return!1;if(c(e))t.container=e;else if(!(t.container=w.querySelector(e)))throw new Error(e+" is not defined");return t.c=w.createElement("canvas"),t.cw=t.c.width=a(t.container,"width"),t.ch=t.c.height=a(t.container,"height"),t.cxt=t.c.getContext("2d"),t.paused=!1,t.container.innerHTML="",!!t.container.appendChild(t.c)}function l(e,t){A&&!e.paused&&(e.paused=!0,t&&t.call(e))}function p(e,t){A&&e.paused&&(t&&t.call(e),e.paused=!1,e.draw())}function m(e,t){e.set.resize&&f(v,"resize",function(){var n=e.cw,o=e.ch;e.cw=e.c.width=a(e.container,"width"),e.ch=e.c.height=a(e.container,"height");var r=e.cw/n,i=e.ch/o;e.dots.forEach(function(e){e.x*=r,e.y*=i}),t&&t.call(e,r,i),e.paused&&e.draw()})}var v=window,w=document,g=Math.random,y=Math.floor,b=Array.isArray,A=!!w.createElement("canvas").getContext,C=/^\d+(\.\d+)?[a-z]+$/i;v.requestAnimationFrame=function(e){return e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||function(t){e.setTimeout(t,1e3/60)}}(v);var x={version:"1.0.0",canvasSupport:A,util:{pInt:e,randomColor:t,createColor:d,limitRandom:n,extend:o,typeChecking:r,isPlainObject:i,isElem:c,getCss:a,offset:u,createCanvas:h,pause:l,open:p,resize:m},inherit:{color:function(){return this.color=d(this.set.color),this.color()},pause:function(){l(this)},open:function(){p(this)},resize:function(){m(this)},requestAnimationFrame:function(){!this.paused&&v.requestAnimationFrame(this.draw.bind(this))}},event:{on:f,off:s},extend:function(e){return o(e,this.inherit),this}};return v.Particleground=x,x});
//# sourceMappingURL=../map/pjs/particleground.js.map
