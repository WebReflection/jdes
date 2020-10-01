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
define('RGB', enums('RED', 'GREEN', {BLUE: 1}));
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
