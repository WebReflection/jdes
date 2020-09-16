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

let SAFE = true;
const REBACK = /^[^(]*\(\s*([^\2]*?)(\s*\)\s*(?:=>)?\s*\{)([\s\S]*?)\}$/;
const RESYMBOL = /^Symbol\(([\s\S]+)\)$/;

const {isArray, prototype: AProto} = Array;
const {parse} = JSON;
const {assign, create, defineProperty, freeze, is: same, prototype: OProto} = Object;
const {getPrototypeOf, ownKeys} = Reflect;

const {concat, every, filter, map, push, slice, splice} = AProto;

/* istanbul ignore next */
const G = typeof self === 'object' ? self : global;

const JdeS = new Map;
const typed = new Map;

const enumerable = new Set;
const structs = new Set;

const proxies = new WeakSet;

const defaultArg = new Proxy({}, {get: () => void 0});

const asString = value => String(value).toString();
const asType = type => String(type).replace(RESYMBOL, '[$1]');

const inspect = object => {
  const [type] = ownKeys(object);
  const value = object[type];
  const _ = JdeS.get(type);
  if (!_)
    throw new TypeError(`unknown type ${asType(type)}`);
  return {_, type, value};
};

const invalidType = (T, V) => {
  const asArray = isArray(V);
  const INVALID_TYPE = `expected type ${asType(T)} but got ${[
    asArray ? 'array' : typeof(V),
    asArray ? map.call(V, asString) : asString(V)
  ].join(': ')}`;
  throw new TypeError(INVALID_TYPE);
};

const patchMethod = (array, type, name, method, _) => {
  defineProperty(array, name, {
    value: (...args) => proxyArray(
      patchArray(method.apply(array, args), type, _),
      type, _
    )
  });
};

const patchArray = (array, type, _) => {
  if (SAFE) {
    patchMethod(array, type, 'concat', concat, _);
    patchMethod(array, type, 'filter', filter, _);
    patchMethod(array, type, 'map', map, _);
    patchMethod(array, type, 'slice', slice, _);
    defineProperty(array, 'push', {
      value(...values) {
        if (!_.check(values, true))
          invalidType(type, values);
        return push.apply(array, values);
      }
    });
    defineProperty(array, 'splice', {
      value(s, d = 0, ...values) {
        if (!_.check(values, true))
          invalidType(type, values);
        return proxyArray(
          patchArray(splice.apply(array, arguments), type, _),
          type, _
        );
      }
    });
  }
  return array;
};

const proxyArray = (array, type, _) => {
  if (SAFE)
    proxies.add(array = new Proxy(array, {set(target, key, value) {
      if (!_.check(value, false))
        invalidType(type, value);
      if (target.length <= key)
        throw new Error('out of bounds: use push(...values) instead');
      target[key] = value;
      return true;
    }}));
  return array;
};

const protoAccessor = (proto, key, type, value) => {
  const _ = new WeakMap;
  defineProperty(proto, key, {
    enumerable: true,
    get() {
      return _.has(this) ? _.get(this) : value;
    },
    set(value) {
      if (SAFE && !is({[type]: value}))
        invalidType(type, value);
      _.set(this, value);
    }
  });
};

export const as = object => {
  const {_, value} = inspect(object);
  return _.cast(value);
};

export const is = object => {
  const {_, type, value} = inspect(object);
  return _.check(value, typeof type === 'symbol');
};

export const define = (types, def) => {
  const isUnion = def === union;
  const isEnum = !isUnion && enumerable.has(def);
  const isStruct = !isUnion && !isEnum && structs.has(def);
  if (!isUnion && !isEnum && !isStruct && (!def.check || !def.cast))
    throw new Error(`unable to define ${types} without check and cast`);
  for (const type of [].concat(types)) {
    const isVoid = /^(?:void|undefined)$/.test(type);
    if (JdeS.has(type) || (type in OProto) || (type in G && !isVoid))
      throw new TypeError(`${asType(type)} already defined`);
    const _ = isUnion || isEnum ?
      def(type) :
      (isStruct ? {
        check(value, asArray) {
          return asArray ?
                  every.call(value, v => this.check(v, false)) :
                  (value instanceof def ||
                    getPrototypeOf(value) === OProto);
        },
        cast(value) {
          return value instanceof def ? value : new def(value);
        }
      } : assign({}, def));
    const array = isEnum ? G[type].toString() : Symbol(type);
    if (!isEnum && !isVoid)
      defineProperty(G, type, {configurable: true, value: array});
    JdeS.set(type, _);
    defineProperty(OProto, type, {
      configurable: true,
      get() {
        if (SAFE && !_.check(this, false))
          invalidType(type, this);
        return isStruct ? _.cast(this) : this;
      }
    });
    if (!isVoid) {
      JdeS.set(array, _);
      defineProperty(OProto, array, {
        configurable: true,
        get() {
          if (SAFE && !_.check(this, true))
            invalidType(array, this);
          if (typed.has(type))
            return _.cast(this);
          if (SAFE && !isArray(this))
            invalidType(array, this);
          if (SAFE && proxies.has(this))
            return this;
          const result = isStruct ? map.call(this, _.cast, _) : this;
          return proxyArray(patchArray(result, array, _), type, _);
        }
      });
    }
  }
};

export const enums = (...properties) => {
  const callback = (type) => {
    const values = [];
    const array = Symbol(type);
    const Enum = create(null, {toString: {value: () => array}});
    for (const property of properties) {
      const isString = typeof property === 'string';
      const key = isString ? property : ownKeys(property)[0];
      const value = isString ? Symbol(property) : property[key];
      Enum[key] = value;
      values.push(value);
    }
    defineProperty(G, type, {configurable: true, value: freeze(Enum)});
    return {
      check(value, asArray) {
        return asArray ?
                every.call(value, v => this.check(v, false)) :
                values.some(v => same(v, value));
      },
      cast(value) {
        if (SAFE && !this.check(value, false))
          invalidType('enum', value);
        return value;
      }
    };
  };
  enumerable.add(callback);
  return callback;
};

export const fn = definition => {
  const [type] = ownKeys(definition);
  const callback = definition[type];
  const {length} = callback;
  defineProperty(fn, 'toJSON', {value() {
    const cb = String(callback);
    const args = cb.replace(REBACK, '$1');
    const body = cb.replace(REBACK, '$3');
    return {[`\xff${String(type)}`]: [args.trim(), body.trim()]};
  }});
  return fn;
  function fn(...args) {
    for (let i = 0, {length: len} = args; i < length; i++) {
      if (len <= i)
        args[i] = defaultArg;
    }
    const result = callback.apply(this, args);
    if (SAFE && !is({[type]: result}))
      invalidType(type, result);
    return result;
  }
};

export const struct = (...definition) => {
  class Struct {
    constructor(definition) {
      if (SAFE) {
        for (const key of mandatory)
          this[key] = definition[key];
        for (const key of arbitrary) {
          if (key in definition)
            this[key] = definition[key];
        }
      }
      else {
        for (const key in definition)
          this[key] = definition[key];
      }
      return SAFE ? freeze(this) : this;
    }
  }
  const {prototype} = Struct;
  const arbitrary = [];
  const mandatory = [];
  for (let i = 0; i < definition.length; i++) {
    const {type, value} = inspect(definition[i]);
    if (typeof value === 'string' || isArray(value)) {
      for (const key of [].concat(value)) {
        mandatory.push(key);
        protoAccessor(prototype, key, type, void 0);
      }
    }
    else {
      const [key] = ownKeys(value);
      const shared = value[key];
      if (typeof shared === 'function')
        defineProperty(prototype, key, {value: fn({[type]: shared})});
      else {
        if (SAFE && !is({[type]: shared}))
          invalidType(type, shared);
        arbitrary.push(key);
        protoAccessor(prototype, key, type, shared);
      }
    }
  }
  defineProperty(prototype, 'toJSON', {value() {
    const object = create(null);
    for (const key in this)
      object[key] = this[key];
    return object;
  }});
  structs.add(Struct);
  return Struct;
};

export const union = type => {
  const types = type.split('_');
  if (SAFE && !every.call(types, type => JdeS.has(type)))
    throw new TypeError(`unable to define union: ${type}`);
  return {
    check(value, asArray) {
      return asArray ?
              every.call(value, v => this.check(v, false)) :
              types.some(type => is({[type]: value}));
    },
    cast(value) {
      const i = types.findIndex(type => is({[type]: value}));
      if (i < 0)
        invalidType(type, value);
      return JdeS.get(types[i]).cast(value);
    }
  };
};

export const unsafe = () => {
  SAFE = false;
};


// JSON Functions
defineProperty(JSON, 'parse', {value(text, reviver = (_, v) => v) {
  return parse.call(JSON, text, function (k, v) {
    if (typeof v === 'object' && v) {
      const keys = ownKeys(v);
      if (keys.length === 1) {
        let [type] = keys;
        if (type[0] === '\xff' && isArray(v[type])) {
          type = type.slice(1);
          if (/^Symbol\((.+?)\)$/.test(type))
            type = G[RegExp.$1];
          v = as({fn: {[type]: v[keys]}});
        }
      }
    }
    return reviver.call(this, k, v);
  });
}});



// NUMERIC TYPES
[
  {f32: 'Float32Array'},
  {f64: 'Float64Array'},
  {i8: 'Int8Array'},
  {i16: 'Int16Array'},
  {i32: 'Int32Array'},
  {u8: 'Uint8Array'},
  {u16: 'Uint16Array'},
  {u32: 'Uint32Array'},
  {uc8: 'Uint8ClampedArray'},
  {i64: 'BigInt64Array'},
  {u64: 'BigUint64Array'},
  {double: 'Float64Array'}
]
.forEach(info => {
  const [type] = ownKeys(info);
  const Class = G[info[type]];
  /* istanbul ignore else */
  if (Class) {
    typed.set(type, Class);
    const instance = new Class(1);
    define(type, {
      check: (value, asArray) => asArray ?
              (value instanceof Class || (
                isArray(value) && every.call(new Class(value), n => !isNaN(n))
              )) :
              ((instance[0] = value), same(instance[0], value)),
      cast: value => typeof value === 'number' ?
              ((instance[0] = value), instance[0]) :
              (value instanceof Class ? value : new Class(value))
    });
  }
});

define('int', {
  check(i, asArray) {
    return asArray ?
            every.call(i, i => this.check(i, false)) :
            same(this.cast(i), i);
  },
  cast: i => same(i, -0) ? i : parseInt(i, 10) || 0
});

define('float', {
  check(f, asArray) {
    return asArray ?
            every.call(f, f => this.check(f, false)) :
            same(this.cast(f), f);
  },
  cast: f => same(f, -0) ? f : parseFloat(f) || 0
});



// PRIMITIVES
[
  [Boolean, 'boolean', 'bool'],
  [Number, 'number', 'num'],
  [String, 'string', 'str'],
  [f => {
    const [type] = ownKeys(f);
    return fn({[type]: Function.apply(null, [].concat(f[type]))});
  }, 'function', 'fn'],
  [() => void 0, 'undefined', 'void']
].forEach(([transform, real, ...fake]) => {
  const is = value => typeof value === real;
  const check = (value, asArray) => asArray ? every.call(value, is) : is(value);
  const cast = value => is(value) ? value : transform(value);
  define([real, ...fake], {check, cast});
});


// OBJECTS
define(['object', 'obj'], {
  check(value, asArray) {
    return asArray ?
            every.call(value, v => this.check(v, false)) :
            typeof value === 'object' && value instanceof Object
  },
  cast: Object
});
