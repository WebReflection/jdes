self.deejs=function(n){"use strict";function t(n){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n})(n)}function r(n,t){if(!(n instanceof t))throw new TypeError("Cannot call a class as a function")}function e(n,t,r){return t in n?Object.defineProperty(n,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):n[t]=r,n}function o(n,t){return c(n)||function(n,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(n)))return;var r=[],e=!0,o=!1,a=void 0;try{for(var c,i=n[Symbol.iterator]();!(e=(c=i.next()).done)&&(r.push(c.value),!t||r.length!==t);e=!0);}catch(n){o=!0,a=n}finally{try{e||null==i.return||i.return()}finally{if(o)throw a}}return r}(n,t)||u(n,t)||l()}function a(n){return function(n){if(Array.isArray(n))return f(n)}(n)||i(n)||u(n)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function c(n){if(Array.isArray(n))return n}function i(n){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(n))return Array.from(n)}function u(n,t){if(n){if("string"==typeof n)return f(n,t);var r=Object.prototype.toString.call(n).slice(8,-1);return"Object"===r&&n.constructor&&(r=n.constructor.name),"Map"===r||"Set"===r?Array.from(n):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?f(n,t):void 0}}function f(n,t){(null==t||t>n.length)&&(t=n.length);for(var r=0,e=new Array(t);r<t;r++)e[r]=n[r];return e}function l(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function s(n,t){var r;if("undefined"==typeof Symbol||null==n[Symbol.iterator]){if(Array.isArray(n)||(r=u(n))||t&&n&&"number"==typeof n.length){r&&(n=r);var e=0,o=function(){};return{s:o,n:function(){return e>=n.length?{done:!0}:{done:!1,value:n[e++]}},e:function(n){throw n},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,c=!0,i=!1;return{s:function(){r=n[Symbol.iterator]()},n:function(){var n=r.next();return c=n.done,n},e:function(n){i=!0,a=n},f:function(){try{c||null==r.return||r.return()}finally{if(i)throw a}}}}
/*!
   * ISC License
   *
   * Copyright (c) 2020, Andrea Giammarchi, @WebReflection
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
   * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
   * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
   * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
   * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
   * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
   * PERFORMANCE OF THIS SOFTWARE.
   */var h=!0,y=/^[^(]*\(\s*([^\2]*?)(\s*\)\s*(?:=>)?\s*\{)([\s\S]*?)\}$/,v=/^Symbol\(([\s\S]+)\)$/,p=Array.isArray,d=Array.prototype,b=JSON.parse,g=Object.assign,m=Object.create,w=Object.defineProperty,S=Object.freeze,k=Object.is,A=Object.prototype,j=Reflect.getPrototypeOf,O=Reflect.ownKeys,E=d.concat,I=d.every,$=d.filter,N=d.map,T=d.push,x=d.slice,M=d.splice,U="object"===("undefined"==typeof self?"undefined":t(self))?self:global,F=new Map,J=new Map,P=new Set,_=new Set,B=new Set,C=new WeakSet,R=new Proxy({},{get:function(){}}),W=function(n){return String(n).toString()},z=function(n){return String(n).replace(v,"[$1]")},K=function(n){var t=o(O(n),1)[0],r=n[t],e=F.get(t);if(!e)throw new TypeError("unknown type ".concat(z(t)));return{_:e,type:t,value:r}},q=function(n,r){var e=p(r),o="expected type ".concat(z(n)," but got ").concat([e?"array":t(r),e?N.call(r,W):W(r)].join(": "));throw new TypeError(o)},D=function(n,t,r,e,o){w(n,r,{value:function(){for(var r=arguments.length,a=new Array(r),c=0;c<r;c++)a[c]=arguments[c];return H(G(e.apply(n,a),t,o),t,o)}})},G=function n(t,r,e){return h&&(D(t,r,"concat",E,e),D(t,r,"filter",$,e),D(t,r,"map",N,e),D(t,r,"slice",x,e),w(t,"push",{value:function(){for(var n=arguments.length,o=new Array(n),a=0;a<n;a++)o[a]=arguments[a];return e.check(o,!0)||q(r,o),T.apply(t,o)}}),w(t,"splice",{value:function(o){for(var a=arguments.length,c=new Array(a>2?a-2:0),i=2;i<a;i++)c[i-2]=arguments[i];return e.check(c,!0)||q(r,c),H(n(M.apply(t,arguments),r,e),r,e)}})),t},H=function(n,t,r){return h&&C.add(n=new Proxy(n,{set:function(n,e,o){if(r.check(o,!1)||q(t,o),n.length<=e)throw new Error("out of bounds: use push(...values) instead");return n[e]=o,!0}})),n},L=function(n,t,r,o){var a=new WeakMap;w(n,t,{enumerable:!0,get:function(){return a.has(this)?a.get(this):o},set:function(n){h&&!V(e({},r,n))&&q(r,n),a.set(this,n)}})},Q=function(n){var t=K(n),r=t._,e=t.value;return r.cast(e)},V=function(n){var r=K(n),e=r._,o=r.type,a=r.value;return e.check(a,"symbol"===t(o))},X=function(n,t){var r=t===Z,e=!r&&P.has(t),o=!r&&!e&&_.has(t),a=!r&&!e&&!o&&B.has(t);if(!(r||e||o||a||t.check&&t.cast))throw new Error("unable to define ".concat(n," without check and cast"));var c,i=s([].concat(n));try{var u=function(){var n=c.value,i=/^(?:void|undefined)$/.test(n);if(F.has(n)||n in A||n in U&&!i)throw new TypeError("".concat(z(n)," already defined"));var u=r||e?t(n):o?{check:function(n,r){var e=this;return r?I.call(n,(function(n){return e.check(n,!1)})):n instanceof t||j(n)===A},cast:function(n){return n instanceof t?n:new t(n)}}:a?{check:function(n,r){var e=this;return r?I.call(n,(function(n){return e.check(n,!1)})):n instanceof t||p(n)},cast:function(n){return n instanceof t?n:new t(n)}}:g({},t),f=e?U[n].toString():Symbol(n);e||i||w(U,n,{configurable:!0,value:f}),F.set(n,u),w(A,n,{configurable:!0,get:function(){return h&&!u.check(this,!1)&&q(n,this),o||a?u.cast(this):this}}),i||(F.set(f,u),w(A,f,{configurable:!0,get:function(){if(h&&!u.check(this,!0)&&q(f,this),J.has(n))return u.cast(this);if(h&&!p(this)&&q(f,this),h&&C.has(this))return this;var t=o||a?N.call(this,u.cast,u):this;return H(G(t,f,u),n,u)}}))};for(i.s();!(c=i.n()).done;)u()}catch(n){i.e(n)}finally{i.f()}},Y=function(n){var t=o(O(n),1)[0],r=n[t],a=r.length;return w(c,"toJSON",{value:function(){var n=String(r),o=n.replace(y,"$1"),a=n.replace(y,"$3");return e({},"ÿ".concat(String(t)),[o.trim(),a.trim()])}}),c;function c(){for(var n=arguments.length,o=new Array(n),c=0;c<n;c++)o[c]=arguments[c];for(var i=0,u=o.length;i<a;i++)u<=i&&(o[i]=R);var f=r.apply(this,o);return h&&!V(e({},t,f))&&q(t,f),f}},Z=function(n){var t=n.split("_");if(h&&!I.call(t,(function(n){return F.has(n)})))throw new TypeError("unable to define union: ".concat(n));return{check:function(n,r){var o=this;return r?I.call(n,(function(n){return o.check(n,!1)})):t.some((function(t){return V(e({},t,n))}))},cast:function(r){var o=t.findIndex((function(n){return V(e({},n,r))}));return o<0&&q(n,r),F.get(t[o]).cast(r)}}};return w(JSON,"parse",{value:function(n){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(n,t){return t};return b.call(JSON,n,(function(n,a){if("object"===t(a)&&a){var c=O(a);if(1===c.length){var i=o(c,1)[0];"ÿ"===i[0]&&p(a[i])&&(i=i.slice(1),/^Symbol\((.+?)\)$/.test(i)&&(i=U[RegExp.$1]),a=Q({fn:e({},i,a[c])}))}}return r.call(this,n,a)}))}}),[{f32:"Float32Array"},{f64:"Float64Array"},{i8:"Int8Array"},{i16:"Int16Array"},{i32:"Int32Array"},{u8:"Uint8Array"},{u16:"Uint16Array"},{u32:"Uint32Array"},{uc8:"Uint8ClampedArray"},{i64:"BigInt64Array"},{u64:"BigUint64Array"},{double:"Float64Array"}].forEach((function(n){var t=o(O(n),1)[0],r=U[n[t]];if(r){J.set(t,r);var e=new r(1);X(t,{check:function(n,t){return t?n instanceof r||p(n)&&I.call(new r(n),(function(n){return!isNaN(n)})):(e[0]=n,k(e[0],n))},cast:function(n){return"number"==typeof n?(e[0]=n,e[0]):n instanceof r?n:new r(n)}})}})),X("int",{check:function(n,t){var r=this;return t?I.call(n,(function(n){return r.check(n,!1)})):k(this.cast(n),n)},cast:function(n){return k(n,-0)?n:parseInt(n,10)||0}}),X("float",{check:function(n,t){var r=this;return t?I.call(n,(function(n){return r.check(n,!1)})):k(this.cast(n),n)},cast:function(n){return k(n,-0)?n:parseFloat(n)||0}}),[[Boolean,"boolean","bool"],[Number,"number","num"],[String,"string","str"],[function(n){var t=o(O(n),1)[0];return Y(e({},t,Function.apply(null,[].concat(n[t]))))},"function","fn"],[function(){},"undefined","void"]].forEach((function(n){var r,e=c(r=n)||i(r)||u(r)||l(),o=e[0],f=e[1],s=e.slice(2),h=function(n){return t(n)===f};X([f].concat(a(s)),{check:function(n,t){return t?I.call(n,h):h(n)},cast:function(n){return h(n)?n:o(n)}})})),X(["object","obj"],{check:function(n,r){var e=this;return r?I.call(n,(function(n){return e.check(n,!1)})):"object"===t(n)&&n instanceof Object},cast:Object}),n.as=Q,n.define=X,n.enums=function(){for(var n=arguments.length,t=new Array(n),r=0;r<n;r++)t[r]=arguments[r];var e=function(n){var r,e=[],o=Symbol(n),a=m(null,{toString:{value:function(){return o}}}),c=s(t);try{for(c.s();!(r=c.n()).done;){var i=r.value,u="string"==typeof i,f=u?i:O(i)[0],l=u?Symbol(i):i[f];a[f]=l,e.push(l)}}catch(n){c.e(n)}finally{c.f()}return w(U,n,{configurable:!0,value:S(a)}),{check:function(n,t){var r=this;return t?I.call(n,(function(n){return r.check(n,!1)})):e.some((function(t){return k(t,n)}))},cast:function(n){return h&&!this.check(n,!1)&&q("enum",n),n}}};return P.add(e),e},n.fn=Y,n.is=V,n.map=function(n,t){var r=p(n),e=p(t),o=F.get(r?n[0]:n),a=F.get(e?t[0]:t),c=h?function(c){var i=new Map,u=i.set;if(w(i,"set",{value:function(c,i){return o.check(c,r)||q(n,c),a.check(i,e)||q(t,i),u.call(this,c,i)}}),c)for(var f=0;f<c.length;f++){var l=c[f];i.set(l[0],l[1])}return i}:Map;return B.add(c),c},n.set=function(n){var t=p(n),r=F.get(t?n[0]:n),e=h?function(e){var o=new Set,a=o.add;if(w(o,"add",{value:function(e){return r.check(e,t)||q(n,e),a.call(this,e)}}),e)for(var c=0;c<e.length;c++)o.add(e[c]);return o}:Set;return B.add(e),e},n.struct=function(){for(var n=function n(t){if(r(this,n),h){var e,o=s(c);try{for(o.s();!(e=o.n()).done;){var i=e.value;this[i]=t[i]}}catch(n){o.e(n)}finally{o.f()}var u,f=s(a);try{for(f.s();!(u=f.n()).done;){var l=u.value;l in t&&(this[l]=t[l])}}catch(n){f.e(n)}finally{f.f()}}else for(var y in t)this[y]=t[y];return h?S(this):this},t=n.prototype,a=[],c=[],i=0;i<arguments.length;i++){var u,f=K(i<0||arguments.length<=i?void 0:arguments[i]),l=f.type,y=f.value,v=s([].concat(y));try{for(v.s();!(u=v.n()).done;){var p=u.value;if("string"==typeof p)c.push(p),L(t,p,l,void 0);else{var d=O(p),b=o(d,1),g=b[0],k=p[g];"function"==typeof k?w(t,g,{value:Y(e({},l,k))}):(h&&!V(e({},l,k))&&q(l,k),a.push(g),L(t,g,l,k))}}}catch(n){v.e(n)}finally{v.f()}}return w(t,"toJSON",{value:function(){var n=m(null);for(var t in this)n[t]=this[t];return n}}),_.add(n),n},n.union=Z,n.unsafe=function(){h=!1},n}({});