const {as, define, enums, fn, is, struct, union, unsafe, set, map} = require('../cjs');

const assert = (ok, comment) => {
  console.assert(ok, comment);
  if (!ok)
    process.exit(1);
};

define('Color', enums(
  'RED', 'GREEN', {BLUE: 'blue'}
));

define('i32_f32', union);

define('Point3D', struct(
  {int: ['x', 'y']},
  {int: {z: 0}},
  {[float]: {coords() {
    return [this.x, this.y, this.z];
  }}}
));

define('NSet', set(int));
define('ANSet', set([int]));
define('NMap', map(str, int));
define('ANMap', map(str, [int]));

console.time('safe');
test(false);
console.timeEnd('safe');
testFailures();

unsafe();
console.time('unsafe');
test(true);
console.timeEnd('unsafe');

function test(unsafe) {
  // Enums
  assert(typeof Color.RED === 'symbol', 'unexpected enum type');
  const {Color: color} = Color.BLUE;
  assert(color === 'blue', 'unexpected enum value');
  const {[Color]: colors} = [Color.RED, Color.GREEN, color];
  assert(Array.isArray(colors), 'unexpected enums');
  assert(as({Color: 'blue'}) === Color.BLUE, 'unexpected enum cast');

  // Unions
  const {i32_f32: casted} = as({i32_f32: 0});

  // Typed values
  const {[f32]: ff} = [casted, 0, 0];
  assert(is({[f32]: ff}), 'unexpected typed array');
  assert(as({[f32]: new Float32Array([])}), 'unexpected as(f32) result');

  // Primitives
  assert(as({void: 123}) === void 0, 'unexpected void cast');
  const {i32_f32: i_f} = 0;
  const {[i32_f32]: ii_ff} = [i_f, 0];
  assert(typeof i_f === 'number', 'unexpected union type');
  assert(Array.isArray(ii_ff), 'unexpected union as array');
  const {[i32_f32]: ii_ff2} = ii_ff.slice(0);
  assert(ii_ff2[2] === void 0, 'unexpected value at index 2');
  assert(ii_ff2.join(',') === ii_ff.join(','), 'unexpected array slice');
  const {str: st} = as({str: 'test'});
  assert(st === 'test', 'unexpected string value');

  const {int: i} = -0;
  assert(Object.is(i, -0), 'unexpected -0 value as int');

  const {float: f} = -0;
  assert(Object.is(f, -0), 'unexpected -0 value as float');

  const {[number]: nums} = [1, 2.3, 4];
  assert(Array.isArray(nums), 'unexpected array of numbers');
  assert(nums[3] === void 0, 'unexpected value at index 3');
  nums[0] = 5;
  assert(nums.push(6, 7) === 5, 'unexpected push return');
  assert(nums.join('-') === '5-2.3-4-6-7', 'unexpected nums values');
  assert(Array.isArray(nums.splice(1, 1)), 'unexpected splice');
  nums.splice(0);
  if (unsafe)
    nums[1] = 1;

  const {int: s} = as({int: '123'});
  assert(s === 123, 'unexpected int cast');

  const {obj: o} = {};
  const {[obj]: oo} = [{}, {}];

  // Functions
  const squared = fn({int: ({int: i = 3}) => i * i});
  assert(squared() === 9, 'unexpected function result');
  const eval = as({fn: {int: ['{int: i}', 'return i * i;']}});
  assert(eval(3) === 9, 'unexpected function result');
  let stringified = JSON.stringify(eval);
  assert(stringified === '{"ÿint":["{int: i}","return i * i;"]}', 'unexpected JSON outcome');
  assert(JSON.parse(stringified)(3) === 9, 'unexpected parse result');
  const nothing = fn({void() {}});
  assert(nothing() === void 0, 'unexpected non void return');
  stringified = JSON.stringify(as({fn: {[int]: ['{int: i}', 'return [i * i];']}}));
  assert(stringified === '{"ÿSymbol(int)":["{int: i}","return [i * i];"]}', 'unexpected JSON outcome');
  assert(Array.isArray(JSON.parse(stringified)(3)), 'unexpected parse result with array returned');
  assert(JSON.parse('{"ÿint":null}')["ÿint"] === null, 'unexpected parse result');

  // Struct
  const {Point3D: p3d} = {x: 1, y: 2};
  assert(is({Point3D: p3d}), 'unexpected Point3D');
  assert(p3d.z === 0, 'unexpected default entry');
  p3d.z = 3;
  assert(p3d.z === 3, 'unexpected override value');
  assert(JSON.stringify(p3d) === JSON.stringify({x: 1, y: 2, z: 3}), 'unexpected struct as JSON');

  const {[Point3D]: p3ds} = [p3d, {x: 3, y: 4, z: 5}];
  assert(Array.isArray(p3ds), 'unexpected Point3D as array');

  // Set
  const {NSet: ns} = [1];
  assert(ns.size === 1 && ns.has(1), 'unexpected Set behavior');

  const {NMap: nm} = [['one', 1]];
  assert(nm.size === 1 && nm.has('one') && nm.get('one') === 1, 'unexpected Map behavior');
}

function testFailures() {
  // define, is
  expect(Error, () => define('int', {}));
  expect(Error, () => define('shenanigans', {}));
  expect(TypeError, () => define('toString', {check() {}, cast() {}}));
  expect(TypeError, () => define('Object', {check() {}, cast() {}}));
  expect(TypeError, () => is({shenanigans: true}));
  expect(TypeError, () => {
    const {[int]: i} = {length: 0};
  });

  // Enums
  expect(TypeError, () => {
    const {[Color]: fail} = [1, 2, 3];
  });
  expect(TypeError, () => {
    const {Color: fail} = 1;
  });
  expect(TypeError, () => {
    const {Color: fail} = as({Color: 1});
  });

  // Unions
  expect(TypeError, () => {
    define('int_shenanigans', union);
  });
  expect(TypeError, () => {
    as({i32_f32: '1'});
  });

  // Typed
  expect(TypeError, () => {
    const {f32: f} = 0.1;
  });

  // Primitives
  const {[number]: nums} = [1, 2, 3];
  expect(TypeError, () => {
    nums.splice(0, 0, '0');
  });
  expect(TypeError, () => {
    nums[0] = '2';
  });
  expect(Error, () => {
    nums[3] = 4;
  });
  expect(TypeError, () => {
    nums.push('4');
  });
  expect(TypeError, () => {
    const {int: i} = 'nope';
  });
  expect(TypeError, () => {
    const {[int]: ii} = ['no', 'pe'];
  });
  expect(TypeError, () => {
    const {[float]: nums} = [0, '1'];
  });

  // Functions
  const squared = fn({int: ({int: i}) => String(i)});
  expect(TypeError, () => {
    squared('3');
  });
  expect(TypeError, () => {
    squared(3);
  });

  // Struct
  const {Point3D: p3d} = {x: 1, y: 2};
  p3d.what = 'ever';
  assert(p3d.what === void 0, 'structs are not frozen');
  expect(TypeError, () => {
    p3d.z = 'nope';
  });
  expect(TypeError, () => {
    p3d.x = '2';
  });
  expect(TypeError, () => {
    define('Point2D', struct(
      {int: 'x'},
      {int: {y: '2'}}
    ));
  });
}

function expect(Error, fn) {
  try {
    fn();
    assert(false, 'unexpected result in ' + fn);
  }
  catch (error) {
    assert(error instanceof Error, 'unexpected error type');
  }
}
