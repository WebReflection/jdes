'use strict';

// TODO: who cares?

const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const {
  parser, options, statics, types,
  slice, genericExpression, objectExpression, bodyNode,
  exit
} = require('./utils.js');

const Structs = new Set;
const Classes = new Map;
const Enums = new Map;

const isArray = code => /^\s*[{[]/.test(code);

const generateOptions = {
  shouldPrintComment: val => /^!|@license|@preserve/.test(val)
};

const asStructOrTyped = (code, type, node) => {
  let js = slice(code, node);
  if (isArray(js)) {
    if (Structs.has(type))
      js = `new ${type}(${js})`;
    else if (statics.has(type))
      js = `new ${statics.get(type)}(${js})`;
  }
  return js;
};

const parse = code => {
  let ast = parser.parse(code, options);
  const loops = [];
  traverse(ast, {
    enter(path) {
      switch (path.type) {
        case 'ForOfStatement': {
          const left = slice(code, path.node.left);
          const right = slice(code, path.node.right);
          const inner = slice(code, path.node.body).replace(/^\{|\}$/g, '');
          const uid = (Math.random() * 1e3) >>> 0;
          const [o, i] = [`_${uid}a`, `_${uid}i`];
          const forLoop = `for(let ${o}=${right},${i}=0;${i}<${o}.length;${i}++)`;
          // TODO: dafuq is wrong with for/of not being replaced in body?
          const hole = loops.push(`${left}=${o}[${i}]`) - 1;
          const jdes = `${forLoop}{'\x00${hole}';${inner}}`;
          path.replaceWithMultiple(bodyNode(jdes));
          break;
        }
        case 'ImportDeclaration':
          if (path.node.source.value === 'jdes')
            path.remove();
          break;
        case 'CallExpression':
          switch (path.node.callee.name) {
            case 'unsafe':
              path.replaceWith(genericExpression('void 0'));
              break;
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
              Enums.set(object, generate(object, code).code);
              path.replaceWith(object);
              break;
            }
            case 'fn': {
              const [property] = path.node.arguments[0].properties;
              const {key: {name: type}, value} = property;
              const arr = isArray(slice(code, property)) ? '[]' : '';
              value.returnType = genericExpression(`(():${type}${arr}=>{})`).returnType;
              path.replaceWith(value);
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
              const Class = genericExpression(`(${jdes})`);
              Classes.set(Class, jdes);
              path.replaceWith(Class);
              break;
            }
          }
          break;
      }
    },
    exit: exit(Classes, Enums)
  });
  code = generate(ast, code).code;
  ast = parser.parse(code, options);
  traverse(ast, {
    enter(path) {
      switch (path.type) {
        case 'CallExpression':
          switch (path.node.callee.name) {
            case 'as': {
              const [property] = path.node.arguments[0].properties;
              const type = property.key.name;
              let value = property.value.name || slice(code, property.value);
              if (Structs.has(type))
                value = `new ${type}(${value})`;
              else if (statics.has(type)) {
                if (/^\[/.test(slice(code, property)))
                  value = `new ${statics.get(type)}(${value})`;
                else
                  value = `new ${statics.get(type)}([${value}])[0]`;
              }
              else if (types.has(type)) {
                // TODO: fn/function + void ? void makes no sense though
                switch (type) {
                  case 'bool':
                  case 'boolean':
                    value = `!!${value}`;
                    break;
                  case 'int':
                  case 'float':
                  case 'num':
                  case 'number':
                    value = `parseFloat(${value})`;
                    break;
                  case 'obj':
                  case 'object':
                    value = `Object(${value})`;
                    break;
                  case 'str':
                  case 'string':
                    value = `String(${value})`;
                    break;
                }
              }
              path.replaceWith(genericExpression(value));
              break;
            }
            case 'is': {
              const [property] = path.node.arguments[0].properties;
              const type = property.key.name;
              let value = property.value.name || slice(code, property.value);
              if (Structs.has(type))
                value += ` instanceof ${type}`;
              else if (statics.has(type)) {
                if (/^\[/.test(slice(code, property)))
                  value += ` instanceof ${statics.get(type)}`;
                else
                  value = `typeof ${value} === 'number'`;
              }
              else if (types.has(type)) {
                switch (type) {
                  case 'bool':
                  case 'boolean':
                    value = `typeof ${value} === 'boolean'`;
                    break;
                  case 'int':
                  case 'float':
                  case 'num':
                  case 'number':
                    value = `typeof ${value} === 'number'`;
                    break;
                  case 'fn':
                  case 'function':
                    value = `typeof ${value} === 'function'`;
                    break;
                  case 'obj':
                  case 'object':
                    value = `typeof ${value} === 'object'`;
                    break;
                  case 'str':
                  case 'string':
                    value = `typeof ${value} === 'string'`;
                    break;
                  case 'void':
                    value = `typeof ${value} === 'undefined'`;
                    break;
                }
              }
              path.replaceWith(genericExpression(value));
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
        case 'ObjectPattern': {
          switch (path.parentPath.type) {
            case 'VariableDeclarator': {
              // TODO: align with the JS parser
              if (path.parentPath.parentPath.container.type === 'ForOfStatement')
                break;
              const [property] = path.container.id.properties;
              const {key: {name: type}, value: {name}} = property;
              path.parentPath.parentPath.replaceWithMultiple(
                bodyNode(`${
                  path.parentPath.parent.kind
                } ${
                  name
                }:${type}${isArray(slice(code, property))?'[]':''}=${
                  asStructOrTyped(code, type, path.container.init)
                }`)
              );
              break;
            }
            case 'ClassMethod':
              if (path.parentPath.node.key.name === 'constructor')
                break;
            case 'ArrowFunctionExpression':
            case 'FunctionDeclaration':
            case 'FunctionExpression': {
              const {key, value} = path.node.properties[0];
              const {name: type} = key;
              let {name} = value;
              if (value.type === 'AssignmentPattern') {
                name = value.left.name;
                const js = asStructOrTyped(code, type, value.right);
                path.replaceWithMultiple(genericExpression(`((${name}:${type} = ${js})=>{})`).params);
              }
              else
                path.replaceWithMultiple(genericExpression(`((${name}:${type})=>{})`).params);
              break;
            }
          }
          break;
        }
      }
    }
  });
  return generate(ast, generateOptions, code).code
          .replace(/'\x00(\d+)'/g, (_, i) => loops[i]);
};

module.exports = parse;
