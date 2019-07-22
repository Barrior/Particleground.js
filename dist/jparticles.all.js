/**
 * JParticles v2.1.0 (https://github.com/Barrior/JParticles)
 * Copyright 2016-present Barrior <Barrior@qq.com>
 * Licensed under the MIT (https://opensource.org/licenses/MIT)
 */
+function(){function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e){return parseInt(e,10)}function n(e){return e.replace(F.trimAll,"")}function i(){return"#"+z().toString(16).slice(-6)}function o(e,t){return e===t?e:z()*(e-t)+t}function r(){var e=arguments,t=e[0]||{},n=!1,i=e.length,o=1,s=void 0,a=void 0,l=void 0;for(f(t)&&(n=t,t=e[1]||{},o++);o<i;o++)for(a in e[o])if(s=e[o][a],n&&(c(s)||(l=X(s)))){var u=t[a];l?(l=!1,u=X(u)?u:[]):u=c(u)?u:{},t[a]=r(n,u,s)}else t[a]=s;return t}function s(e,t){return Object.prototype.toString.call(e)===t}function a(e){return s(e,"[object Function]")}function c(e){return s(e,"[object Object]")}function l(e){return"string"==typeof e}function f(e){return"boolean"==typeof e}function u(e){return void 0===e}function h(e){return null===e}function p(e){return!(!e||1!==e.nodeType)}function v(e,n){var i=R.getComputedStyle(e)[n];return F.styleValue.test(i)?t(i):i}function d(e){var t=e.getBoundingClientRect();return{left:window.pageXOffset+t.left,top:window.pageYOffset+t.top}}function y(e,t,n){e.addEventListener(t,n)}function m(e,t,n){e.removeEventListener(t,n)}function b(e){e.cw=e.c.width=v(e.container,"width")||H,e.ch=e.c.height=v(e.container,"height")||D}function g(e,t){return e>0&&e<1?t*e:e}function w(e,t){return(o(e,t)||e)*(z()>.5?1:-1)}function x(e,t){if(e.set){for(var n=arguments.length,i=Array(n>2?n-2:0),o=2;o<n;o++)i[o-2]=arguments[o];for(var r=0;r<i.length;r++)a(i[r])&&t.push(i[r])}return e}function O(e){var t=!!X(e)&&e.length,n=function(){return e[M(z()*t)]};return l(e)?function(){return e}:t?n:i}function k(e,t){e.canvasRemoved||!e.set||e.paused||(a(t)&&t.call(e,"pause"),e.paused=!0)}function E(e,t){!e.canvasRemoved&&e.set&&e.paused&&(a(t)&&t.call(e,"open"),e.paused=!1,e.draw())}function P(e,t){e.set.resize&&(e._resizeHandler=function(){var n=e.cw,i=e.ch;b(e);var o=e.cw/n,r=e.ch/i;X(e.dots)&&e.dots.forEach(function(e){c(e)&&(e.x*=o,e.y*=r)}),a(t)&&t.call(e,o,r),e.paused&&e.draw()},y(R,"resize",e._resizeHandler))}function T(e,t,i){n(t).split(",").forEach(function(t){e[t]=function(){q[t](this,i)}})}function C(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:B;Object.defineProperty(n,t,{value:e,writable:!1,enumerable:!0,configurable:!1})}function j(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:B;return function(n){Object.defineProperty(t,e,{value:n,writable:!1,enumerable:!0,configurable:!1}),e=e.charAt(0).toLowerCase()+e.substring(1),Object.defineProperty(t,e,{value:n,writable:!1,enumerable:!0,configurable:!1})}}var L=!0,S=/msie\s8.0/i.test(navigator.userAgent);Object.defineProperty&&!S||(L=!1,Object.defineProperty=function(e,t,n){e[t]=n.value}),"function"!=typeof Object.create&&(Object.create=function(){function e(){}var t=Object.prototype.hasOwnProperty;return function(n){if("object"!=typeof n)throw TypeError("Object prototype may only be an Object or null");e.prototype=n;var i=new e;if(e.prototype=null,arguments.length>1){var o=Object(arguments[1]);for(var r in o)t.call(o,r)&&(i[r]=o[r])}return i}}());var _=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),R=window,A=document,z=Math.random,M=Math.floor,X=Array.isArray,Y=!!R.DeviceOrientationEvent,H=485,D=300,F={trimAll:/\s/g,styleValue:/^\d+(\.\d+)?[a-z]+$/i},N=function(){function t(n,i,o){e(this,t),L&&(this.container=p(i)?i:A.querySelector(i))&&(this.set=r(!0,{},B.commonConfig,n.defaultConfig,o),this.c=A.createElement("canvas"),this.ctx=this.c.getContext("2d"),this.paused=!1,b(this),this.container.innerHTML="",this.container.appendChild(this.c),this.color=O(this.set.color),this.observeCanvasRemoved(),this.init(),this.resize())}return _(t,[{key:"requestAnimationFrame",value:function(){this.canvasRemoved||this.paused||R.requestAnimationFrame(this.draw.bind(this))}},{key:"observeCanvasRemoved",value:function(){var e=this;this.destructionListeners=[],W(this.c,function(){e.canvasRemoved=!0,e._resizeHandler&&m(R,"resize",e._resizeHandler),e.destructionListeners.forEach(function(e){e()})})}},{key:"onDestroy",value:function(){return x.apply(void 0,[this,this.destructionListeners].concat(Array.prototype.slice.call(arguments)))}},{key:"pause",value:function(){k(this)}},{key:"open",value:function(){E(this)}},{key:"resize",value:function(){P(this)}}]),t}();R.requestAnimationFrame=function(e){return e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||function(t){e.setTimeout(t,1e3/60)}}(R);var W=function(){var e=R.MutationObserver||R.WebKitMutationObserver,t=function e(t,n){if(t===n)return!0;if(p(t))for(var i=t.children,o=i.length;o--;)if(e(i[o],n))return!0;return!1},n=function(n,i){new e(function(e,o){for(var r=e.length;r--;)for(var s=e[r].removedNodes,a=s.length;a--;)if(t(s[a],n))return o.disconnect(),i()}).observe(document,{childList:!0,subtree:!0})},i=function(e,n){var i=function i(o){t(o.target,e)&&(document.removeEventListener("DOMNodeRemoved",i),n())};document.addEventListener("DOMNodeRemoved",i)};return e?n:i}(),q={orientationSupport:Y,regExp:F,pInt:t,trimAll:n,randomColor:i,limitRandom:o,extend:r,typeChecking:s,isPlainObject:c,isFunction:a,isArray:X,isString:l,isBoolean:f,isUndefined:u,isNull:h,isElement:p,observeElementRemoved:W,getCss:v,offset:d,on:y,off:m,scaleValue:g,calcSpeed:w,pause:k,open:E,resize:P,modifyPrototype:T,defineReadOnlyProperty:C,mount:j,registerListener:x},V={opacity:1,color:[],resize:!0},I={linear:function(e,t,n,i){return n+(i-n)*e},swing:function(){return I.easeInOutQuad.apply(I,arguments)},easeInOutQuad:function(e,t,n,i,o){return(t/=o/2)<1?i/2*t*t+n:-i/2*(--t*(t-2)-1)+n}},B={utils:q,Base:N,easing:I};!function e(t){for(var n in t){var i=t[n];C(i,n,t),c(i)&&e(i)}}(B),B.commonConfig=V,R.JParticles=B,C("2.1.0","version",B),"function"==typeof define&&define.amd?define(function(){return B}):"object"==typeof module&&module.exports&&(module.exports=B)}(),function(){"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function n(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function i(e,t,n){for(;e=e.offsetParent;)if(x(e,t)===n)return!0;return!1}var o,r,s,a,c=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),l=JParticles,f=l.utils,u=l.Base,h=Math.random,p=Math.abs,v=Math.PI,d=Math.floor,y=2*v,m=f.pInt,b=f.limitRandom,g=f.calcSpeed,w=f.scaleValue,x=f.getCss,O=f.offset,k=f.isElement,E=f.isNull,P=f.on,T=f.off,C=f.orientationSupport,j=f.resize,L=f.mount;(o=L("Particle"))((a=s=function(o){function r(n,i){return e(this,r),t(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,r,n,i))}return n(r,o),c(r,[{key:"init",value:function(){this.attrNormalize(),this.set.range>0&&(this.positionX=h()*this.cw,this.positionY=h()*this.ch,this.defineLineShape(),this.positionEvent()),this.mouseX=this.mouseY=0,this.createDots(),this.draw(),this.parallaxEvent()}},{key:"attrNormalize",value:function(){var e=this.cw,t=this.set;["num","proximity","range"].forEach(function(n){t[n]=m(w(t[n],e))}),k(t.eventElem)||t.eventElem===document||(t.eventElem=this.c)}},{key:"defineLineShape",value:function(){var e=this,t=this.set,n=t.proximity,i=t.range;switch(t.lineShape){case"cube":this.lineShapeMaker=function(t,o,r,s,a){var c=e.positionX,l=e.positionY;p(t-r)<=n&&p(o-s)<=n&&p(t-c)<=i&&p(o-l)<=i&&p(r-c)<=i&&p(s-l)<=i&&a()};break;default:this.lineShapeMaker=function(t,o,r,s,a){var c=e.positionX,l=e.positionY;p(t-r)<=n&&p(o-s)<=n&&(p(t-c)<=i&&p(o-l)<=i||p(r-c)<=i&&p(s-l)<=i)&&a()}}}},{key:"createDots",value:function(){var e=this.cw,t=this.ch,n=this.color,i=this.set,o=i.num,r=i.maxR,s=i.minR,a=i.maxSpeed,c=i.minSpeed,l=i.parallaxLayer,f=l.length;for(this.dots=[];o--;){var u=b(r,s);this.dots.push({r:u,x:b(e-u,u),y:b(t-u,u),vx:g(a,c),vy:g(a,c),color:n(),parallaxLayer:l[d(h()*f)],parallaxOffsetX:0,parallaxOffsetY:0})}}},{key:"draw",value:function(){var e=this.cw,t=this.ch,n=this.ctx,i=this.set,o=i.range,r=i.lineWidth,s=i.opacity;n.clearRect(0,0,e,t),n.lineWidth=r,n.globalAlpha=s,this.updateXY(),this.dots.forEach(function(e){var t=e.x,i=e.y,o=e.r,r=e.parallaxOffsetX,s=e.parallaxOffsetY;n.save(),n.beginPath(),n.arc(t+r,i+s,o,0,y),n.fillStyle=e.color,n.fill(),n.restore()}),o>0&&this.connectDots(),this.requestAnimationFrame()}},{key:"connectDots",value:function(){var e=this.dots,t=this.ctx,n=this.lineShapeMaker,i=e.length;e.forEach(function(o,r){for(var s=o.x+o.parallaxOffsetX,a=o.y+o.parallaxOffsetY;++r<i;)!function(){var i=e[r],c=i.x+i.parallaxOffsetX,l=i.y+i.parallaxOffsetY;n(s,a,c,l,function(){t.save(),t.beginPath(),t.moveTo(s,a),t.lineTo(c,l),t.strokeStyle=o.color,t.stroke(),t.restore()})}()})}},{key:"updateXY",value:function(){var e=this.paused,t=this.mouseX,n=this.mouseY,i=this.cw,o=this.ch,r=this.set,s=r.parallax,a=r.parallaxStrength;this.dots.forEach(function(r){if(!e){if(s){var c=a*r.parallaxLayer;r.parallaxOffsetX+=(t/c-r.parallaxOffsetX)/10,r.parallaxOffsetY+=(n/c-r.parallaxOffsetY)/10}r.x+=r.vx,r.y+=r.vy;var l=r.x,f=r.y,u=r.r,h=r.parallaxOffsetX,v=r.parallaxOffsetY;l+=h,f+=v,l+u>=i?r.vx=-p(r.vx):l-u<=0&&(r.vx=p(r.vx)),f+u>=o?r.vy=-p(r.vy):f-u<=0&&(r.vy=p(r.vy))}})}},{key:"setElemOffset",value:function(){return this.elemOffset=this.set.eventElem===document?null:O(this.set.eventElem)}},{key:"proxyEvent",value:function(e,t){var n=this,o=this.set.eventElem,r=null;C&&(r=function(e){n.paused||E(e.beta)||t(Math.min(Math.max(e.beta,-90),90),e.gamma)},P(window,"deviceorientation",r));var s=function(t){if(!n.paused){var r=t.pageX,s=t.pageY;n.setElemOffset()&&(i(o,"position","fixed")&&(r=t.clientX,s=t.clientY),r-=n.elemOffset.left,s-=n.elemOffset.top),e(r,s)}};P(o,"mousemove",s),this.onDestroy(function(){T(o,"mousemove",s),T(window,"deviceorientation",r)})}},{key:"positionEvent",value:function(){var e=this,t=this.set.range;t>this.cw&&t>this.ch||this.proxyEvent(function(t,n){e.positionX=t,e.positionY=n},function(t,n){e.positionY=-(t-90)/180*e.ch,e.positionX=-(n-90)/180*e.cw})}},{key:"parallaxEvent",value:function(){var e=this;this.set.parallax&&this.proxyEvent(function(t,n){e.mouseX=t-e.cw/2,e.mouseY=n-e.ch/2},function(t,n){e.mouseX=-n*e.cw/180,e.mouseY=-t*e.ch/180})}},{key:"resize",value:function(){var e=this;j(this,function(t,n){e.set.range>0&&(e.positionX*=t,e.positionY*=n,e.mouseX*=t,e.mouseY*=n)})}}]),r}(u),s.defaultConfig={num:.12,maxR:2.4,minR:.6,maxSpeed:1,minSpeed:.1,proximity:.2,range:.2,lineWidth:.2,lineShape:"spider",eventElem:null,parallax:!1,parallaxLayer:[1,2,3],parallaxStrength:3},r=a))}(),function(){"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function n(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var i,o,r,s,a=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),c=JParticles,l=c.utils,f=c.Base,u=Math.random,h=Math.abs,p=Math.PI,v=2*p,d=l.pInt,y=l.limitRandom,m=l.calcSpeed,b=l.mount;(i=b("Snow"))((s=r=function(i){function o(n,i){return e(this,o),t(this,(o.__proto__||Object.getPrototypeOf(o)).call(this,o,n,i))}return n(o,i),a(o,[{key:"init",value:function(){this.dots=[],this.createDots(),this.draw()}},{key:"snowShape",value:function(){var e=this.set,t=e.maxR,n=e.minR,i=e.maxSpeed,o=e.minSpeed,r=y(t,n);return{r:r,x:u()*this.cw,y:-r,vx:m(i,o),vy:h(r*m(i,o)),color:this.color()}}},{key:"createDots",value:function(){for(var e=d(6*u());e--;)this.dots.push(this.snowShape())}},{key:"draw",value:function(){var e=this,t=this.ctx,n=this.cw,i=this.ch,o=this.paused,r=this.set.opacity;t.clearRect(0,0,n,i),t.globalAlpha=r,this.dots.forEach(function(r,s,a){var c=r.x,l=r.y,f=r.r;t.save(),t.beginPath(),t.arc(c,l,f,0,v),t.fillStyle=r.color,t.fill(),t.restore(),o||(r.x+=r.vx,r.y+=r.vy,u()>.99&&u()>.5&&(r.vx*=-1),c<0||c-f>n?a.splice(s,1,e.snowShape()):l-f>i&&a.splice(s,1))}),!o&&u()>.9&&this.createDots(),this.requestAnimationFrame()}}]),o}(f),r.defaultConfig={color:"#fff",maxR:6.5,minR:.4,maxSpeed:.6,minSpeed:.1},o=s))}(),function(){"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function n(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var i,o,r,s,a=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),c=JParticles,l=c.utils,f=c.Base,u=Math.PI,h=Math.sin,p=Math.ceil,v=2*u,d=l.scaleValue,y=l.isPlainObject,m=l.isUndefined,b=l.resize,g=l.mount,w=l.registerListener,x=(i=g("WaveLoading"))((s=r=function(i){function o(n,i){return e(this,o),t(this,(o.__proto__||Object.getPrototypeOf(o)).call(this,o,n,i))}return n(o,i),a(o,[{key:"init",value:function(){this.c.style.borderRadius="50%",this.progress=0,this.set.offsetTop=this.ch,this.halfCH=this.ch/2,this.progressListeners=[],this.finishedListeners=[],this.attrNormalize(),this.createDots(),this.draw()}},{key:"attrNormalize",value:function(){var e=this;["offsetLeft","crestHeight"].forEach(function(t){e.set[t]=d(e.set[t],"offsetLeft"===t?e.cw:e.ch)})}},{key:"createDots",value:function(){for(var e=this.cw,t=this.dots=[],n=e/this.set.rippleNum,i=v/n,o=0;o<=e;o++)t.push({x:o,y:o*i})}},{key:"draw",value:function(){this.calcOffsetTop(),this.drawWave(),this.drawText(),this.calcProgress(),this.progress<=100?this.requestAnimationFrame():(this.progress=100,this.calcOffsetTop(),this.drawWave(),this.drawText(),this.finishedListeners.forEach(function(e){return e()}))}},{key:"drawWave",value:function(){var e=this.ctx,t=this.cw,n=this.ch,i=this.set,o=i.opacity,r=i.crestHeight,s=i.offsetLeft,a=i.offsetTop,c=i.fillColor,l=i.speed;e.clearRect(0,0,t,n),e.globalAlpha=o,e.save(),e.beginPath(),this.dots.forEach(function(t,n){e[n?"lineTo":"moveTo"](t.x,r*h(t.y+s)+a),t.y-=l}),e.lineTo(t,n),e.lineTo(0,n),e.closePath(),e.fillStyle=c,e.fill(),e.restore()}},{key:"drawText",value:function(){var e=this,t=this.ctx,n=this.cw,i=this.halfCH,o=this.progress,r=this.set,s=r.font,a=r.smallFont,c=r.color,l=r.smallFontOffsetTop,f="%",u=p(o);this.progressListeners.forEach(function(t){var n=t(e.progress);m(n)||(y(n)?(u=n.text,f=n.smallText||""):(u=n,f=""))}),t.font=s;var h=t.measureText(u).width;t.font=a;var v=t.measureText(f).width,d=(n-h-v)/2;t.textBaseline="middle",t.fillStyle=c,t.font=s,t.fillText(u,d,i),t.font=a,t.fillText(f,d+h,i+l)}},{key:"calcProgress",value:function(){if(this.immediatelyComplete)return this.progress+=this.immediatelyComplete,void(this.immediatelyComplete+=.5);if(!(this.progress>=99)){var e=this.set,t=e.easing,n=e.duration;this.startTime||(this.startTime=Date.now());var i=Date.now()-this.startTime,o=i/n;o<=1&&(this.progress=JParticles.easing[t](o,i,0,100,n),this.progress>=99&&(this.progress=99))}}},{key:"calcOffsetTop",value:function(){(this.immediatelyComplete||99!==this.progress)&&(100===this.progress?this.set.offsetTop=-this.set.crestHeight:this.set.offsetTop=p((100-this.progress)/100*this.ch+this.set.crestHeight))}},{key:"resize",value:function(){var e=this;b(this,function(t,n){["offsetLeft","offsetTop","crestHeight"].forEach(function(i){e.set[i]*="offsetLeft"===i?t:n}),e.halfCH=e.ch/2,100===e.progress&&e.draw()})}},{key:"setOptions",value:function(e){if(this.set&&y(e))for(var t in e)"offsetTop"!==t&&t in this.set&&(this.set[t]=e[t])}},{key:"done",value:function(){this.set&&!this.immediatelyComplete&&(this.immediatelyComplete=1)}},{key:"onProgress",value:function(){return w.apply(void 0,[this,this.progressListeners].concat(Array.prototype.slice.call(arguments)))}},{key:"onFinished",value:function(){return w.apply(void 0,[this,this.finishedListeners].concat(Array.prototype.slice.call(arguments)))}}]),o}(f),r.defaultConfig={font:"normal 900 20px Arial",smallFont:"normal 900 14px Arial",smallFontOffsetTop:1,color:"#333",fillColor:"#27C9E5",offsetLeft:0,crestHeight:4,rippleNum:1,speed:.3,duration:5e3,easing:"swing"},o=s))||o;delete x.prototype.pause,delete x.prototype.open}(),function(){"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function n(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var i,o,r,s,a=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),c=JParticles,l=c.utils,f=c.Base,u=Math.random,h=Math.PI,p=Math.sin,v=2*h,d=l.limitRandom,y=l.scaleValue,m=l.randomColor,b=l.isArray,g=l.isPlainObject,w=l.isUndefined,x=l.resize,O=l.mount,k=["fill","fillColor","line","lineColor","lineWidth","offsetLeft","offsetTop","crestHeight","speed"];(i=O("Wave"))((s=r=function(i){function o(n,i){return e(this,o),t(this,(o.__proto__||Object.getPrototypeOf(o)).call(this,o,n,i))}return n(o,i),a(o,[{key:"init",value:function(){this.rippleLength=[],this.attrNormalize(),this.createDots(),this.draw()}},{key:"attrNormalize",value:function(){var e=this;["fill","fillColor","line","lineColor","lineWidth","offsetLeft","offsetTop","crestHeight","rippleNum","speed"].forEach(function(t){return e.attrProcessor(t)})}},{key:"attrProcessor",value:function(e){var t=this.set.num,n=this.set[e],i=n,o="offsetLeft"===e?this.cw:this.ch;for(b(n)||(i=this.set[e]=[]);t--;){var r=b(n)?n[t]:n;i[t]=w(r)?this.generateDefaultValue(e):this.scaleValue(e,r,o),"rippleNum"===e&&(this.rippleLength[t]=this.cw/i[t])}}},{key:"generateDefaultValue",value:function(e){var t=this.cw,n=this.ch;switch(e){case"lineColor":case"fillColor":e=m();break;case"lineWidth":e=d(2,.2);break;case"offsetLeft":e=u()*t;break;case"offsetTop":case"crestHeight":e=u()*n;break;case"rippleNum":e=d(t/2,1);break;case"speed":e=d(.4,.1);break;case"fill":e=!1;break;case"line":e=!0}return e}},{key:"scaleValue",value:function(e,t,n){return"offsetTop"===e||"offsetLeft"===e||"crestHeight"===e?y(t,n):t}},{key:"dynamicProcessor",value:function(e,t){var n=this,i="offsetLeft"===e?this.cw:this.ch,o=b(t);this.set[e].forEach(function(r,s,a){var c=o?t[s]:t;c=n.scaleValue(e,c,i),w(c)&&(c=r),a[s]=c})}},{key:"setOptions",value:function(e){if(this.set&&g(e))for(var t in e)"opacity"===t?this.set.opacity=e[t]:-1!==k.indexOf(t)&&this.dynamicProcessor(t,e[t])}},{key:"createDots",value:function(){for(var e=this.cw,t=this.rippleLength,n=this.set.num,i=this.dots=[];n--;)for(var o=i[n]=[],r=v/t[n],s=0;s<=e;s++)o.push({x:s,y:s*r})}},{key:"draw",value:function(){var e=this.ctx,t=this.cw,n=this.ch,i=this.paused,o=this.set,r=o.opacity;e.clearRect(0,0,t,n),e.globalAlpha=r,this.dots.forEach(function(r,s){var a=o.crestHeight[s],c=o.offsetLeft[s],l=o.offsetTop[s],f=o.speed[s];e.save(),e.beginPath(),r.forEach(function(t,n){e[n?"lineTo":"moveTo"](t.x,a*p(t.y+c)+l),!i&&(t.y-=f)}),o.fill[s]&&(e.lineTo(t,n),e.lineTo(0,n),e.closePath(),e.fillStyle=o.fillColor[s],e.fill()),o.line[s]&&(e.lineWidth=o.lineWidth[s],e.strokeStyle=o.lineColor[s],e.stroke()),e.restore()}),this.requestAnimationFrame()}},{key:"resize",value:function(){var e=this;x(this,function(t,n){["offsetLeft","offsetTop","crestHeight"].forEach(function(i){var o="offsetLeft"===i?t:n;e.set[i].forEach(function(e,t,n){n[t]=e*o})}),e.dots.forEach(function(e){e.forEach(function(e){e.x*=t,e.y*=n})})})}}]),o}(f),r.defaultConfig={num:3,fill:!1,fillColor:[],line:!0,lineColor:[],lineWidth:[],offsetLeft:[],offsetTop:[],crestHeight:[],rippleNum:[],speed:[]},o=s))}();