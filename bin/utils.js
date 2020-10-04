const parser = require('@babel/parser');
const traverse = require("@babel/traverse").default;

const slice = (code, item) => code.slice(item.start, item.end);

const genericExpression = js => bodyNode(js)[0].expression;

const objectExpression = o => bodyNode(`(${JSON.stringify(o)})`)[0].expression;

const bodyNode = js => parser.parse(js, options).program.body;

const globals = new Set;

const options = {
  plugins: ['flow'],
  sourceType: 'unambiguous'
};

const statics = new Map([
  ['f32', 'Float32Array'],
  ['f64', 'Float64Array'],
  ['double', 'Float64Array'],
  ['i8', 'Int8Array'],
  ['i16', 'Int16Array'],
  ['i32', 'Int32Array'],
  ['u8', 'Uint8Array'],
  ['u16', 'Uint16Array'],
  ['u32', 'Uint32Array'],
  ['uc8', 'Uint8ClampedArray'],
  ['i64', 'BigInt64Array'],
  ['u64', 'BigUint64Array']
]);

module.exports = {
  slice, genericExpression, objectExpression, bodyNode,
  globals,
  options,
  parser,
  traverse,
  statics,
  types: new Set([
    'int',
    'float',
    'boolean', 'bool',
    'number', 'num',
    'string', 'str',
    'object', 'obj',
    'function', 'fn',
    'void'
  ].concat(...statics)),
  exit(Classes, Enums, Structs) {
    return path => {
      switch (path.type) {
        case 'CallExpression':
          switch (path.node.callee.name) {
            case 'define': {
              const [args, expr] = path.node.arguments;
              if (expr.name === 'union')
                path.parentPath.remove();
              else if (expr.type === 'ArrayExpression') {
                let first = '';
                const constants = [];
                for (const {value} of (args.type === 'StringLiteral' ? [args] : args.elements)) {
                  if (!first) {
                    first = value;
                    const Class = expr.elements.length === 2 ? 'Map' : 'Set';
                    globals.add(Class);
                    Structs.add(value);
                    constants.push(`const ${value}=${Class}`);
                  }
                  else
                    constants.push(`${value}=${first}`);
                }
                path.parentPath.replaceWithMultiple(bodyNode(`${constants.join(',')}`));
              }
              else {
                let first = '';
                const constants = [];
                const isStruct = expr.type === 'ClassExpression';
                for (const {value} of (args.type === 'StringLiteral' ? [args] : args.elements)) {
                  if (!first) {
                    first = value;
                    constants.push(`const ${value}=${Classes.get(expr) || Enums.get(expr)}`);
                  }
                  else
                    constants.push(`${value}=${first}`);
                  if (isStruct)
                    Structs.add(value);
                }
                path.parentPath.replaceWithMultiple(bodyNode(`${constants.join(',')}`));
              }
              break;
            }
          }
          break;
      }
    };
  }
};
