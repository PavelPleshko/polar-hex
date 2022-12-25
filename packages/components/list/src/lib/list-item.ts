import { LitElement, customElement, property } from 'lit-element';

import { ListItemState } from './types';

@customElement('yt-list-item')
export class ListItemComponent extends LitElement implements ListItemState {
	@property({ type: String, reflect: true })
	override role = 'option';

	@property({ type: Boolean })
	disabled = false;

	protected override createRenderRoot(): Element | ShadowRoot {
		return this;
	}
}
