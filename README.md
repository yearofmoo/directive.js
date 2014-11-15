# directive.js

Directive.js brings the power of directives from Angular into VanillaJS.

## Requirements
- Nothing is required in this code for it to work.
- jQuery integrates fine as well (just remember to use `$(element)` when needed).

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
```

## Building it

Run:

- `sudo npm install -g gulp gulp-cli`
- `npm install`
- `gulp package`

The files will be created inside of `dist/directive.js`.

## Testing it

Run:

- `sudo npm install -g gulp gulp-cli`
- `npm install`
- `gulp test`
