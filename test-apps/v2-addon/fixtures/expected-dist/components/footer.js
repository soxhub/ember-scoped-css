import './footer.css';
import templateOnly from '@ember/component/template-only';
import { setComponentTemplate } from '@ember/component';
import { precompileTemplate } from '@ember/template-compilation';

var footer = setComponentTemplate(precompileTemplate(`
  <div class='alert_ec12a09e5 ec12a09e5' data-test3={{concat "test" "my-class_ec12a09e5 my-other-class_ec12a09e5"}} data-test2="my-class_ec12a09e5" data-test="my-class_ec12a09e5">
    <div class="ec12a09e5">
      {{@title}}
    </div>
    <p class="ec12a09e5">
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
