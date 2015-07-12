
var filePath    = process.argv[2];
var filterParam = process.argv[3];
var showParam   = process.argv[4];

function parseFilter(param) {
  var filter = {};

  var bufArr = param.split('=');
  var bufQuery = bufArr[0];
  
  filter.value = bufArr[1];
  filter.path = bufQuery.split('.');

  return (filter);
}

function parseDisplayFields(param) {
  return (param.split(','));
}

/**
 * @param {Object} object
 * @param {Array<String>} filterPath
 * @param {String|int} filterValue
 * @param {Function(obj, path)} callback
 * @param {Array<String>} path
 */
function iterator(object, filterPath, filterValue, callback, path) {
  var p = path || [];

  if (filterPath.length === 0) return;

  var localFilterPath = filterPath.slice();
  var pathFragment = localFilterPath.shift();

  if (localFilterPath.length === 0) {
    if (object[pathFragment] === filterValue) callback.apply({}, [ object, path ]);
  } 

  var keysForIterate = [];
  if (pathFragment === '*') keysForIterate = Object.keys(object);
  else keysForIterate = [ pathFragment ];

  for (var i=0; i<keysForIterate.length; i++) {
    var k = keysForIterate[i];
    var objPath = p.slice();
    objPath.push(k);
    iterator(object[k], localFilterPath, filterValue, callback, objPath);
  }
}

var filter = parseFilter(filterParam);
var display = parseDisplayFields(showParam);

var report = require('./' + filePath);

iterator(report, filter.path, filter.value, function(obj, path) {
  var show = [];
  for (var i=0; i<display.length; i++) show.push(obj[display[i]]);
  console.log('[%s]', path.join('.'), show);
});

