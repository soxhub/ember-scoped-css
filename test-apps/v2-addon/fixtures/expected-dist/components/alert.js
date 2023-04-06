import './alert.css';
import { setComponentTemplate } from '@ember/component';
import { precompileTemplate } from '@ember/template-compilation';
import templateOnly from '@ember/component/template-only';

var TEMPLATE = precompileTemplate("<div class=\"e8e958954 e8e958954\">\n  <h3 class='header_e8e958954'>\n    {{@title}}\n  </h3>\n  <p class='message_e8e958954 {{@some}}'>\n    {{@message}}\n  </p>\n</div>");

var alert = setComponentTemplate(TEMPLATE, templateOnly());

export { alert as default };
//# sourceMappingURL=alert.js.map
