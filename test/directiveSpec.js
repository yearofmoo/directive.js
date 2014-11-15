describe('Directive', function() {

  var directive;
  beforeEach(function() {
    directive = new DirectiveContainer();
  });

  it('should register a directive with a selector', function() {
    var capturedText;
    directive.register('strong', function(element) {
      capturedText = element.innerHTML;
    });

    var html = '<strong>hello</strong>';
    document.body.innerHTML = html;

    directive.compile();

    expect(capturedText).toBe('hello');
  });

  it('should only compile the same element once', function() {
    var count = 0;
    directive.register('strong', function(element) {
      count++;
    });

    var html = '<strong>hello</strong>';
    document.body.innerHTML = html;

    directive.compile();

    expect(count).toBe(1);

    document.body.innerHTML += html;

    directive.compile();

    expect(count).toBe(2);
  });

  it('should support classes, tags, ID and attribute selectors', function() {
    var captures = {};

    registerDirective('.header');
    registerDirective('header');
    registerDirective('#header');
    registerDirective('[header]');

    var html = '<div class="header">one</div>' +
               '<header>two</header>' +
               '<div id="header">three</div>' +
               '<div header="true">four</div>';

    document.body.innerHTML = html;

    directive.compile();

    assertFound('.header');
    assertFound('header');
    assertFound('#header');
    assertFound('[header]');

    function registerDirective(selector) {
      directive.register(selector, function(element) {
        captures[selector] = element.innerHTML;
      });
    }

    function assertFound(selector) {
      var element = document.body.querySelector(selector);
      expect(captures[selector]).toBe(element.innerHTML);
    }
  });

  it('should allow directives to listen on events that are triggered', function() {
    var captured = false;
    directive.register('.directive', function(element) {
      this.on('myEvent', function(data) {
        captured = data;
      });
    });

    document.body.innerHTML = '<div class="directive"></div>';
    directive.compile();

    expect(captured).toBe(false);

    var eventData = { someVal: true };
    directive.trigger('myEvent', eventData);

    expect(captured).toBeTruthy();
    expect(captured).toEqual(eventData);
  });

  it('should destroy old directives when new data is rendered', function() {
    var destroyed = false;
    directive.register('.old-directive', function(element) {
      this.on('destroy', function(data) {
        destroyed = true;
      });
    });

    directive.update('<div class="old-directive">...</div>');
    expect(destroyed).toBe(false);
    expect(document.body.querySelector('.old-directive')).toBeTruthy();

    directive.update('<div class="new-directive">...</div>');
    expect(destroyed).toBe(true);
    expect(document.body.querySelector('.old-directive')).toBeFalsy();
    expect(document.body.querySelector('.new-directive')).toBeTruthy();
  });

  it('should allow inner regions of the container to be replaced', function() {
    var count = 0;
    directive.register('.directive', function(element) {
      count++;
      this.on('destroy', function(data) {
        count--;
      });
    });

    var html = '<div class="container">' +
               '  <div class="directive">...</div>' +
               '  <div class="inner">' +
               '    <div class="directive">' +
               '       1' +
               '    </div>' +
               '    <div class="directive">' +
               '       2' +
               '    </div>' +
               '    <div class="directive">' +
               '       3' +
               '    </div>' +
               '  </div>' +
               '</div>';

    directive.update(html);
    expect(count).toBe(4);

    var replacementHTML = '<div class="inner">...</div>';
    directive.update('.container .inner', replacementHTML);

    expect(count).toBe(1);
  });

  it('should collect all attributes when registered', function() {
    var capturedAttrs;
    directive.register('.special-directive', function(element, attrs) {
      capturedAttrs = attrs;
    });

    var html = '<div class="special-directive" ' +
                  'value="true" ' +
                  'another-value=123 ' +
                  'boolean-value>...</div>';
    directive.update(html);

    expect(capturedAttrs).toEqual({
      'class' : 'special-directive',
      value : 'true',
      anotherValue: '123',
      booleanValue: ''
    });
  });

  it('should allow directives to listen on attributes', function() {
    var captureLog = [];
    directive.register('.observer-directive', function(element, attrs) {
      this.observe('watchMe', function(newValue, oldValue) {
        captureLog.push([newValue, oldValue]);
      });
    });

    var html = '<div class="observer-directive">...</div>';
    
    directive.update(html);

    var element = document.body.querySelector('.observer-directive');
    directive.attr(element, 'watchMe', 'blue');
    directive.attr(element, 'watchMe', 'red');
    directive.attr(element, 'watchMe', 'green');

    expect(captureLog.shift()).toEqual([null, undefined]);
    expect(captureLog.shift()).toEqual(['blue', null]);
    expect(captureLog.shift()).toEqual(['red', 'blue']);
    expect(captureLog.shift()).toEqual(['green', 'red']);
  });

  it('should provide a list of all the directives registered', function() {

    var FN = function() { };
    
    register('.one');
    register('two');
    register('#three');
    register('[four]');

    expect(directive.list()).toEqual([
      ['.one', FN],
      ['two', FN],
      ['#three', FN],
      ['[four]', FN],
    ]);
    
    function register(selector) {
      directive.register(selector, FN);
    }
  });

  it('should allow for another directive to be registered with the same selector', function() {

    var directiveA = function() { return 1; }
    var directiveB = function() { return 2; }

    directive.register('.car', directiveA);
    directive.register('.car', directiveB);

    expect(directive.list()).toEqual([
      ['.car', directiveA],
      ['.car', directiveB]
    ]);
  });

});
