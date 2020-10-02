const parser = require('@babel/parser');
const traverse = require("@babel/traverse").default;

const slice = (code, item) => code.slice(item.start, item.end);

const genericExpression = js => bodyNode(js)[0].expression;

const objectExpression = o => bodyNode(`(${JSON.stringify(o)})`)[0].expression;

const bodyNode = js => parser.parse(js).program.body;

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
  options: {
    sourceType: 'unambiguous'
  },
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
  ].concat(...statics))
};
