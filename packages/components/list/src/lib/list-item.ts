import { LitElement, customElement, property } from 'lit-element';

import { uniqueIdGenerator } from '@yeti-wc/utils';
import { ListItemState, Activatable } from './types';

export const LIST_ITEM_SELECTOR = 'yt-list-item';

const getNextId = uniqueIdGenerator('yt-list-item');

@customElement(LIST_ITEM_SELECTOR)
export class ListItemComponent extends LitElement implements ListItemState, Activatable {
	@property({ type: String, reflect: true })
	override role = 'option';

	@property({ attribute: 'aria-disabled', type: Boolean, reflect: true })
	disabled = false;

	@property({ attribute: 'id', type: String, reflect: true })
	override id = getNextId();

	active = false;

	override connectedCallback(): void {
		super.connectedCallback();
	}

	markActive(active = true): void {
		this.active = true;
		if (active) {
			this.classList.add('active');
		} else {
			this.classList.remove('active');
		}
	}

	protected override createRenderRoot(): Element | ShadowRoot {
		return this;
	}
}
