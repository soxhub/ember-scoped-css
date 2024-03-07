import { scopedClass } from 'ember-scoped-css';

import type { TOC } from '@ember/component/template-only';

export const Strict: TOC<{ Element: null }> = <template>
  <p class={{scopedClass "hi"}}>text color</p>
</template>
