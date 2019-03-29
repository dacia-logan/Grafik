function createArray(length) {
  var arr = new Array(length || 0),
      i = length;

  if (arguments.length > 1) {
    var args = Array.prototype.slice.call(arguments, 1);
    while(i--) arr[i] = createArray.apply(this, args);
  }
  return arr;
}
var positions=createArray(6,20,6);
for (var y = 0; y < 20; y++) {
  for (var x = 0; x < 6; x++) {
    for (var z = 0; z < 6; z++) {
      positions[x][y][z]=0;
    }
  }
}
