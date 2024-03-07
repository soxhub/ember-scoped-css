import './strict.css';
import { on } from '@ember/modifier';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';
import templateOnly from '@ember/component/template-only';

const noop = () => {};
const Strict = setComponentTemplate(precompileTemplate("\n  <p class=\"hi_e0d942f65\">text color</p>\n  {{!-- this button is part of the test to ensure we don't blow away this scope bag--}}\n  <button {{on \"click\" noop}}>e</button>\n", {
  scope: () => ({
    on,
    noop
  }),
  strictMode: true
}), templateOnly());

export { Strict };
//# sourceMappingURL=strict.js.map
