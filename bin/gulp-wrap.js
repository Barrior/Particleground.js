const through = require('through2')
const pkg = require('../package.json')
const VERSION = pkg.version

const UMDHeader = `
+function() {
    var runtimeSupport = true;
    var isIE8 = /msie\\s8.0/i.test(navigator.userAgent);
    if (!Object.defineProperty || isIE8) {
        runtimeSupport = false;
        Object.defineProperty = function (target, prop, descriptor) {
            target[prop] = descriptor.value;
        };
    }

    // 兼容不支持的浏览器的报错行为，如 IE8
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create
    if (typeof Object.create != 'function') {
        Object.create = (function() {
            function Temp() {}
            var hasOwn = Object.prototype.hasOwnProperty;
            return function (O) {
                if (typeof O != 'object') {
                    throw TypeError('Object prototype may only be an Object or null');
                }
                Temp.prototype = O;
                var obj = new Temp();
                Temp.prototype = null;
                if (arguments.length > 1) {
                    var Properties = Object(arguments[1]);
                    for (var prop in Properties) {
                        if (hasOwn.call(Properties, prop)) {
                            obj[prop] = Properties[prop];
                        }
                    }
                }
                return obj;
            };
        })();
    }
`
const UMDFooter = `
    
    defineReadOnlyProperty('${VERSION}', 'version', JParticles);

    // AMD 加载方式放在头部，factory 函数会比后面的插件延迟执行
    // 导致后面的插件找不到 JParticles 对象而报错
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return JParticles;
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = JParticles;
    }
}();
`

module.exports = () => {
  return through.obj((file, encoding, callback) => {
    let content = file.contents.toString()
    // const filename = file.path.replace(/.+[\\|/](\w+)\.js$/,'$1');

    if (file.path.indexOf('jparticles.js') !== -1) {
      content = UMDHeader + content + UMDFooter
    } else {
      content = `+function () { ${content} }();`
    }

    file.contents = new Buffer(content)

    callback(null, file)
  })
}
