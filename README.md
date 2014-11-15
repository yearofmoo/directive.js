# directive.js

Directive.js brings the power of directives from Angular into VanillaJS.

## Requirements
- Nothing is required in this code for it to work.
- jQuery integrates fine as well (just remember to use `$(element)` when needed).

## Usage

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
