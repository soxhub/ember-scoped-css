import './strict.css';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';
import templateOnly from '@ember/component/template-only';

const Strict = setComponentTemplate(precompileTemplate("\n  <p class=\"hi_e0d942f65\">text color</p>\n", {
  scope: () => ({
    scopedClass
  }),
  strictMode: true
}), templateOnly());

export { Strict };
//# sourceMappingURL=strict.js.map
