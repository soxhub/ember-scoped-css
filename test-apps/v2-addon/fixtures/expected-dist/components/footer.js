import './footer.css';
import templateOnly from '@ember/component/template-only';
import { setComponentTemplate } from '@ember/component';
import { precompileTemplate } from '@ember/template-compilation';
import { concat } from '@ember/helper';

var footer = setComponentTemplate(precompileTemplate(`
  <div class='alert_e9a64d6f1 e9a64d6f1' data-test3={{concat "test" "   my-class_e9a64d6f1 my-other-class_e9a64d6f1  "}} data-test2="  my-class_e9a64d6f1 " data-test="my-class_e9a64d6f1">
    <div class="e9a64d6f1">
      {{@title}}
    </div>
    <p class="e9a64d6f1">
      {{@message}}
    </p>
  </div>
`, {
  strictMode: true,
  scope: () => ({
    concat
  })
}), templateOnly("footer", "_footer"));

export { footer as default };
//# sourceMappingURL=footer.js.map
