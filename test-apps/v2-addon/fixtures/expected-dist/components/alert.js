import './alert.css';
import templateOnly from '@ember/component/template-only';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("<div class=\"e4b9579df\">\n  <h3 class=\"header_e4b9579df\">\n    {{@title}}\n  </h3>\n  <p class=\"message_e4b9579df {{@some}}\">\n    {{@message}}\n  </p>\n</div>");

var alert = setComponentTemplate(TEMPLATE, templateOnly());

export { alert as default };
//# sourceMappingURL=alert.js.map
