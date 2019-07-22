+function(){"use strict";function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function i(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function a(t,e,i){for(;t=t.offsetParent;)if(w(t,e)===i)return!0;return!1}var n,o,s,r,l=function(){function t(t,e){for(var i=0;i<e.length;i++){var a=e[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}return function(e,i,a){return i&&t(e.prototype,i),a&&t(e,a),e}}(),f=JParticles,c=f.utils,u=f.Base,h=Math.random,p=Math.abs,v=Math.PI,m=Math.floor,x=2*v,y=c.pInt,d=c.limitRandom,O=c.calcSpeed,b=c.scaleValue,w=c.getCss,E=c.offset,g=c.isElement,X=c.isNull,Y=c.on,k=c.off,S=c.orientationSupport,P=c.resize,M=c.mount;(n=M("Particle"))((r=s=function(n){function o(i,a){return t(this,o),e(this,(o.__proto__||Object.getPrototypeOf(o)).call(this,o,i,a))}return i(o,n),l(o,[{key:"init",value:function(){this.attrNormalize(),this.set.range>0&&(this.positionX=h()*this.cw,this.positionY=h()*this.ch,this.defineLineShape(),this.positionEvent()),this.mouseX=this.mouseY=0,this.createDots(),this.draw(),this.parallaxEvent()}},{key:"attrNormalize",value:function(){var t=this.cw,e=this.set;["num","proximity","range"].forEach(function(i){e[i]=y(b(e[i],t))}),g(e.eventElem)||e.eventElem===document||(e.eventElem=this.c)}},{key:"defineLineShape",value:function(){var t=this,e=this.set,i=e.proximity,a=e.range;switch(e.lineShape){case"cube":this.lineShapeMaker=function(e,n,o,s,r){var l=t.positionX,f=t.positionY;p(e-o)<=i&&p(n-s)<=i&&p(e-l)<=a&&p(n-f)<=a&&p(o-l)<=a&&p(s-f)<=a&&r()};break;default:this.lineShapeMaker=function(e,n,o,s,r){var l=t.positionX,f=t.positionY;p(e-o)<=i&&p(n-s)<=i&&(p(e-l)<=a&&p(n-f)<=a||p(o-l)<=a&&p(s-f)<=a)&&r()}}}},{key:"createDots",value:function(){var t=this.cw,e=this.ch,i=this.color,a=this.set,n=a.num,o=a.maxR,s=a.minR,r=a.maxSpeed,l=a.minSpeed,f=a.parallaxLayer,c=f.length;for(this.dots=[];n--;){var u=d(o,s);this.dots.push({r:u,x:d(t-u,u),y:d(e-u,u),vx:O(r,l),vy:O(r,l),color:i(),parallaxLayer:f[m(h()*c)],parallaxOffsetX:0,parallaxOffsetY:0})}}},{key:"draw",value:function(){var t=this.cw,e=this.ch,i=this.ctx,a=this.set,n=a.range,o=a.lineWidth,s=a.opacity;i.clearRect(0,0,t,e),i.lineWidth=o,i.globalAlpha=s,this.updateXY(),this.dots.forEach(function(t){var e=t.x,a=t.y,n=t.r,o=t.parallaxOffsetX,s=t.parallaxOffsetY;i.save(),i.beginPath(),i.arc(e+o,a+s,n,0,x),i.fillStyle=t.color,i.fill(),i.restore()}),n>0&&this.connectDots(),this.requestAnimationFrame()}},{key:"connectDots",value:function(){var t=this.dots,e=this.ctx,i=this.lineShapeMaker,a=t.length;t.forEach(function(n,o){for(var s=n.x+n.parallaxOffsetX,r=n.y+n.parallaxOffsetY;++o<a;)!function(){var a=t[o],l=a.x+a.parallaxOffsetX,f=a.y+a.parallaxOffsetY;i(s,r,l,f,function(){e.save(),e.beginPath(),e.moveTo(s,r),e.lineTo(l,f),e.strokeStyle=n.color,e.stroke(),e.restore()})}()})}},{key:"updateXY",value:function(){var t=this.paused,e=this.mouseX,i=this.mouseY,a=this.cw,n=this.ch,o=this.set,s=o.parallax,r=o.parallaxStrength;this.dots.forEach(function(o){if(!t){if(s){var l=r*o.parallaxLayer;o.parallaxOffsetX+=(e/l-o.parallaxOffsetX)/10,o.parallaxOffsetY+=(i/l-o.parallaxOffsetY)/10}o.x+=o.vx,o.y+=o.vy;var f=o.x,c=o.y,u=o.r,h=o.parallaxOffsetX,v=o.parallaxOffsetY;f+=h,c+=v,f+u>=a?o.vx=-p(o.vx):f-u<=0&&(o.vx=p(o.vx)),c+u>=n?o.vy=-p(o.vy):c-u<=0&&(o.vy=p(o.vy))}})}},{key:"setElemOffset",value:function(){return this.elemOffset=this.set.eventElem===document?null:E(this.set.eventElem)}},{key:"proxyEvent",value:function(t,e){var i=this,n=this.set.eventElem,o=null;S&&(o=function(t){i.paused||X(t.beta)||e(Math.min(Math.max(t.beta,-90),90),t.gamma)},Y(window,"deviceorientation",o));var s=function(e){if(!i.paused){var o=e.pageX,s=e.pageY;i.setElemOffset()&&(a(n,"position","fixed")&&(o=e.clientX,s=e.clientY),o-=i.elemOffset.left,s-=i.elemOffset.top),t(o,s)}};Y(n,"mousemove",s),this.onDestroy(function(){k(n,"mousemove",s),k(window,"deviceorientation",o)})}},{key:"positionEvent",value:function(){var t=this,e=this.set.range;e>this.cw&&e>this.ch||this.proxyEvent(function(e,i){t.positionX=e,t.positionY=i},function(e,i){t.positionY=-(e-90)/180*t.ch,t.positionX=-(i-90)/180*t.cw})}},{key:"parallaxEvent",value:function(){var t=this;this.set.parallax&&this.proxyEvent(function(e,i){t.mouseX=e-t.cw/2,t.mouseY=i-t.ch/2},function(e,i){t.mouseX=-i*t.cw/180,t.mouseY=-e*t.ch/180})}},{key:"resize",value:function(){var t=this;P(this,function(e,i){t.set.range>0&&(t.positionX*=e,t.positionY*=i,t.mouseX*=e,t.mouseY*=i)})}}]),o}(u),s.defaultConfig={num:.12,maxR:2.4,minR:.6,maxSpeed:1,minSpeed:.1,proximity:.2,range:.2,lineWidth:.2,lineShape:"spider",eventElem:null,parallax:!1,parallaxLayer:[1,2,3],parallaxStrength:3},o=r))}();