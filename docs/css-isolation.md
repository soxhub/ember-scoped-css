# CSS Isolation

The isolation method used for `ember-scoped-css` was originally inspired by svelt but actually works slightly differenty.

<!-- TODO add details of how we add our suffix and compare all methods -->
<!-- also make sure that we show examples -->

We were considering multiple approaches for scoping css. It was Svelte, Vue and renaming classes.

## Svelte approach

Svelte is adding generated class to every class and tag used in css file.

Input

```html
<!-- components/first.hbs -->
<p class="my-class">...</p>
<div>...</div>
```

```css
/* components/first.css */
.my-class {
  ...;
}
div {
  ...;
}
```

Output

```html
<!-- components/first.hbs -->
<p class="my-class generated-first">...</p>
<div class="generated-first">...</div>
```

```css
/* components/first.css */
.my-class.generated-first {
  ...;
}
div.generated-first {
  ...;
}
```

## Vue approach

Vue is adding generated attributes to every class and tag used in css file.

Input

```html
<!-- components/first.hbs -->
<p class="my-class">...</p>
<div>...</div>
```

```css
/* components/first.css */
.my-class {
  ...;
}
div {
  ...;
}
```

Output

```html
<!-- components/first.hbs -->
<p class="my-class" data-generated-first>...</p>
<div data-generated-first>...</div>
```

```css
/* components/first.css */
.my-class[data-generated-first] {
  ...;
}
div[data-generated-first] {
  ...;
}
```

## ember-scoped-css approach

ember-scoped-css is renaming classes and adding generating classes to tags used in css file.

Input

```html
<!-- components/first.hbs -->
<p class="my-class">...</p>
<div>...</div>
```

```css
/* components/first.css */
.my-class {
  ...;
}
div {
  ...;
}
```

Output

```html
<!-- components/first.hbs -->
<p class="my-class_generated-first">...</p>
<div class="generated-first">...</div>
```

```css
/* components/first.css */
.my-class_generated-first {
  ...;
}
div.generated-first {
  ...;
}
```

All three approaches can use `:global()` pseudo-class. Selector inside it will not be scoped.

In Svelte the following

```css
.some-class {
  ...;
}
:global(.other-class) {
  //class inside :global will not be scoped
}
```

will become

```css
.some-class.generated {
  ...;
}
.other-class {
}
```

## Why ember-scoped-css chose renaming classes

If class names aren't renamed, it could potentially create an issue when a developer establishes a global class with the same name as that used in a scoped component. In this case, the global style could unintentionally alter the component. Both Svelte and Vue, therefore, necessitate that everyone is aware of class names used in global styles and across all other components. This makes it crucial for developers to select unique class names. However, achieving this could prove to be extremely challenging in larger projects. Let me illustrate this with an example.

If someone would choose the same class name in multiple components and in global styles in svelte and vue styles will leak as in the following example.

```css
/*app.css*/
.header {
  ...;
}
```

```css
/*some-component.css*/
.header {
  ...;
} /*The developer wanted to scope the style*/
```

```css
/*other-component.css*/
:global(.header) {
  ...;
}
```

Result

```css
/*app.css*/
.header {
  ...;
}
```

```css
/*some-component.css*/

/*svelte*/
.header.generated {
  ...;
} /*svelte selector can be overwriten in any other component and from global styles*/
/*vue*/
.header[data-generated] {
  ...;
} /*vue selector can be overwriten in any other component and from global styles*/
/*ember-scoped-css*/
.header_data-generated {
  ...;
} /*ember-scoped-css selector can't be unintentionally overwritten in other components and in global styles*/
```

```css
/*other-component.css*/
.header {
  ...;
}
```

As you can see a developer could use the header class in `some-component` thinking that it is scoped and styles don't leak in or out
but in svelte and vue `other-component` will leak styles to `some-compoent` unitentionally. Also global styles leak to some component unintentionally. This is not the case in `ember-scoped-css`

## Philosophy

The philosophy is to stick with the CSS and HTML as much as possible and not introduce new syntax or concepts.

The key ideas of `ember-scoped-css` are:

- CSS files will be co-located with components so the addon will know which CSS file belongs to which component.
- all CSS selectors will be renamed at build time to prevent styles from leaking
- `:global(.text-center)` can be used to target global classes or classes from any third party CSS
- `{{scoped-class "some-class other_class"}}` helper can be used to pass renamed classes to another components
- Ability to use selectors in unit tests

### Testing

Sometimes you need to test if a class was applied to specific parts of a component, `ember-scoped-css` provides a test-helper function `scopedClass(class: string, pathToCssFile: string) : string` to allow you to tap into the same system for renaming classes.

Input

```js
import { scopedClass } from 'ember-scoped-css/test-helper';

const aSelector = scopedClass('.alert', 'components/foo.css');
```

Output

```js
import { generated } from 'ember-scoped-css';

const aSelector = '.alert_generated-foo';
```
