'use strict';

const babel = require('@babel/core');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const parseJS = require('./js.js');
const {parser, options, slice, genericExpression, objectExpression, bodyNode} = require('./utils.js');

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
  return babel.transform(code, babelConfig).code
          .replace(/^\s*(['"])use strict\1;?/gm, '').trim();
};
