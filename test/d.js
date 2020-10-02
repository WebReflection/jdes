define('Point3D', struct(
  {int: ['x', 'y']},  // mandatory properties
  {int: {z: 0}},      // default properties
  // methods {returnType: {methodName({argType: name}, ...) {}}}
  {[int]: {coords({int: x}, {int: y = 2}) {
    return [this.x, this.y, this.z];
  }}}
));