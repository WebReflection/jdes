# Destructured JS

[![Build Status](https://travis-ci.com/WebReflection/jdes.svg?branch=master)](https://travis-ci.com/WebReflection/jdes) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/jdes/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/jdes?branch=master)

A type safe JS runtime.

```js
// values and arrays declaration
const {int: i} = 0;                     // is({int: i});
const {[int]: ii} = [1, 2];             // is({[int]: ii});

// explicit cast
const {string: s} = as({string: 123});  // s === "123"

// unions (multi type overloads)
define('int_float', union);

// functions {returnType: ({argType: name}, ...) => {}}
const squared = fn({int: ({int_float: num}) => num * num});
squared(3); // 9

// enums
define('RGB', enums(['RED', 'GREEN', 'BLUE']));
const {RGB: color} = RGB.GREEN;

// struct
define('Point3D', struct([
  {int: ['x', 'y']},  // mandatory properties
  {int: {z: 0}},      // default properties
  // methods {returnType: {methodName({argType: name}, ...) {}}}
  {[int]: {coords() {
    return [this.x, this.y, this.z];
  }}}
]));
const {Point3D: p3d} = {x: 1, y: 2};
p3d.coords();       // [1, 2, 0]
is({Point3D: p3d}); // true
```
