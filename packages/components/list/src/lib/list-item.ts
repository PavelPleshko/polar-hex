import { LitElement, customElement, property } from 'lit-element';

import { uniqueIdGenerator } from '@yeti-wc/utils';
import { ListItemState, Activatable } from './types';
import { Selectable } from './selection/types';

export const LIST_ITEM_SELECTOR = 'yt-list-item';

const getNextId = uniqueIdGenerator('yt-list-item');

@customElement(LIST_ITEM_SELECTOR)
export class ListItemComponent<ValueType = unknown>
	extends LitElement
	implements ListItemState, Activatable, Selectable<ValueType>
{
	private _value?: ValueType;

	@property({ type: String, reflect: true })
	override role = 'option';

	@property({ attribute: 'aria-disabled', type: Boolean, reflect: true })
	disabled = false;

	@property({ attribute: 'id', type: String, reflect: true })
	override id = getNextId();

	@property()
	set value(val: ValueType) {
		this._value = val;
	}

	get value(): ValueType {
		return this._value === undefined ? (this.textContent as ValueType) : this._value;
	}

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
