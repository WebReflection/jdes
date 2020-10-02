#!/usr/bin/qjs -m

import {in as stdin, out as stdout} from 'std';

let find = '';
let place = '';

for (let i = 1; i < scriptArgs.length; i++) {
  if (/^\//.test(scriptArgs[i]))
    find = scriptArgs[i];
  else
    place = scriptArgs[i];
}

if (find.length) {
  const i = find.lastIndexOf('/');
  const re = new RegExp(find.slice(1, i), find.slice(i + 1));
  if (place.length) {
    const out = stdin.readAsString().replace(re, place);
    const {length} = out;
    const utf8 = new Uint8Array(length);
    for (let i = 0; i < length; i++)
      utf8[i] = out[i].charCodeAt(0);
    stdout.write(utf8.buffer, 0, length);
  }
}
