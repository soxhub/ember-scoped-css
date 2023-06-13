---
'ember-scoped-css': minor
---

Normalize on module paths for `scopedClass` as well as hash generation.

To migrate:

```diff
    assert
      .dom('h1')
-     .hasClass(scopedClass('test-header', 'classic-app/components/header.css'));
+     .hasClass(scopedClass('test-header', 'classic-app/components/header'));
```
