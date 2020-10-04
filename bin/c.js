'use strict';

const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const {
  parser, options, statics, types,
  slice, genericExpression, objectExpression, bodyNode
} = require('./utils.js');

const Structs = new Set;
const Classes = new Map;
const Enums = new Map;

const includes = [
  '#include <stdio.h>',
  '#include <stdlib.h>',
  '#include <string.h>',
];
const main = [];

const generateOptions = {
  shouldPrintComment: val => /^!|@license|@preserve/.test(val)
};

const asStructOrTyped = (code, type, node) => {
  let js = slice(code, node);
  if (/^\s*[{[]/.test(js)) {
    if (Structs.has(type))
      js = `new ${type}(${js})`;
    else if (statics.has(type))
      js = `new ${statics.get(type)}(${js})`;
  }
  return js;
};

const parse = code => {
  let ast = parser.parse(code, options);
  traverse(ast, {
    enter(path) {
      // console.log(path.type);
      switch (path.type) {
        case 'ExportDefaultDeclaration': {
          // TODO: do this only if `export default ({[string]: args}) => {}` is there
          main.push(`int main(int argc, const char* argv[]) {`);
          main.push(`  for (int i = 0; i < argc; i++)`);
          main.push(`    printf(i ? " %s" : "%s", argv[i]);`);
          main.push(`  return 0;`);
          main.push(`}`);
          console.log(includes.concat(main).join('\n'));
          path.remove();
          break;
        }
      }
    }
  });
  return generate(ast, generateOptions, code).code;
};

module.exports = parse;
