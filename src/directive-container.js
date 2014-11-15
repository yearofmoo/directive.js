var DirectiveContainer = (function(container) {
  container = container || document.body;
  
  var lookup = {};
  var instances = [];
  var events = {};

  function directiveBodyTemplate(attrs) {
    return {
      $events : {},
      $attrs : attrs,

      on : function(event, fn) {
        events[event] = events[event] || [];
        events[event].push(this);
        
        this.$events[event] = this.$events[event] || [];
        this.$events[event].push(fn);
      },

      observe : function(prop, fn) {

      },

      destroy : function() {
        triggerOnFn(this, 'destroy');
      }
    };
  }

  function triggerOnFn(instance, event, data) {
    var listeners = instance.$events[event] || [];
    forEach(listeners, function(fn) {
      fn(data);
    });
  }

  var self;
  return self = {
    register : function(selector, bodyFn) {
      lookup[selector] = lookup[selector] || [];
      lookup[selector].push(bodyFn);
    },

    list : function() {
      var result = [];
      forEach(lookup, function(fns, selector) {
        forEach(fns, function(bodyFn) {
          result.push([selector, bodyFn]);
        });
      });
      return result;
    },

    scan : function(filterFn) {
      filterFn = filterFn || function(val) { return true; };
      var entries = [];
      forEach(lookup, function(fns, selector) {
        forEach(container.querySelectorAll(selector), function(element) {
          if (filterFn(element)) {
            forEach(fns, function(bodyFn) {
              entries.push([element, bodyFn]);
            });
          }
        });
      });
      return entries;
    },

    compile : function() {
      forEach(self.scan(rejectIfMarkedFn), function(entry) {
        var element = entry[0];
        var bodyFn = entry[1];
        var attrs = compileAttrs(element);
        var instance = directiveBodyTemplate(attrs);
        var instanceID = instances.length;
        bodyFn.call(instance, element, attrs);
        instances.push(instance);
        markElement(element, instanceID);
      });

      function rejectIfMarkedFn(element) {
        return !isElementMarked(element);
      }
    },

    decompile : function() {
      forEach(self.scan(isElementMarked), function(entry) {
        var element = entry[0];
        var instanceID = element.getAttribute(DIRECTIVE_MARK_KEY);
        var instance = instances[instanceID];
        triggerOnFn(instance, 'destroy');
        instances.splice(instanceID, 1);
        markElement(element, undefined);
      });
    },

    update : function(newContent) {
      self.decompile(container);
      self.trigger(container, 'update');

      if (typeof newContent == 'string') {
        container.innerHTML = newContent;
      } else {
        container.innerHTML = '';
        container.appendChild(newContent);
      }
      self.compile(container);
    },

    trigger : function(event, data) {
      forEach(events[event] || [], function(instance) {
        triggerOnFn(instance, event, data);
      });
    }
  }
});
