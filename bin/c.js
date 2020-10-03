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

const getVariables = (code, declarations) => {
  const variables = [];
  for (const declaration of declarations) {
    if (declaration.id.properties)
      for (const {key: {name: type}, value: {name}} of declaration.id.properties)
        variables.push(`${name}=${asStructOrTyped(code, type, declaration.init)}`);
  }
  return variables;
};

const parse = code => {
  let ast = parser.parse(code, options);
  traverse(ast, {
    enter(path) {
      switch (path.type) {
      }
    }
  });
  return generate(ast, generateOptions, code).code;
};

module.exports = parse;
