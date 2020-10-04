self.deejs=function(t){"use strict";
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
   */let e=!0;const n=/^[^(]*\(\s*([^\2]*?)(\s*\)\s*(?:=>)?\s*\{)([\s\S]*?)\}$/,r=/^Symbol\(([\s\S]+)\)$/,{isArray:c,prototype:s}=Array,{parse:o}=JSON,{assign:a,create:i,defineProperty:l,freeze:u,is:h,prototype:f}=Object,{getPrototypeOf:p,ownKeys:y}=Reflect,{concat:d,every:g,filter:k,map:w,push:b,slice:S,splice:v}=s,m="object"==typeof self?self:global,A=new Map,$=new Map,j=new Set,E=new Set,O=new Set,N=new WeakSet,I=new Proxy({},{get:()=>{}}),x=t=>String(t).toString(),F=t=>String(t).replace(r,"[$1]"),J=t=>{const[e]=y(t),n=t[e],r=A.get(e);if(!r)throw new TypeError("unknown type "+F(e));return{_:r,type:e,value:n}},M=(t,e)=>{const n=c(e),r=`expected type ${F(t)} but got ${[n?"array":typeof e,n?w.call(e,x):x(e)].join(": ")}`;throw new TypeError(r)},U=(t,e,n,r,c)=>{l(t,n,{value:(...n)=>T(P(r.apply(t,n),e,c),e,c)})},P=(t,n,r)=>(e&&(U(t,n,"concat",d,r),U(t,n,"filter",k,r),U(t,n,"map",w,r),U(t,n,"slice",S,r),l(t,"push",{value:(...e)=>(r.check(e,!0)||M(n,e),b.apply(t,e))}),l(t,"splice",{value(e,c=0,...s){return r.check(s,!0)||M(n,s),T(P(v.apply(t,arguments),n,r),n,r)}})),t),T=(t,n,r)=>(e&&N.add(t=new Proxy(t,{set(t,e,c){if(r.check(c,!1)||M(n,c),t.length<=e)throw new Error("out of bounds: use push(...values) instead");return t[e]=c,!0}})),t),_=(t,n,r,c)=>{const s=new WeakMap;l(t,n,{enumerable:!0,get(){return s.has(this)?s.get(this):c},set(t){e&&!R({[r]:t})&&M(r,t),s.set(this,t)}})},B=t=>{const{_:e,value:n}=J(t);return e.cast(n)},R=t=>{const{_:e,type:n,value:r}=J(t);return e.check(r,"symbol"==typeof n)},W=(t,n)=>{const r=n===C,s=!r&&j.has(n),o=!r&&!s&&E.has(n),i=!r&&!s&&!o&&O.has(n);if(!(r||s||o||i||n.check&&n.cast))throw new Error(`unable to define ${t} without check and cast`);for(const u of[].concat(t)){const t=/^(?:void|undefined)$/.test(u);if(A.has(u)||u in f||u in m&&!t)throw new TypeError(F(u)+" already defined");const h=r||s?n(u):o?{check(t,e){return e?g.call(t,(t=>this.check(t,!1))):t instanceof n||p(t)===f},cast:t=>t instanceof n?t:new n(t)}:i?{check(t,e){return e?g.call(t,(t=>this.check(t,!1))):t instanceof n||c(t)},cast:t=>t instanceof n?t:new n(t)}:a({},n),y=s?m[u].toString():Symbol(u);s||t||l(m,u,{configurable:!0,value:y}),A.set(u,h),l(f,u,{configurable:!0,get(){return e&&!h.check(this,!1)&&M(u,this),o||i?h.cast(this):this}}),t||(A.set(y,h),l(f,y,{configurable:!0,get(){if(e&&!h.check(this,!0)&&M(y,this),$.has(u))return h.cast(this);if(e&&!c(this)&&M(y,this),e&&N.has(this))return this;const t=o||i?w.call(this,h.cast,h):this;return T(P(t,y,h),u,h)}}))}},z=t=>{const[r]=y(t),c=t[r],{length:s}=c;return l(o,"toJSON",{value(){const t=String(c),e=t.replace(n,"$1"),s=t.replace(n,"$3");return{["ÿ"+String(r)]:[e.trim(),s.trim()]}}}),o;function o(...t){for(let e=0,{length:n}=t;e<s;e++)n<=e&&(t[e]=I);const n=c.apply(this,t);return e&&!R({[r]:n})&&M(r,n),n}},C=t=>{const n=t.split("_");if(e&&!g.call(n,(t=>A.has(t))))throw new TypeError("unable to define union: "+t);return{check(t,e){return e?g.call(t,(t=>this.check(t,!1))):n.some((e=>R({[e]:t})))},cast(e){const r=n.findIndex((t=>R({[t]:e})));return r<0&&M(t,e),A.get(n[r]).cast(e)}}};return l(JSON,"parse",{value:(t,e=((t,e)=>e))=>o.call(JSON,t,(function(t,n){if("object"==typeof n&&n){const t=y(n);if(1===t.length){let[e]=t;"ÿ"===e[0]&&c(n[e])&&(e=e.slice(1),/^Symbol\((.+?)\)$/.test(e)&&(e=m[RegExp.$1]),n=B({fn:{[e]:n[t]}}))}}return e.call(this,t,n)}))}),[{f32:"Float32Array"},{f64:"Float64Array"},{i8:"Int8Array"},{i16:"Int16Array"},{i32:"Int32Array"},{u8:"Uint8Array"},{u16:"Uint16Array"},{u32:"Uint32Array"},{uc8:"Uint8ClampedArray"},{i64:"BigInt64Array"},{u64:"BigUint64Array"},{double:"Float64Array"}].forEach((t=>{const[e]=y(t),n=m[t[e]];if(n){$.set(e,n);const t=new n(1);W(e,{check:(e,r)=>r?e instanceof n||c(e)&&g.call(new n(e),(t=>!isNaN(t))):(t[0]=e,h(t[0],e)),cast:e=>"number"==typeof e?(t[0]=e,t[0]):e instanceof n?e:new n(e)})}})),W("int",{check(t,e){return e?g.call(t,(t=>this.check(t,!1))):h(this.cast(t),t)},cast:t=>h(t,-0)?t:parseInt(t,10)||0}),W("float",{check(t,e){return e?g.call(t,(t=>this.check(t,!1))):h(this.cast(t),t)},cast:t=>h(t,-0)?t:parseFloat(t)||0}),[[Boolean,"boolean","bool"],[Number,"number","num"],[String,"string","str"],[t=>{const[e]=y(t);return z({[e]:Function.apply(null,[].concat(t[e]))})},"function","fn"],[()=>{},"undefined","void"]].forEach((([t,e,...n])=>{const r=t=>typeof t===e;W([e,...n],{check:(t,e)=>e?g.call(t,r):r(t),cast:e=>r(e)?e:t(e)})})),W(["object","obj"],{check(t,e){return e?g.call(t,(t=>this.check(t,!1))):"object"==typeof t&&t instanceof Object},cast:Object}),t.as=B,t.define=W,t.enums=(...t)=>{const n=n=>{const r=[],c=Symbol(n),s=i(null,{toString:{value:()=>c}});for(const e of t){const t="string"==typeof e,n=t?e:y(e)[0],c=t?Symbol(e):e[n];s[n]=c,r.push(c)}return l(m,n,{configurable:!0,value:u(s)}),{check(t,e){return e?g.call(t,(t=>this.check(t,!1))):r.some((e=>h(e,t)))},cast(t){return e&&!this.check(t,!1)&&M("enum",t),t}}};return j.add(n),n},t.fn=z,t.is=R,t.map=(t,n)=>{const r=c(t),s=c(n),o=A.get(r?t[0]:t),a=A.get(s?n[0]:n),i=e?function(e){const c=new Map,{set:i}=c;if(l(c,"set",{value(e,c){return o.check(e,r)||M(t,e),a.check(c,s)||M(n,c),i.call(this,e,c)}}),e)for(let t=0;t<e.length;t++){const n=e[t];c.set(n[0],n[1])}return c}:Map;return O.add(i),i},t.set=t=>{const n=c(t),r=A.get(n?t[0]:t),s=e?function(e){const c=new Set,{add:s}=c;if(l(c,"add",{value(e){return r.check(e,n)||M(t,e),s.call(this,e)}}),e)for(let t=0;t<e.length;t++)c.add(e[t]);return c}:Set;return O.add(s),s},t.struct=(...t)=>{class n{constructor(t){if(e){for(const e of s)this[e]=t[e];for(const e of c)e in t&&(this[e]=t[e])}else for(const e in t)this[e]=t[e];return e?u(this):this}}const{prototype:r}=n,c=[],s=[];for(let n=0;n<t.length;n++){const{type:o,value:a}=J(t[n]);for(const t of[].concat(a))if("string"==typeof t)s.push(t),_(r,t,o,void 0);else{const[n]=y(t),s=t[n];"function"==typeof s?l(r,n,{value:z({[o]:s})}):(e&&!R({[o]:s})&&M(o,s),c.push(n),_(r,n,o,s))}}return l(r,"toJSON",{value(){const t=i(null);for(const e in this)t[e]=this[e];return t}}),E.add(n),n},t.union=C,t.unsafe=()=>{e=!1},t}({});
