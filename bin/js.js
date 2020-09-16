// TODO use a proper AST

const {stringify} = JSON;

module.exports = content => {
  const {keys} = Object;
  let types = new Set;
  const enums = (...values) => {
    const out = [];
    const value = [];
    values.forEach(v => {
      if (typeof v === 'object') {
        const [key] = keys(v);
        value.push(`${key}:${stringify(v[key])}`);
      }
      else
        value.push(`${v}:Symbol(${stringify(v)})`);
    });
    types.forEach(type => {
      out.push(`globalThis.${type}={${value.join(',')}};`);
    });
    return out.join('\n');
  };
  return `const Cast=(C,i)=>i instanceof C?i:new C(_);\nconst cast=(C,t,i)=>typeof i===t?i:C(i);\n${content.trim()}`
    // DEFINITIONS
    .replace(/define\(((?:\[[^]]+?\]|.+?))\s*,\s*([^\3]+?)\)([;\n\r])/g, (_, type, $2) => {
      eval(`types = new Set([].concat(${type}))`);
      const i = $2.indexOf('(');
      return -1 < i ? eval($2) : '';
    })
    // TYPE CHECKS
    .replace(/is\(\s*\{([^:]+?):\s*([^\3]+)(\s*\}\s*\))/g, (_, $1, $2) => {
      switch ($1.trim()) {
        case 'int':
        case 'float':
        case 'double':
        case 'num':
        case 'number':
        case 'f32':
        case 'f64':
        case 'i8':
        case 'i16':
        case 'i32':
        case 'u8':
        case 'u16':
        case 'u32':
        case 'uc8':
        case 'i64':
        case 'u64':
          return `typeof ${$2} === 'number'`;
        case 'bool':
        case 'boolean':
          return `typeof ${$2} === 'boolean'`;
        case 'str':
        case 'string':
          return `typeof ${$2} === 'string'`;
        case 'void':
        case 'undefined':
          return `typeof ${$2} === 'undefined'`;
        case 'fn':
        case 'function':
          return `typeof ${$2} === 'function'`;
        default:
          // TODO: enums and unions
          return `${$2} instanceof ${$1}`;
      }
    })
    // TYPE CASTS
    // TODO: actually cast values (typed or not)
    .replace(/as\(\s*\{([^:]+?):\s*([^\3]+)(\s*\}\s*\))/g, '$2')
    // ASSIGNMENTS
    .replace(/\{([^:]+?):\s*([^}]+?)\}(\s*=)([^;\n\r]+)/g, (_, $1, $2, $3, $4) => {
      const type = $1.trim();
      if (/^\[.+\]$/.test(type)) {
        let constructor = '';
        const ref = $4.trim();
        switch (type.slice(1, -1)) {
          case 'f64':
          case 'double':
            if (!constructor)
              constructor = 'Float64Array';
          case 'f32':
            if (!constructor)
              constructor = 'Float32Array';
          case 'i8':
            if (!constructor)
              constructor = 'Int8Array';
          case 'i16':
            if (!constructor)
              constructor = 'Int16Array';
          case 'i32':
            if (!constructor)
              constructor = 'Int32Array';
          case 'u8':
            if (!constructor)
              constructor = 'Uint8Array';
          case 'u16':
            if (!constructor)
              constructor = 'Uint16Array';
          case 'u32':
            if (!constructor)
              constructor = 'Uint32Array';
          case 'uc8':
            if (!constructor)
              constructor = 'UintClamped8Array';
          case 'i64':
            if (!constructor)
              constructor = 'Int64Array';
          case 'u64':
            if (!constructor)
              constructor = 'Uint64Array';
          default:
            return `${$2} = Cast(${constructor},${ref})`;
        }
      }
      return $2 + $3 + $4;
    })
  ;
};
