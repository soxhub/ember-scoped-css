import Component from '@glimmer/component';
import { scopedClass as sc } from 'ember-scoped-css';
import { tracked } from '@glimmer/tracking';

export default class TestComponent extends Component {
  @tracked
  scopedClass = '';

  constructor() {
    super(...arguments);
    this.scopedClass = sc('header', 'alert.css');
  }
}
