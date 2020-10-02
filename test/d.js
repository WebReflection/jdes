define('Point2D', struct({int: ['x', 'y']}, {void: {coords({int: x}, {int: y = 0}) { this.x = x; this.y = y; }}}));

const sum = function ({int: arg0}, {int: arg1 = 0}) {
  return arg0 + arg1;
};

const {Point2D: p2d} = {x: 1, y: 2};


