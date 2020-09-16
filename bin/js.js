'use strict';

const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const {parser, options, statics, types} = require('./utils.js');

const Structs = new Set;

const slice = (code, item) => code.slice(item.start, item.end);
const objectExpression = o => bodyNode(`(${JSON.stringify(o)})`).expression;
const bodyNode = js => parser.parse(js).program.body[0];

const parse = code => {
  let ast = parser.parse(code, options);
  traverse(ast, {
    enter(path) {
      switch (path.type) {
        case 'ImportDeclaration':
          if (path.node.source.value === 'jdes')
            path.remove();
          break;
        case 'CallExpression':
          switch (path.node.callee.name) {
            case 'enums': {
              const object = objectExpression({});
              for (const argument of path.node.arguments) {
                if (argument.type === 'ObjectExpression')
                  object.properties.push(...argument.properties);
                else {
                  const sub = {};
                  sub[argument.value] = {};
                  object.properties.push(...objectExpression(sub).properties);
                }
              }
              path.replaceWith(object);
              break;
            }
            case 'struct': {
              const args = [];
              const constructor = [];
              const methods = [];
              for (const argument of path.node.arguments) {
                if (argument.type === 'ObjectExpression') {
                  const [typed] = argument.properties;
                  const {elements, type, properties, value} = typed.value;
                  if (type === 'StringLiteral') {
                    args.push(value);
                    constructor.push(`this.${value}=${value}`);
                  }
                  else if (type === 'ObjectExpression') {
                    for (const property of properties) {
                      const {type, key, value} = property;
                      if (type === 'ObjectProperty') {
                        const {name} = key;
                        args.push(`${name}=${slice(code, value)}`);
                        constructor.push(`this.${name}=${name}`);
                      }
                      else if (type === 'ObjectMethod')
                        methods.push(slice(code, property));
                    }
                  }
                  else if (type === 'ArrayExpression') {
                    for (const {value} of elements) {
                      args.push(value);
                      constructor.push(`this.${value}=${value}`);
                    }
                  }
                }
              }
              const jdes = `class{constructor({${args.join(',')}}){${constructor.join(';')}}${methods.join('\n')}}`;
              const Class = bodyNode(`(${jdes})`).expression;
              path.replaceWith(Class);
              break;
            }
          }
          break;
      }
    }
  });
  code = generate(ast, code).code;
  ast = parser.parse(code, options);
  traverse(ast, {
    enter(path) {
      switch (path.type) {
        case 'CallExpression':
          switch (path.node.callee.name) {
            case 'define': {
              const constants = [];
              const [args, expr] = path.node.arguments;
              if (expr.name === 'union')
                path.parentPath.remove();
              else {
                const isStruct = expr.type === 'ClassExpression';
                for (const {value} of (args.type === 'StringLiteral' ? [args] : args.elements)) {
                  constants.push(`const ${value}=${slice(code, expr)}`);
                  if (isStruct)
                    Structs.add(value);
                }
                let jdes = parser.parse(constants.join('\n')).program.body[0];
                path.parentPath.replaceWith(jdes);
              }
              break;
            }
          }
          break;
      }
    }
  });
  code = generate(ast, code).code;
  ast = parser.parse(code, options);
  traverse(ast, {
    enter(path) {
      switch (path.type) {
        case 'ObjectPattern':
          switch (path.parentPath.type) {
            case 'VariableDeclarator': {
              const {key: {name: type}, value: {name}} = path.container.id.properties[0];
              let jdes = slice(code, path.container.init);
              if (/^\s*[{[]/.test(jdes)) {
                if (Structs.has(type))
                  jdes = `new ${type}(${jdes})`;
                else if (statics.has(type))
                  jdes = `new ${statics.get(type)}(${jdes})`;
              }
              path.parentPath.parentPath.replaceWith(
                bodyNode(`${
                  path.parentPath.parent.kind
                } ${
                  name
                }=${
                  jdes
                }`)
              );
            }
            // TODO: arguments
            case 'ArrowFunctionExpression':
            case 'FunctionDeclaration': {
              break;
            }
          }
          break;
      }
    }
  });
  return generate(ast, {comments: false}, code).code;
};

module.exports = parse;
