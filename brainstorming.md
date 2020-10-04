# About jdes

The goal of this project is *not* to make any *JS* executable or working cross platforms, rather define a *JS* subset that could be written, and tested, with ease, but could target super strict languages such as *C*.

## Goals

  * simplify the creation of native programs and module without going too far from writing standard *JS*
  * make executable outcome as small as possible, but not smaller
  * be an alternative to all *JS* engines out there that try to make any *JS* usable through a runtime ... hence, be a *runtimeless* alternative within the current offer of all these "*use or embed JS natively*" approaches

## Primitives and globals

Following a list of things that *must* work without compromises across targets:

  * **TypedArray** as immutable lists of same type
  * **Math** as namespace to perform *Math* related operations
  * **RegExp** as immutable reference and through third party libraries when needed
  * **JSON** to optionally include any *JSON* library that can serialize and unserialize data
  * **Struct** to define strictly typed instances (classes without extends)
  * **Enums** to define enumerables (static objects with optional defaults)
  * **String.prototype** for anything string related
  * **Array** mutable lists of same type (use `array(type)` ?) and its prototype
  * **Map** through a pre-defined `Map<key, value>` type  (use `map(type, type)` ?) and its prototype
  * **Set** through a pre-defined `Set<type>` type  (use `set(type)` ?) and its prototype
  * **Object** *(?)* as mutable generic references

All other primitives *might* be supported as *string*, *number*, *int*, *float*, etcetera.

#### Optionally to be included

  * *closures* or nested functions
  * *spread* operations

## The JS Subset

To be able to target every possible env, these are major restrictions to what's possible:

  * no runtime prototype changes allowed ... ever
  * every `for/of` is transformed as `for(let thing=toForOf,i=0;i<thing.length;i++)` so no generators or iterables (*Set*, *Map*) are allowed ... however, these iterables will have a `forEach` or other methods implemented
  * no *Reflect* or anything that coudl change, evaluate, or define a runtime behavior
  * *generators* are not supported
  * *cosures* are better off (not supported, might be later)

If the target is *JS*, but *not* the *ES3* version of it, any code that won't follow previous convention will still be valid, cleaned up, and work as expected.

Most restrictions and definitions, in such case, will be mostly vaporware, but if the target is *ES3* you are in charge of providing all polyfills that are needed, except for *Set* and *Map*, which are automatically provided when needed.

See [es5-shim](https://github.com/es-shims/es5-shim) good old library for other polyfills.

## As main program

If a *non-imported* file expoerts a *default* function, it will be transpiled as `main(...)` function and executed right away.

## As module (stretch goal)

Each file that exports utilities and *not* a *default* *function* will be resolved and included ahead of time before producing the final distributable.