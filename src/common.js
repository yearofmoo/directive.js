var DIRECTIVE_MARK_KEY = 'data-directive-id';

function forEach(collection, fn) {
  if (collection == null) return;

  if (collection.length != null) {
    for(var i=0;i<collection.length;i++) {
      fn(collection[i], i);
    }
  } else {
    for(var i in collection) {
      if (collection.hasOwnProperty(i)) {
        fn(collection[i], i);
      }
    }
  }
}

function isElementMarked(element) {
  var val = element.getAttribute(DIRECTIVE_MARK_KEY);
  return val != null && val >= 0;
}

function markElement(element, instanceID) {
  instanceID != null
      ? element.setAttribute(DIRECTIVE_MARK_KEY, instanceID)
      : element.removeAttribute(DIRECTIVE_MARK_KEY);
}

function camelCase(value) {
  return value.replace(/-./g, function(v) {
    return v.charAt(1).toUpperCase();
  });
}

function compileAttrs(element) {
  var attrs = {};
  forEach(element.attributes, function(entry) {
    var attr = entry.name;
    if (attr && attr.length) {
      var value = entry.value;
      if (value !== undefined) {
        attrs[camelCase(attr)] = value;
      }
    }
  });
  return attrs;
}
