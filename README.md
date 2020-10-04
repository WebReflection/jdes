# Destructured JS

[![Build Status](https://travis-ci.com/WebReflection/jdes.svg?branch=master)](https://travis-ci.com/WebReflection/jdes) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/jdes/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/jdes?branch=master)

A type safe JS runtime.

### TODO for CLI
- [x] target JS (cleanup)
- [ ] target another PL that can export WASM or compile natively

## API

<details id="api-define">
  <summary><strong>define(type, definition)</strong></summary>

Allow the definition of enums, structs, unions, or any other arbitrary type.

The `type` parameter can be either a _string_ or an _array of strings_, in case of multiple types aliases.

The `definition` is either the returned value of `enums`, and `struct`, the `union` reference itself, or an _object_ that exposes at least 2 methods: `check(value, asArray)` and `cast(value)`.

```js
define('special', {
  check(value, asArray) {
    // true when the type is in squared brackets
    return asArray ?
            value.map(v => this.check(v, false)) :
            value instanceof Special;
  },
  cast(value) {
    return this.check(value, false) ? value : new Special(value);
  }
});

const {special: single} = new Special;
const {[special]: multi} = [new Special, new Special];
```

</details>


<details id="api-is">
  <summary><strong>is({type: value})</strong></summary>

It verifies that a specific value is an expected _type_, passing through the definition `check(value, false)` when _type_ is not in square brackets, and `check(value, true)` when it is.

```js
const value = 'test';
if (!is({string: value}))
  throw new TypeError(`unexpected ${value}`);

const values = ['a', 'b', 'c'];
if (!is({[string]: values}))
  throw new TypeError(`unexpected ${values}`);
```

</details>

<details id="api-as">
  <summary><strong>as({type: value})</strong></summary>

It performs a cast through the definition `cast(value)` method, and it's responsibility of such method to understand what kind of value need to be casted, and throw in case there's no way to cast it.

```js
// the following throws a TypeError
const {string: test} = 123;

// the following works as expected
const {string: test} = as({string: 123});

as({string: 123}) === "123"; // true
```

</details>

<details id="api-enums">
  <summary><strong>enums(name, ...)</strong></summary>

_enums_ are simple, static, values that could be just named, or have a simple value.

_enums_ are (currently?) defined in the global context, and it's not possible to define different enums with the same name.

```js
define('Color', enums(
  'RED',      // by default enums are Symbol
  'GREEN',
  {BLUE: 123} // but these could be simple values too
));

console.log(Color);
// {RED: Symbol(RED), GREEN: Symbol(GREEN), BLUE: 123}

const {Color: red} = Color.RED;
const {[Color]: colors} = [Color.RED, Color.BLUE];
```

Differently from other types, _enums_ cannot really be casted.

</details>

<details id="api-fn">
  <summary><strong>fn({returnType: (...) => {}})</strong></summary>

The syntax to define a safe function must provide all information needed to make it safe.

```js
const sum = fn({int: ({int: arg0}, {int: arg1 = 0}) => {
  return arg0 + arg1;
}});

sum(1);         // 1
sum(1, 2);      // 3
sum('a', 'b');  // throws a TypeError
```

Please note:

  * optional arguments must be at the end of the signature. `({int: a}, {int: b = 1})` is OK, but `({int: a = 1}, {int: b})` is not.
  * the return type must always be present. If nothing is returned, a `void` type is expected
  * _rest_ arguments are probably supported but these should *not* be used
  * for options/objects use the `{object: {props}}` if destructuring fields is needed
  * for overloads define *unions*

Differently from regular JS functions, _jdes_ functions can be serialized as _JSON_, and these will be parsed back once parsed.

```js
const json = JSON.serialize(sum);
const fn = JSON.parse(json);

fn(2, 3); // 5
```

</details>

<details id="api-struct">
  <summary><strong>struct(field, method, ...)</strong></summary>

In *jdes* classes are mostly discouraged for at least two reasons:

  * these cannot be used as _type_
  * these cannot target other programming languages, as they all have slightly different classes

Accordingly, whenever you think you need a _class_, you need to create a _struct_.

```js
define('Point2D', struct(
  // mandatory fields {type: name}
  {int: 'x'},
  {int: 'y'}
));

// literals are casted automatically
const {Point2D: p2d} = {x: 1, y: 2};
const {[Point2D]: p2ds} = [p2d, {x: 3, y: 2}];

// also OK through explicit new Point2D
const myPoint = new Point2D({x: 1, y: 2});
```

If a mandatory field is not available as literal property, a _TypeError_ will be thrown.

However, fields can also have **optional** entries that don't need to be present in the literal.

```js
define('Point3D', struct(
  // mandatory fields
  // multiple type: [name, ...] allowed
  {int: ['x', 'y']},
  // optional fields
  // {type: {name: defaultValue}}
  {int: {z: 0}}
));

const {Point3D: p3d} = {x: 1, y: 2};
p3d.z; // 0
```

A _struct_ can also have **methods**, which are just guarded functions.

```js
define('Point3D', struct(
  {int: ['x', 'y']},  // mandatory fields
  {int: {z: 0}},      // default fields
  // methods {returnType: {methodName({argType: name}, ...) {}}}
  {[int]: {coords() {
    return [this.x, this.y, this.z];
  }}}
));
const {Point3D: p3d} = {x: 1, y: 2};
p3d.coords();       // [1, 2, 0]
```

</details>

<details id="api-union">
  <summary><strong>union</strong></summary>

The _union_ utility makes overloads possible by defining multiple known types separated by an underscore.

```js
define('int_float', union);
const {int_float: a} = 1;
const {int_float: b} = 1.2;
const {[int_float]: c} = [a, b];
```

As the `_` underscore is used to split/check types, it is a good idea to never define a type within an underscore, in case it needs to be used as union.

</details>

<details id="api-map">
  <summary><strong>map</strong></summary>

The _map_ utility helps defining *Map* instances with a well known type for both keys or values.

```js
define('StrInt', map(str, int));

// maps definition work via shortcut
const {StrInt: si} = [];
si.set('one', 1); // OK
si.set(1, 'one'); // fails
```

When targeting compilable targets it is *mandatory* to define typed maps.

</details>

<details id="api-set">
  <summary><strong>set</strong></summary>

The _set_ utility helps defining *Set* instances with a well known type for values.

```js
define('Str', set(str));

// maps definition work via shortcut
const {Str: s} = [];
s.add('one'); // OK
s.add(1);     // fails
```

When targeting compilable targets it is *mandatory* to define typed sets.

</details>

<details id="api-unsafe">
  <summary><strong>unsafe()</strong></summary>

_jdes_ runtime guards properties access, type checks, arguments and much more, but all these runtime checks come with a cost.

Even if performance are still very reasonable, a safe execution takes 10X up to 1000X what would be an _unsafe_ execution time.

Accordingly, it is highly recommended to mark _jdes_ unsafe after importing it, when the code is meant to run in production.

```js
import {unsafe} from 'jdes';
if (global.PRODUCTION)
  unsafe();
```

The `unsafe` call is not reversible: once _jdes_ is unsafe it's unsafe.

If the code is transpiled though, and _JS_ is used as target, there's no need to flag anything `unsafe`, as the environment will be super clean and no guards whatsoever are used.

</details>

<details id="api-types">
  <summary><strong>types</strong></summary>

These are all the pre-defined **generic** types:

  * `int` a generic integer, casted via `parseInt(value, 10)`
  * `float` a generic float, casted via `parseFloat(value)`
  * `boolean` - `bool` either `true` or `false`, casted via `Boolean(value)`
  * `number` - `num` a generic number, casted via `Number(value)`
  * `string` - `str` a generic string, casted via `String(value)`
  * `object` - `obj` a generic object (literal/instance), casted via `Object(value)`
  * `function` - `fn` a generic function, casted via `Function` when parsed via _JSON_
  * `void` usable to describe _functions_ return type

There is no `array` type for the simple reason that any type, except for the `void` one, can be part of an array.

```js
// not an array
const {int: i} = 0;
// as array of int
const {[int]: ii} = [0, 0];
```

These are all **specialized** types:

  * `f32` a *Float32Array* compatible number
  * `f64` - `double` a *Float64Array* compatible number
  * `i8` an *Int8Array* compatible number
  * `i16` an *Int16Array* compatible number
  * `i32` an *Int32Array* compatible number
  * `u8` a *Uint8Array* compatible number
  * `u16` a *Uint16Array* compatible number
  * `u32` a *Uint32Array* compatible number
  * `uc8` a *Uint8ClampedArray* compatible number
  * `i64` a *BigInt64Array* compatible number
  * `u64` a *BigUint64Array* compatible number

Each specialized type cast, as value, is performed by setting the value within the index 0 and retrieving it back, while as *array*, the cast is done via `new SpecialConstructor(array)` if the *array* is not already an *instanceof* such constructor.

Please note that all specialized types are *static* when retrieved as *array*.

```js
// single value
const {i32: i} = 0;

// as array - implicit cast
const {[i32]: ii} = [1, 2, 3];
```

If a predefined length is needed, it is always possible to create values explicitly.

```js
const ii = new Int32Array(100);
```

Please note that not all these types are necessarily available, as some engine might not have all of them.

</details>



### Getting Started

[Codepen playground](https://codepen.io/WebReflection/pen/abNjjoV?editors=0011)

```js
import {
  define,                   // used to define types
  as, is,                   // cast and check utils
  enums, fn, struct, union, // specialized types
  unsafe                    // performance boost for production
} from 'jdes';

// values and arrays declaration
const {int: i} = 0;                     // is({int: i});
const {[int]: ii} = [1, 2];             // is({[int]: ii});

// explicit cast
const {string: s} = as({string: 123});  // s === "123"

// unions (multi type overloads)
define('int_float', union);

// functions {returnType: ({argType: name}, ...) => {}}
const squared = fn({int: ({int_float: num = 0}) => num * num});
squared(3); // 9

// enums
define('RGB', enums('RED', 'GREEN', 'BLUE'));
const {RGB: color} = RGB.GREEN;

// struct
define('Point3D', struct(
  {int: ['x', 'y']},  // mandatory properties
  {int: {z: 0}},      // default properties
  // methods {returnType: {methodName({argType: name}, ...) {}}}
  {[int]: {coords() {
    return [this.x, this.y, this.z];
  }}}
));
const {Point3D: p3d} = {x: 1, y: 2};
p3d.coords();       // [1, 2, 0]
is({Point3D: p3d}); // true
```
