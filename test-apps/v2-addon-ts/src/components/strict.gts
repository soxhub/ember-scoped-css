import { on } from '@ember/modifier';

import { scopedClass } from 'ember-scoped-css';

import type { TOC } from '@ember/component/template-only';

const noop = () => {};

export const Strict: TOC<{ Element: null }> = <template>
  <p class={{scopedClass "hi"}}>text color</p>
  {{! this button is part of the test to ensure we don't blow away this scope bag}}
  <button {{on 'click' noop}}>e</button>
</template>
