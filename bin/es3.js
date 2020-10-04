'use strict';

const babel = require('@babel/core');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const parseJS = require('./js.js');
const {parser, options, slice, globals, bodyNode} = require('./utils.js');

const babelConfig = {
  presets: ['@babel/env']
};

module.exports = code => {
  code = parseJS(code);
  let ast = parser.parse(code, options);
  traverse(ast, {
    enter(path) {
      if (
        path.type === 'ClassExpression' &&
        path.parentPath.type === 'VariableDeclarator'
      ) {
        const Class = ['function '];
        const prototype = [];
        const {name} = path.parentPath.node.id;
        for (const method of path.node.body.body) {
          const key = method.key.name;
          if (key === 'constructor') {
            Class.push(
              slice(code, method)
                .replace(/^constructor/, name)
            );
          }
          else {
            const fn = slice(code, method);
            const body = fn.replace(/^[^(]+?\(/, 'function(');
            if (/^get\s+/.test(fn)) {
              prototype.push(
                `${name}.prototype.__defineGetter__("${key}",${body})`
              );
            }
            else if (/^set\s+/.test(fn)) {
              prototype.push(
                `${name}.prototype.__defineSetter__("${key}",${body})`
              );
            }
            else {
              prototype.push(
                name + '.prototype.' + key + '=' + body
              );
            }
          }
        }
        const ES3 = `${Class.join('')}\n${prototype.join('\n')}`;
        path.parentPath.parentPath.replaceWithMultiple(bodyNode(ES3));
      }
    }
  });
  code = generate(ast, code).code;
  code = babel.transform(code, babelConfig).code
          .replace(/^\s*(['"])use strict\1;?/gm, '').trim();

  if (globals.has('Set'))
    code = `// [ES3-Set-Polyfill
function Set(I){this.clear();if(I){this._k=I.slice(0);this.size=I.length}}
Set.prototype["delete"]=function(k){var _k=this._k,i=_k.indexOf(k),h=-1<i;if(h){_k.splice(i,1);this.size--;}return h};
Set.prototype.clear=function(){this._k=[];this.size = 0};
Set.prototype.has=function(k){return -1<this._k.indexOf(k)};
Set.prototype.add=function(k,v){var _k=this._k,i=_k.indexOf(k);if(-1<i)_k[i]=k;else{_k.push(k);this.size++}return this};
Set.prototype.entries=function(){for(var _k=this._k,e=[],i=0;i<this.size;i++)e[i]=[_k[i],_k[i]];return e};
Set.prototype.keys=function(){return this._k.slice(0)};
Set.prototype.values=function(){return this._k.slice(0)};
Set.prototype.forEach=function(c,x){for(var _k=this._k,i=0;i<this.size;i++)c.call(x,_k[i],_k[i],this)};
// /]

${code}`;

  if (globals.has('Map'))
    code = `// [ES3-Map-Polyfill
function Map(I){this.clear();if(I){for(var i=0;i<I.length;i++){this._k.push(I[i][0]);this._v.push(I[i][1])}this.size=I.length}}
Map.prototype["delete"]=function(k){var _k=this._k,i=_k.indexOf(k),h=-1<i;if(h){_k.splice(i,1);this._v.splice(i,1);this.size--}return h};
Map.prototype.clear=function(){this._k=[];this._v=[];this.size=0};
Map.prototype.has=function(k){return -1<this._k.indexOf(k)};
Map.prototype.get=function(k){var i=this._k.indexOf(k);return -1<i?this._v[i]:void 0};
Map.prototype.set=function(k,v){var _k=this._k,i=_k.indexOf(k),h=-1<i;this._v[h?i:(_k.push(k)-1)]=v;if(!h)this.size++;return this};
Map.prototype.entries=function(){for(var e=[],i=0;i<this.size;i++)e[i]=[this._k[i],this._v[i]];return e};
Map.prototype.keys=function(){return this._k.slice(0)};
Map.prototype.values=function(){return this._v.slice(0)};
Map.prototype.forEach=function(c,x){for(var i=0;i<this.size;i++)c.call(x,this._v[i],this._k[i],this)};
// /]

${code}`;

  return code;
};
