self.deejs = (function (exports) {
  'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  /*!
   * ISC License
   *
   * Copyright (c) 2020, Andrea Giammarchi, @WebReflection
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
   * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
   * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
   * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
   * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
   * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
   * PERFORMANCE OF THIS SOFTWARE.
   */
  var SAFE = true;
  var isArray = Array.isArray,
      AProto = Array.prototype;
  var assign = Object.assign,
      create = Object.create,
      defineProperty = Object.defineProperty,
      freeze = Object.freeze,
      same = Object.is,
      OProto = Object.prototype;
  var getPrototypeOf = Reflect.getPrototypeOf,
      ownKeys = Reflect.ownKeys;
  var concat = AProto.concat,
      every = AProto.every,
      filter = AProto.filter,
      map = AProto.map,
      push = AProto.push,
      slice = AProto.slice,
      splice = AProto.splice;
  /* istanbul ignore next */

  var G = (typeof self === "undefined" ? "undefined" : _typeof(self)) === 'object' ? self : global;
  var JdeS = new Map();
  var typed = new Map();
  var enumerable = new Set();
  var structs = new Set();
  var proxies = new WeakSet();

  var asString = function asString(value) {
    return String(value).toString();
  };

  var asType = function asType(type) {
    return String(type).replace(/^Symbol\(([\s\S]+)\)$/, '[$1]');
  };

  var inspect = function inspect(object) {
    var _ownKeys = ownKeys(object),
        _ownKeys2 = _slicedToArray(_ownKeys, 1),
        type = _ownKeys2[0];

    var value = object[type];

    var _ = JdeS.get(type);

    if (!_) throw new TypeError("unknown type ".concat(asType(type)));
    return {
      _: _,
      type: type,
      value: value
    };
  };

  var invalidType = function invalidType(T, V) {
    var asArray = isArray(V);
    var INVALID_TYPE = "expected type ".concat(asType(T), " but got ").concat([asArray ? 'array' : _typeof(V), asArray ? map.call(V, asString) : asString(V)].join(': '));
    throw new TypeError(INVALID_TYPE);
  };

  var patchMethod = function patchMethod(array, type, name, method, _) {
    defineProperty(array, name, {
      value: function value() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return proxyArray(patchArray(method.apply(array, args), type, _), type, _);
      }
    });
  };

  var patchArray = function patchArray(array, type, _) {
    if (SAFE) {
      patchMethod(array, type, 'concat', concat, _);
      patchMethod(array, type, 'filter', filter, _);
      patchMethod(array, type, 'map', map, _);
      patchMethod(array, type, 'slice', slice, _);
      defineProperty(array, 'push', {
        value: function value() {
          for (var _len2 = arguments.length, values = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            values[_key2] = arguments[_key2];
          }

          if (!_.check(values, true)) invalidType(type, values);
          return push.apply(array, values);
        }
      });
      defineProperty(array, 'splice', {
        value: function value(s) {

          for (var _len3 = arguments.length, values = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
            values[_key3 - 2] = arguments[_key3];
          }

          if (!_.check(values, true)) invalidType(type, values);
          return proxyArray(patchArray(splice.apply(array, arguments), type, _), type, _);
        }
      });
    }

    return array;
  };

  var proxyArray = function proxyArray(array, type, _) {
    if (SAFE) proxies.add(array = new Proxy(array, {
      set: function set(target, key, value) {
        if (!_.check(value, false)) invalidType(type, value);
        if (target.length <= key) throw new Error('out of bounds: use push(...values) instead');
        target[key] = value;
        return true;
      }
    }));
    return array;
  };

  var protoAccessor = function protoAccessor(proto, key, type, value) {
    var _ = new WeakMap();

    defineProperty(proto, key, {
      enumerable: true,
      get: function get() {
        return _.has(this) ? _.get(this) : value;
      },
      set: function set(value) {
        if (SAFE && !is(_defineProperty({}, type, value))) invalidType(type, value);

        _.set(this, value);
      }
    });
  };

  var as = function as(object) {
    var _inspect = inspect(object),
        _ = _inspect._,
        value = _inspect.value;

    return _.cast(value);
  };
  var is = function is(object) {
    var _inspect2 = inspect(object),
        _ = _inspect2._,
        type = _inspect2.type,
        value = _inspect2.value;

    return _.check(value, _typeof(type) === 'symbol');
  };
  var define = function define(types, def) {
    var isUnion = def === union;
    var isEnum = !isUnion && enumerable.has(def);
    var isStruct = !isUnion && !isEnum && structs.has(def);
    if (!isUnion && !isEnum && !isStruct && (!def.check || !def.cast)) throw new Error("unable to define ".concat(types, " without check and cast"));

    var _iterator = _createForOfIteratorHelper([].concat(types)),
        _step;

    try {
      var _loop = function _loop() {
        var type = _step.value;
        if (JdeS.has(type) || type in G || type in OProto) throw new TypeError("".concat(asType(type), " already defined"));

        var _ = isUnion || isEnum ? def(type) : isStruct ? {
          check: function check(value, asArray) {
            var _this = this;

            return asArray ? every.call(value, function (v) {
              return _this.check(v, false);
            }) : value instanceof def || getPrototypeOf(value) === OProto;
          },
          cast: function cast(value) {
            return value instanceof def ? value : new def(value);
          }
        } : assign({}, def);

        var array = isEnum ? G[type].toString() : Symbol(type);
        if (!isEnum) defineProperty(G, type, {
          configurable: true,
          value: array
        });
        JdeS.set(type, _);
        JdeS.set(array, _);
        defineProperty(OProto, type, {
          configurable: true,
          get: function get() {
            if (SAFE && !_.check(this, false)) invalidType(type, this);
            return isStruct ? _.cast(this) : this;
          }
        });
        defineProperty(OProto, array, {
          configurable: true,
          get: function get() {
            if (SAFE && !_.check(this, true)) invalidType(array, this);
            if (typed.has(type)) return _.cast(this);
            if (SAFE && !isArray(this)) invalidType(array, this);
            if (SAFE && proxies.has(this)) return this;
            var result = isStruct ? map.call(this, _.cast, _) : this;
            return proxyArray(patchArray(result, array, _), type, _);
          }
        });
      };

      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        _loop();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  var enums = function enums() {
    for (var _len4 = arguments.length, properties = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      properties[_key4] = arguments[_key4];
    }

    var callback = function callback(type) {
      var values = [];
      var array = Symbol(type);
      var Enum = create(null, {
        toString: {
          value: function value() {
            return array;
          }
        }
      });

      var _iterator2 = _createForOfIteratorHelper(properties),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var property = _step2.value;
          var isString = typeof property === 'string';
          var key = isString ? property : ownKeys(property)[0];
          var value = isString ? Symbol(property) : property[key];
          Enum[key] = value;
          values.push(value);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      defineProperty(G, type, {
        configurable: true,
        value: freeze(Enum)
      });
      return {
        check: function check(value, asArray) {
          var _this2 = this;

          return asArray ? every.call(value, function (v) {
            return _this2.check(v, false);
          }) : values.some(function (v) {
            return same(v, value);
          });
        },
        cast: function cast(value) {
          if (SAFE && !this.check(value, false)) invalidType('enum', value);
          return value;
        }
      };
    };

    enumerable.add(callback);
    return callback;
  };
  var fn = function fn(definition) {
    var _ownKeys3 = ownKeys(definition),
        _ownKeys4 = _slicedToArray(_ownKeys3, 1),
        type = _ownKeys4[0];

    var callback = definition[type];
    return function () {
      var result = callback.apply(this, arguments);
      if (SAFE && !is(_defineProperty({}, type, result))) invalidType(type, result);
      return result;
    };
  };
  var struct = function struct() {
    var Struct = function Struct(definition) {
      _classCallCheck(this, Struct);

      if (SAFE) {
        var _iterator3 = _createForOfIteratorHelper(mandatory),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var key = _step3.value;
            this[key] = definition[key];
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        var _iterator4 = _createForOfIteratorHelper(arbitrary),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var _key5 = _step4.value;
            if (_key5 in definition) this[_key5] = definition[_key5];
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      } else {
        for (var _key6 in definition) {
          this[_key6] = definition[_key6];
        }
      }

      return SAFE ? freeze(this) : this;
    };

    var prototype = Struct.prototype;
    var arbitrary = [];
    var mandatory = [];

    for (var i = 0; i < arguments.length; i++) {
      var _inspect3 = inspect(i < 0 || arguments.length <= i ? undefined : arguments[i]),
          type = _inspect3.type,
          value = _inspect3.value;

      if (typeof value === 'string' || isArray(value)) {
        var _iterator5 = _createForOfIteratorHelper([].concat(value)),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var key = _step5.value;
            mandatory.push(key);
            protoAccessor(prototype, key, type, void 0);
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      } else {
        var _ownKeys5 = ownKeys(value),
            _ownKeys6 = _slicedToArray(_ownKeys5, 1),
            _key7 = _ownKeys6[0];

        var shared = value[_key7];
        if (typeof shared === 'function') defineProperty(prototype, _key7, {
          value: fn(_defineProperty({}, type, shared))
        });else {
          if (SAFE && !is(_defineProperty({}, type, shared))) invalidType(type, shared);
          arbitrary.push(_key7);
          protoAccessor(prototype, _key7, type, shared);
        }
      }
    }

    defineProperty(prototype, 'toJSON', {
      value: function value() {
        var object = create(null);

        for (var _key8 in this) {
          object[_key8] = this[_key8];
        }

        return object;
      }
    });
    structs.add(Struct);
    return Struct;
  };
  var union = function union(type) {
    var types = type.split('_');
    if (SAFE && !types.every(function (type) {
      return JdeS.has(type);
    })) throw new TypeError("unable to define union: ".concat(type));
    return {
      check: function check(value, asArray) {
        var _this3 = this;

        return asArray ? every.call(value, function (v) {
          return _this3.check(v, false);
        }) : types.some(function (type) {
          return is(_defineProperty({}, type, value));
        });
      },
      cast: function cast(value) {
        var i = types.findIndex(function (type) {
          return is(_defineProperty({}, type, value));
        });
        if (i < 0) invalidType(type, value);
        return JdeS.get(types[i]).cast(value);
      }
    };
  };
  var unsafe = function unsafe() {
    SAFE = false;
  }; // NUMERIC TYPES

  [{
    f32: 'Float32Array'
  }, {
    f64: 'Float64Array'
  }, {
    i8: 'Int8Array'
  }, {
    i16: 'Int16Array'
  }, {
    i32: 'Int32Array'
  }, {
    u8: 'Uint8Array'
  }, {
    u16: 'Uint16Array'
  }, {
    u32: 'Uint32Array'
  }, {
    uc8: 'Uint8ClampedArray'
  }, {
    i64: 'BigInt64Array'
  }, {
    u64: 'BigUint64Array'
  }, {
    "double": 'Float64Array'
  }].forEach(function (info) {
    var _ownKeys7 = ownKeys(info),
        _ownKeys8 = _slicedToArray(_ownKeys7, 1),
        type = _ownKeys8[0];

    var Class = G[info[type]];
    /* istanbul ignore else */

    if (Class) {
      typed.set(type, Class);
      var instance = new Class(1);
      define(type, {
        check: function check(value, asArray) {
          return asArray ? value instanceof Class || isArray(value) && every.call(new Class(value), function (n) {
            return !isNaN(n);
          }) : (instance[0] = value, same(instance[0], value));
        },
        cast: function cast(value) {
          return typeof value === 'number' ? (instance[0] = value, instance[0]) : value instanceof Class ? value : new Class(value);
        }
      });
    }
  });
  define('int', {
    check: function check(i, asArray) {
      var _this4 = this;

      return asArray ? every.call(i, function (i) {
        return _this4.check(i, false);
      }) : same(this.cast(i), i);
    },
    cast: function cast(i) {
      return same(i, -0) ? i : parseInt(i, 10) || 0;
    }
  });
  define('float', {
    check: function check(f, asArray) {
      var _this5 = this;

      return asArray ? every.call(f, function (f) {
        return _this5.check(f, false);
      }) : same(this.cast(f), f);
    },
    cast: function cast(f) {
      return same(f, -0) ? f : parseFloat(f) || 0;
    }
  }); // PRIMITIVES

  [[Boolean, 'boolean', 'bool'], [Number, 'number', 'num'], [String, 'string', 'str'], [function (f) {
    var _ownKeys9 = ownKeys(f),
        _ownKeys10 = _slicedToArray(_ownKeys9, 1),
        type = _ownKeys10[0];

    return fn(_defineProperty({}, type, Function.apply(null, [].concat(f[type]))));
  }, 'function', 'fn']].forEach(function (_ref) {
    var _ref2 = _toArray(_ref),
        transform = _ref2[0],
        real = _ref2[1],
        fake = _ref2.slice(2);

    var is = function is(value) {
      return _typeof(value) === real;
    };

    var check = function check(value, asArray) {
      return asArray ? every.call(value, is) : is(value);
    };

    var cast = function cast(value) {
      return is(value) ? value : transform(value);
    };

    define([real].concat(_toConsumableArray(fake)), {
      check: check,
      cast: cast
    });
  });

  exports.as = as;
  exports.define = define;
  exports.enums = enums;
  exports.fn = fn;
  exports.is = is;
  exports.struct = struct;
  exports.union = union;
  exports.unsafe = unsafe;

  return exports;

}({}));
