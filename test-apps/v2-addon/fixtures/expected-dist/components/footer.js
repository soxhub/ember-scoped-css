import './footer.css';
import templateOnly from '@ember/component/template-only';
import { setComponentTemplate } from '@ember/component';
import { precompileTemplate } from '@ember/template-compilation';
import { concat } from '@ember/helper';

var footer = setComponentTemplate(precompileTemplate(`
  <div class='alert_e41324d86 e41324d86' data-test3={{concat "test" "   my-class_e41324d86 my-other-class_e41324d86  "}} data-test2="  my-class_e41324d86 " data-test="my-class_e41324d86">
    <div class="e41324d86">
      {{@title}}
    </div>
    <p class="e41324d86">
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
