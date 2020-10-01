function test(lol) {
  for (const {a, b} of lol) {
    console.log(a.toString());
    console.log(b.toString());
  }
}