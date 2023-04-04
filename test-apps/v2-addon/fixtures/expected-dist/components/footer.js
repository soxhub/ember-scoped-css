import './footer.css';
import templateOnly from '@ember/component/template-only';
import { setComponentTemplate } from '@ember/component';
import { precompileTemplate } from '@ember/template-compilation';

var footer = setComponentTemplate(precompileTemplate(`
  <div class='alert_e8b2ef263 e8b2ef263' data-test3={{concat "test" "my-class_eb8759922"}} data-test2="my-class_eb8759922" data-test="my-class_eb8759922">
    <div class="e8b2ef263">
      {{@title}}
    </div>
    <p class="e8b2ef263">
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
