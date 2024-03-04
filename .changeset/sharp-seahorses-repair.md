---
'ember-scoped-css': patch
---

Fixes #108. ember-scoped-css is now compatible with `@embroider/addon-dev@v4`, which means that `rollup-plugin-glimmer-template-tag` is no longer needed, and also no longer recommended in the README. For GJS/GTS/`<template>`, please use `@embroider/addon-dev`'s `addon.gjs()` plugin.
