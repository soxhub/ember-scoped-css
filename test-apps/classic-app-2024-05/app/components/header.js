import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class Header extends Component {
  @tracked label = 'header';
}
