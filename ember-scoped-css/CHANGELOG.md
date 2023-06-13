# ember-scoped-css

## 0.11.0

### Minor Changes

- [`55d09ea`](https://github.com/soxhub/ember-scoped-css/commit/55d09ea84b6ce4fc0feb7231eb25dfde6ed8471a) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Normalize on module paths for `scopedClass` as well as hash generation.

  To migrate:

  ```diff
      assert
        .dom('h1')
  -     .hasClass(scopedClass('test-header', 'classic-app/components/header.css'));
  +     .hasClass(scopedClass('test-header', 'classic-app/components/header'));
  ```

## 0.10.1

### Patch Changes

- [#53](https://github.com/soxhub/ember-scoped-css/pull/53) [`09282f8`](https://github.com/soxhub/ember-scoped-css/commit/09282f8d1b476ddb88777f5c8657a0fba3c1b923) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Publish 'dist' as well as 'src', as 'dist' contains the cjs variants of the build tools

## 0.10.0

### Minor Changes

- [#50](https://github.com/soxhub/ember-scoped-css/pull/50) [`da51618`](https://github.com/soxhub/ember-scoped-css/commit/da516183b564ac92e3993ed62e249d3f15ee1d00) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Support importing scopedClass in tests
