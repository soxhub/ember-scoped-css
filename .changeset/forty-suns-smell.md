---
'ember-scoped-css': minor
---

Fix TypeScript / Glint support.
There is now a template-registry that folks can import for loose-mode components:

```ts
import 'ember-source/types';
import 'ember-source/types/preview';

import type ScopedCss from 'ember-scoped-css/template-registry';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry extends ScopedCss {
    // ...
  }
}
```

Note that the `scoped-class` helper is removed at build time, so you should never see it at runtime. The types here are to satisfy correctness/type checking/lints.
