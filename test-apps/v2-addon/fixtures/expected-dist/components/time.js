import './time.css';
import templateOnly from '@ember/component/template-only';
import { setComponentTemplate } from '@ember/component';
import { precompileTemplate } from '@ember/template-compilation';

var time = setComponentTemplate(precompileTemplate(`
  <h1 class="e3dfc1780">Time</h1>
`, {
  strictMode: true
}), templateOnly("time", "_time"));

export { time as default };
//# sourceMappingURL=time.js.map
