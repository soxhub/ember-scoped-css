import './alert.css';
import { setComponentTemplate } from '@ember/component';
import { precompileTemplate } from '@ember/template-compilation';
import templateOnly from '@ember/component/template-only';

var TEMPLATE = precompileTemplate("<div class=\"e0286f62f\">\n  <h3 class=\"header_e0286f62f\">\n    {{@title}}\n  </h3>\n  <p class=\"message_e0286f62f {{@some}}\">\n    {{@message}}\n  </p>\n</div>");

var alert = setComponentTemplate(TEMPLATE, templateOnly());

export { alert as default };
//# sourceMappingURL=alert.js.map
