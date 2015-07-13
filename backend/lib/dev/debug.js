
function lg() {
  var args = Array.prototype.slice.call(arguments);
  if (typeof args[0] === 'string') args[0] = '[dbg] ' + args[0];
  console.log.apply(console, args);
}

function nop() {}

module.exports = {
  // lg: lg,
  lg: nop,
}
