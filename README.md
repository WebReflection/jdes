# Destructured JS

[![Build Status](https://travis-ci.com/WebReflection/jdes.svg?branch=master)](https://travis-ci.com/WebReflection/jdes) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/jdes/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/jdes?branch=master)

A type safe JS runtime.

### TODO for CLI
- [ ] target JS (cleanup)
- [ ] target another PL that can export WASM or compile natively

## API

<details>
  <summary><strong id="api-define">define(type, definition)</strong></summary>

Allow the definition of enums, structs, unions, or any other arbitrary type.

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
