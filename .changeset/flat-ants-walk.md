---
'ember-scoped-css': patch
---

Fix an issue with strings in `class` attributes declared via sub-expressions (such as within if statements), were not properly getting scoped.

For example:

```js
<template>
  <div class="global-probably {{if @condition "a-local-class"}}">
    Hello there!
  </div>
</template>
```

When the sibling CSS file only declares `a-local-class`, we would expect that

- `global-probably` remains unchanged
- `a-local-class` gets hashed

Note that this bug is not fixed for embroider consumers.
