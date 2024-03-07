---
'ember-scoped-css': minor
---

Support `gjs` and `gts` (`<template>`) by allowing an import for `scopedClass`.

Example usage:

```gjs
import { scopedClass } from 'ember-scoped-css';

<template>
  <p class={{scopedClass "hi"}}>text color</p>
</template>
```
