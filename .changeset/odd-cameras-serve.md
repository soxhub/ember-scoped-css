---
'ember-scoped-css': minor
---

Fix issue where sufficiently modern JS would not be parseable by scoped-css' build processes.

Folks would run in to this if they ship code with untranspiled

- static initializer blocks
- private fields

Both these ecma features are supported everywhere, so it's reasonable that folks would expect their tooling to support parsing those features.
