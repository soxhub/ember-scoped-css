# Changelog

## Release (2024-06-12)

ember-scoped-css 0.21.0 (minor)
ember-scoped-css-compat 10.0.2 (patch)

#### :rocket: Enhancement
* `ember-scoped-css`, `embroider-app`
  * [#234](https://github.com/soxhub/ember-scoped-css/pull/234) [Breaking]: remove the app-js-loader (embroider-webpack) ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `ember-scoped-css`, `embroider-app`, `pods-embroider-app`
  * [#233](https://github.com/soxhub/ember-scoped-css/pull/233) [Breaking]: Remove the appDependencyLoader (used for embroider-webpack) ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `ember-scoped-css`, `embroider-app`, `pods-embroider-app`, `v2-addon-ts`, `v2-addon`
  * [#206](https://github.com/soxhub/ember-scoped-css/pull/206) Supports pods-routes/templates/styles under webpack-embroider3 ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :house: Internal
* `ember-scoped-css-compat`, `ember-scoped-css`, `classic-app`, `embroider-app`, `pods-classic-app`, `pods-embroider-app`, `v2-addon-ts`, `v2-addon`
  * [#232](https://github.com/soxhub/ember-scoped-css/pull/232) Use shared-workspace-lockfile=false to have more realistic peer situations. ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2024-06-11)

ember-scoped-css 0.20.0 (minor)
ember-scoped-css-compat 10.0.1 (patch)

#### :rocket: Enhancement
* `ember-scoped-css`, `classic-app`
  * [#226](https://github.com/soxhub/ember-scoped-css/pull/226) Add better error when `scoped-class` makes it way to runtime ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :bug: Bug Fix
* `ember-scoped-css`
  * [#225](https://github.com/soxhub/ember-scoped-css/pull/225) Fix mishandling of package lookup cache ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :house: Internal
* `ember-scoped-css-compat`, `ember-scoped-css`, `classic-app`, `embroider-app`, `pods-classic-app`, `pods-embroider-app`, `v2-addon-ts`
  * [#224](https://github.com/soxhub/ember-scoped-css/pull/224) Upgrade devdeps ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* Other
  * [#223](https://github.com/soxhub/ember-scoped-css/pull/223) Remove overrides ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2024-06-06)

ember-scoped-css 0.19.1 (patch)

#### :bug: Bug Fix
* `ember-scoped-css`
  * [#211](https://github.com/soxhub/ember-scoped-css/pull/211) Fix template path transform issue with the app name had "app" in the name ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#216](https://github.com/soxhub/ember-scoped-css/pull/216) Remove noisy log ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2024-05-22)

ember-scoped-css-compat 10.0.0 (major)

#### :boom: Breaking Change
* `ember-scoped-css-compat`
  * [#208](https://github.com/soxhub/ember-scoped-css/pull/208) Force ember-scoped-css-compat-to-release ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :house: Internal
* [#210](https://github.com/soxhub/ember-scoped-css/pull/210) Re-roll the lockfile to get the latest github-changelog ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2024-05-22)

ember-scoped-css 0.19.0 (minor)

#### :rocket: Enhancement
* `ember-scoped-css`, `classic-app`, `embroider-app`, `v2-addon`
  * [#207](https://github.com/soxhub/ember-scoped-css/pull/207) Upgrade babel-plugin-ember-template-compilation ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `v2-addon`
  * [#197](https://github.com/soxhub/ember-scoped-css/pull/197) (Breaking) Move the internal test v2 addon to `addon.gjs()`, dropping support for rollup-plugin-glimmer-template-tag ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `embroider-app`
  * [#195](https://github.com/soxhub/ember-scoped-css/pull/195) (Breaking) Drop support for 3.28 ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `ember-scoped-css`
  * [#186](https://github.com/soxhub/ember-scoped-css/pull/186) Loosen peer requirements ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#185](https://github.com/soxhub/ember-scoped-css/pull/185) (Breaking) Forbid renaming of scopedClass when importing it for types reasons ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :house: Internal
* `v2-addon`
  * [#205](https://github.com/soxhub/ember-scoped-css/pull/205) Remove ember template imports v3 from the libraries ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `embroider-app`, `pods-embroider-app`, `v2-addon`
  * [#204](https://github.com/soxhub/ember-scoped-css/pull/204) Upgrade other embroider dependencies ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `classic-app`
  * [#203](https://github.com/soxhub/ember-scoped-css/pull/203) Upgrade ember-resources ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#189](https://github.com/soxhub/ember-scoped-css/pull/189) Additional assertions in the classic test-app ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `ember-scoped-css`, `classic-app`, `embroider-app`, `pods-classic-app`, `pods-embroider-app`
  * [#202](https://github.com/soxhub/ember-scoped-css/pull/202) Upgrade boilerplate runtime dependencies ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `embroider-app`, `pods-embroider-app`
  * [#201](https://github.com/soxhub/ember-scoped-css/pull/201) Upgrade @embroider/webpack ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* Other
  * [#200](https://github.com/soxhub/ember-scoped-css/pull/200) Root cleanup ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#188](https://github.com/soxhub/ember-scoped-css/pull/188) Split out the tests into a matrix so its easier to see which test app… ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#179](https://github.com/soxhub/ember-scoped-css/pull/179) Setup Release plan ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `ember-scoped-css`, `embroider-app`
  * [#199](https://github.com/soxhub/ember-scoped-css/pull/199) Update @embroider/test-setup ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `ember-scoped-css`, `classic-app`, `embroider-app`, `pods-classic-app`, `pods-embroider-app`, `v2-addon`
  * [#198](https://github.com/soxhub/ember-scoped-css/pull/198) Upgrade local ember-source to 5.8 ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#194](https://github.com/soxhub/ember-scoped-css/pull/194) Use pnpm 9 ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#192](https://github.com/soxhub/ember-scoped-css/pull/192) Upgrade CLI deps ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#190](https://github.com/soxhub/ember-scoped-css/pull/190) Upgrade lint deps ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#182](https://github.com/soxhub/ember-scoped-css/pull/182) Update lint dependencies ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#175](https://github.com/soxhub/ember-scoped-css/pull/175) Update core lint packages ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `embroider-app`
  * [#196](https://github.com/soxhub/ember-scoped-css/pull/196) Add ember 5.4 y 5.8 ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `classic-app`, `pods-classic-app`, `pods-embroider-app`
  * [#193](https://github.com/soxhub/ember-scoped-css/pull/193) Bump dev node ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `ember-scoped-css`, `v2-addon`
  * [#191](https://github.com/soxhub/ember-scoped-css/pull/191) Upgrade babel deps ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `ember-scoped-css`
  * [#187](https://github.com/soxhub/ember-scoped-css/pull/187) Add isRelevantFile tests ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#184](https://github.com/soxhub/ember-scoped-css/pull/184) Simplify babel build <-> real file correlation ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#178](https://github.com/soxhub/ember-scoped-css/pull/178) Refactor path utils, add a ton of tests around path manipulation ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* `ember-scoped-css`, `pods-classic-app`, `pods-embroider-app`
  * [#183](https://github.com/soxhub/ember-scoped-css/pull/183) Remove custom fs exists util ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#181](https://github.com/soxhub/ember-scoped-css/pull/181) Remove stylelint ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)









## v0.9.0 (2023-05-29)

#### :boom: Breaking Change
* [#37](https://github.com/soxhub/ember-scoped-css/pull/37) Implemented scoped-class helper for classic app ([@candunaj](https://github.com/candunaj))

#### :rocket: Enhancement
* [#37](https://github.com/soxhub/ember-scoped-css/pull/37) Implemented scoped-class helper for classic app ([@candunaj](https://github.com/candunaj))

#### Committers: 1
- Stanislav Dunajcan (Stan) ([@candunaj](https://github.com/candunaj))


## v0.8.0 (2023-05-25)

#### :rocket: Enhancement
* [#33](https://github.com/soxhub/ember-scoped-css/pull/33) Support for classic apps ([@candunaj](https://github.com/candunaj))

#### Committers: 1
- Stanislav Dunajcan (Stan) ([@candunaj](https://github.com/candunaj))


## v0.7.0 (2023-05-16)

#### :boom: Breaking Change
* [#32](https://github.com/soxhub/ember-scoped-css/pull/32) simplify path to template-lint plugin ([@mansona](https://github.com/mansona))

#### :memo: Documentation
* [#22](https://github.com/soxhub/ember-scoped-css/pull/22) Added documentation ([@candunaj](https://github.com/candunaj))

#### Committers: 2
- Chris Manson ([@mansona](https://github.com/mansona))
- Stanislav Dunajcan (Stan) ([@candunaj](https://github.com/candunaj))

## v0.6.0 (2023-05-16)

#### :boom: Breaking Change
* [#31](https://github.com/soxhub/ember-scoped-css/pull/31) Fix naming of rollup plugins and helper functions in ember-scoped-css ([@candunaj](https://github.com/candunaj))

#### :rocket: Enhancement
* [#31](https://github.com/soxhub/ember-scoped-css/pull/31) Fix naming of rollup plugins and helper functions in ember-scoped-css ([@candunaj](https://github.com/candunaj))

#### Committers: 1
- Stanislav Dunajcan (Stan) ([@candunaj](https://github.com/candunaj))


## v0.5.0 (2023-05-12)

#### :rocket: Enhancement
* [#28](https://github.com/soxhub/ember-scoped-css/pull/28) Added support for co-located css for gts files ([@candunaj](https://github.com/candunaj))

#### Committers: 1
- Stanislav Dunajcan (Stan) ([@candunaj](https://github.com/candunaj))


## v0.4.1 (2023-05-03)

#### :rocket: Enhancement
* [#27](https://github.com/soxhub/ember-scoped-css/pull/27) Added documentation for ember-scoped-helper rule ([@candunaj](https://github.com/candunaj))

#### Committers: 1
- Stanislav Dunajcan (Stan) ([@candunaj](https://github.com/candunaj))


## v0.4.0 (2023-05-02)

#### :rocket: Enhancement
* [#26](https://github.com/soxhub/ember-scoped-css/pull/26) Add a lint rule for the correct usage of scoped-class helper ([@candunaj](https://github.com/candunaj))

#### Committers: 1
- Stanislav Dunajcan (Stan) ([@candunaj](https://github.com/candunaj))


## v0.3.0 (2023-04-26)

#### :boom: Breaking Change
* [#25](https://github.com/soxhub/ember-scoped-css/pull/25) Remove forked ember-template-imports dependency from ember-scoped-css ([@candunaj](https://github.com/candunaj))

#### :rocket: Enhancement
* [#21](https://github.com/soxhub/ember-scoped-css/pull/21) Scoped class helper ([@candunaj](https://github.com/candunaj))
* [#18](https://github.com/soxhub/ember-scoped-css/pull/18) scoped-class helper with multiple classes ([@candunaj](https://github.com/candunaj))
* [#16](https://github.com/soxhub/ember-scoped-css/pull/16) Fix getPostfix to work with relative paths to files ([@candunaj](https://github.com/candunaj))
* [#12](https://github.com/soxhub/ember-scoped-css/pull/12) Scoped class ([@candunaj](https://github.com/candunaj))
* [#3](https://github.com/soxhub/ember-scoped-css/pull/3) Support V2 addon ([@candunaj](https://github.com/candunaj))

#### :bug: Bug Fix
* [#24](https://github.com/soxhub/ember-scoped-css/pull/24) Fix sourcemaps for JS files that are modified by ember-scoped-css ([@candunaj](https://github.com/candunaj))
* [#20](https://github.com/soxhub/ember-scoped-css/pull/20) Preserve white spaces before and after renamed class ([@candunaj](https://github.com/candunaj))
* [#17](https://github.com/soxhub/ember-scoped-css/pull/17) Implemented replace classes in concat statement ([@candunaj](https://github.com/candunaj))

#### :house: Internal
* [#23](https://github.com/soxhub/ember-scoped-css/pull/23) Add linting for the ember-scoped-css package ([@mansona](https://github.com/mansona))
* [#11](https://github.com/soxhub/ember-scoped-css/pull/11) add a simple test-fixture ([@mansona](https://github.com/mansona))
* [#10](https://github.com/soxhub/ember-scoped-css/pull/10) ember-style-loader ([@candunaj](https://github.com/candunaj))
* [#8](https://github.com/soxhub/ember-scoped-css/pull/8) test-app, test-addon -> embroider-app, v2-addon ([@candunaj](https://github.com/candunaj))
* [#7](https://github.com/soxhub/ember-scoped-css/pull/7) Live reload css moved to @embroider/webpack ([@candunaj](https://github.com/candunaj))
* [#6](https://github.com/soxhub/ember-scoped-css/pull/6) Live reloading imported css styles. ([@candunaj](https://github.com/candunaj))
* [#5](https://github.com/soxhub/ember-scoped-css/pull/5) Live reload imported css ([@candunaj](https://github.com/candunaj))
* [#2](https://github.com/soxhub/ember-scoped-css/pull/2) Add unit tests ([@candunaj](https://github.com/candunaj))

#### Committers: 2
- Chris Manson ([@mansona](https://github.com/mansona))
- Stanislav Dunajcan (Stan) ([@candunaj](https://github.com/candunaj))

