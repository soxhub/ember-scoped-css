import './curly.css';
import { setComponentTemplate } from '@ember/component';
import { precompileTemplate } from '@ember/template-compilation';
import templateOnly from '@ember/component/template-only';

var TEMPLATE = precompileTemplate("{{footer class=(concat @class 'my-class_ea1ad6fa7')}}\n{{footer class='my-class_ea1ad6fa7'}}");

var curly = setComponentTemplate(TEMPLATE, templateOnly());

export { curly as default };
//# sourceMappingURL=curly.js.map
