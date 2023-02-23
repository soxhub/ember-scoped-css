
import Component from '@glimmer/component';
    <style>
      div {
        width: 170px;
        border: 1px solid black;
        padding: 0px 15px;
        margin-top: 15px;
      }

      .header {
        margin-top: 0;
        background-color: lightgreen;
        padding: 15px;
        margin: 0px -15px;
      }

      .message {
        font-weight: bold;
      }
    </style>

export default class Hello extends Component {
  name = 'world';

  <template>
    <div>
      <h3 class='header'>
        {{@title}}
      </h3>
      <p class='message'>
        name: {{this.name}}<br/>
        {{@message}}
      </p>
    </div>
  </template>
}

