import Component from '@glimmer/component';
import { service } from '@ember/service';

import type { TOC } from '@ember/component/template-only';
import type RouterService from '@ember/routing/router-service';

export interface Signature {
	Args: {};
	Blocks: {
		default?: [];
	};
}

const A: TOC<{ Element: HTMLDivElement}> = <template><div ...attributes>A</div></template>;
const B: TOC<{ Element: HTMLDivElement}> = <template><div ...attributes>B</div></template>;

export class StrictClass extends Component<Signature> {
	@service declare router: RouterService;

  get dynamicComponent() {
    return Math.random() < 0.5 ? A : B;
  }


	<template>
    <this.dynamicComponent class="hello-there" />
    {{yield}}
	</template>
}
