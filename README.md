# directive.js
[![Build Status](https://secure.travis-ci.org/yearofmoo/directive.js.png?branch=master)](https://travis-ci.org/yearofmoo/directive.js)

Directive.js brings the power of directives from angular.js into vanilla JavaScript.
Directives are effectively JavaScript callbacks for HTML elements, CSS classes and
custom HTML components that are found on a webpage.

This tool is useful when building AJAX-enhanced webpages where various components
need to be updated when new page content is added.

## Requirements
- No special dependencies are required. This tool works with standard JavaScript.
- jQuery integrates fine as well (just remember to use `$(element)` when needed).

## Browser Support
- Anything that supports `document.querySelectorAll` (so nothing below IE8).

## Installation
1. Grab using bower: `bower install directive.js`
2. The files are under `dist/directive.js` or `dist/directive.min.js`

You can also just download the files directive from github under `dist/`.

## Usage

### Registering Directives
```js
var container = document.body;

var directives = new DirectiveContainer(container);
directives.register('custom-component', function(element, attrs) {
  //this is called when compiled
});

directives.register('another-component', function(element, attrs) {
  //this is called when compiled
});

var html = '<custom-component>Hello</custom-component>' +
           '<another-component>Hello Again</another-component>';

directives.update(html); //the directives are fired!<D-r>
```

### Listening on Events
The directive body has a `on(event, fn)` function which allows for events
to be created.

```js
var directives = new DirectiveContainer(); //document.body is the default

directives.register('noisy-component', function(element, attrs) {
  this.on('scream', function(volume) {
    scream('ahhhhh', volume * 10);
  });
});

directives.update('<noisy-component></noisy-component>');

directives.trigger('scream', 5);
```

### Observing Attributes
Directives can also watch attributes:

```js
var directives = new DirectiveContainer(); //document.body is the default

directives.register('.careful-directive', function(element, attrs) {
  this.observe('title', function(newValue, oldValue) {
    console.log('The title is now: ', newValue);    
  });
});

directives.update('<div title="some-title" class="careful-directive"></div>');
// "The title is now: some-title"

var element = document.body.querySelector('.careful-directive');

directives.attr(element, 'title', 'another-title');
// "The title is now: another-title"

directives.attr(element, 'title', 'one-more-title');
// "The title is now: one-more-title"

element.setAttribute('title', 'final-title');
directives.checkObservers();
// "The title is now: final-title"

element.setAttribute('title', 'super-final-title');
directives.compile();
// "The title is now: super-final-title"
```

### Targeting inner regions of HTML
Sometimes you may just want to replace a certain region of code without
having to recompile the entire page. This can be done by adding in a
CSS selector into the `update()` or `compile()` methods.

```js
var directives = new DirectiveContainer(); //document.body is the default

var count = 0;
directives.register('.directive', function(element) {
  element.innerHTML = 'I am directive #' + (count++); 
});

var html = '<div class="outer">' +
           '  <div class="directive"></div>' +
           '  <div class="inner"></div>' +
           '    <div class="directive"></div>' +
           '    <div class="directive"></div>' +
           '    <div class="directive"></div>' +
           '  </div>' +
           '</div>';

directives.update(html);

console.log(document.body);
/*
<div class="outer">
  <div class="directive">I am directive #0</div>
  <div class="inner"></div>
    <div class="directive">I am directive #1</div>
    <div class="directive">I am directive #2</div>
    <div class="directive">I am directive #3</div>
  </div>
</div>
*/

var newHTML = '<div class="directive"></div>';
directives.update('.outer .inner', newHTML);

console.log(document.body);
/*
<div class="outer">
  <div class="directive">I am directive #0</div>
  <div class="directive">I am directive #4</div>
</div>
*/
```

## Building it
Run:

- `sudo npm install -g gulp`
- `npm install`
- `gulp package`

The files will be created inside of `dist/directive.js`.

## Testing it
Run:

- `sudo npm install -g gulp`
- `npm install`
- `gulp test`
